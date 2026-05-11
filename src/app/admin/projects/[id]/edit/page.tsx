"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectForm from "@/components/admin/project-form";

export default function EditProjectPage() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${params.id}`)
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <p className="text-sm text-[#666] font-mono">加载中...</p>;
  }

  if (!project) {
    return (
      <p className="text-sm text-[#666] font-mono">未找到该项目</p>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold mb-6 tracking-tight font-mono">编辑项目</h1>
      <ProjectForm
        initialData={project}
        projectId={params.id as string}
        mode="edit"
      />
    </div>
  );
}
