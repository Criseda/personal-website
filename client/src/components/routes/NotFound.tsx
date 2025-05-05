import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t, language } = useLanguage();
  
  // Determine home path based on language
  const homePath = language === 'en' ? '/' : '/ro';

  return (
    <>
      <Navbar />
      <AuroraBackground>
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
            {t('notFound')}
          </h2>
          <p className="text-center dark:text-neutral-300 max-w-md">
            {t('notFoundDesc')}
          </p>
          <Link 
            to={homePath}
            className="mt-6 px-6 py-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
          >
            {t('returnHome')}
          </Link>
        </motion.div>
      </AuroraBackground>
    </>
  );
}