import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const honor = await prisma.honor.findUnique({ where: { id } });
  if (!honor) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }
  return NextResponse.json(honor);
}

export async function PUT(req: NextRequest, { params }: Props) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const data = await req.json();

    if (!data.title) {
      return NextResponse.json(
        { error: "请输入荣誉名称" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.level !== undefined) updateData.level = data.level;
    if (data.organizer !== undefined) updateData.organizer = data.organizer;
    if (data.date !== undefined) updateData.date = data.date;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.year !== undefined) updateData.year = data.year;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;

    const honor = await prisma.honor.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(honor);
  } catch {
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Props) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.honor.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
