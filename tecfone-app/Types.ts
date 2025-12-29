
export enum RepairStatus {
  RECEIVED = 'Recibido',
  DIAGNOSING = 'Diagnosticando',
  REPAIRING = 'En Reparación',
  READY = 'Listo para Entrega',
  DELIVERED = 'Entregado'
}

export interface StockHistoryEntry {
  date: string;
  type: 'Entrada' | 'Salida' | 'Ajuste';
  quantity: number;
  reason?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  lastUpdated: string;
  stockHistory: StockHistoryEntry[];
}

export interface RepairOrder {
  id: string;
  customerName: string;
  device: string;
  issue: string;
  status: RepairStatus;
  date: string;
  estimatedCost: number;
}

export interface Sale {
  id: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  date: string;
}

export type AppView = 'dashboard' | 'inventory' | 'sales' | 'repairs' | 'ai-assistant';