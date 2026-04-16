import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export default function NotFound() {
  return (
    <div className="w-full min-h-screen relative">
      <AuroraBackground fixed />
      <div className="w-full min-h-screen flex flex-col relative z-10">
        <div className="w-full border-b border-purple-500/20 dark:border-purple-500/40 backdrop-blur-md bg-white/40 dark:bg-black/40">
          <div className="px-4 md:px-6 py-4">
            <Navbar />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="relative flex flex-col gap-4 items-center justify-center px-4"
          >
            <h1 className="text-3xl md:text-7xl font-bold dark:text-white text-center">
              404
            </h1>
            <h2 className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4 text-center">
              Page Not Found
            </h2>
            <p className="text-center dark:text-neutral-300 max-w-md">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
              to="/"
              className="mt-6 px-6 py-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
            >
              Return Home
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}