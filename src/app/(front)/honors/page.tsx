import { prisma } from "@/lib/prisma";
import HonorsContent from "./honors-content";

export default async function HonorsPage() {
  const honors = await prisma.honor.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
  });

  const years = [...new Set(honors.map((h) => h.year).filter(Boolean))].sort(
    (a, b) => b.localeCompare(a)
  );
  const levels = [...new Set(honors.map((h) => h.level).filter(Boolean))];

  return <HonorsContent honors={honors} years={years} levels={levels} />;
}
