import { motion } from 'framer-motion';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Navbar } from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  status: 'active' | 'coming-soon';
}

const projectsList: Project[] = [
  {
    id: 'lofi-station',
    title: 'Lofi Station',
    description: 'Generate ambient lofi music tailored to your mood and environment. Features AI-powered synthesis with manual controls or auto-vibe mode based on weather and location.',
    tags: ['Music Generation', 'React', 'HTTP API', 'Real-time'],
    href: '/projects/lofi-station',
    status: 'active',
  },
];

export default function Projects() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="w-full min-h-screen flex flex-col relative">
      <AuroraBackground className="absolute inset-0 z-0" />
      <div className="w-full sticky top-0 z-50 border-b border-purple-500/40 backdrop-blur-md bg-black/40">
        <div className="px-4 md:px-6 py-4">
          <Navbar />
        </div>
      </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 relative z-10 pt-8">
          <motion.div
            className="w-full max-w-4xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeInOut' }}
          >
            <h1 className="text-4xl md:text-6xl font-bold dark:text-white text-center mb-6">
              Projects
            </h1>
            <p className="text-lg md:text-xl dark:text-neutral-300 text-center mb-12 max-w-2xl mx-auto">
              Exploring the intersection of creative technology and practical engineering.
            </p>

            {/* Projects Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {projectsList.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className="group"
                >
                  <Link
                    to={project.href}
                    className="block h-full"
                  >
                    <div className="h-full p-6 dark:bg-gradient-to-br dark:from-purple-500/10 dark:to-pink-500/10 hover:dark:from-purple-500/20 hover:dark:to-pink-500/20 backdrop-blur-xl border dark:border-purple-400/30 hover:dark:border-purple-400/60 rounded-xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-purple-500/20">
                      <div className="flex flex-col gap-4 h-full">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl md:text-2xl font-bold dark:text-white mb-2">
                              {project.title}
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-1 dark:bg-purple-500/20 dark:text-purple-300 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          {project.status === 'active' && (
                            <div className="px-3 py-1 text-xs font-semibold dark:bg-green-500/20 dark:text-green-300 rounded-full">
                              Active
                            </div>
                          )}
                          {project.status === 'coming-soon' && (
                            <div className="px-3 py-1 text-xs font-semibold dark:bg-yellow-500/20 dark:text-yellow-300 rounded-full">
                              Coming Soon
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="flex-1 dark:text-neutral-300 text-sm md:text-base">
                          {project.description}
                        </p>

                        {/* CTA */}
                        <div className="flex items-center gap-2 dark:text-purple-400 group-hover:gap-4 transition-all">
                          <span className="text-sm font-semibold">
                            {project.status === 'coming-soon' ? 'Coming Soon' : 'Explore'}
                          </span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State for More Projects */}
            {projectsList.length < 3 && (
              <motion.div
                variants={itemVariants}
                className="mt-12 p-8 dark:bg-gradient-to-br dark:from-cyan-500/10 dark:to-purple-500/10 backdrop-blur-xl border dark:border-cyan-400/30 rounded-xl text-center shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
              >
                <p className="dark:text-neutral-300 font-medium">
                  More projects coming soon...
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
    </div>
  );
}
