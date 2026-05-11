import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9一-龥]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
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
        { error: "请输入文章标题" },
        { status: 400 }
      );
    }

    let slug = data.slug || generateSlug(data.title);
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug,
        summary: data.summary || "",
        content: data.content || "",
        cover: data.cover || "",
        category: data.category || "",
        tags: data.tags || "[]",
        published: data.published || false,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
