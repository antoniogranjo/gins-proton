import { ResourceItem } from '../../../shared/types';
import { useStore } from '../store/useStore';

export function ResourceTable() {
  const { resources, selectedResource, setSelectedResource } = useStore();

  const handleRowClick = (item: ResourceItem) => {
    setSelectedResource(item);
  };

  const handleDoubleClick = (item: ResourceItem) => {
    const id = (item as any).Name;
    if (!id) return;
    console.log("Deep dive into", id);
    // Double click logic is handled by 'App' or specific drill down action?
    // User requirement: "double clicking... can go a level deeper".
    // I need to trigger the drill down here.
    // App.tsx uses breadcrumbStack.
    // I need to push to breadcrumbStack.
    useStore.getState().pushBreadcrumb({ type: useStore.getState().currentResourceType, id });
    // And switch type?
    // Logic for type switching is: 
    // Glue Job -> Glue Job Runs ('job_run')
    // Glue Crawler -> Crawler Runs ('crawler_run')
    // Glue Database -> Tables ('table')
    // Glue Workflow -> Workflow Runs ('workflow_run')

    // I'll define mapping here or helper.
    const current = useStore.getState().currentResourceType;
    let next: any = null;
    if (current === 'job') next = 'job_run';
    if (current === 'crawler') next = 'crawler_run';
    if (current === 'database') next = 'table';
    if (current === 'workflow') next = 'workflow_run';

    if (next) {
      useStore.getState().setCurrentResourceType(next);
    }
  };

  if (resources.length === 0) {
    return <div className="p-8 text-center text-slate-500">No resources found.</div>;
  }

  const sample = resources[0];
  const columns = Object.keys(sample).filter(k => typeof (sample as any)[k] !== 'object' && k !== 'DefaultRunProperties');

  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase text-slate-500 sticky top-0">
          <tr>
            {columns.map(col => (
              <th key={col} className="px-4 py-3 font-medium cursor-pointer hover:text-slate-700">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {resources.map((item, idx) => (
            <tr
              key={idx}
              onClick={() => handleRowClick(item)}
              onDoubleClick={() => handleDoubleClick(item)}
              className={`
                cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-800
                ${selectedResource === item ? 'bg-blue-50 dark:bg-blue-900/30' : ''}
              `}
            >
              {columns.map(col => (
                <td key={col} className="px-4 py-3 truncate max-w-[200px]">
                  {renderCell((item as any)[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderCell(value: any) {
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}
