"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ImageUpload from "@/components/admin/image-upload";

interface Profile {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  longBio: string;
  github: string;
  email: string;
  location: string;
  skills: string;
  tags: string;
}

const emptyProfile: Profile = {
  name: "",
  title: "",
  avatar: "",
  bio: "",
  longBio: "",
  github: "",
  email: "",
  location: "",
  skills: "[]",
  tags: "[]",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [skillsInput, setSkillsInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setProfile(data);
          const skills: string[] = JSON.parse(data.skills || "[]");
          const tags: string[] = JSON.parse(data.tags || "[]");
          setSkillsInput(skills.join(", "));
          setTagsInput(tags.join(", "));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tags = tagsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...profile,
        skills: JSON.stringify(skills),
        tags: JSON.stringify(tags),
      }),
    });

    if (res.ok) setSaved(true);
    setSaving(false);
  };

  const inputClass =
    "w-full px-3 py-2 text-sm border border-[#222] rounded-md bg-[#0a0a0a] text-white focus:outline-none focus:border-[#444] transition-colors font-mono";

  return (
    <div className="max-w-2xl">
      <h1 className="text-lg font-semibold mb-6 tracking-tight font-mono">
        编辑个人信息
      </h1>

      <div className="space-y-5">
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">姓名</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <ImageUpload
            value={profile.avatar}
            onChange={(url) => setProfile({ ...profile, avatar: url })}
            label="头像"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
            个人定位
          </label>
          <input
            type="text"
            value={profile.title}
            onChange={(e) =>
              setProfile({ ...profile, title: e.target.value })
            }
            placeholder="例：全栈开发者 / CTF 选手"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
            简短简介
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) =>
              setProfile({ ...profile, bio: e.target.value })
            }
            rows={3}
            placeholder="一句话介绍自己"
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
            完整简介
          </label>
          <textarea
            value={profile.longBio}
            onChange={(e) =>
              setProfile({ ...profile, longBio: e.target.value })
            }
            rows={8}
            placeholder="详细的个人介绍，支持多段落"
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
              value={profile.github}
              onChange={(e) =>
                setProfile({ ...profile, github: e.target.value })
              }
              placeholder="https://github.com/username"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
              邮箱
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
            所在地
          </label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) =>
              setProfile({ ...profile, location: e.target.value })
            }
            placeholder="例：上海"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
            技术栈（逗号分隔）
          </label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="React, TypeScript, Node.js, Python"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">
            个人标签（逗号分隔）
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="开发者, CTF 选手, 开源爱好者"
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-[#e5e5e5] disabled:opacity-50 transition-colors font-mono"
          >
            {saving ? "保存中..." : "保存"}
          </motion.button>
          {saved && (
            <span className="text-sm text-[#22c55e] font-mono">
              保存成功
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
