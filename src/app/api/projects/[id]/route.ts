import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest, { params }: Props) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const data = await req.json();

    if (!data.name) {
      return NextResponse.json(
        { error: "请输入项目名称" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.techStack !== undefined) updateData.techStack = data.techStack;
    if (data.highlights !== undefined) updateData.highlights = data.highlights;
    if (data.githubUrl !== undefined) updateData.githubUrl = data.githubUrl;
    if (data.demoUrl !== undefined) updateData.demoUrl = data.demoUrl;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(project);
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
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
