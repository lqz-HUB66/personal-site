import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Github, ExternalLink, FolderOpen } from "lucide-react";
import FadeIn from "@/components/ui/fade-in";
import { safeJsonParse } from "@/lib/utils";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="border-b border-[#222]">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
          <FadeIn>
            <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-[0.2em] mb-3">Projects</p>
            <h1 className="text-4xl font-bold tracking-tight mb-2">项目作品</h1>
            <p className="text-[var(--color-muted)]">共 {projects.length} 个项目</p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        {projects.length === 0 ? (
          <FadeIn>
            <div className="text-center py-24 text-[var(--color-muted)]">
              <div className="w-16 h-16 mx-auto mb-6 rounded flex items-center justify-center border border-[#222]">
                <FolderOpen size={28} className="opacity-40" />
              </div>
              <p>暂无项目</p>
            </div>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {projects.map((project, i) => {
              const techStack: string[] = safeJsonParse<string[]>(project.techStack, []);
              const highlights: string[] = safeJsonParse<string[]>(project.highlights, []);
              return (
                <FadeIn key={project.id} delay={Math.min(i * 100, 400)} direction="up">
                  <div className="card overflow-hidden h-full flex flex-col group">
                    {project.image && (
                      <div className="relative h-52 bg-[var(--color-surface)] overflow-hidden">
                        <Image src={project.image} alt={project.name} fill className="object-cover" />
                        {project.isFeatured && (
                          <span className="absolute top-3 right-3 tag">
                            精选
                          </span>
                        )}
                      </div>
                    )}
                    <div className="p-7 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold group-hover:text-[var(--color-muted)] transition-colors">{project.name}</h3>
                        {!project.image && project.isFeatured && (
                          <span className="tag">精选</span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--color-muted)] mb-5 leading-relaxed">{project.description}</p>
                      {highlights.length > 0 && (
                        <ul className="text-sm text-[var(--color-muted)] mb-5 space-y-2">
                          {highlights.map((h, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-auto">
                        {techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            {techStack.map((tech) => (
                              <span key={tech} className="tag">{tech}</span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-4 pt-5 border-t border-[#222]">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-white transition-colors font-medium">
                              <Github size={15} /> 源码
                            </a>
                          )}
                          {project.demoUrl && (
                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-white hover:underline font-medium">
                              <ExternalLink size={15} /> 演示
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
