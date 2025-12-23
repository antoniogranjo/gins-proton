import { useStore } from '../../store/useStore';
import ReactJson from 'react-json-view';
import { X, Save } from 'lucide-react';

export function JsonModal() {
  const { isJsonModalOpen, setJsonModalOpen, selectedResource } = useStore();

  if (!isJsonModalOpen || !selectedResource) return null;

  const handleSave = () => {
    const blob = new Blob([JSON.stringify(selectedResource, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(selectedResource as any).Name || 'resource'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-3/4 h-3/4 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-bold text-lg">JSON Inspector</h2>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              <Save size={16} /> Save
            </button>
            <button onClick={() => setJsonModalOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-slate-50 dark:bg-black">
          <ReactJson
            src={selectedResource}
            theme="monokai"
            displayDataTypes={false}
            style={{ fontSize: '0.9rem', backgroundColor: 'transparent' }}
          />
        </div>
      </div>
    </div>
  );
}
