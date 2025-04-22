import mongoose, { Schema, model, Document } from "mongoose";

interface IDrawingSession extends Document {
  imageFolderUuid: string;
  imageUrl: string;
  imageName: string;
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "inactive";
}

const drawingSessionSchema = new Schema<IDrawingSession>(
  {
    imageUrl: { type: String },
    imageName: { type: String },
    imageFolderUuid: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

const DrawingSession =
  mongoose.models.DrawingSession ||
  model<IDrawingSession>("DrawingSession", drawingSessionSchema);
export default DrawingSession;
