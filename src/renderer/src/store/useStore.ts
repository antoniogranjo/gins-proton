import { create } from 'zustand';
import { ResourceType, ResourceItem, AWSConfig, Breadcrumb } from '../../../shared/types';

interface AppState {
  // Configuration
  config: AWSConfig;
  setConfig: (config: AWSConfig) => void;

  // Navigation
  currentResourceType: ResourceType;
  breadcrumbStack: Breadcrumb[];

  // Navigate deeper: Push current state to stack, set new type/id
  pushBreadcrumb: (crumb: Breadcrumb) => void;
  // Navigate back: Pop stack
  popBreadcrumb: () => void;
  // Switch top level type: Clear stack, set type
  switchMainView: (type: ResourceType) => void;
  setCurrentResourceType: (type: ResourceType) => void;

  // Data
  resources: ResourceItem[];
  setResources: (resources: ResourceItem[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Selection
  selectedResource: ResourceItem | null;
  setSelectedResource: (resource: ResourceItem | null) => void;

  // UI State
  isJsonModalOpen: boolean;
  setJsonModalOpen: (open: boolean) => void;
  isProfileSwitcherOpen: boolean;
  setProfileSwitcherOpen: (open: boolean) => void;

  // Search/Filter
  filterQuery: string;
  setFilterQuery: (query: string) => void;
}

export const useStore = create<AppState>((set) => ({
  config: { region: 'us-east-1', profile: 'default' },
  setConfig: (config) => set({ config }),

  currentResourceType: 'job',
  breadcrumbStack: [],

  pushBreadcrumb: (crumb) => set((state) => ({
    breadcrumbStack: [...state.breadcrumbStack, crumb],
    // Logic to switch resource type based on crumb type interaction happens 
    // in the component or a separate thunk, but here we just update stack.
    // Actually we usually want to update currentResourceType when pushing?
    // Let's assume the caller handles data fetching and type switching.
  })),

  popBreadcrumb: () => set((state) => {
    if (state.breadcrumbStack.length === 0) return {};
    const newStack = [...state.breadcrumbStack];
    newStack.pop();
    // Revert logic would depend on what we popped to.
    // For now simplistic state update.
    return { breadcrumbStack: newStack };
  }),

  switchMainView: (type) => set({
    currentResourceType: type,
    breadcrumbStack: [],
    selectedResource: null,
    resources: [] // Clear resources when switching views
  }),
  setCurrentResourceType: (type) => set({ currentResourceType: type }),

  resources: [],
  setResources: (resources) => set({ resources }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  selectedResource: null,
  setSelectedResource: (selectedResource) => set({ selectedResource }),

  isJsonModalOpen: false,
  setJsonModalOpen: (isJsonModalOpen) => set({ isJsonModalOpen }),

  isProfileSwitcherOpen: false,
  setProfileSwitcherOpen: (isProfileSwitcherOpen) => set({ isProfileSwitcherOpen }),

  filterQuery: '',
  setFilterQuery: (filterQuery) => set({ filterQuery }),
}));
