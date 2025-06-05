export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  lastUpdated: Date;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'fulfilled' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface StockUpdate {
  productId: string;
  previousStock: number;
  newStock: number;
  reason: 'sale' | 'restock' | 'adjustment' | 'cancellation';
  orderId?: string;
  timestamp: Date;
}

export interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'restock_needed';
  productId: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}