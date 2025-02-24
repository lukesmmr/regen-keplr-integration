import { NextResponse } from 'next/server';

// In-memory cache
let cachedPrice: number | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const FALLBACK_PRICE = 0.02875; // Approximate price per REGEN token

export async function GET(request: Request) {
  try {
    const now = Date.now();
    
    // Return cached price if available and not expired
    if (cachedPrice && (now - lastFetchTime) < CACHE_DURATION) {
      return NextResponse.json({ 
        regenPrice: cachedPrice
      });
    }

    // Fetch new price if cache expired or not available
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=regen&vs_currencies=usd');
    const data = await res.json();
    const regenPrice = data?.regen?.usd;

    if (!regenPrice) {
      console.warn('REGEN price not available, using fallback price');
      return NextResponse.json({ 
        regenPrice: FALLBACK_PRICE,
        usingFallback: true
      });
    }

    // Update cache
    cachedPrice = regenPrice;
    lastFetchTime = now;

    return NextResponse.json({ 
      regenPrice
    });
  } catch (error) {
    console.error('Error fetching REGEN price:', error);
    return NextResponse.json({ 
      regenPrice: FALLBACK_PRICE,
      usingFallback: true
    });
  }
}
