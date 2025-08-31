import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

const API_BASE_URL = 'http://localhost:5001/api'

// Settings API functions
const settingsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/settings`)
    if (!response.ok) throw new Error('Failed to fetch settings')
    return response.json()
  },
  
  updateLogo: async (logoData) => {
    const response = await fetch(`${API_BASE_URL}/settings/logo`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logoData)
    })
    if (!response.ok) throw new Error('Failed to update logo')
    return response.json()
  },
  
  updateSocialMedia: async (socialData) => {
    const response = await fetch(`${API_BASE_URL}/settings/social-media`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(socialData)
    })
    if (!response.ok) throw new Error('Failed to update social media')
    return response.json()
  },
  
  updateTheme: async (themeData) => {
    const response = await fetch(`${API_BASE_URL}/settings/theme`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(themeData)
    })
    if (!response.ok) throw new Error('Failed to update theme')
    return response.json()
  },
  
  updateContact: async (contactData) => {
    const response = await fetch(`${API_BASE_URL}/settings/contact`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    })
    if (!response.ok) throw new Error('Failed to update contact')
    return response.json()
  },
  
  updateSiteInfo: async (siteData) => {
    const response = await fetch(`${API_BASE_URL}/settings/site-info`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siteData)
    })
    if (!response.ok) throw new Error('Failed to update site info')
    return response.json()
  }
}

export const useSettings = () => {
  const queryClient = useQueryClient()
  
  // Get settings query
  const {
    data: settings,
    isLoading,
    error
  } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsAPI.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Update logo mutation
  const updateLogoMutation = useMutation({
    mutationFn: settingsAPI.updateLogo,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['settings'])
      toast.success('Logo updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update logo')
      console.error('Logo update error:', error)
    }
  })

  // Update social media mutation
  const updateSocialMutation = useMutation({
    mutationFn: settingsAPI.updateSocialMedia,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['settings'])
      toast.success('Social media updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update social media')
      console.error('Social media update error:', error)
    }
  })

  // Update theme mutation
  const updateThemeMutation = useMutation({
    mutationFn: settingsAPI.updateTheme,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['settings'])
      toast.success('Theme updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update theme')
      console.error('Theme update error:', error)
    }
  })

  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: settingsAPI.updateContact,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['settings'])
      toast.success('Contact info updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update contact info')
      console.error('Contact update error:', error)
    }
  })

  // Update site info mutation
  const updateSiteInfoMutation = useMutation({
    mutationFn: settingsAPI.updateSiteInfo,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['settings'])
      toast.success('Site info updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update site info')
      console.error('Site info update error:', error)
    }
  })

  return {
    // Data
    settings: settings?.settings,
    isLoading,
    error,
    
    // Mutations
    updateLogo: updateLogoMutation.mutate,
    updateSocialMedia: updateSocialMutation.mutate,
    updateTheme: updateThemeMutation.mutate,
    updateContact: updateContactMutation.mutate,
    updateSiteInfo: updateSiteInfoMutation.mutate,
    
    // Loading states
    isUpdatingLogo: updateLogoMutation.isPending,
    isUpdatingSocial: updateSocialMutation.isPending,
    isUpdatingTheme: updateThemeMutation.isPending,
    isUpdatingContact: updateContactMutation.isPending,
    isUpdatingSiteInfo: updateSiteInfoMutation.isPending,
  }
}

export default useSettings