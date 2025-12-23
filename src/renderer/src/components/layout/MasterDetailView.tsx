import { ReactNode } from 'react';
import { cn } from '../../utils';

interface MasterDetailViewProps {
  top: ReactNode;
  bottom: ReactNode;
  className?: string;
}

export function MasterDetailView({ top, bottom, className }: MasterDetailViewProps) {
  return (
    <div className={cn("flex flex-col h-full w-full", className)}>
      <div className="h-2/5 border-b border-slate-200 dark:border-slate-800 overflow-auto bg-white dark:bg-slate-900">
        {top}
      </div>
      <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950">
        {bottom}
      </div>
    </div>
  );
}
