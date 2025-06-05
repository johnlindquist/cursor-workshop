'use client';

import { useState } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import Link from 'next/link';
import styles from './page.module.css';

export default function ProductsPage() {
  const { products, loading, createProduct, updateProduct } = useInventory();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    price: '',
    stock: '',
    lowStockThreshold: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      sku: formData.sku,
      name: formData.name,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      lowStockThreshold: parseInt(formData.lowStockThreshold)
    };

    if (editingProduct) {
      await updateProduct(editingProduct, productData);
      setEditingProduct(null);
    } else {
      await createProduct(productData);
    }

    setFormData({ sku: '', name: '', price: '', stock: '', lowStockThreshold: '' });
    setShowAddForm(false);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product.id);
    setFormData({
      sku: product.sku,
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      lowStockThreshold: product.lowStockThreshold.toString()
    });
    setShowAddForm(true);
  };

  const handleStockAdjustment = async (productId: string, adjustment: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      await updateProduct(productId, { stock: Math.max(0, product.stock + adjustment) });
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading products...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Product Management</h1>
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
            className={styles.addButton}
            onClick={() => {
              setShowAddForm(true);
              setEditingProduct(null);
              setFormData({ sku: '', name: '', price: '', stock: '', lowStockThreshold: '' });
            }}
          >
            Add New Product
          </button>
        </div>

        {showAddForm && (
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="sku">SKU</label>
                <input
                  id="sku"
                  type="text"
                  value={formData.sku}
                  onChange={e => setFormData({ ...formData, sku: e.target.value })}
                  required
                  disabled={!!editingProduct}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="name">Product Name</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="price">Price</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="stock">Initial Stock</label>
                <input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="threshold">Low Stock Threshold</label>
                <input
                  id="threshold"
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={e => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                {editingProduct ? 'Update' : 'Add'} Product
              </button>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className={styles.productGrid}>
          {products.map(product => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productHeader}>
                <h3>{product.name}</h3>
                <span className={styles.sku}>SKU: {product.sku}</span>
              </div>
              <div className={styles.productDetails}>
                <div className={styles.detail}>
                  <span className={styles.label}>Price:</span>
                  <span className={styles.value}>${product.price.toFixed(2)}</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Stock:</span>
                  <span className={`${styles.value} ${
                    product.stock === 0 ? styles.danger : 
                    product.stock <= product.lowStockThreshold ? styles.warning : 
                    styles.success
                  }`}>
                    {product.stock} units
                  </span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Low Stock Alert:</span>
                  <span className={styles.value}>{product.lowStockThreshold} units</span>
                </div>
              </div>
              <div className={styles.productActions}>
                <button 
                  className={styles.adjustButton}
                  onClick={() => handleStockAdjustment(product.id, -1)}
                  disabled={product.stock === 0}
                >
                  -1
                </button>
                <button 
                  className={styles.adjustButton}
                  onClick={() => handleStockAdjustment(product.id, 1)}
                >
                  +1
                </button>
                <button 
                  className={styles.editButton}
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}