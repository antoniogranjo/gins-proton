import { useStore } from '../store/useStore';
import ReactJson from 'react-json-view';

export function ResourceDetails() {
  const { selectedResource } = useStore();

  if (!selectedResource) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900/50">
        <div className="text-center">
          <p>Select a resource to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 font-semibold bg-white dark:bg-slate-900 flex justify-between items-center">
        <span>{(selectedResource as any).Name || 'Details'}</span>
        <button className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          JSON
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 bg-white dark:bg-slate-900">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {Object.entries(selectedResource).map(([key, value]) => {
            if (typeof value === 'object' || Array.isArray(value)) return null; // Skip complex objects for simple view
            return (
              <div key={key} className="flex flex-col">
                <span className="text-slate-500 text-xs uppercase">{key}</span>
                <span className="font-medium truncate" title={String(value)}>{String(value)}</span>
              </div>
            );
          })}
        </div>
        {/* Show complex objects in JSON viewer at bottom or simplified */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">Raw Data</h3>
          <ReactJson
            src={selectedResource}
            theme="rjv-default"
            collapsed={1}
            displayDataTypes={false}
            style={{ fontSize: '0.8rem', backgroundColor: 'transparent' }}
          />
        </div>
      </div>
    </div>
  );
}
