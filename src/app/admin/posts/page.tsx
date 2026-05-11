"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { HexLoader } from "@/components/admin/terminal-loading";

interface Post {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  createdAt: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = () => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false); });
  };

  useEffect(() => { loadPosts(); }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`确定删除「${title}」？此操作不可撤销。`)) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) loadPosts();
  };

  const togglePublished = async (post: Post) => {
    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    if (res.ok) loadPosts();
  };

  return (
    <div className="shutter-enter">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold tracking-tight font-mono">文章管理</h1>
        <motion.div whileTap={{ scale: 0.97 }} className="inline-flex">
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-[#e5e5e5] transition-colors font-mono"
          >
            <Plus size={15} /> 新增文章
          </Link>
        </motion.div>
      </div>

      {loading ? (
        <HexLoader label="FETCH" />
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-[#444]">
          <p className="mb-2 font-mono text-[11px]">NO_DATA</p>
          <p className="text-[10px] text-[#333] font-mono blink-cursor">awaiting first entry</p>
        </div>
      ) : (
        <div className="card-border-growth card-noise overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="text-left px-4 py-3 font-medium text-[#444] font-mono text-[11px]">标题</th>
                <th className="text-left px-4 py-3 font-medium text-[#444] font-mono text-[11px] hidden md:table-cell">分类</th>
                <th className="text-center px-4 py-3 font-medium text-[#444] font-mono text-[11px] w-24">状态</th>
                <th className="text-right px-4 py-3 font-medium text-[#444] font-mono text-[11px] w-28">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr
                  key={post.id}
                  className="border-b border-[#111] last:border-0 row-scan"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium font-mono text-[#ccc]">{post.title}</div>
                    <div className="text-xs text-[#333] font-mono">/blog/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-[#555] hidden md:table-cell font-mono">{post.category || "–"}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => togglePublished(post)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded font-mono transition-colors ${
                        post.published ? "bg-[#0a1a0a] text-[#22c55e]" : "bg-[#0a0a0a] text-[#444]"
                      }`}
                    >
                      {post.published ? <><Eye size={10} /> LIVE</> : <><EyeOff size={10} /> DRAFT</>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/posts/${post.id}/edit`} className="p-1.5 text-[#555] hover:text-white rounded transition-colors">
                        <Pencil size={14} />
                      </Link>
                      <button onClick={() => handleDelete(post.id, post.title)} className="p-1.5 text-[#555] hover:text-[#dc2626] rounded transition-colors">
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
