import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import DrawingSession from "@/models/DrawingSession";
import DrawingImagePiece from "@/models/DrawingImagePiece";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const session = await DrawingSession.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    await DrawingSession.findOneAndUpdate(
      { status: "active" },
      { status: "inactive" },
      { merge: true }
    );

    console.log("Session", session);

    const newSession = new DrawingSession({
      ...session.toObject(),
      _id: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
    });

    await newSession.save();

    const imagePieces = await DrawingImagePiece.find({ sessionId: sessionId });

    imagePieces.forEach(async (piece) => {
      const newPiece = new DrawingImagePiece({
        ...piece.toObject(),
        _id: undefined,
        sessionId: newSession._id,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: null,
        updatedUrl: null,
      });

      await newPiece.save();
    });

    return NextResponse.json(
      { message: "Session reset successfully", newSession },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset session error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to reset session" },
      { status: 500 }
    );
  }
}
