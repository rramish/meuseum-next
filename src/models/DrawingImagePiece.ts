import mongoose, { Schema, model, Document } from "mongoose";

interface IDrawingImagePiece extends Document {
  name: string;
  dataUrl: string;
  sessionId: mongoose.Types.ObjectId;
  username: string | null;
  updatedUrl: string | null;
  serial: number;
}

const drawingImagePieceSchema = new Schema<IDrawingImagePiece>({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: "DrawingSession",
    required: true,
  },
  dataUrl: { type: String, required: true },
  name: { type: String },
  username: { type: String, default: null },
  updatedUrl: { type: String, default: null },
  serial: { type: Number },
});

const DrawingImagePiece =
  mongoose.models.DrawingImagePiece ||
  model<IDrawingImagePiece>("DrawingImagePiece", drawingImagePieceSchema);
export default DrawingImagePiece;
