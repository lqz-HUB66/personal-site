import PostForm from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold mb-6 tracking-tight">新增文章</h1>
      <PostForm mode="create" />
    </div>
  );
}
