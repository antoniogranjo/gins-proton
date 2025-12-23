import { ReactNode } from 'react';
import { Sidebar } from '../Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
