import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsAPI } from '../services/api';
import { toast } from 'react-hot-toast';

export const useSettings = () => {
  const queryClient = useQueryClient();

  // Query to get all settings
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await settingsAPI.get();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation to update settings
  const updateMutation = useMutation({
    mutationFn: (updatedSettings) => settingsAPI.update(updatedSettings),
    onSuccess: (data) => {
      // Invalidate and refetch the settings query to get fresh data
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings updated successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to update settings.';
      toast.error(errorMessage);
      console.error('Settings update error:', error);
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};

export default useSettings;