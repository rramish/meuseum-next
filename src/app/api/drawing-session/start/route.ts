import connectDB from '@/lib/mongodb';
import DrawingSession from '@/models/DrawingSession';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { imageFolderUuid } = await req.json();

    if (!imageFolderUuid) {
      return NextResponse.json({ error: 'Image folder UUID required' }, { status: 400 });
    }

    const existingSession = await DrawingSession.findOne({ imageFolderUuid });
    if (existingSession) {
      return NextResponse.json(
        { error: 'Session already exists for this image' },
        { status: 409 }
      );
    }

    const session = new DrawingSession({
      imageFolderUuid: imageFolderUuid,
      status: 'active',
    });
    await session.save();

    return NextResponse.json({ sessionId: session._id.toString() }, { status: 201 });
  } catch (error) {
    console.error('Start session error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to start session' },
      { status: 500 }
    );
  }
}