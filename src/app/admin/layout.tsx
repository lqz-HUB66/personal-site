"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AdminGridBackground from "@/components/admin/admin-grid-bg";
import {
  LayoutDashboard,
  User,
  Award,
  FolderKanban,
  FileText,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Settings,
} from "lucide-react";

const sidebarGroups = [
  {
    label: "内容管理",
    items: [
      { href: "/admin/posts", label: "文章", icon: FileText },
      { href: "/admin/honors", label: "荣誉", icon: Award },
      { href: "/admin/projects", label: "项目", icon: FolderKanban },
    ],
  },
  {
    label: "系统",
    items: [
      { href: "/admin/dashboard", label: "仪表盘", icon: LayoutDashboard },
      { href: "/admin/profile", label: "个人信息", icon: User },
      { href: "/admin/settings", label: "设置", icon: Settings },
    ],
  },
];

const allItems = sidebarGroups.flatMap((g) => g.items);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isActive = (href: string) => pathname.startsWith(href);
  const currentPage = allItems.find((i) => isActive(i.href));

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-52 bg-[#060606]/80 backdrop-blur-xl border-r border-[#1a1a1a] flex flex-col transition-transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center pl-5 pr-4 border-b border-[#1a1a1a]">
          <Link
            href="/admin/dashboard"
            className="text-sm font-semibold text-white tracking-tight font-mono"
          >
            LQZ<span className="text-[#444]">/</span>admin
          </Link>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {sidebarGroups.map((group) => (
            <div key={group.label}>
              <span className="block px-3 mb-1.5 text-[9px] font-medium uppercase tracking-[0.15em] text-[#333] font-mono">
                {group.label}
              </span>
              <div className="space-y-0.5 relative">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`relative flex items-center gap-2.5 px-3 py-1.5 text-[13px] rounded transition-all duration-200 font-mono z-10 ${
                        active
                          ? "text-white font-semibold"
                          : "text-[#555] hover:text-[#999] hover:bg-[#0a0a0a]"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="sidebar-active-line"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-white rounded-full"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      {active && (
                        <motion.span
                          layoutId="sidebar-active-bg"
                          className="absolute inset-0 rounded bg-[#111] pointer-events-none"
                          transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.8 }}
                        />
                      )}
                      <Icon size={14} strokeWidth={active ? 2 : 1.5} className="relative z-10" />
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[#1a1a1a] space-y-0.5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-1.5 text-[13px] text-[#555] hover:text-[#dc2626] rounded transition-colors font-mono"
          >
            <LogOut size={14} strokeWidth={1.5} />
            退出
          </motion.button>
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-1.5 text-[13px] text-[#555] hover:text-white rounded transition-colors font-mono"
          >
            <ExternalLink size={14} strokeWidth={1.5} />
            查看网站
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 md:ml-[220px]">
        {/* Top bar */}
        <motion.header
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="sticky top-0 z-30 h-11 bg-black/60 backdrop-blur-md border-b border-[#1a1a1a] flex items-center px-8"
        >
          <button
            className="md:hidden mr-4 p-1 text-[#555]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>
          <nav className="flex items-center gap-1.5 text-[11px] font-mono text-[#333]">
            <span className="text-[#555]">~</span>
            <span>/</span>
            <span className="text-[#555]">admin</span>
            <span>/</span>
            <span className="text-[#999]">{currentPage?.label || "管理"}</span>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[10px] font-mono text-[#333]">LIVE</span>
          </div>
        </motion.header>

        {/* Content area */}
        <main className="relative p-8 min-h-[calc(100vh-2.75rem)] bg-[#030303]">
          <AdminGridBackground />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
