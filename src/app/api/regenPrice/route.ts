import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Public API endpoint from CoinGecko for the "regen-network" id
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=regen&vs_currencies=usd');
    const data = await res.json();
    const regenPrice = data?.regen?.usd;

    if (!regenPrice) {
      console.error('REGEN price not available in API response:', data);
      return NextResponse.json({ error: 'Price not available' }, { status: 400 });
    }

    return NextResponse.json({ regenPrice }, {
      // Cache the response for 5 minutes and allow stale content while revalidating
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60'
      }
    });
  } catch (error) {
    console.error('Error fetching REGEN price:', error);
    return NextResponse.json({ error: `Failed to fetch price: ${error}` }, { status: 500 });
  }
}
