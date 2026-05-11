import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

export const dynamic = "force-dynamic";
import MarkdownBody from "@/components/markdown/markdown-body";
import FadeIn from "@/components/ui/fade-in";
import { safeJsonParse } from "@/lib/utils";

interface Props { params: Promise<{ slug: string }> }

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();
  const tags: string[] = safeJsonParse<string[]>(post.tags, []);

  return (
    <div>
      {/* Top bar */}
      <div className="border-b border-[#222]">
        <div className="max-w-3xl mx-auto px-6 pt-10 pb-8">
          <FadeIn>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-white transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 返回博客
            </Link>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        <article>
          <FadeIn delay={80} direction="up">
            <header className="mb-10 pt-2">
              <div className="flex items-center gap-3 text-sm text-[var(--color-muted)] mb-5">
                {post.category && (
                  <span className="tag">{post.category}</span>
                )}
                <span className="flex items-center gap-1.5"><Calendar size={14} />{new Date(post.createdAt).toLocaleDateString("zh-CN")}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-5 tracking-tight leading-tight">{post.title}</h1>
              {post.summary && <p className="text-lg text-[var(--color-muted)] leading-relaxed">{post.summary}</p>}
              {tags.length > 0 && (
                <div className="flex items-center gap-2 mt-5">
                  <Tag size={14} className="text-[var(--color-muted)]" />
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => <span key={tag} className="tag">#{tag}</span>)}
                  </div>
                </div>
              )}
            </header>
          </FadeIn>

          <FadeIn delay={120}>
            <div className="h-px bg-[#222] mb-10" />
          </FadeIn>

          {post.cover && (
            <FadeIn delay={160} direction="up">
              <div className="relative w-full h-64 md:h-80 rounded overflow-hidden mb-10 bg-[var(--color-surface)] border border-[#222]">
                <Image src={post.cover} alt={post.title} fill className="object-cover" />
              </div>
            </FadeIn>
          )}

          <FadeIn delay={200} direction="up">
            <div className="markdown-body"><MarkdownBody content={post.content} /></div>
          </FadeIn>
        </article>
      </div>
    </div>
  );
}
