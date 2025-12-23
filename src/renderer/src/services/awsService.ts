import { ResourceType, ResourceItem, AWSConfig } from '../../../shared/types';

const ipc = window.electron.ipcRenderer;

export const awsService = {
  readConfig: async (): Promise<AWSConfig> => {
    return ipc.invoke('config:read');
  },

  saveConfig: async (config: AWSConfig): Promise<void> => {
    return ipc.invoke('config:save', config);
  },

  listResources: async (type: ResourceType, config: AWSConfig): Promise<ResourceItem[]> => {
    switch (type) {
      case 'job':
        return ipc.invoke('aws:list-jobs', config);
      case 'crawler':
        return ipc.invoke('aws:list-crawlers', config);
      case 'database':
        return ipc.invoke('aws:list-databases', config);
      case 'workflow':
        return ipc.invoke('aws:list-workflows', config);
      default:
        return [];
    }
  },

  getSubResources: async (type: ResourceType, parentId: string, config: AWSConfig): Promise<ResourceItem[]> => {
    // type here is the SUB-resource type (e.g. 'crawler_run' when parent is crawler?)
    // Actually the router logic should handle this mapping.
    // Let's assume we pass the PARENT type and request sub resources?
    // User logic: Job -> JobRuns.
    // So if current type is 'job', we want runs.
    // Let's make this explicit based on the requested sub-type.

    switch (type) {
      case 'job_run':
        return ipc.invoke('aws:get-job-runs', config, parentId);
      case 'crawler_run':
        return ipc.invoke('aws:get-crawler-runs', config, parentId);
      case 'table':
        return ipc.invoke('aws:get-tables', config, parentId); // parentId is dbName
      case 'workflow_run':
        return ipc.invoke('aws:get-workflow-runs', config, parentId);
      default:
        return [];
    }
  }
};
