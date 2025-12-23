import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useKeyboardShortcuts() {
  const {
    breadcrumbStack,
    currentResourceType,
    popBreadcrumb,
    setCurrentResourceType, // Need to make sure this exists in store
    setJsonModalOpen,
    setProfileSwitcherOpen,
    selectedResource
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if input is focused (rudimentary check)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Escape') {
        if (breadcrumbStack.length > 0) {
          // Logic to go back
          let targetType: any = 'job';
          // Reverse mapping (naive)
          if (currentResourceType === 'job_run') targetType = 'job';
          else if (currentResourceType === 'crawler_run') targetType = 'crawler';
          else if (currentResourceType === 'table') targetType = 'database';
          else if (currentResourceType === 'workflow_run') targetType = 'workflow';

          popBreadcrumb();
          setCurrentResourceType(targetType);
        } else {
          // Close modals if open?
          setJsonModalOpen(false);
          setProfileSwitcherOpen(false);
        }
      }

      if (e.key === 'j') {
        if (selectedResource) {
          setJsonModalOpen(true);
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault(); // Prevent print
        setProfileSwitcherOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [breadcrumbStack, currentResourceType, selectedResource, popBreadcrumb, setCurrentResourceType, setJsonModalOpen, setProfileSwitcherOpen]);
}
