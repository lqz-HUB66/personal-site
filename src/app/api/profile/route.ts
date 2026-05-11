import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const profile = await prisma.profile.findFirst();
  return NextResponse.json(profile || null);
}

export async function PUT(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const existing = await prisma.profile.findFirst();

    const profileData = {
      name: data.name || "",
      title: data.title || "",
      avatar: data.avatar || "",
      bio: data.bio || "",
      longBio: data.longBio || "",
      github: data.github || "",
      email: data.email || "",
      location: data.location || "",
      skills: data.skills || "[]",
      tags: data.tags || "[]",
    };

    let profile;
    if (existing) {
      profile = await prisma.profile.update({
        where: { id: existing.id },
        data: profileData,
      });
    } else {
      profile = await prisma.profile.create({ data: profileData });
    }

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
