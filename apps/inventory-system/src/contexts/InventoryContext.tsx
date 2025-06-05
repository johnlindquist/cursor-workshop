'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Order, InventoryAlert } from '../types/models';

interface InventoryContextType {
  products: Product[];
  orders: Order[];
  alerts: InventoryAlert[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  createProduct: (product: Omit<Product, 'id' | 'lastUpdated'>) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Omit<Product, 'id'>>) => Promise<Product | null>;
  createOrder: (customerId: string, items: { productId: string; quantity: number }[]) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<Order | null>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.map((p: any) => ({ ...p, lastUpdated: new Date(p.lastUpdated) })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.map((o: any) => ({ 
        ...o, 
        createdAt: new Date(o.createdAt),
        updatedAt: new Date(o.updatedAt)
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    }
  }, []);

  const createProduct = useCallback(async (product: Omit<Product, 'id' | 'lastUpdated'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!response.ok) throw new Error('Failed to create product');
      const newProduct = await response.json();
      setProducts(prev => [...prev, { ...newProduct, lastUpdated: new Date(newProduct.lastUpdated) }]);
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      return null;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Omit<Product, 'id'>>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update product');
      const updatedProduct = await response.json();
      setProducts(prev => prev.map(p => p.id === id 
        ? { ...updatedProduct, lastUpdated: new Date(updatedProduct.lastUpdated) } 
        : p
      ));
      return updatedProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      return null;
    }
  }, []);

  const createOrder = useCallback(async (customerId: string, items: { productId: string; quantity: number }[]) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, items })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }
      
      const newOrder = {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      };
      
      setOrders(prev => [...prev, newOrder]);
      await refreshProducts();
      return newOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      return null;
    }
  }, [refreshProducts]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update order status');
      const updatedOrder = await response.json();
      setOrders(prev => prev.map(o => o.id === orderId 
        ? { ...updatedOrder, createdAt: new Date(updatedOrder.createdAt), updatedAt: new Date(updatedOrder.updatedAt) } 
        : o
      ));
      if (status === 'cancelled') {
        await refreshProducts();
      }
      return updatedOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
      return null;
    }
  }, [refreshProducts]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([refreshProducts(), refreshOrders()]);
      setLoading(false);
    };
    init();
  }, [refreshProducts, refreshOrders]);

  useEffect(() => {
    const eventSource = new EventSource('/api/inventory/updates');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'product_updated':
          setProducts(prev => prev.map(p => 
            p.id === data.data.id 
              ? { ...data.data, lastUpdated: new Date(data.data.lastUpdated) }
              : p
          ));
          break;
        case 'product_added':
          setProducts(prev => [...prev, { ...data.data, lastUpdated: new Date(data.data.lastUpdated) }]);
          break;
        case 'order_created':
          setOrders(prev => [...prev, {
            ...data.data,
            createdAt: new Date(data.data.createdAt),
            updatedAt: new Date(data.data.updatedAt)
          }]);
          break;
        case 'order_updated':
          setOrders(prev => prev.map(o =>
            o.id === data.data.id
              ? { ...data.data, createdAt: new Date(data.data.createdAt), updatedAt: new Date(data.data.updatedAt) }
              : o
          ));
          break;
        case 'alert_created':
          setAlerts(prev => [...prev, { ...data.data, timestamp: new Date(data.data.timestamp) }]);
          break;
        case 'alert_cleared':
          setAlerts(prev => prev.filter(a => a.id !== data.data.alertId));
          break;
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <InventoryContext.Provider value={{
      products,
      orders,
      alerts,
      loading,
      error,
      refreshProducts,
      refreshOrders,
      createProduct,
      updateProduct,
      createOrder,
      updateOrderStatus
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}