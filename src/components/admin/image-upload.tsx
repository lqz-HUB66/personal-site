"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "上传失败");
        return;
      }

      onChange(data.url);
    } catch {
      setError("上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-[#999] font-mono">{label}</label>
      )}

      {value ? (
        <div className="relative w-24 h-24 rounded-md overflow-hidden border border-[#222] group">
          <Image src={value} alt="上传图片" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 p-0.5 bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 flex flex-col items-center justify-center gap-1 border border-dashed border-[#333] rounded-md text-[#555] hover:border-[#666] hover:text-[#999] transition-colors disabled:opacity-50"
        >
          <Upload size={16} />
          <span className="text-xs font-mono">
            {uploading ? "上传中..." : "上传图片"}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-[#dc2626] mt-1">{error}</p>
      )}
    </div>
  );
}
