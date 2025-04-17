import connectDB from "@/lib/mongodb";
import DrawingImagePiece from "@/models/DrawingImagePiece";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { pieceId } = await req.json();
    // console.log("data is : ", pieceId);

    if (!pieceId) {
      return NextResponse.json(
        { error: "Piece ID are required" },
        { status: 400 }
      );
    }

    const piece = await DrawingImagePiece.findById(pieceId);
    if (!piece) {
      return NextResponse.json({ error: "Piece not found" }, { status: 404 });
    }

    piece.updatedUrl = null;
    piece.username = null;
    await piece.save();

    return NextResponse.json(
      { message: "Progress reset successfully", piece },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update piece error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update piece" },
      { status: 500 }
    );
  }
}
