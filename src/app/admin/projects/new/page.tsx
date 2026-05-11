import ProjectForm from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold mb-6 tracking-tight">新增项目</h1>
      <ProjectForm mode="create" />
    </div>
  );
}
