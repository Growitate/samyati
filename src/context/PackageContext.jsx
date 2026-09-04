import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PACKAGES as INITIAL_CODE_PACKAGES, DESTINATIONS as INITIAL_CODE_DESTINATIONS } from '../data/travelData';
import { API_ENDPOINTS, ADMIN_STORAGE_KEYS } from '../config/adminConfig';

const PackageContext = createContext(null);

export function PackageProvider({ children }) {
  const [packages, setPackages] = useState(() => {
    // Attempt to hydrate from localStorage cache for instant fast render
    try {
      const cached = localStorage.getItem(ADMIN_STORAGE_KEYS.CACHED_PACKAGES);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Cache read error:', e);
    }
    return INITIAL_CODE_PACKAGES;
  });

  const [destinations, setDestinations] = useState(INITIAL_CODE_DESTINATIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  /**
   * Helper to retrieve admin token from sessionStorage or localStorage
   */
  const getAuthToken = () => {
    return sessionStorage.getItem(ADMIN_STORAGE_KEYS.TOKEN) || localStorage.getItem(ADMIN_STORAGE_KEYS.TOKEN) || '';
  };

  /**
   * Fetch all packages from file-based database API
   */
  const fetchPackages = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_ENDPOINTS.PACKAGES, {
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.packages) && data.packages.length > 0) {
          setPackages(data.packages);
          if (Array.isArray(data.destinations) && data.destinations.length > 0) {
            setDestinations(data.destinations);
          }
          setLastSync(data.lastModified || new Date().toISOString());

          // Update local cache
          try {
            localStorage.setItem(ADMIN_STORAGE_KEYS.CACHED_PACKAGES, JSON.stringify(data.packages));
          } catch (storageErr) {
            console.warn('Storage cache error:', storageErr);
          }
        }
      } else {
        console.warn('API returned non-200 status, falling back to local store');
      }
    } catch (err) {
      console.warn('Failed to fetch packages from API, using cached/code data:', err.message);
      setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  /**
   * Get package by ID
   */
  const getPackage = useCallback((id) => {
    return packages.find(p => p.id === id) || null;
  }, [packages]);

  /**
   * Get packages for a given destination
   */
  const getPackagesByDestination = useCallback((destId) => {
    if (!destId) return [];
    const normalized = destId.toLowerCase().replace(/\s+/g, '-');
    return packages.filter(p => {
      const pDestId = (p.destinationId || '').toLowerCase().replace(/\s+/g, '-');
      const pDestName = (p.destinationName || '').toLowerCase().replace(/\s+/g, '-');
      return pDestId === normalized || pDestName === normalized;
    });
  }, [packages]);

  /**
   * Get packages by category (Domestic / International)
   */
  const getPackagesByCategory = useCallback((category) => {
    if (!category || category === 'All') return packages;
    return packages.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  }, [packages]);

  /**
   * Update a package (Pricing, Content, Images, Itinerary, etc.)
   */
  const updatePackage = useCallback(async (id, updates) => {
    const token = getAuthToken();
    try {
      const res = await fetch(API_ENDPOINTS.PACKAGE_DETAIL(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update package');
      }

      // Optimistically / locally update state
      setPackages(prev => {
        const updated = prev.map(p => p.id === id ? { ...p, ...data.package } : p);
        try {
          localStorage.setItem(ADMIN_STORAGE_KEYS.CACHED_PACKAGES, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      return { success: true, package: data.package };
    } catch (err) {
      console.error('Update package failed:', err);
      throw err;
    }
  }, []);

  /**
   * Create a new package
   */
  const createPackage = useCallback(async (newPackageData) => {
    const token = getAuthToken();
    try {
      const res = await fetch(API_ENDPOINTS.PACKAGES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPackageData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create package');
      }

      setPackages(prev => {
        const updated = [data.package, ...prev];
        try {
          localStorage.setItem(ADMIN_STORAGE_KEYS.CACHED_PACKAGES, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      return { success: true, package: data.package };
    } catch (err) {
      console.error('Create package failed:', err);
      throw err;
    }
  }, []);

  /**
   * Delete a package
   */
  const deletePackage = useCallback(async (id) => {
    const token = getAuthToken();
    try {
      const res = await fetch(API_ENDPOINTS.PACKAGE_DETAIL(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete package');
      }

      setPackages(prev => {
        const updated = prev.filter(p => p.id !== id);
        try {
          localStorage.setItem(ADMIN_STORAGE_KEYS.CACHED_PACKAGES, JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      return { success: true, id };
    } catch (err) {
      console.error('Delete package failed:', err);
      throw err;
    }
  }, []);

  /**
   * Trigger automatic merge sync with packages in code
   */
  const syncWithCode = useCallback(async () => {
    const token = getAuthToken();
    try {
      const res = await fetch(API_ENDPOINTS.SYNC, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Sync failed');
      }

      await fetchPackages(true);
      return data;
    } catch (err) {
      console.error('Sync with code failed:', err);
      throw err;
    }
  }, [fetchPackages]);

  /**
   * Factory reset database to code defaults
   */
  const resetToDefault = useCallback(async () => {
    const token = getAuthToken();
    try {
      const res = await fetch(API_ENDPOINTS.RESET, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Reset failed');
      }

      await fetchPackages(true);
      return data;
    } catch (err) {
      console.error('Reset to default failed:', err);
      throw err;
    }
  }, [fetchPackages]);

  const value = {
    packages,
    destinations,
    loading,
    error,
    lastSync,
    getPackage,
    getPackagesByDestination,
    getPackagesByCategory,
    updatePackage,
    createPackage,
    deletePackage,
    syncWithCode,
    resetToDefault,
    refreshPackages: () => fetchPackages(false)
  };

  return (
    <PackageContext.Provider value={value}>
      {children}
    </PackageContext.Provider>
  );
}

export function usePackages() {
  const context = useContext(PackageContext);
  if (!context) {
    throw new Error('usePackages must be used within a PackageProvider');
  }
  return context;
}
