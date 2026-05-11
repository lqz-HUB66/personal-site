"use client";

import { useState } from "react";
import Image from "next/image";
import { Award, Calendar, Building2, X, Filter } from "lucide-react";
import FadeIn from "@/components/ui/fade-in";
import { safeJsonParse } from "@/lib/utils";

interface Honor {
  id: string;
  title: string;
  level: string;
  organizer: string;
  date: string;
  description: string;
  image: string;
  tags: string;
  year: string;
  isFeatured: boolean;
}

interface Props {
  honors: Honor[];
  years: string[];
  levels: string[];
}

export default function HonorsContent({ honors, years, levels }: Props) {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filtered = honors.filter((h) => {
    if (selectedYear && h.year !== selectedYear) return false;
    if (selectedLevel && h.level !== selectedLevel) return false;
    return true;
  });

  return (
    <div>
      {/* Hero bar */}
      <div className="border-b border-[#222]">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
          <FadeIn>
            <p className="text-xs font-bold text-[var(--color-muted)] uppercase tracking-[0.2em] mb-3">
              Honors
            </p>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              荣誉奖项
            </h1>
            <p className="text-[var(--color-muted)]">
              共 {honors.length} 项荣誉
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        {/* Filters */}
        {(years.length > 0 || levels.length > 0) && (
          <FadeIn delay={80} direction="up">
            <div className="flex flex-wrap items-center gap-3 mt-10 mb-10">
              <Filter size={14} className="text-[var(--color-muted)]" />
              {years.length > 0 && (
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-1.5 text-sm bg-transparent border border-[#222] rounded focus:border-white transition-colors cursor-pointer text-[var(--color-foreground)]"
                >
                  <option value="" className="bg-black">全部年份</option>
                  {years.map((y) => (
                    <option key={y} value={y} className="bg-black">{y}</option>
                  ))}
                </select>
              )}
              {levels.length > 0 && (
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-1.5 text-sm bg-transparent border border-[#222] rounded focus:border-white transition-colors cursor-pointer text-[var(--color-foreground)]"
                >
                  <option value="" className="bg-black">全部级别</option>
                  {levels.map((l) => (
                    <option key={l} value={l} className="bg-black">{l}</option>
                  ))}
                </select>
              )}
              {(selectedYear || selectedLevel) && (
                <button
                  onClick={() => { setSelectedYear(""); setSelectedLevel(""); }}
                  className="text-sm text-[var(--color-muted)] hover:text-white transition-colors ml-1"
                >
                  清除筛选
                </button>
              )}
            </div>
          </FadeIn>
        )}

        {filtered.length === 0 ? (
          <FadeIn>
            <div className="text-center py-24 text-[var(--color-muted)]">
              <div className="w-16 h-16 mx-auto mb-6 rounded flex items-center justify-center border border-[#222]">
                <Award size={28} className="opacity-40" />
              </div>
              <p>暂无荣誉记录</p>
            </div>
          </FadeIn>
        ) : (
          <div className="space-y-5">
            {filtered.map((honor, i) => {
              const tags: string[] = safeJsonParse<string[]>(honor.tags, []);
              return (
                <FadeIn key={honor.id} delay={Math.min(i * 70, 350)} direction="up">
                  <div className="card p-7 group">
                    <div className="flex flex-col lg:flex-row gap-7">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                          {honor.level && (
                            <span className="tag">
                              {honor.level}
                            </span>
                          )}
                          {honor.isFeatured && (
                            <span className="tag">
                              精选
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--color-muted)] transition-colors leading-snug">
                          {honor.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)] mb-4">
                          {honor.organizer && (
                            <span className="flex items-center gap-1.5">
                              <Building2 size={14} /> {honor.organizer}
                            </span>
                          )}
                          {honor.date && (
                            <span className="flex items-center gap-1.5">
                              <Calendar size={14} /> {honor.date}
                            </span>
                          )}
                        </div>
                        {honor.description && (
                          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                            {honor.description}
                          </p>
                        )}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-4">
                            {tags.map((tag) => (
                              <span key={tag} className="tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {honor.image && (
                        <button
                          onClick={() => setPreviewImage(honor.image)}
                          className="relative w-full lg:w-56 h-40 rounded overflow-hidden shrink-0 cursor-zoom-in border border-[#222]"
                        >
                          <Image
                            src={honor.image}
                            alt={honor.title}
                            fill
                            className="object-cover"
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        )}

        {previewImage && (
          <div className="image-preview-overlay" onClick={() => setPreviewImage(null)}>
            <Image src={previewImage} alt="预览" width={1200} height={800} className="max-w-[90vw] max-h-[90vh] object-contain rounded" />
            <button className="absolute top-6 right-6 text-white/80 hover:text-white" onClick={() => setPreviewImage(null)}>
              <X size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
