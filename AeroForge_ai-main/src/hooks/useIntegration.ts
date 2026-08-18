import { useState, useCallback, useEffect } from 'react';
import { IntegrationHandler, type IntegrationConfig, type IntegrationResponse } from '@/services/integrationService';

interface UseIntegrationOptions {
  config: IntegrationConfig;
  autoConnect?: boolean;
}

export function useIntegration<T = any>({ config, autoConnect = false }: UseIntegrationOptions) {
  const [handler] = useState(() => new IntegrationHandler(config));
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Test connection
  const testConnection = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await handler.request<any>('GET', '/health', undefined, false);
      if (response.success) {
        setIsConnected(true);
      } else {
        setError(response.error || 'Connection failed');
        setIsConnected(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, [handler]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      testConnection();
    }
  }, [autoConnect, testConnection]);

  // GET request
  const get = useCallback(
    async (path: string, useCache = true): Promise<IntegrationResponse<T>> => {
      setLoading(true);
      setError(null);
      try {
        const response = await handler.request<T>('GET', path, undefined, useCache);
        if (response.success) {
          setData(response.data || null);
        } else {
          setError(response.error || 'Request failed');
        }
        return response;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return {
          success: false,
          error: errorMsg,
          timestamp: Date.now(),
          duration: 0,
        };
      } finally {
        setLoading(false);
      }
    },
    [handler]
  );

  // POST request
  const post = useCallback(
    async (path: string, payload: any): Promise<IntegrationResponse<T>> => {
      setLoading(true);
      setError(null);
      try {
        const response = await handler.request<T>('POST', path, payload, false);
        if (response.success) {
          setData(response.data || null);
        } else {
          setError(response.error || 'Request failed');
        }
        return response;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return {
          success: false,
          error: errorMsg,
          timestamp: Date.now(),
          duration: 0,
        };
      } finally {
        setLoading(false);
      }
    },
    [handler]
  );

  // PUT request
  const put = useCallback(
    async (path: string, payload: any): Promise<IntegrationResponse<T>> => {
      setLoading(true);
      setError(null);
      try {
        const response = await handler.request<T>('PUT', path, payload, false);
        if (response.success) {
          setData(response.data || null);
        } else {
          setError(response.error || 'Request failed');
        }
        return response;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return {
          success: false,
          error: errorMsg,
          timestamp: Date.now(),
          duration: 0,
        };
      } finally {
        setLoading(false);
      }
    },
    [handler]
  );

  // DELETE request
  const delete_ = useCallback(
    async (path: string): Promise<IntegrationResponse<T>> => {
      setLoading(true);
      setError(null);
      try {
        const response = await handler.request<T>('DELETE', path, undefined, false);
        if (response.success) {
          setData(response.data || null);
        } else {
          setError(response.error || 'Request failed');
        }
        return response;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        return {
          success: false,
          error: errorMsg,
          timestamp: Date.now(),
          duration: 0,
        };
      } finally {
        setLoading(false);
      }
    },
    [handler]
  );

  // Clear cache
  const clearCache = useCallback((pattern?: string) => {
    handler.clearCache(pattern);
  }, [handler]);

  return {
    // State
    data,
    loading,
    error,
    isConnected,
    
    // Methods
    get,
    post,
    put,
    delete: delete_,
    testConnection,
    clearCache,
  };
}
