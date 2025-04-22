import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import DrawingSession from "@/models/DrawingSession";
import { authMiddleware } from "@/lib/authMiddleware";

export async function GET(req: NextRequest) {
  const authResponse = authMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  await connectDB();

  try {
    const sessions = await DrawingSession.find({});
    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}
