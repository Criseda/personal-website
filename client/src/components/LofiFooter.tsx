import React from 'react';
import { Link } from 'react-router-dom';

const LofiFooter: React.FC = () => {
    return (
        <footer className="w-full py-8 border-t border-purple-500/10 dark:border-purple-500/20 bg-white/5 dark:bg-black/5 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    © {new Date().getFullYear()} Laurențiu Cristian Preda. All rights reserved.
                </div>
                <div className="flex gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    <Link to="/projects/lofi-station/privacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        Privacy Policy
                    </Link>
                    <Link to="/projects/lofi-station/terms" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                        Terms of Service
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default LofiFooter;
