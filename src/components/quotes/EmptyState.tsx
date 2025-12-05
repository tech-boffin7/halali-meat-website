interface EmptyStateProps {
  searchQuery?: string;
  statusFilter?: string;
}

export function EmptyState({ searchQuery, statusFilter }: EmptyStateProps) {
  let title = "You have no quotes";
  let description = "You can view your quotes here.";

  if (searchQuery) {
    title = `No quotes found for "${searchQuery}"`;
    description = "Try adjusting your search or filters.";
  } else if (statusFilter && statusFilter !== 'ALL') {
    title = `No ${statusFilter.toLowerCase()} quotes`;
    description = "Check other quote categories or filters.";
  }

  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
