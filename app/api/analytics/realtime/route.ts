import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const propertyId = process.env.GA4_PROPERTY_ID;
    
    // Using environment variables or fallback to a JSON key approach if they set it.
    // In Netlify, they might set GA_CLIENT_EMAIL and GA_PRIVATE_KEY
    const clientEmail = process.env.GA_CLIENT_EMAIL;
    const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!propertyId || !clientEmail || !privateKey) {
      return NextResponse.json(
        { error: 'Missing GA4 configuration. Ensure GA4_PROPERTY_ID, GA_CLIENT_EMAIL, and GA_PRIVATE_KEY are set.' },
        { status: 500 }
      );
    }

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      }
    });

    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      metrics: [
        { name: 'activeUsers' }
      ]
    });

    const activeUsers = response.rows && response.rows.length > 0
      ? parseInt(response.rows[0].metricValues?.[0]?.value || '0', 10)
      : 0;

    return NextResponse.json({ activeUsers });
  } catch (error) {
    console.error('Error fetching real-time users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch real-time users from GA4' },
      { status: 500 }
    );
  }
}
