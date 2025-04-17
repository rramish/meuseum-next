import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    return NextResponse.json({ message: 'Protected data', userId: decoded.id }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Invalid token', }, { status: 401 });
  }
}
