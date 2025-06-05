import { InventoryProvider } from '../contexts/InventoryContext';
import './global.css';

export const metadata = {
  title: 'Inventory Management System',
  description: 'Real-time inventory management for retail',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <InventoryProvider>
          {children}
        </InventoryProvider>
      </body>
    </html>
  )
}
