import connectDB from "@/lib/mongodb";
import DrawingSession from "@/models/DrawingSession";
import DrawingImagePiece from "@/models/DrawingImagePiece";

import { NextRequest, NextResponse } from "next/server";

interface Piece {
  name: string;
  serial: number;
  dataUrl: string;
  username: string;
  updatedUrl: string;
}

export async function POST(req: NextRequest) {

  await connectDB();

  try {
    const { sessionId, pieces } = await req.json();

    if (!sessionId || !Array.isArray(pieces) || pieces.length === 0) {
      return NextResponse.json(
        { error: "Session ID and a non-empty array of pieces are required" },
        { status: 400 }
      );
    }

    const session = await DrawingSession.findOne({
      imageFolderUuid: sessionId,
    });
    if (!session) {
      return NextResponse.json(
        { error: "Active session not found" },
        { status: 404 }
      );
    }
    if (session.status !== "active") {
      return NextResponse.json(
        { error: "Active session not found" },
        { status: 404 }
      );
    }

    const pieceDocs = await Promise.all(
      pieces.map(async (piece: Piece) => {
        const { dataUrl, name, serial } = piece;
        console.log("piece is : ", piece);
        if (!dataUrl || !name) {
          throw new Error("Each piece must have a pieceUrl and name");
        }

        const newPiece = new DrawingImagePiece({
          sessionId: session._id,
          dataUrl,
          name,
          serial,
        });
        await newPiece.save();
        return newPiece;
      })
    );

    return NextResponse.json(
      { message: "Pieces saved successfully", pieceDocs },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save pieces error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to save pieces" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDB();

  try {
    const session = await DrawingSession.findOne({ status: "active" });
    if (!session) {
      return NextResponse.json(
        { error: "Active session not found" },
        { status: 404 }
      );
    }

    const pieces = await DrawingImagePiece.find({ sessionId: session._id }).sort("serial");

    return NextResponse.json(
      { message: "Pieces fetched successfully", pieces },
      { status: 200 }
    );
  } catch (error) {
    console.error("get pieces error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to get pieces" },
      { status: 500 }
    );
  }
}
