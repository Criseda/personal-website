"use client";

import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { GithubIcon, LinkedinIcon, SpotifyIcon } from "@/components/BrandIcons";
import { useLanguage } from "@/contexts/LanguageContext";

export function HomeContent() {
  const { t } = useLanguage();

  return (
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
          Laurențiu Cristian Preda
        </h1>
        <h2 className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          {t('role')}
        </h2>
        <div className="flex justify-center space-x-20">
          <GithubIcon />
          <LinkedinIcon />
          <SpotifyIcon />
        </div>
      </motion.div>
    </AuroraBackground>
  );
}