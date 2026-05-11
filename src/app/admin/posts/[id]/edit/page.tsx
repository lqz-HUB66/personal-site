"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostForm from "@/components/admin/post-form";

export default function EditPostPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${params.id}`)
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <p className="text-sm text-[#666] font-mono">加载中...</p>;
  }

  if (!post) {
    return (
      <p className="text-sm text-[#666] font-mono">未找到该文章</p>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold mb-6 tracking-tight font-mono">编辑文章</h1>
      <PostForm initialData={post} postId={params.id as string} mode="edit" />
    </div>
  );
}
