import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user, token) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        })
        localStorage.setItem('token', token)
      },
      
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        })
        localStorage.removeItem('token')
      },
      
      checkAuth: () => {
        const token = localStorage.getItem('token')
        if (token) {
          // In a real app, you'd verify the token with the server
          set({ 
            token, 
            isAuthenticated: true 
          })
          return true
        }
        return false
      }
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
)