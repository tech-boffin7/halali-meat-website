'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import CountUp from 'react-countup';

import { IconRenderer, ValidIconName } from '@/components/ui/icon-renderer';

interface DashboardStatCardProps {
  iconName: ValidIconName;
  title: string;
  value: number;
  description?: string;
  variant?: 'default' | 'primary' | 'success';
}

export function DashboardStatCard({ iconName, title, value, description, variant = 'default' }: DashboardStatCardProps) {
  const variantClasses = {
    default: 'border-border',
    primary: 'border-primary/50 text-primary',
    success: 'border-green-500/50 text-green-600',
  };

  return (
    <Card className={`shadow-sm hover:shadow-md transition-shadow duration-300 ${variantClasses[variant]}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <IconRenderer name={iconName} className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <>
          <div className="text-2xl font-bold">
            <CountUp end={value} duration={2.5} />
          </div>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </>
      </CardContent>
    </Card>
  );
}
