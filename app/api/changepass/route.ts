import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/userModels";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  // Retrieve the session; cookies are automatically parsed on the server
  const session = await getServerSession(authOptions);
  console.log("Session in changepass route:", session);

  // If session or email is missing, return 401 Unauthorized
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract new password from the request body
  const { password } = await req.json();
  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters long" },
      { status: 400 }
    );
  }

  try {
    // Hash the new password and update the user
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ email: session.user.email }, { password: hashedPassword });
    
    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
