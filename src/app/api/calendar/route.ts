import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session || !(session as any).accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      // Normalize any non-JSON upstream response into a JSON error envelope
      try {
        const data = JSON.parse(text);
        return NextResponse.json(data, { status: res.status });
      } catch {
        return NextResponse.json({ error: text || 'Upstream error' }, { status: res.status });
      }
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
