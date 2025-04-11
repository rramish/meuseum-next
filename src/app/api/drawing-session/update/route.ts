import connectDB from '@/lib/mongodb';
import DrawingSession from '@/models/DrawingSession';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { sessionId, status } = await req.json();

    if (!sessionId || !status || !['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { error: 'Session ID and valid status (active/inactive) required' },
        { status: 400 }
      );
    }

    const session = await DrawingSession.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    session.status = status;
    await session.save();

    return NextResponse.json({ message: 'Session updated', session }, { status: 200 });
  } catch (error) {
    console.error('Update session error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to update session' },
      { status: 500 }
    );
  }
}
