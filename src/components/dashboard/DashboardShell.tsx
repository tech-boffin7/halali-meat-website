'use client';

interface DashboardShellProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function DashboardShell({ children, title, description }: DashboardShellProps) {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <div className="flex items-center justify-between p-2 border-b relative">
        <div>
          <h1 className="text-md md:text-lg lg:text-xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground text-sm md:text-sm">{description}</p>}
        </div>
      </div>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-secondary overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
