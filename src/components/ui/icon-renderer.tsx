'use client';

import {
  Package,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  LucideProps,
} from 'lucide-react';

export const icons = {
  Package,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
};

export type ValidIconName = keyof typeof icons;

export const IconRenderer = ({ name, ...props }: { name: ValidIconName } & LucideProps) => {
  const Icon = icons[name];
  if (!Icon) return null;
  return <Icon {...props} />;
};
