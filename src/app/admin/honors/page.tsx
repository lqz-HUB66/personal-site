"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { HexLoader } from "@/components/admin/terminal-loading";

interface Honor {
  id: string;
  title: string;
  level: string;
  organizer: string;
  year: string;
  isFeatured: boolean;
}

export default function AdminHonorsPage() {
  const [honors, setHonors] = useState<Honor[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHonors = () => {
    fetch("/api/honors")
      .then((r) => r.json())
      .then((data) => { setHonors(data); setLoading(false); });
  };

  useEffect(() => { loadHonors(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`确定删除「${title}」？此操作不可撤销。`)) return;
    const res = await fetch(`/api/honors/${id}`, { method: "DELETE" });
    if (res.ok) loadHonors();
  };

  const toggleFeatured = async (honor: Honor) => {
    const res = await fetch(`/api/honors/${honor.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !honor.isFeatured }),
    });
    if (res.ok) loadHonors();
  };

  return (
    <div className="shutter-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold tracking-tight font-mono">荣誉管理</h1>
        <motion.div whileTap={{ scale: 0.97 }} className="inline-flex">
          <Link
            href="/admin/honors/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-[#e5e5e5] transition-colors font-mono"
          >
            <Plus size={15} /> 新增荣誉
          </Link>
        </motion.div>
      </div>

      {loading ? (
        <HexLoader label="FETCH" />
      ) : honors.length === 0 ? (
        <div className="text-center py-16 text-[#444]">
          <p className="mb-2 font-mono text-[11px]">NO_DATA</p>
          <p className="text-[10px] text-[#333] font-mono blink-cursor">awaiting first entry</p>
        </div>
      ) : (
        <div className="card-border-growth card-noise overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="text-left px-4 py-3 font-medium text-[#444] font-mono text-[11px]">名称</th>
                <th className="text-left px-4 py-3 font-medium text-[#444] font-mono text-[11px] hidden md:table-cell">等级</th>
                <th className="text-left px-4 py-3 font-medium text-[#444] font-mono text-[11px] hidden md:table-cell">年份</th>
                <th className="text-center px-4 py-3 font-medium text-[#444] font-mono text-[11px] w-24">精选</th>
                <th className="text-right px-4 py-3 font-medium text-[#444] font-mono text-[11px] w-28">操作</th>
              </tr>
            </thead>
            <tbody>
              {honors.map((honor, i) => (
                <tr
                  key={honor.id}
                  className="border-b border-[#111] last:border-0 row-scan"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium font-mono text-[#ccc]">{honor.title}</div>
                    {honor.organizer && <div className="text-xs text-[#333] font-mono">{honor.organizer}</div>}
                  </td>
                  <td className="px-4 py-3 text-[#555] hidden md:table-cell font-mono">{honor.level || "–"}</td>
                  <td className="px-4 py-3 text-[#555] hidden md:table-cell font-mono">{honor.year || "–"}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleFeatured(honor)}
                      className={`p-1 rounded transition-colors ${honor.isFeatured ? "text-[#f59e0b]" : "text-[#222] hover:text-[#555]"}`}
                    >
                      <Star size={16} fill={honor.isFeatured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/honors/${honor.id}/edit`} className="p-1.5 text-[#555] hover:text-white rounded transition-colors">
                        <Pencil size={14} />
                      </Link>
                      <button onClick={() => handleDelete(honor.id, honor.title)} className="p-1.5 text-[#555] hover:text-[#dc2626] rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
