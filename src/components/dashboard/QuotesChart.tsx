"use client";

import { fetchQuotesChartData } from "@/app/actions/dashboard-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type DataType = "quotesCount" | "totalQuantity";
type TimeRange = "daily" | "weekly" | "monthly";

interface Product {
    id: string;
    name: string;
}

interface QuotesChartProps {
    initialData: any[];
    products: Product[];
}

// Generate colors dynamically based on product index
const generateColor = (index: number): string => {
    const colors = [
        "#FF6347", // Tomato
        "#4682B4", // SteelBlue
        "#3CB371", // MediumSeaGreen
        "#FFD700", // Gold
        "#9370DB", // MediumPurple
        "#FF69B4", // HotPink
        "#20B2AA", // LightSeaGreen
        "#FFA500", // Orange
    ];
    return colors[index % colors.length];
};

export function QuotesChart({ initialData, products: initialProducts }: QuotesChartProps) {
    const [dataType, setDataType] = useState<DataType>("quotesCount");
    const [timeRange, setTimeRange] = useState<TimeRange>("monthly");
    const [chartData, setChartData] = useState(initialData);
    const [products, setProducts] = useState(initialProducts);
    const [selectedProducts, setSelectedProducts] = useState<string[]>(
        initialProducts.map((p) => p.id)
    );
    const [isPending, startTransition] = useTransition();

    const handleTimeRangeChange = async (newRange: TimeRange) => {
        setTimeRange(newRange);
        
        startTransition(async () => {
            const result = await fetchQuotesChartData(newRange);
            setChartData(result.chartData);
            setProducts(result.products);
            // Update selected products to include new products
            setSelectedProducts(result.products.map((p) => p.id));
        });
    };

    const handleProductToggle = (productId: string, checked: boolean) => {
        if (checked) {
            setSelectedProducts((prev) => [...prev, productId]);
        } else {
            setSelectedProducts((prev) =>
                prev.filter((id) => id !== productId)
            );
        }
    };

    const yAxisLabel =
        dataType === "quotesCount" ? "Number of Quotes" : "Total Quantity";

    // Generate color map for products
    const productColors: { [key: string]: string } = {};
    products.forEach((product, index) => {
        productColors[product.id] = generateColor(index);
    });

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardTitle className="text-sm m-6 py-2 pl-1 bg-secondary">
                Quotes Overview (
                {dataType === "quotesCount" ? "Count" : "Quantity"})
            </CardTitle>
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    {/* Product Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="outline"
                                size="sm"
                                data-tooltip="Select which products to display on the chart"
                                data-tooltip-position="top"
                            >
                                Products{" "}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto scrollbar-thin">
                            {products.map((product) => (
                                <DropdownMenuCheckboxItem
                                    key={product.id}
                                    checked={selectedProducts.includes(
                                        product.id
                                    )}
                                    onCheckedChange={(checked) =>
                                        handleProductToggle(product.id, checked)
                                    }
                                >
                                    {product.name}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Data Type Toggle */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="outline"
                                size="sm"
                                data-tooltip="Toggle between quote count and total quantity"
                                data-tooltip-position="top"
                            >
                                Data Type{" "}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40">
                            <DropdownMenuCheckboxItem
                                checked={dataType === "quotesCount"}
                                onCheckedChange={() =>
                                    setDataType("quotesCount")
                                }
                            >
                                Quote Count
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={dataType === "totalQuantity"}
                                onCheckedChange={() =>
                                    setDataType("totalQuantity")
                                }
                            >
                                Total Quantity
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Time Range Selector */}
                    <div className="flex gap-1">
                        <Button
                            variant={timeRange === "monthly" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleTimeRangeChange("monthly")}
                            disabled={isPending}
                            data-tooltip="View data grouped by month"
                            data-tooltip-position="top"
                        >
                            {isPending && timeRange === "monthly" ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                "Month"
                            )}
                        </Button>
                        <Button
                            variant={timeRange === "weekly" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleTimeRangeChange("weekly")}
                            disabled={isPending}
                            data-tooltip="View data grouped by week"
                            data-tooltip-position="top"
                        >
                            {isPending && timeRange === "weekly" ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                "Week"
                            )}
                        </Button>
                        <Button
                            variant={timeRange === "daily" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleTimeRangeChange("daily")}
                            disabled={isPending}
                            data-tooltip="View data grouped by day"
                            data-tooltip-position="top"
                        >
                            {isPending && timeRange === "daily" ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                "Day"
                            )}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {chartData.length > 0 ? (
                    <>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={chartData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    tick={{
                                        fontSize: 10,
                                        fill: "hsl(var(--muted-foreground))",
                                    }}
                                />
                                <YAxis
                                    style={{ fontSize: "10px" }}
                                    label={{
                                        value: yAxisLabel,
                                        angle: -90,
                                        position: "insideLeft",
                                        style: {
                                            textAnchor: "middle",
                                            fontSize: "12px",
                                            fill: "hsl(var(--muted-foreground))",
                                        },
                                    }}
                                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "0.5rem",
                                        fontSize: "12px",
                                    }}
                                    itemStyle={{
                                        color: "hsl(var(--foreground))",
                                        fontSize: "12px",
                                    }}
                                    labelStyle={{
                                        color: "hsl(var(--muted-foreground))",
                                        fontSize: "12px",
                                    }}
                                    formatter={(value: number, name: string) => [
                                        value,
                                        products.find(
                                            (p) =>
                                                `${p.id}QuotesCount` === name ||
                                                `${p.id}TotalQuantity` === name
                                        )?.name || name,
                                    ]}
                                />
                                {selectedProducts.map((productId) => (
                                    <Line
                                        key={productId}
                                        type="monotone"
                                        dataKey={`${dataType === "quotesCount" ? `${productId}QuotesCount` : `${productId}TotalQuantity`}`}
                                        name={
                                            products.find((p) => p.id === productId)
                                                ?.name || productId
                                        }
                                        stroke={productColors[productId] || "#8884d8"}
                                        activeDot={{ r: 8 }}
                                        strokeWidth={2}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                        {selectedProducts.length > 2 && (
                            <>
                                <h1 className="text-xs mt-8 ml-12 p-2">Legend:</h1>
                                <div className="mt-1 ml-12 p-2 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
                                    {selectedProducts.map((productId) => {
                                        const product = products.find(
                                            (p) => p.id === productId
                                        );
                                        return (
                                            <div
                                                key={productId}
                                                className="flex items-center"
                                            >
                                                <span
                                                    className="w-3 h-3 rounded-full mr-2"
                                                    style={{
                                                        backgroundColor:
                                                            productColors[
                                                                productId
                                                            ] || "#8884d8",
                                                    }}
                                                ></span>
                                                <span>
                                                    {product?.name || productId}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
                        {isPending ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading chart data...</span>
                            </div>
                        ) : (
                            "No quote data available for the selected time range"
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
