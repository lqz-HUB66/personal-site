import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const honors = await prisma.honor.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(honors);
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const data = await req.json();

    if (!data.title) {
      return NextResponse.json(
        { error: "请输入荣誉名称" },
        { status: 400 }
      );
    }

    const honor = await prisma.honor.create({
      data: {
        title: data.title,
        level: data.level || "",
        organizer: data.organizer || "",
        date: data.date || "",
        description: data.description || "",
        image: data.image || "",
        tags: data.tags || "[]",
        year: data.year || "",
        isFeatured: data.isFeatured || false,
      },
    });

    return NextResponse.json(honor, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
