// components/dashboard/dashboard-header.tsx
import { cn } from "../../lib/utils";

interface DashboardHeaderProps {
  heading: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({
  heading,
  description,
  children,
  className,
}: DashboardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}