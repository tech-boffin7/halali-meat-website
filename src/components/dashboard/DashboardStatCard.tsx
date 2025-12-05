'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { memo } from 'react';
import CountUp from 'react-countup';

import { IconRenderer, ValidIconName } from '@/components/ui/icon-renderer';

interface DashboardStatCardProps {
  iconName: ValidIconName;
  title: string;
  value: number;
  description?: string;
  variant?: 'default' | 'primary' | 'success';
  tooltip?: string;
}

// Memoized for better performance when rendering multiple stat cards
export const DashboardStatCard = memo(function DashboardStatCard({ 
  iconName, 
  title, 
  value, 
  description, 
  variant = 'default', 
  tooltip 
}: DashboardStatCardProps) {
  const variantClasses = {
    default: 'border-border',
    primary: 'border-primary/50 text-primary',
    success: 'border-green-500/50 text-green-600',
  };

  return (
    <Card 
      className={`shadow-sm hover:shadow-md transition-shadow duration-300 ${variantClasses[variant]}`}
      data-tooltip={tooltip}
      data-tooltip-position="top"
    >
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
});
