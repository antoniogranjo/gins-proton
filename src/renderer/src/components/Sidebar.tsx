import { Database, Layers, Play, Network } from 'lucide-react';
import { ResourceType } from '../../../shared/types';
import { useStore } from '../store/useStore';
import { cn } from '../utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { currentResourceType, switchMainView } = useStore();

  const items: { type: ResourceType; label: string; icon: any }[] = [
    { type: 'job', label: 'Jobs', icon: Play },
    { type: 'crawler', label: 'Crawlers', icon: Network },
    { type: 'database', label: 'Databases', icon: Database },
    { type: 'workflow', label: 'Workflows', icon: Layers },
  ];

  return (
    <div className={cn("w-64 bg-slate-900 text-white flex flex-col border-r border-slate-700", className)}>
      <div className="p-4 border-b border-slate-700 font-bold text-lg flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-500 rounded-lg"></div>
        Gins Proton
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {items.map((item) => (
          <button
            key={item.type}
            onClick={() => switchMainView(item.type)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              currentResourceType === item.type
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-500">Region: us-east-1</div>
        <div className="text-xs text-slate-500">Profile: default</div>
      </div>
    </div>
  );
}
