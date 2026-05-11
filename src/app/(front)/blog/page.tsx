import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";
import FadeIn from "@/components/ui/fade-in";
import { safeJsonParse } from "@/lib/utils";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="border-b border-[#222]">
        <div className="max-w-3xl mx-auto px-6 pt-16 pb-12">
          <FadeIn>
            <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-[0.2em] mb-3">Blog</p>
            <h1 className="text-4xl font-bold tracking-tight mb-2">博客</h1>
            <p className="text-[var(--color-muted)]">共 {posts.length} 篇文章</p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        {posts.length === 0 ? (
          <FadeIn>
            <div className="text-center py-24 text-[var(--color-muted)]">
              <div className="w-16 h-16 mx-auto mb-6 rounded flex items-center justify-center border border-[#222]">
                <FileText size={28} className="opacity-40" />
              </div>
              <p>暂无文章</p>
            </div>
          </FadeIn>
        ) : (
          <div className="space-y-5 mt-12">
            {posts.map((post, i) => {
              const tags: string[] = safeJsonParse<string[]>(post.tags, []);
              return (
                <FadeIn key={post.id} delay={Math.min(i * 80, 320)} direction="up">
                  <Link href={`/blog/${post.slug}`} className="block group">
                    <article className="card flex gap-6 p-7">
                      {post.cover && (
                        <div className="relative w-40 h-28 rounded overflow-hidden shrink-0 bg-[var(--color-surface)]">
                          <Image src={post.cover} alt={post.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex items-center gap-2.5 text-xs text-[var(--color-muted)] mb-2.5">
                          {post.category && (
                            <span className="tag">{post.category}</span>
                          )}
                          <time className="text-[var(--color-muted)]">{new Date(post.createdAt).toLocaleDateString("zh-CN")}</time>
                        </div>
                        <h2 className="text-lg font-bold mb-1.5 group-hover:text-[var(--color-muted)] transition-colors">{post.title}</h2>
                        {post.summary && <p className="text-sm text-[var(--color-muted)] line-clamp-2 leading-relaxed">{post.summary}</p>}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                            {tags.slice(0, 5).map((tag) => (
                              <span key={tag} className="tag">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <ArrowRight size={18} className="text-[#333] group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 self-center hidden sm:block" />
                    </article>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
