// import path from "path";
// import connectDB from "@/lib/mongodb";
// import DrawingSession from "@/models/DrawingSession";

// import { promises as fs } from "fs";
// import { v4 as uuidv4 } from "uuid";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const formData = await req.formData();
//     const file = formData.get("image") as File | null;
//     const fileName = `${formData.get("name")}.${file?.name.split(".")[1]}`;

//     if (!file) {
//       return NextResponse.json({ error: "No image provided" }, { status: 400 });
//     }

//     const folderName = uuidv4();
//     const uploadDir = path.join(process.cwd(), "public", "uploads", folderName);
//     await fs.mkdir(uploadDir, { recursive: true });

//     const filePath = path.join(uploadDir, fileName);
//     const arrayBuffer = await file.arrayBuffer();
//     await fs.writeFile(filePath, Buffer.from(arrayBuffer));

//     const imageUrl = `/uploads/${folderName}/${fileName}`;

//     const currentSession = await DrawingSession.findOne({status: "active"});
//     if(currentSession){
//       await DrawingSession.findByIdAndUpdate(currentSession._id, {status: "inactive"});
//     }

//     const session = new DrawingSession({
//       imageFolderUuid: folderName,
//       status: "active",
//     });
//     await session.save();

//     return NextResponse.json({ imageUrl, folderName }, { status: 200 });
//   } catch (error) {
//     console.error("Image upload error:", error);
//     return NextResponse.json(
//       { error: (error as Error).message || "Failed to upload image" },
//       { status: 500 }
//     );
//   }
// }

import path from "path";
import connectDB from "@/lib/mongodb";
import DrawingSession from "@/models/DrawingSession";

import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const fileName = `${formData.get("name")}.${file?.name.split(".").pop()}`;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const folderName = uuidv4();

    // Use /tmp instead of public folder
    const uploadDir = path.join("/tmp", folderName);
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    // You can’t serve this file via public/ anymore
    // So ideally upload to S3 or Cloudinary and get a public URL
    const imageUrl = `file-saved-in-tmp-folder-${filePath}`;

    const currentSession = await DrawingSession.findOne({ status: "active" });
    if (currentSession) {
      await DrawingSession.findByIdAndUpdate(currentSession._id, { status: "inactive" });
    }

    const session = new DrawingSession({
      imageFolderUuid: folderName,
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

