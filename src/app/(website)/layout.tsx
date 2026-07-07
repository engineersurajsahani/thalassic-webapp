import Navbar from "@/components/layout/navbar/navbar";
import Footer from "./footer";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#031525]">
      <Navbar />

      <main className="pt-[64px] md:pt-[72px] lg:pt-[80px]">
        {children}
      </main>

      <Footer />
    </div>
  );
}