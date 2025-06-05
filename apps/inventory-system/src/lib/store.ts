import { Product, Order, StockUpdate, InventoryAlert } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

export class InventoryStore {
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private stockUpdates: StockUpdate[] = [];
  private alerts: Map<string, InventoryAlert> = new Map();
  private subscribers: Set<(event: InventoryEvent) => void> = new Set();

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleProducts: Product[] = [
      {
        id: uuidv4(),
        sku: 'LAPTOP-001',
        name: 'Gaming Laptop Pro',
        price: 1299.99,
        stock: 15,
        lowStockThreshold: 5,
        lastUpdated: new Date()
      },
      {
        id: uuidv4(),
        sku: 'MOUSE-001',
        name: 'Wireless Gaming Mouse',
        price: 79.99,
        stock: 3,
        lowStockThreshold: 10,
        lastUpdated: new Date()
      },
      {
        id: uuidv4(),
        sku: 'KEYBOARD-001',
        name: 'Mechanical Keyboard RGB',
        price: 149.99,
        stock: 25,
        lowStockThreshold: 8,
        lastUpdated: new Date()
      },
      {
        id: uuidv4(),
        sku: 'MONITOR-001',
        name: '27" 4K Gaming Monitor',
        price: 499.99,
        stock: 8,
        lowStockThreshold: 3,
        lastUpdated: new Date()
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
      if (product.stock <= product.lowStockThreshold) {
        this.createAlert(product.id, product.stock === 0 ? 'out_of_stock' : 'low_stock');
      }
    });
  }

  subscribe(callback: (event: InventoryEvent) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private emit(event: InventoryEvent) {
    this.subscribers.forEach(callback => callback(event));
  }

  getAllProducts(): Product[] {
    return Array.from(this.products.values());
  }

  getProduct(id: string): Product | undefined {
    return this.products.get(id);
  }

  addProduct(product: Omit<Product, 'id' | 'lastUpdated'>): Product {
    const newProduct: Product = {
      ...product,
      id: uuidv4(),
      lastUpdated: new Date()
    };
    
    this.products.set(newProduct.id, newProduct);
    this.emit({ type: 'product_added', data: newProduct });
    
    if (newProduct.stock <= newProduct.lowStockThreshold) {
      this.createAlert(newProduct.id, newProduct.stock === 0 ? 'out_of_stock' : 'low_stock');
    }
    
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>): Product | null {
    const product = this.products.get(id);
    if (!product) return null;

    const previousStock = product.stock;
    const updatedProduct: Product = {
      ...product,
      ...updates,
      lastUpdated: new Date()
    };

    this.products.set(id, updatedProduct);

    if (updates.stock !== undefined && updates.stock !== previousStock) {
      this.recordStockUpdate({
        productId: id,
        previousStock,
        newStock: updates.stock,
        reason: 'adjustment',
        timestamp: new Date()
      });

      this.checkStockAlerts(updatedProduct);
    }

    this.emit({ type: 'product_updated', data: updatedProduct });
    return updatedProduct;
  }

  private checkStockAlerts(product: Product) {
    if (product.stock === 0) {
      this.createAlert(product.id, 'out_of_stock');
    } else if (product.stock <= product.lowStockThreshold) {
      this.createAlert(product.id, 'low_stock');
    } else {
      this.clearAlertsForProduct(product.id);
    }
  }

  private createAlert(productId: string, type: 'low_stock' | 'out_of_stock' | 'restock_needed') {
    const product = this.products.get(productId);
    if (!product) return;

    const alertId = `alert-${productId}-${type}`;
    const existingAlert = this.alerts.get(alertId);
    
    if (existingAlert && !existingAlert.acknowledged) return;

    const alert: InventoryAlert = {
      id: alertId,
      type,
      productId,
      message: type === 'out_of_stock' 
        ? `${product.name} is out of stock!`
        : `${product.name} is low on stock (${product.stock} remaining)`,
      timestamp: new Date(),
      acknowledged: false
    };

    this.alerts.set(alertId, alert);
    this.emit({ type: 'alert_created', data: alert });
  }

  private clearAlertsForProduct(productId: string) {
    const alertIds = Array.from(this.alerts.keys()).filter(id => id.includes(productId));
    alertIds.forEach(id => {
      this.alerts.delete(id);
      this.emit({ type: 'alert_cleared', data: { alertId: id } });
    });
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  getOrder(id: string): Order | undefined {
    return this.orders.get(id);
  }

  createOrder(customerId: string, items: Omit<OrderItem, 'priceAtPurchase'>[]): { success: boolean; order?: Order; error?: string } {
    const validationResult = this.validateOrderItems(items);
    if (!validationResult.valid) {
      return { success: false, error: validationResult.error };
    }

    const orderItems = items.map(item => {
      const product = this.products.get(item.productId)!;
      return {
        ...item,
        priceAtPurchase: product.price
      };
    });

    const order: Order = {
      id: uuidv4(),
      customerId,
      items: orderItems,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.orders.set(order.id, order);
    
    items.forEach(item => {
      const product = this.products.get(item.productId)!;
      this.updateProduct(item.productId, { stock: product.stock - item.quantity });
      
      this.recordStockUpdate({
        productId: item.productId,
        previousStock: product.stock,
        newStock: product.stock - item.quantity,
        reason: 'sale',
        orderId: order.id,
        timestamp: new Date()
      });
    });

    this.emit({ type: 'order_created', data: order });
    return { success: true, order };
  }

  updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const order = this.orders.get(orderId);
    if (!order) return null;

    const previousStatus = order.status;
    order.status = status;
    order.updatedAt = new Date();

    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      order.items.forEach(item => {
        const product = this.products.get(item.productId);
        if (product) {
          const previousStock = product.stock;
          this.updateProduct(item.productId, { stock: product.stock + item.quantity });
          
          this.recordStockUpdate({
            productId: item.productId,
            previousStock,
            newStock: product.stock + item.quantity,
            reason: 'cancellation',
            orderId: order.id,
            timestamp: new Date()
          });
        }
      });
    }

    this.emit({ type: 'order_updated', data: order });
    return order;
  }

  private validateOrderItems(items: { productId: string; quantity: number }[]): { valid: boolean; error?: string } {
    for (const item of items) {
      const product = this.products.get(item.productId);
      if (!product) {
        return { valid: false, error: `Product ${item.productId} not found` };
      }
      if (product.stock < item.quantity) {
        return { valid: false, error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` };
      }
    }
    return { valid: true };
  }

  private recordStockUpdate(update: StockUpdate) {
    this.stockUpdates.push(update);
    this.emit({ type: 'stock_updated', data: update });
  }

  getStockUpdates(productId?: string): StockUpdate[] {
    if (productId) {
      return this.stockUpdates.filter(update => update.productId === productId);
    }
    return this.stockUpdates;
  }

  getAlerts(): InventoryAlert[] {
    return Array.from(this.alerts.values());
  }

  acknowledgeAlert(alertId: string) {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      this.emit({ type: 'alert_acknowledged', data: alert });
    }
  }
}

export type InventoryEvent = 
  | { type: 'product_added'; data: Product }
  | { type: 'product_updated'; data: Product }
  | { type: 'order_created'; data: Order }
  | { type: 'order_updated'; data: Order }
  | { type: 'stock_updated'; data: StockUpdate }
  | { type: 'alert_created'; data: InventoryAlert }
  | { type: 'alert_cleared'; data: { alertId: string } }
  | { type: 'alert_acknowledged'; data: InventoryAlert };

export interface OrderItem {
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

export const inventoryStore = new InventoryStore();