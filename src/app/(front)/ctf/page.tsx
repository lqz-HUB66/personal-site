import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";
import FadeIn from "@/components/ui/fade-in";

const CTF_CATEGORIES = ["Web", "Crypto", "Misc", "Reverse", "Pwn"];

export default async function CTFPage() {
  const posts = await prisma.post.findMany({
    where: { published: true, category: { in: CTF_CATEGORIES } },
    orderBy: { createdAt: "desc" },
  });

  const grouped = CTF_CATEGORIES.map((cat) => ({
    category: cat,
    posts: posts.filter((p) => p.category === cat),
  }));

  return (
    <div>
      <div className="border-b border-[#222]">
        <div className="max-w-3xl mx-auto px-6 pt-16 pb-12">
          <FadeIn>
            <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-[0.2em] mb-3">CTF</p>
            <h1 className="text-4xl font-bold tracking-tight mb-2">CTF 题解</h1>
            <p className="text-[var(--color-muted)]">共 {posts.length} 篇题解</p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        {posts.length === 0 ? (
          <FadeIn>
            <div className="text-center py-24 text-[var(--color-muted)]">
              <div className="w-16 h-16 mx-auto mb-6 rounded flex items-center justify-center border border-[#222]">
                <Shield size={28} className="opacity-40" />
              </div>
              <p>暂无 CTF 题解</p>
            </div>
          </FadeIn>
        ) : (
          <div className="space-y-16 mt-12">
            {grouped.map(({ category, posts: catPosts }, gi) =>
              catPosts.length > 0 && (
                <FadeIn key={category} delay={gi * 120} direction="up">
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="tag">
                        {category}
                      </span>
                      <span className="text-sm text-[var(--color-muted)]">{catPosts.length} 篇</span>
                      <div className="flex-1 h-px bg-[#222]" />
                    </div>
                    <div className="space-y-3">
                      {catPosts.map((post, pi) => (
                        <FadeIn key={post.id} delay={pi * 60} direction="up">
                          <Link href={`/blog/${post.slug}`} className="group card flex items-center justify-between gap-4 p-5">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold group-hover:text-[var(--color-muted)] transition-colors truncate">{post.title}</h3>
                              {post.summary && <p className="text-sm text-[var(--color-muted)] mt-0.5 line-clamp-1">{post.summary}</p>}
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <time className="text-xs text-[var(--color-muted)]">{new Date(post.createdAt).toLocaleDateString("zh-CN")}</time>
                              <ArrowRight size={14} className="text-[#333] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </Link>
                        </FadeIn>
                      ))}
                    </div>
                  </section>
                </FadeIn>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
