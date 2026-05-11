import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Github, Mail, MapPin } from "lucide-react";
import FadeIn from "@/components/ui/fade-in";
import { safeJsonParse } from "@/lib/utils";

export default async function AboutPage() {
  const profile = await prisma.profile.findFirst();
  const skills: string[] = safeJsonParse<string[]>(profile?.skills, []);

  return (
    <div>
      {/* Hero bar */}
      <div className="border-b border-[#222]">
        <div className="max-w-3xl mx-auto px-6 pt-16 pb-12">
          <FadeIn>
            <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-[0.2em] mb-3">
              About
            </p>
            <h1 className="text-4xl font-bold tracking-tight">关于我</h1>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-20">
        {/* Profile card */}
        <FadeIn delay={80} direction="up">
          <div className="card p-8 mt-12 mb-12">
            <div className="flex flex-col sm:flex-row items-start gap-8">
              {profile?.avatar && (
                <div className="relative w-28 h-28 rounded overflow-hidden shrink-0 border border-[#222]">
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">
                  {profile?.name || "你的名字"}
                </h2>
                <p className="text-[var(--color-muted)] mb-5 text-sm">
                  {profile?.title || ""}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {profile?.location && (
                    <span className="flex items-center gap-1.5 text-[var(--color-muted)]">
                      <MapPin size={14} /> {profile.location}
                    </span>
                  )}
                  {profile?.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#333] rounded text-xs font-medium text-[var(--color-muted)] hover:text-white hover:border-white transition-colors"
                    >
                      <Github size={13} /> GitHub
                    </a>
                  )}
                  {profile?.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-[#333] rounded text-xs font-medium text-[var(--color-muted)] hover:text-white hover:border-white transition-colors"
                    >
                      <Mail size={13} /> {profile.email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Bio */}
        {profile?.longBio && (
          <FadeIn delay={160} direction="up">
            <section className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1 h-7 bg-white rounded" />
                <h3 className="text-xl font-bold">个人简介</h3>
              </div>
              <div className="text-[var(--color-muted)] leading-[2] whitespace-pre-wrap pl-6 border-l border-[#222]">
                {profile.longBio}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <FadeIn delay={240} direction="up">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1 h-7 bg-white rounded" />
                <h3 className="text-xl font-bold">技术栈</h3>
              </div>
              <div className="flex flex-wrap gap-3 pl-6">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="tag px-4 py-2 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        {!profile && (
          <FadeIn>
            <div className="text-center py-20 text-[var(--color-muted)]">
              尚未配置个人资料。
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
