import connectDB from '@/lib/mongodb';
import DrawingSession from '@/models/DrawingSession';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const session = await DrawingSession.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    session.status = 'inactive';
    await session.save();

    return NextResponse.json({ message: 'Session ended', sessionId }, { status: 200 });
  } catch (error) {
    console.error('End session error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to end session' },
      { status: 500 }
    );
  }
}
