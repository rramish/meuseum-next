import path from "path";
import { put } from "@vercel/blob";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import DrawingSession from "@/models/DrawingSession";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const fileName = `${formData.get("name")}.${file?.name.split(".")[1]}`;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    const folderName = uuidv4();
    const tempUploadDir = path.join("/tmp", "uploads", folderName);
    await fs.mkdir(tempUploadDir, { recursive: true });

    const tempFilePath = path.join(tempUploadDir, fileName);
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(tempFilePath, Buffer.from(arrayBuffer));

    const blob = await put(`uploads/${folderName}/${fileName}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    await fs.unlink(tempFilePath).catch(() => {});

    const imageUrl = blob.url;

    const currentSession = await DrawingSession.findOne({ status: "active" });
    if (currentSession) {
      await DrawingSession.findByIdAndUpdate(currentSession._id, {
        status: "inactive",
      });
    }

    const session = new DrawingSession({
      imageFolderUuid: folderName,
      imageUrl,
      imageName: fileName,
      status: "active",
    });
    await session.save();

    return NextResponse.json({ imageUrl, folderName }, { status: 200 });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
