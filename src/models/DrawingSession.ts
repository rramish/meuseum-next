import mongoose, { Schema, model, Document } from "mongoose";

interface IDrawingSession extends Document {
  imageFolderUuid: string;
  status: "active" | "inactive";
}

const drawingSessionSchema = new Schema<IDrawingSession>({
  imageFolderUuid: { type: String, required: true, unique: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

const DrawingSession =
  mongoose.models.DrawingSession ||
  model<IDrawingSession>("DrawingSession", drawingSessionSchema);
export default DrawingSession;
