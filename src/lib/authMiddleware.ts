import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export function authMiddleware(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return null; // Indicate that the request is valid
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/protected/:path*"],
};
