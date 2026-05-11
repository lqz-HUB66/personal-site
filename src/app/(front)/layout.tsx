import Header from "@/components/front/header";
import Footer from "@/components/front/footer";
import GridBackground from "@/components/ui/grid-background";
import PageTransition from "@/components/front/page-transition";
import { prisma } from "@/lib/prisma";

export default async function FrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await prisma.profile.findFirst();

  return (
    <div className="min-h-screen flex flex-col">
      <GridBackground />
      <Header />
      <main className="flex-1 relative z-10">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer github={profile?.github} email={profile?.email} />
    </div>
  );
}
