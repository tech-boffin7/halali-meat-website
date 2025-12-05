'use client';

import {
    AlertCircle,
    CheckCircle,
    Clock,
    FileText,
    LucideProps,
    Mail,
    MessageSquare,
    Package,
    TrendingUp,
} from 'lucide-react';

export const icons = {
  Package,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  Mail,
  AlertCircle,
  TrendingUp,
};

export type ValidIconName = keyof typeof icons;

export const IconRenderer = ({ name, ...props }: { name: ValidIconName } & LucideProps) => {
  const Icon = icons[name];
  if (!Icon) return null;
  return <Icon {...props} />;
};
