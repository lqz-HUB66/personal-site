"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleChange = async () => {
    setMsg(null);

    if (!currentPassword || !newPassword) {
      setMsg({ type: "err", text: "请填写所有字段" });
      return;
    }
    if (newPassword.length < 8) {
      setMsg({ type: "err", text: "新密码至少 8 位" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsg({ type: "err", text: "两次输入的新密码不一致" });
      return;
    }
    if (newPassword === currentPassword) {
      setMsg({ type: "err", text: "新密码不能与当前密码相同" });
      return;
    }

    setSaving(true);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setMsg({ type: "ok", text: "密码修改成功" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setMsg({ type: "err", text: data.error || "修改失败" });
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm border border-[#222] rounded-md bg-[#0a0a0a] text-white focus:outline-none focus:border-[#444] transition-colors font-mono";

  return (
    <div className="max-w-md">
      <h1 className="text-lg font-semibold mb-6 tracking-tight font-mono">安全设置</h1>

      <div className="card-border-growth card-noise p-5 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Lock size={14} strokeWidth={1.5} className="text-[#444]" />
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#444] font-mono">
            修改密码
          </span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">当前密码</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888]"
            >
              {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">新密码</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="至少 8 位"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888]"
            >
              {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">确认新密码</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {msg && (
          <p className={`text-sm font-mono ${msg.type === "ok" ? "text-[#22c55e]" : "text-[#dc2626]"}`}>
            {msg.text}
          </p>
        )}

        <motion.button
          onClick={handleChange}
          disabled={saving}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-[#e5e5e5] disabled:opacity-50 transition-colors font-mono"
        >
          {saving ? "修改中..." : "修改密码"}
        </motion.button>
      </div>
    </div>
  );
}
