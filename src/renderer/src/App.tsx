import { useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { MasterDetailView } from './components/layout/MasterDetailView';
import { ResourceTable } from './components/ResourceTable';
import { ResourceDetails } from './components/ResourceDetails';
import { useStore } from './store/useStore';
import { awsService } from './services/awsService';
import { JsonModal } from './components/modals/JsonModal';
import { ProfileSwitcher } from './components/modals/ProfileSwitcher';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ResourceItem } from '../../shared/types';

function App(): JSX.Element {
  const {
    currentResourceType,
    config,
    setResources,
    setIsLoading,
    breadcrumbStack,
    setConfig,
  } = useStore();

  useKeyboardShortcuts();

  // Initial Config Load
  useEffect(() => {
    awsService.readConfig().then(setConfig);
  }, []);

  // Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let items: ResourceItem[] = [];
        if (breadcrumbStack.length > 0) {
          const parent = breadcrumbStack[breadcrumbStack.length - 1];
          items = await awsService.getSubResources(currentResourceType, parent.id, config);
        } else {
          items = await awsService.listResources(currentResourceType, config);
        }
        setResources(items);
      } catch (error) {
        console.error("Failed to fetch resources", error);
        setResources([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentResourceType, config, breadcrumbStack]);

  return (
    <MainLayout>
      <div className="flex-1 h-full flex flex-col">
        {/* Breadcrumb Header */}
        <div className="p-2 text-sm text-slate-500 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {breadcrumbStack.length > 0 && (
              <span className="flex items-center gap-1">
                <span className="font-bold">{breadcrumbStack[breadcrumbStack.length - 1].id}</span>
                <span>/</span>
              </span>
            )}
            <span className="capitalize">{currentResourceType}s</span>
          </div>
          <div className="text-xs text-slate-400">
            <span className="mr-2">Ctrl+P to switch profile</span>
            <span>j to view JSON</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <MasterDetailView
            top={<ResourceDetails />}
            bottom={<ResourceTable />}
          />
        </div>
      </div>
      <JsonModal />
      <ProfileSwitcher />
    </MainLayout>
  );
}

export default App;
