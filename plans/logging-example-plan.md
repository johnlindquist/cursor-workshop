# Inventory Management System - Logging Example Plan

## Overview
A real-time inventory management system for a small retail business. This application will have complex frontend-backend interactions that would greatly benefit from comprehensive logging (which will be added during the workshop).

## Key Features

### 1. Product Management
- **Add/Edit Products**: Users can add new products with details (name, SKU, price, initial stock)
- **Real-time Stock Updates**: When stock levels change, all connected clients see updates immediately
- **Low Stock Alerts**: Automatic notifications when stock falls below threshold

### 2. Order Processing
- **Create Orders**: Process customer orders with multiple items
- **Stock Validation**: Real-time validation against current inventory
- **Order Status Updates**: Track order progress (pending → processing → fulfilled)

### 3. Concurrent User Scenarios
- **Race Conditions**: Multiple users trying to order the same low-stock item
- **Inventory Reconciliation**: Handling conflicts when multiple updates occur
- **Transaction Rollbacks**: Cancelling orders and restoring stock

## Technical Architecture

### Frontend (Next.js App Router)
- **Pages**:
  - `/` - Dashboard with real-time inventory overview
  - `/products` - Product management interface
  - `/orders` - Order creation and management
  - `/analytics` - Basic inventory analytics

### Backend (Next.js API Routes)
- **API Endpoints**:
  - `POST /api/products` - Create new product
  - `PUT /api/products/[id]` - Update product details
  - `GET /api/products` - List all products with current stock
  - `POST /api/orders` - Create new order
  - `PUT /api/orders/[id]/status` - Update order status
  - `GET /api/inventory/updates` - SSE endpoint for real-time updates

### State Management
- Server-side: In-memory store (for simplicity during workshop)
- Client-side: React Context with optimistic updates
- WebSocket/SSE for real-time synchronization

## Logging Opportunities (To Be Added During Workshop)

### Critical Events to Log:
1. **Product Operations**
   - Product creation/updates
   - Stock level changes
   - Low stock threshold breaches

2. **Order Processing**
   - Order creation attempts
   - Stock validation results
   - Order status transitions
   - Failed orders due to insufficient stock

3. **Concurrent Access**
   - Race condition detection
   - Optimistic update conflicts
   - Transaction rollbacks

4. **Performance Metrics**
   - API response times
   - Database query durations
   - Real-time update latency

## Implementation Details

### Data Models
```typescript
interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  lastUpdated: Date;
}

interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'fulfilled' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}
```

### Complex Interaction Scenarios
1. **Concurrent Order Processing**
   - User A and User B both try to order the last 5 units of a product
   - System needs to handle this gracefully with proper error handling

2. **Real-time Dashboard Updates**
   - When an order is placed, dashboard updates for all users
   - Stock levels, recent orders, and alerts all update in real-time

3. **Order Cancellation Flow**
   - Cancelling an order triggers stock restoration
   - Other users immediately see updated availability

## Workshop Focus Areas

During the workshop, participants will add logging to:
- Trace the complete lifecycle of an order
- Debug race conditions in concurrent scenarios
- Monitor performance bottlenecks
- Create audit trails for inventory changes
- Set up alerts for critical events (out of stock, high-value orders)

## Setup Commands
```bash
# Generate the Next.js app
npx nx g @nx/next:app inventory-system --directory=apps/inventory-system --appDir=true --e2eTestRunner=none --projectNameAndRootFormat=as-provided

# Install additional dependencies
pnpm add --filter=inventory-system uuid date-fns
```