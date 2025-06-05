import { NextRequest, NextResponse } from 'next/server';
import { inventoryStore } from '../../../lib/store';

export async function GET() {
  const products = inventoryStore.getAllProducts();
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sku, name, price, stock, lowStockThreshold } = body;

    if (!sku || !name || price === undefined || stock === undefined || lowStockThreshold === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const product = inventoryStore.addProduct({
      sku,
      name,
      price,
      stock,
      lowStockThreshold
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}