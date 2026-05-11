"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "登录失败");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold text-center mb-2 tracking-tight text-white font-mono">
          后台登录
        </h1>
        <p className="text-sm text-[#666] text-center mb-8 font-mono">
          请输入管理员账号和密码
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[#999] mb-1.5 font-mono"
            >
              用户名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-[#222] rounded-md bg-[#0a0a0a] text-white focus:outline-none focus:border-[#444] transition-colors font-mono"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#999] mb-1.5 font-mono"
            >
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-[#222] rounded-md bg-[#0a0a0a] text-white focus:outline-none focus:border-[#444] transition-colors font-mono"
            />
          </div>

          {error && (
            <p className="text-sm text-[#dc2626]">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 text-sm font-medium text-white bg-white rounded-md hover:bg-[#e5e5e5] disabled:opacity-50 transition-colors font-mono"
          >
            {loading ? "登录中..." : "登录"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
