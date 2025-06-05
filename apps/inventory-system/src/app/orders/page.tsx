'use client';

import { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { format } from 'date-fns';
import Link from 'next/link';
import styles from './page.module.css';

export default function OrdersPage() {
  const { products, orders, loading, createOrder, updateOrderStatus } = useInventory();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: 'productId' | 'quantity', value: string | number) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderItems(newItems);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validItems = orderItems.filter(item => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      setError('Please add at least one item to the order');
      return;
    }

    const result = await createOrder(customerId, validItems);
    if (result) {
      setShowCreateForm(false);
      setCustomerId('');
      setOrderItems([]);
    } else {
      setError('Failed to create order. Please check stock availability.');
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: any) => {
    await updateOrderStatus(orderId, newStatus);
  };

  const getOrderTotal = (order: any) => {
    return order.items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.priceAtPurchase), 0
    );
  };

  if (loading) {
    return <div className={styles.loading}>Loading orders...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Order Management</h1>
        <nav className={styles.nav}>
          <Link href="/">Dashboard</Link>
          <Link href="/products">Products</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/analytics">Analytics</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.actionBar}>
          <button 
            className={styles.createButton}
            onClick={() => setShowCreateForm(true)}
          >
            Create New Order
          </button>
        </div>

        {showCreateForm && (
          <form className={styles.form} onSubmit={handleSubmitOrder}>
            <h2>Create New Order</h2>
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.formGroup}>
              <label htmlFor="customerId">Customer ID</label>
              <input
                id="customerId"
                type="text"
                value={customerId}
                onChange={e => setCustomerId(e.target.value)}
                placeholder="Enter customer ID"
                required
              />
            </div>

            <div className={styles.itemsSection}>
              <h3>Order Items</h3>
              {orderItems.map((item, index) => (
                <div key={index} className={styles.orderItemForm}>
                  <select
                    value={item.productId}
                    onChange={e => handleItemChange(index, 'productId', e.target.value)}
                    required
                  >
                    <option value="">Select a product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.price} ({product.stock} in stock)
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    required
                  />
                  <button 
                    type="button"
                    className={styles.removeButton}
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button 
                type="button"
                className={styles.addItemButton}
                onClick={handleAddItem}
              >
                Add Item
              </button>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Create Order
              </button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => {
                  setShowCreateForm(false);
                  setCustomerId('');
                  setOrderItems([]);
                  setError(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className={styles.ordersTable}>
          <h2>Order History</h2>
          {orders.length === 0 ? (
            <p className={styles.noOrders}>No orders yet</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id.slice(0, 8)}</td>
                    <td>{order.customerId}</td>
                    <td>{order.items.length} items</td>
                    <td>${getOrderTotal(order).toFixed(2)}</td>
                    <td>
                      <span className={`${styles.status} ${styles[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{format(order.createdAt, 'PPp')}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className={styles.statusSelect}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}