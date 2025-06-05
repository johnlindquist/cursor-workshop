'use client';

import { useInventory } from '../../contexts/InventoryContext';
import Link from 'next/link';
import styles from './page.module.css';

export default function AnalyticsPage() {
  const { products, orders, loading } = useInventory();

  if (loading) {
    return <div className={styles.loading}>Loading analytics...</div>;
  }

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => {
    if (order.status !== 'cancelled') {
      return sum + order.items.reduce((orderSum, item) => 
        orderSum + (item.quantity * item.priceAtPurchase), 0
      );
    }
    return sum;
  }, 0);

  const averageOrderValue = totalOrders > 0 ? totalRevenue / orders.filter(o => o.status !== 'cancelled').length : 0;

  const productPerformance = products.map(product => {
    const soldQuantity = orders.reduce((sum, order) => {
      if (order.status !== 'cancelled') {
        const item = order.items.find(i => i.productId === product.id);
        return sum + (item ? item.quantity : 0);
      }
      return sum;
    }, 0);

    const revenue = orders.reduce((sum, order) => {
      if (order.status !== 'cancelled') {
        const item = order.items.find(i => i.productId === product.id);
        return sum + (item ? item.quantity * item.priceAtPurchase : 0);
      }
      return sum;
    }, 0);

    return {
      ...product,
      soldQuantity,
      revenue,
      turnoverRate: soldQuantity / (product.stock + soldQuantity)
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const orderStatusBreakdown = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    fulfilled: orders.filter(o => o.status === 'fulfilled').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Inventory Analytics</h1>
        <nav className={styles.nav}>
          <Link href="/">Dashboard</Link>
          <Link href="/products">Products</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/analytics">Analytics</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <h2>Total Revenue</h2>
            <p className={styles.metricValue}>${totalRevenue.toFixed(2)}</p>
          </div>
          <div className={styles.metricCard}>
            <h2>Total Orders</h2>
            <p className={styles.metricValue}>{totalOrders}</p>
          </div>
          <div className={styles.metricCard}>
            <h2>Average Order Value</h2>
            <p className={styles.metricValue}>${averageOrderValue.toFixed(2)}</p>
          </div>
          <div className={styles.metricCard}>
            <h2>Total Products</h2>
            <p className={styles.metricValue}>{totalProducts}</p>
          </div>
        </div>

        <div className={styles.analyticsGrid}>
          <div className={styles.section}>
            <h2>Order Status Breakdown</h2>
            <div className={styles.statusBreakdown}>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Pending</span>
                <span className={styles.statusCount}>{orderStatusBreakdown.pending}</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Processing</span>
                <span className={styles.statusCount}>{orderStatusBreakdown.processing}</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Fulfilled</span>
                <span className={styles.statusCount}>{orderStatusBreakdown.fulfilled}</span>
              </div>
              <div className={styles.statusItem}>
                <span className={styles.statusLabel}>Cancelled</span>
                <span className={styles.statusCount}>{orderStatusBreakdown.cancelled}</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Inventory Health</h2>
            <div className={styles.inventoryHealth}>
              <div className={styles.healthItem}>
                <span className={styles.healthLabel}>Well Stocked</span>
                <span className={styles.healthValue + ' ' + styles.success}>
                  {products.filter(p => p.stock > p.lowStockThreshold).length}
                </span>
              </div>
              <div className={styles.healthItem}>
                <span className={styles.healthLabel}>Low Stock</span>
                <span className={styles.healthValue + ' ' + styles.warning}>
                  {products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length}
                </span>
              </div>
              <div className={styles.healthItem}>
                <span className={styles.healthLabel}>Out of Stock</span>
                <span className={styles.healthValue + ' ' + styles.danger}>
                  {products.filter(p => p.stock === 0).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.performanceTable}>
          <h2>Product Performance</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Current Stock</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Turnover Rate</th>
              </tr>
            </thead>
            <tbody>
              {productPerformance.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td className={
                    product.stock === 0 ? styles.danger : 
                    product.stock <= product.lowStockThreshold ? styles.warning : 
                    ''
                  }>
                    {product.stock}
                  </td>
                  <td>{product.soldQuantity}</td>
                  <td>${product.revenue.toFixed(2)}</td>
                  <td>{(product.turnoverRate * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}