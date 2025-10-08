'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import {
  getDailyQuotesData,
  getWeeklyQuotesData,
  getMonthlyQuotesData,
} from '@/data/dashboard-data';
import { products } from '@/data/products'; // Import products to get names and IDs

type TimeRange = 'daily' | 'weekly' | 'monthly';
type DataType = 'quotesCount' | 'totalQuantity';

// Define a color palette for the product lines
const productColors: { [key: string]: string } = {
  'beef-01': '#FF6347', // Tomato
  'goat-01': '#4682B4', // SteelBlue
  'sheep-01': '#3CB371', // MediumSeaGreen
  'lamb-01': '#FFD700', // Gold
  // Add more colors if you have more products
};

export function QuotesChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [dataType, setDataType] = useState<DataType>('quotesCount');
  const [selectedProducts, setSelectedProducts] = useState<string[]>(products.map(p => p.id));

  const chartData = useMemo(() => {
    switch (timeRange) {
      case 'daily':
        return getDailyQuotesData();
      case 'weekly':
        return getWeeklyQuotesData();
      case 'monthly':
        return getMonthlyQuotesData();
      default:
        return getMonthlyQuotesData();
    }
  }, [timeRange]);

  const xAxisFormatter = (value: string) => {
    if (timeRange === 'daily') {
      return value; // Already formatted as 'MMM dd'
    } else if (timeRange === 'weekly') {
      return value.split(' (')[0]; // Extract 'Week X'
    } else {
      return value; // Month name
    }
  };

  const handleProductToggle = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const yAxisLabel = dataType === 'quotesCount' ? 'Number of Quotes' : 'Total Quantity';

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-xs">Quotes Overview ({dataType === 'quotesCount' ? 'Count' : 'Quantity'})</CardTitle>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Products <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-60 overflow-y-auto scrollbar-thin">
                {products.map(product => (
                  <DropdownMenuCheckboxItem
                    key={product.id}
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={(checked) => handleProductToggle(product.id, checked)}
                  >
                    {product.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Data Type <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                <DropdownMenuCheckboxItem
                  checked={dataType === 'quotesCount'}
                  onCheckedChange={() => setDataType('quotesCount')}
                >
                  Quote Count
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={dataType === 'totalQuantity'}
                  onCheckedChange={() => setDataType('totalQuantity')}
                >
                  Total Quantity
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-2">
            <Button
              variant={timeRange === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('monthly')}
            >
              Month
            </Button>
            <Button
              variant={timeRange === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('weekly')}
            >
              Week
            </Button>
            <Button
              variant={timeRange === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('daily')}
            >
              Day
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tickFormatter={xAxisFormatter} style={{ fontSize: '10px' }} />
            <YAxis style={{ fontSize: '10px' }} label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '12px' } }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                fontSize: '12px',
              }}
              itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '12px' }}
              labelStyle={{ color: 'hsl(var(--muted-foreground))', fontSize: '12px' }}
              formatter={(value: number, name: string) => [
                value,
                products.find(p => `${p.id}QuotesCount` === name || `${p.id}TotalQuantity` === name)?.name || name,
              ]}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            {selectedProducts.map(productId => (
              <Line
                key={productId}
                type="monotone"
                dataKey={`${productId}${dataType === 'quotesCount' ? 'QuotesCount' : 'TotalQuantity'}`}
                name={products.find(p => p.id === productId)?.name || productId}
                stroke={productColors[productId] || '#8884d8'} // Fallback color
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
