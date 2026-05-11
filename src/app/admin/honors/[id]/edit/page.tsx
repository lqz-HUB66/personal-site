"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HonorForm from "@/components/admin/honor-form";

export default function EditHonorPage() {
  const params = useParams();
  const [honor, setHonor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/honors/${params.id}`)
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        setHonor(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <p className="text-sm text-[#666] font-mono">加载中...</p>;
  }

  if (!honor) {
    return (
      <p className="text-sm text-[#666] font-mono">未找到该荣誉记录</p>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold mb-6 tracking-tight font-mono">编辑荣誉</h1>
      <HonorForm
        initialData={honor}
        honorId={params.id as string}
        mode="edit"
      />
    </div>
  );
}
