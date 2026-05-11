"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ImageUpload from "./image-upload";

interface PostData {
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover: string;
  category: string;
  tags: string;
  published: boolean;
}

interface Props {
  initialData?: PostData;
  postId?: string;
  mode: "create" | "edit";
}

const defaultData: PostData = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  cover: "",
  category: "",
  tags: "[]",
  published: false,
};

const CATEGORIES = [
  { value: "Blog", label: "博客" },
  { value: "Web", label: "Web" },
  { value: "Crypto", label: "Crypto" },
  { value: "Misc", label: "Misc" },
  { value: "Reverse", label: "Reverse" },
  { value: "Pwn", label: "Pwn" },
  { value: "Tutorial", label: "教程" },
  { value: "Project", label: "项目" },
];

const inputClass =
  "w-full px-3 py-2 text-sm border border-[#222] rounded-md bg-[#0a0a0a] text-white focus:outline-none focus:border-[#444] transition-colors font-mono";

export default function PostForm({ initialData, postId, mode }: Props) {
  const router = useRouter();
  const [data, setData] = useState<PostData>(initialData || defaultData);
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags
      ? (JSON.parse(initialData.tags) as string[]).join(", ")
      : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const body = {
      ...data,
      tags: JSON.stringify(tags),
    };

    try {
      const url =
        mode === "create" ? "/api/posts" : `/api/posts/${postId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "保存失败");
        return;
      }

      router.push("/admin/posts");
    } catch {
      setError("保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
              文章标题 <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) =>
                setData({ ...data, title: e.target.value })
              }
              required
              placeholder="输入文章标题"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
              文章摘要
            </label>
            <textarea
              value={data.summary}
              onChange={(e) =>
                setData({ ...data, summary: e.target.value })
              }
              rows={2}
              placeholder="简要概括文章内容"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
              文章正文（Markdown）
            </label>
            <textarea
              value={data.content}
              onChange={(e) =>
                setData({ ...data, content: e.target.value })
              }
              rows={20}
              placeholder="使用 Markdown 格式编写文章内容"
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
              URL 别名
            </label>
            <input
              type="text"
              value={data.slug}
              onChange={(e) =>
                setData({ ...data, slug: e.target.value })
              }
              placeholder="自动生成或自定义"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
              分类
            </label>
            <select
              value={data.category}
              onChange={(e) =>
                setData({ ...data, category: e.target.value })
              }
              className={inputClass}
            >
              <option value="">无分类</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
              标签（逗号分隔）
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="nextjs, typescript, 教程"
              className={inputClass}
            />
          </div>

          <ImageUpload
            value={data.cover}
            onChange={(url) => setData({ ...data, cover: url })}
            label="封面图片"
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.published}
              onChange={(e) =>
                setData({ ...data, published: e.target.checked })
              }
              className="rounded border-[#333] bg-[#0a0a0a]"
            />
            <span className="text-sm font-mono text-[#999]">发布文章</span>
          </label>
        </div>
      </div>

      {error && (
        <p className="text-sm text-[#dc2626]">{error}</p>
      )}

      <div className="flex items-center gap-3 pt-2 border-t border-[#222]">
        <motion.button
          type="submit"
          disabled={saving}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-[#e5e5e5] disabled:opacity-50 transition-colors font-mono"
        >
          {saving
            ? "保存中..."
            : mode === "create"
            ? "创建文章"
            : "保存修改"}
        </motion.button>
        <motion.button
          type="button"
          onClick={() => router.back()}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2 text-sm text-[#666] hover:text-white transition-colors font-mono"
        >
          取消
        </motion.button>
      </div>
    </form>
  );
}
