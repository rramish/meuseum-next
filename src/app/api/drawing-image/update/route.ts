import connectDB from "@/lib/mongodb";
import DrawingImagePiece from "@/models/DrawingImagePiece";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { pieceId, username, updatedUrl } = await req.json();
    console.log("data is : ", pieceId, username, updatedUrl);
    
    if (!pieceId) {
      return NextResponse.json(
        { error: "Piece ID and username are required" },
        { status: 400 }
      );
    }
    // const imageId = pieceId as mongoose.Schema.Types.ObjectId;

    const piece = await DrawingImagePiece.findById(pieceId);
    if (!piece) {
      return NextResponse.json({ error: "Piece not found" }, { status: 404 });
    }
    if (username) {
      piece.username = username;
    }
    if (updatedUrl) {
      piece.updatedUrl = updatedUrl;
    }
    await piece.save();

    return NextResponse.json(
      { message: "Piece updated successfully", piece },
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
