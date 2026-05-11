import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 创建管理员账号
  const hashedPassword = await bcrypt.hash("admin123456", 10);
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });
  console.log("管理员已创建: admin / admin123456");

  // 创建个人信息（请登录后台替换为你的信息）
  await prisma.profile.upsert({
    where: { id: "seed-profile" },
    update: {},
    create: {
      id: "seed-profile",
      name: "你的名字",
      title: "你的定位，例：全栈开发者 / CTF 选手",
      bio: "一句话介绍自己，例：热衷于 Web 开发与信息安全，喜欢用代码解决实际问题。",
      longBio:
        "这里写你的完整个人介绍。\n\n" +
        "可以写学习经历、技术方向、兴趣爱好等。\n\n" +
        "支持多段落，登录后台后可以随时修改。",
      github: "https://github.com/你的用户名",
      email: "your@email.com",
      location: "你的城市",
      skills: JSON.stringify([
        "在这里填写",
        "你的技术栈",
        "用逗号分隔",
      ]),
      tags: JSON.stringify(["标签1", "标签2", "标签3"]),
    },
  });
  console.log("个人信息已创建（请登录后台修改）");

  // 创建示例荣誉（请替换为你的荣誉）
  const honors = [
    {
      id: "seed-honor-1",
      title: "示例荣誉 — 请替换为你的荣誉名称",
      level: "奖项等级，例：国家级一等奖",
      organizer: "主办方名称",
      date: "2024-08",
      description: "简要描述这项荣誉，例：在某竞赛中获得某奖项。",
      tags: JSON.stringify(["标签1", "标签2"]),
      year: "2024",
      isFeatured: true,
    },
    {
      id: "seed-honor-2",
      title: "另一个示例荣誉",
      level: "省级二等奖",
      organizer: "某组委会",
      date: "2024-05",
      description: "这是第二个示例荣誉，展示卡片布局效果。",
      tags: JSON.stringify(["示例"]),
      year: "2024",
      isFeatured: false,
    },
  ];

  for (const honor of honors) {
    await prisma.honor.upsert({
      where: { id: honor.id },
      update: { title: honor.title, level: honor.level, organizer: honor.organizer, date: honor.date, description: honor.description, tags: honor.tags, year: honor.year, isFeatured: honor.isFeatured },
      create: honor,
    });
  }
  console.log(`已创建 ${honors.length} 条示例荣誉（请替换）`);

  // 创建示例项目（请替换为你的项目）
  const projects = [
    {
      id: "seed-project-1",
      name: "示例项目 — 请替换",
      description: "简要描述这个项目是做什么的，解决什么问题。",
      content: "",
      techStack: JSON.stringify(["技术1", "技术2", "技术3"]),
      highlights: JSON.stringify(["亮点1", "亮点2", "亮点3"]),
      githubUrl: "https://github.com/你的用户名/项目名",
      demoUrl: "",
      isFeatured: true,
    },
    {
      id: "seed-project-2",
      name: "另一个示例项目",
      description: "第二个示例项目，展示卡片布局效果。",
      content: "",
      techStack: JSON.stringify(["Go", "Redis"]),
      highlights: JSON.stringify(["功能亮点1", "功能亮点2"]),
      githubUrl: "",
      demoUrl: "",
      isFeatured: false,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: { name: project.name, description: project.description, content: project.content, techStack: project.techStack, highlights: project.highlights, githubUrl: project.githubUrl, demoUrl: project.demoUrl, isFeatured: project.isFeatured },
      create: project,
    });
  }
  console.log(`已创建 ${projects.length} 个示例项目（请替换）`);

  // 创建示例文章（请替换为你的文章）
  const posts = [
    {
      title: "示例文章：Markdown 排版演示",
      slug: "markdown-demo",
      summary: "这篇文章展示了 Markdown 渲染效果，包括标题、代码块、表格等。",
      content: `## 标题二

这是一段正文。Markdown 支持 **加粗**、*斜体*、\`行内代码\` 等格式。

### 代码块

\`\`\`typescript
function greet(name: string): string {
  return \`你好，\${name}！\`;
}

console.log(greet("世界"));
\`\`\`

### 列表

- 第一项
- 第二项
- 第三项

### 引用

> 这是一段引用文字，适合用来标注参考或强调某段内容。

### 表格

| 功能 | 说明 | 状态 |
|------|------|------|
| 博客 | Markdown 文章 | 可用 |
| 项目 | 作品集展示 | 可用 |
| 荣誉 | 奖项证书 | 可用 |

---

以上是 Markdown 排版效果演示。你可以在后台删除这篇文章，然后开始写你自己的内容。`,
      cover: "",
      category: "Blog",
      tags: JSON.stringify(["示例", "markdown"]),
      published: true,
    },
    {
      title: "示例文章：CTF 题解格式演示",
      slug: "ctf-demo",
      summary: "展示 CTF 题解的写作格式，包括题目信息、解题步骤、代码和总结。",
      content: `## 题目信息

- **平台：** 示例平台
- **分类：** Web
- **难度：** Easy

## 解题过程

### 1. 信息收集

\`\`\`bash
nmap -sC -sV 目标IP
\`\`\`

### 2. 漏洞分析

在这里描述你发现的漏洞。

### 3. 利用过程

\`\`\`python
import requests

url = "http://target/api/endpoint"
payload = {"key": "value"}
r = requests.post(url, json=payload)
print(r.text)
\`\`\`

### 4. 获取 Flag

\`\`\`
flag{example_flag_here}
\`\`\`

## 总结

这道题考察了 XXX 知识点。关键在于 XXX。

---

以上是 CTF 题解的写作格式演示。分类选择 Web、Crypto、Misc、Reverse、Pwn 会自动出现在 CTF 专区。`,
      cover: "",
      category: "Web",
      tags: JSON.stringify(["示例", "ctf", "writeup"]),
      published: true,
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: { title: post.title, summary: post.summary, content: post.content, cover: post.cover, category: post.category, tags: post.tags, published: post.published },
      create: post,
    });
  }
  console.log(`已创建 ${posts.length} 篇示例文章（请替换）`);

  console.log("");
  console.log("初始化完成！");
  console.log("请登录 http://localhost:3000/admin/login 开始填写你的内容。");
  console.log("默认账号: admin / admin123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
