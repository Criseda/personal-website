import { Navbar } from "@/components/Navbar";
import { HomeContent } from "@/components/HomeContent";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col relative">
      <AuroraBackground className="absolute inset-0 z-0" />
      <div className="w-full sticky top-0 z-50 border-b border-purple-500/40 backdrop-blur-md bg-black/40">
        <div className="px-4 md:px-6 py-4">
          <Navbar />
        </div>
      </div>
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <HomeContent />
      </div>
    </div>
  );
}
