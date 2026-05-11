"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ImageUpload from "./image-upload";

interface ProjectData {
  name: string;
  description: string;
  content: string;
  techStack: string;
  highlights: string;
  githubUrl: string;
  demoUrl: string;
  image: string;
  isFeatured: boolean;
}

interface Props {
  initialData?: ProjectData;
  projectId?: string;
  mode: "create" | "edit";
}

const defaultData: ProjectData = {
  name: "",
  description: "",
  content: "",
  techStack: "[]",
  highlights: "[]",
  githubUrl: "",
  demoUrl: "",
  image: "",
  isFeatured: false,
};

const inputClass =
  "w-full px-3 py-2 text-sm border border-[#222] rounded-md bg-[#0a0a0a] text-white focus:outline-none focus:border-[#444] transition-colors font-mono";

export default function ProjectForm({ initialData, projectId, mode }: Props) {
  const router = useRouter();
  const [data, setData] = useState<ProjectData>(initialData || defaultData);
  const [techInput, setTechInput] = useState(
    initialData?.techStack
      ? (JSON.parse(initialData.techStack) as string[]).join(", ")
      : ""
  );
  const [highlightsInput, setHighlightsInput] = useState(
    initialData?.highlights
      ? (JSON.parse(initialData.highlights) as string[]).join("\n")
      : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const techStack = techInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const highlights = highlightsInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const body = {
      ...data,
      techStack: JSON.stringify(techStack),
      highlights: JSON.stringify(highlights),
    };

    try {
      const url =
        mode === "create"
          ? "/api/projects"
          : `/api/projects/${projectId}`;
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

      router.push("/admin/projects");
    } catch {
      setError("保存失败");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
          项目名称 <span className="text-[#dc2626]">*</span>
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
          placeholder="例：个人博客系统"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
          项目简介
        </label>
        <textarea
          value={data.description}
          onChange={(e) =>
            setData({ ...data, description: e.target.value })
          }
          rows={3}
          placeholder="简要描述这个项目"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
          详细内容（Markdown）
        </label>
        <textarea
          value={data.content}
          onChange={(e) => setData({ ...data, content: e.target.value })}
          rows={8}
          placeholder="详细的项目介绍，支持 Markdown 格式"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
          技术栈（逗号分隔）
        </label>
        <input
          type="text"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          placeholder="React, TypeScript, Prisma"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
          项目亮点（每行一条）
        </label>
        <textarea
          value={highlightsInput}
          onChange={(e) => setHighlightsInput(e.target.value)}
          rows={3}
          placeholder="功能亮点 1&#10;功能亮点 2&#10;功能亮点 3"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
            GitHub 地址
          </label>
          <input
            type="url"
            value={data.githubUrl}
            onChange={(e) =>
              setData({ ...data, githubUrl: e.target.value })
            }
            placeholder="https://github.com/..."
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
            演示地址
          </label>
          <input
            type="url"
            value={data.demoUrl}
            onChange={(e) =>
              setData({ ...data, demoUrl: e.target.value })
            }
            placeholder="https://..."
            className={inputClass}
          />
        </div>
      </div>

      <ImageUpload
        value={data.image}
        onChange={(url) => setData({ ...data, image: url })}
        label="项目截图"
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={data.isFeatured}
          onChange={(e) =>
            setData({ ...data, isFeatured: e.target.checked })
          }
          className="rounded border-[#333] bg-[#0a0a0a]"
        />
        <span className="text-sm font-mono text-[#999]">在首页展示</span>
      </label>

      {error && (
        <p className="text-sm text-[#dc2626]">{error}</p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <motion.button
          type="submit"
          disabled={saving}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-[#e5e5e5] disabled:opacity-50 transition-colors font-mono"
        >
          {saving
            ? "保存中..."
            : mode === "create"
            ? "创建项目"
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
