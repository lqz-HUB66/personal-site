import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Github, Mail, MapPin } from "lucide-react";
import FadeIn from "@/components/ui/fade-in";
import MaskReveal from "@/components/ui/mask-reveal";
import GridCard from "@/components/ui/grid-card";
import { safeJsonParse } from "@/lib/utils";

export default async function HomePage() {
  const profile = await prisma.profile.findFirst();
  const featuredHonors = await prisma.honor.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  const featuredProjects = await prisma.project.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  const recentPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  const tags: string[] = safeJsonParse<string[]>(profile?.tags, []);

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* Hero */}
      <section className="pt-32 pb-24">
        <FadeIn>
          <div className="flex flex-col sm:flex-row items-start gap-10">
            {profile?.avatar && (
              <div className="relative w-28 h-28 rounded overflow-hidden shrink-0 border border-[#222]">
                <Image src={profile.avatar} alt={profile.name} fill className="object-cover" />
              </div>
            )}
            <div className="max-w-2xl">
              <h1 className="text-6xl sm:text-7xl font-bold tracking-tight mb-6">
                <MaskReveal>{profile?.name || "你的名字"}</MaskReveal>
              </h1>
              <p className="text-xl text-[var(--color-muted)] mb-6">
                {profile?.title || "开发者 / 学生 / 创作者"}
              </p>
              <p className="text-[var(--color-muted)] leading-relaxed mb-8 text-base">
                {profile?.bio || "欢迎来到我的个人网站。"}
              </p>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-5 text-sm text-[var(--color-muted)]">
                {profile?.location && (
                  <span className="flex items-center gap-1.5"><MapPin size={14} />{profile.location}</span>
                )}
                {profile?.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <Github size={14} />GitHub
                  </a>
                )}
                {profile?.email && (
                  <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <Mail size={14} />{profile.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Honors */}
      {featuredHonors.length > 0 && (
        <section className="py-20 border-t border-[#222]">
          <FadeIn>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-bold">精选荣誉</h2>
              <Link href="/honors" className="text-sm text-[var(--color-muted)] hover:text-white flex items-center gap-1 transition-colors">
                查看全部 <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredHonors.map((honor, i) => (
              <FadeIn key={honor.id} delay={i * 100} direction="up">
                <GridCard className="card p-6 h-full flex flex-col">
                  <div className="text-xs text-[var(--color-muted)] mb-3">
                    {honor.year}{honor.organizer && ` · ${honor.organizer}`}
                  </div>
                  <h3 className="font-semibold mb-2">{honor.title}</h3>
                  {honor.level && (
                    <span className="tag self-start mb-3">
                      {honor.level}
                    </span>
                  )}
                  {honor.description && (
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-3 mt-auto">{honor.description}</p>
                  )}
                </GridCard>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {featuredProjects.length > 0 && (
        <section className="py-20 border-t border-[#222]">
          <FadeIn>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-bold">精选项目</h2>
              <Link href="/projects" className="text-sm text-[var(--color-muted)] hover:text-white flex items-center gap-1 transition-colors">
                查看全部 <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project, i) => (
              <FadeIn key={project.id} delay={i * 100} direction="up">
                <Link href="/projects" className="group block h-full">
                  <GridCard className="card overflow-hidden h-full flex flex-col">
                    {project.image && (
                      <div className="relative h-44 bg-[var(--color-surface)] overflow-hidden">
                        <Image src={project.image} alt={project.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-semibold mb-2">{project.name}</h3>
                      <p className="text-sm text-[var(--color-muted)] line-clamp-2 mb-4 leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {(safeJsonParse<string[]>(project.techStack, [])).map((tech) => (
                          <span key={tech} className="tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </GridCard>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* Posts */}
      {recentPosts.length > 0 && (
        <section className="py-20 border-t border-[#222]">
          <FadeIn>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-bold">最新文章</h2>
              <Link href="/blog" className="text-sm text-[var(--color-muted)] hover:text-white flex items-center gap-1 transition-colors">
                查看全部 <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>
          <div className="space-y-4">
            {recentPosts.map((post, i) => (
              <FadeIn key={post.id} delay={i * 100} direction="up">
                <Link href={`/blog/${post.slug}`} className="block group">
                  <GridCard className="card flex gap-6 p-6">
                    {post.cover && (
                      <div className="relative w-36 h-24 rounded overflow-hidden shrink-0 bg-[var(--color-surface)]">
                        <Image src={post.cover} alt={post.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] mb-2">
                        {post.category && <span>{post.category}</span>}
                        {post.category && <span>·</span>}
                        <time>{new Date(post.createdAt).toLocaleDateString("zh-CN")}</time>
                      </div>
                      <h3 className="font-semibold mb-1 group-hover:text-[var(--color-muted)] transition-colors">{post.title}</h3>
                      {post.summary && <p className="text-sm text-[var(--color-muted)] line-clamp-2">{post.summary}</p>}
                    </div>
                  </GridCard>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* Empty */}
      {!profile && featuredHonors.length === 0 && featuredProjects.length === 0 && recentPosts.length === 0 && (
        <div className="py-32 text-center text-[var(--color-muted)]">
          <FadeIn>
            <p className="text-lg mb-2 text-white font-medium">欢迎</p>
            <p className="text-sm">前往 <Link href="/admin/login" className="underline">/admin</Link> 开始配置你的网站</p>
          </FadeIn>
        </div>
      )}
    </div>
  );
}
