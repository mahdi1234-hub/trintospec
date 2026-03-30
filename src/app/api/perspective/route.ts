import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Generates data formatted for Perspective.js viewer
export async function GET() {
  const now = new Date();
  const brands = ['JA Solar', 'Longi', 'Trina Solar', 'Canadian Solar', 'Jinko Solar', 'Risen Energy', 'BYD Solar', 'Q Cells'];
  const regions = ['Tunis', 'Sfax', 'Sousse', 'Monastir', 'Bizerte', 'Gabes', 'Kairouan', 'Tozeur'];
  
  const rows: any[] = [];
  
  for (let i = 0; i < 200; i++) {
    const brand = brands[i % brands.length];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const basePrice = 600 + Math.random() * 1400;
    const wattage = [340, 400, 450, 500, 550, 570, 600, 670][Math.floor(Math.random() * 8)];
    const ts = new Date(now.getTime() - Math.random() * 86400000 * 30);
    
    rows.push({
      id: i,
      brand,
      region,
      price_tnd: parseFloat(basePrice.toFixed(2)),
      wattage,
      price_per_watt: parseFloat((basePrice / wattage).toFixed(3)),
      date: ts.toISOString().split('T')[0],
      timestamp: ts.toISOString(),
      efficiency: parseFloat((18 + Math.random() * 5).toFixed(1)),
      rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
      in_stock: Math.random() > 0.2,
      volume_sold: Math.floor(Math.random() * 500),
    });
  }

  return NextResponse.json(rows);
}
