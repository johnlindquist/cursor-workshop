'use client';

import { useInventory } from '../contexts/InventoryContext';
import { format } from 'date-fns';
import Link from 'next/link';
import styles from './page.module.css';

export default function DashboardPage() {
  const { products, orders, alerts, loading } = useInventory();

  if (loading) {
    return <div className={styles.loading}>Loading inventory data...</div>;
  }

  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const recentOrders = orders.slice(-5).reverse();
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Inventory Management Dashboard</h1>
        <nav className={styles.nav}>
          <Link href="/">Dashboard</Link>
          <Link href="/products">Products</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/analytics">Analytics</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h2>Total Products</h2>
            <p className={styles.statValue}>{products.length}</p>
          </div>
          <div className={styles.statCard}>
            <h2>Low Stock Items</h2>
            <p className={styles.statValue + ' ' + styles.warning}>{lowStockProducts.length}</p>
          </div>
          <div className={styles.statCard}>
            <h2>Out of Stock</h2>
            <p className={styles.statValue + ' ' + styles.danger}>{outOfStockProducts.length}</p>
          </div>
          <div className={styles.statCard}>
            <h2>Inventory Value</h2>
            <p className={styles.statValue}>${totalInventoryValue.toFixed(2)}</p>
          </div>
        </div>

        {alerts.length > 0 && (
          <div className={styles.alertsSection}>
            <h2>Active Alerts</h2>
            <div className={styles.alertsList}>
              {alerts.map(alert => (
                <div key={alert.id} className={`${styles.alert} ${styles[alert.type]}`}>
                  <span>{alert.message}</span>
                  <time>{format(alert.timestamp, 'PPp')}</time>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.dashboardGrid}>
          <div className={styles.section}>
            <h2>Low Stock Products</h2>
            <div className={styles.productList}>
              {lowStockProducts.length === 0 ? (
                <p>All products are well stocked!</p>
              ) : (
                lowStockProducts.map(product => (
                  <div key={product.id} className={styles.productItem}>
                    <div>
                      <h3>{product.name}</h3>
                      <p>SKU: {product.sku}</p>
                    </div>
                    <div className={styles.stockInfo}>
                      <span className={product.stock === 0 ? styles.danger : styles.warning}>
                        {product.stock} units
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h2>Recent Orders</h2>
            <div className={styles.orderList}>
              {recentOrders.length === 0 ? (
                <p>No orders yet</p>
              ) : (
                recentOrders.map(order => (
                  <div key={order.id} className={styles.orderItem}>
                    <div>
                      <h3>Order #{order.id.slice(0, 8)}</h3>
                      <p>{order.items.length} items</p>
                    </div>
                    <div className={styles.orderStatus}>
                      <span className={`${styles.status} ${styles[order.status]}`}>
                        {order.status}
                      </span>
                      <time>{format(order.createdAt, 'PP')}</time>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}