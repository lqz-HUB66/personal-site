import HonorForm from "@/components/admin/honor-form";

export default function NewHonorPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold mb-6 tracking-tight">新增荣誉</h1>
      <HonorForm mode="create" />
    </div>
  );
}
