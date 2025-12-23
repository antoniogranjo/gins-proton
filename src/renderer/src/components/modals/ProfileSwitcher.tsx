import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { awsService } from '../../services/awsService';
import { X, Check } from 'lucide-react';

export function ProfileSwitcher() {
  const { isProfileSwitcherOpen, setProfileSwitcherOpen, config, setConfig } = useStore();
  const [tempProfile, setTempProfile] = useState(config.profile);
  const [tempRegion, setTempRegion] = useState(config.region);

  if (!isProfileSwitcherOpen) return null;

  const handleSave = async () => {
    const newConfig = { profile: tempProfile, region: tempRegion };
    setConfig(newConfig);
    await awsService.saveConfig(newConfig);
    setProfileSwitcherOpen(false);
    // Trigger potential re-fetch handled by useEffect in App.tsx
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-96 rounded-lg shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">AWS Configuration</h2>
          <button onClick={() => setProfileSwitcherOpen(false)}>
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Profile</label>
            <input
              type="text"
              value={tempProfile}
              onChange={(e) => setTempProfile(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-700"
              placeholder="default"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Region</label>
            <input
              type="text"
              value={tempRegion}
              onChange={(e) => setTempRegion(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-slate-800 dark:border-slate-700"
              placeholder="us-east-1"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium mt-4"
          >
            <Check size={18} /> Apply Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
