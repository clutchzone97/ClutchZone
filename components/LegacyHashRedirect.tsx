import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const LegacyHashRedirect: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check for hash-based routing (legacy)
    const hash = window.location.hash; // e.g., #/cars/60d5ec...
    
    if (hash && hash.startsWith('#/')) {
      const path = hash.substring(1); // /cars/60d5ec...
      
      // Try to resolve ID to slug if it looks like a detail page
      const parts = path.split('/').filter(Boolean); // ['cars', 'ID']
      
      if (parts.length === 2 && (parts[0] === 'cars' || parts[0] === 'properties')) {
        const type = parts[0];
        const id = parts[1];
        
        // Only attempt to resolve if it looks like a Mongo ID
        if (id.match(/^[a-fA-F0-9]{24}$/)) {
          api.get(`/${type}/resolve/${id}`)
            .then(res => {
              const slug = res.data.slug;
              if (slug) {
                // Redirect to new clean URL with slug
                navigate(`/${type}/${slug}`, { replace: true });
              } else {
                // Fallback to ID-based URL (supported by backend)
                navigate(path, { replace: true });
              }
            })
            .catch((err) => {
              console.error("Failed to resolve slug", err);
              // Fallback to path without hash
              navigate(path, { replace: true });
            });
          return;
        }
      }
      
      // For other routes, just remove the hash and navigate
      navigate(path, { replace: true });
    }
  }, [navigate]);

  return null;
};

export default LegacyHashRedirect;
