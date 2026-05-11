import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Props) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: Props) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const data = await req.json();

    if (data.title !== undefined && !data.title) {
      return NextResponse.json(
        { error: "请输入文章标题" },
        { status: 400 }
      );
    }

    if (data.slug !== undefined) {
      if (!data.slug) {
        return NextResponse.json(
          { error: "URL 别名不能为空" },
          { status: 400 }
        );
      }
      const existing = await prisma.post.findFirst({
        where: { slug: data.slug, id: { not: id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: "该 URL 别名已被使用" },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.cover !== undefined) updateData.cover = data.cover;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.published !== undefined) updateData.published = data.published;

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(post);
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
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
