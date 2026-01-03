'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import type { WebSocketMessage, WebSocketEvent } from '@/types/api.types';

interface UseWebSocketOptions {
  url?: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (event: string, data: any) => void;
  subscribe: (event: WebSocketEvent, callback: (data: any) => void) => () => void;
  reconnect: () => void;
}

/**
 * Custom hook for WebSocket connection
 * Provides real-time updates for job status, pipeline progress, and system events
 */
export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3002',
    reconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const subscribers = useRef<Map<WebSocketEvent, Set<(data: any) => void>>>(new Map());

  /**
   * Connect to WebSocket server
   */
  const connect = useCallback(() => {
    try {
      console.log('[WebSocket] Connecting to:', url);
      const websocket = new WebSocket(url);

      websocket.onopen = () => {
        console.log('[WebSocket] Connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;

        // Clear any pending reconnect timeout
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
          reconnectTimeout.current = null;
        }
      };

      websocket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);

          // Notify subscribers
          const eventSubscribers = subscribers.current.get(message.event);
          if (eventSubscribers) {
            eventSubscribers.forEach((callback) => {
              try {
                callback(message.data);
              } catch (error) {
                console.error('[WebSocket] Subscriber error:', error);
              }
            });
          }

          // Log message in development
          if (process.env.NODE_ENV === 'development') {
            console.log('[WebSocket] Message:', message.event, message.data);
          }
        } catch (error) {
          console.error('[WebSocket] Failed to parse message:', error);
        }
      };

      websocket.onclose = () => {
        console.log('[WebSocket] Disconnected');
        setIsConnected(false);
        ws.current = null;

        // Attempt to reconnect
        if (reconnect && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(
            `[WebSocket] Reconnecting... (${reconnectAttempts.current}/${maxReconnectAttempts})`
          );

          reconnectTimeout.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          console.error('[WebSocket] Max reconnect attempts reached');
        }
      };

      websocket.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
      };

      ws.current = websocket;
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
    }
  }, [url, reconnect, reconnectInterval, maxReconnectAttempts]);

  /**
   * Disconnect from WebSocket server
   */
  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }

    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }

    setIsConnected(false);
  }, []);

  /**
   * Send message to WebSocket server
   */
  const sendMessage = useCallback((event: string, data: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        event: event as WebSocketEvent,
        data,
        timestamp: new Date(),
      };
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('[WebSocket] Cannot send message: Not connected');
    }
  }, []);

  /**
   * Subscribe to specific WebSocket events
   * Returns an unsubscribe function
   */
  const subscribe = useCallback(
    (event: WebSocketEvent, callback: (data: any) => void): (() => void) => {
      if (!subscribers.current.has(event)) {
        subscribers.current.set(event, new Set());
      }

      const eventSubscribers = subscribers.current.get(event)!;
      eventSubscribers.add(callback);

      // Return unsubscribe function
      return () => {
        eventSubscribers.delete(callback);
        if (eventSubscribers.size === 0) {
          subscribers.current.delete(event);
        }
      };
    },
    []
  );

  /**
   * Manual reconnect
   */
  const reconnectManually = useCallback(() => {
    reconnectAttempts.current = 0;
    disconnect();
    connect();
  }, [connect, disconnect]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    sendMessage,
    subscribe,
    reconnect: reconnectManually,
  };
}

/**
 * Hook for subscribing to specific WebSocket events
 */
export function useWebSocketEvent<T = any>(
  event: WebSocketEvent,
  callback: (data: T) => void,
  deps: any[] = []
) {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe(event, callback);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, subscribe, ...deps]);
}
