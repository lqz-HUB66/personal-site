"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, FolderKanban, FileText, CheckCircle, Clock } from "lucide-react";
import { HexLoader } from "@/components/admin/terminal-loading";

interface Stats {
  honors: number;
  projects: number;
  posts: number;
  published: number;
}

interface Activity {
  id: string;
  action: string;
  target: string;
  time: string;
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function MonochromeSparkline({ data, animate }: { data: number[]; animate: boolean }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const w = 120;
  const h = 32;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 4) - 2}`)
    .join(" ");
  const areaPoints =
    `0,${h} ` +
    data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 4) - 2}`).join(" ") +
    ` ${w},${h}`;
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polygon
        points={areaPoints}
        fill="rgba(255,255,255,0.03)"
        style={{ opacity: animate ? 1 : 0, transition: "opacity 1s ease 0.5s" }}
      />
      <polyline
        points={points}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="400"
        strokeDashoffset={animate ? "0" : "400"}
        style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.65, 0, 0.35, 1)" }}
      />
    </svg>
  );
}

function StatSkeleton({ large }: { large?: boolean }) {
  return (
    <div className={`${large ? "p-6" : "p-5"} card-border-growth card-noise relative`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded bg-[#111]" />
        <div className="w-10 h-1.5 rounded bg-[#111]" />
      </div>
      <div className={large ? "w-16 h-10 rounded bg-[#111]" : "w-12 h-8 rounded bg-[#111]"} />
    </div>
  );
}

function StatCard({
  label, value, icon: Icon, trend, spark, large,
}: {
  label: string; value: number; icon: React.ElementType; trend: string; spark: number[]; large?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      variants={fadeUp}
      className={`group relative ${large ? "p-6" : "p-5"} card-border-growth card-noise relative`}
    >
      <div className="absolute bottom-3 right-3 pointer-events-none">
        <MonochromeSparkline data={spark} animate={mounted} />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Icon size={large ? 14 : 12} strokeWidth={1.5} className="text-[#555]" />
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#444] font-mono">
          {label}
        </span>
      </div>

      <div className="flex items-end gap-3">
        <span className={`font-bold font-mono leading-none text-white ${large ? "text-5xl" : "text-4xl"}`}>
          {value}
        </span>
        <span className="text-[11px] font-mono text-[#555] mb-1">{trend}</span>
      </div>
    </motion.div>
  );
}

function HexTicker() {
  const [hex, setHex] = useState("a3f2b1");
  useEffect(() => {
    const id = setInterval(() => {
      setHex(Array.from({ length: 6 }, () => Math.floor(Math.random() * 16).toString(16)).join(""));
    }, 800);
    return () => clearInterval(id);
  }, []);
  return <span className="font-mono text-[9px] text-[#222] tabular-nums select-none">0x{hex}</span>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/honors").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/posts").then((r) => r.json()),
    ])
      .then(([honors, projects, posts]) => {
        setStats({
          honors: honors.length,
          projects: projects.length,
          posts: posts.length,
          published: posts.filter((p: { published: boolean }) => p.published).length,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const activities: Activity[] = [
    { id: "1", action: "发布了文章", target: "Next.js 部署指南", time: "2h ago" },
    { id: "2", action: "更新了项目", target: "个人博客系统", time: "5h ago" },
    { id: "3", action: "新增了荣誉", target: "CTF 省赛一等奖", time: "1d ago" },
    { id: "4", action: "修改了简介", target: "个人信息", time: "2d ago" },
    { id: "5", action: "发布了文章", target: "Web 安全入门", time: "3d ago" },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="shutter-enter">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-8">
        <h1 className="text-lg font-semibold tracking-tight font-mono">仪表盘</h1>
        <div className="flex items-center gap-2.5 text-[10px] font-mono text-[#333]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22c55e] admin-dot" />
          <span>系统运行中</span>
          <HexTicker />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 2 large stat cards */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          {loading ? (
            <>
              <StatSkeleton large />
              <StatSkeleton large />
            </>
          ) : (
            <>
              <StatCard label="荣誉" value={stats?.honors ?? 0} icon={Award} trend="+2" spark={[1, 2, 2, 3, 4]} large />
              <StatCard label="项目" value={stats?.projects ?? 0} icon={FolderKanban} trend="+1" spark={[0, 1, 1, 2, 3]} large />
            </>
          )}
        </div>

        {/* Right: Activity log */}
        <motion.div variants={fadeUp} className="lg:col-span-5 card-border-growth card-noise p-5">
          <div className="flex items-center gap-2 mb-5">
            <Clock size={13} strokeWidth={1.5} className="text-[#444]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#444] font-mono">
              最近操作
            </span>
          </div>
          {loading ? (
            <HexLoader label="FETCH" />
          ) : (
            <div className="space-y-0 relative">
              <div className="absolute left-[3px] top-2 bottom-2 w-px bg-[#1a1a1a] overflow-hidden">
                <div className="timeline-flow w-full h-8" />
              </div>
              {activities.map((act, i) => (
                <div key={act.id} className="flex items-start gap-3 py-3 relative">
                  <div className="relative mt-1.5 z-10">
                    <span className={`block w-[7px] h-[7px] rounded-full ${i === 0 ? "bg-white timeline-dot-active" : "bg-[#333]"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#666] font-mono leading-tight">
                      {act.action} <span className="text-[#ccc]">{act.target}</span>
                    </p>
                    <p className="text-[10px] text-[#333] font-mono mt-1">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Bottom row */}
        <div className="lg:col-span-5">
          {loading ? <StatSkeleton /> : (
            <StatCard label="文章" value={stats?.posts ?? 0} icon={FileText} trend="+5" spark={[2, 3, 5, 7, 12]} />
          )}
        </div>
        <div className="lg:col-span-7">
          {loading ? <StatSkeleton /> : (
            <StatCard label="已发布" value={stats?.published ?? 0} icon={CheckCircle} trend="+3" spark={[1, 2, 4, 6, 9]} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
