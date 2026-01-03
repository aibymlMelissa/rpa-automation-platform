'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import type { WebSocketMessage, WebSocketEvent } from '@/types/api.types';

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: WebSocketMessage | null;
  sendMessage: (event: string, data: any) => void;
  subscribe: (event: WebSocketEvent, callback: (data: any) => void) => () => void;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
  url?: string;
}

/**
 * WebSocket Provider Component
 * Provides WebSocket context to all child components
 */
export function WebSocketProvider({ children, url }: WebSocketProviderProps) {
  const websocket = useWebSocket({ url });

  return (
    <WebSocketContext.Provider value={websocket}>
      {children}
    </WebSocketContext.Provider>
  );
}

/**
 * Hook to access WebSocket context
 */
export function useWebSocketContext(): WebSocketContextType {
  const context = useContext(WebSocketContext);

  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }

  return context;
}
