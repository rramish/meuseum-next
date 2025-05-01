import connectDB from "@/lib/mongodb";
import DrawingImagePiece from "@/models/DrawingImagePiece";
import DrawingSession from "@/models/DrawingSession";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { sessionId } = await req.json();

    if (!sessionId ) {
      return NextResponse.json(
        { error: "Session ID and new username are required" },
        { status: 400 }
      );
    }

    const session = await DrawingSession.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    console.log("Ending session:", session);

    const updateResult = await DrawingImagePiece.updateMany(
      { sessionId: session._id }, 
      { $set: { username: "Mosida Admin." } } 
    );


    return NextResponse.json(
      {
        sessionId,
        updatedCount: updateResult.modifiedCount,
        message: "Session ended and username updated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("End session error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to end session" },
      { status: 500 }
    );
  }
}
