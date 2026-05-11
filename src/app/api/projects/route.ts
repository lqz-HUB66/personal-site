import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  try {
    const data = await req.json();

    if (!data.name) {
      return NextResponse.json(
        { error: "请输入项目名称" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description || "",
        content: data.content || "",
        techStack: data.techStack || "[]",
        highlights: data.highlights || "[]",
        githubUrl: data.githubUrl || "",
        demoUrl: data.demoUrl || "",
        image: data.image || "",
        isFeatured: data.isFeatured || false,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
