import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { MyAvatar } from "@/components/MyAvatar";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full relative flex justify-between items-center gap-4">
      <Link to="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0">
        <figure className="px-3">
          <MyAvatar />
        </figure>
        <div className="hidden lg:flex">
          <h1 className="text-base font-semibold text-zinc-900 dark:text-white">Laurențiu Cristian Preda</h1>
        </div>
      </Link>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <nav className="flex gap-6 text-sm font-medium text-zinc-800 dark:text-white">
          <Link to="/" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">Home</Link>
          <Link to="/projects" className="hover:text-purple-600 dark:hover:text-purple-300 transition-colors">Projects</Link>
        </nav>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center gap-2 md:gap-4 flex-shrink-0">
        <DarkModeToggle />
      </div>

      {/* Mobile menu */}
      <div className="md:hidden flex-shrink-0">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-zinc-900 dark:text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <div className="flex items-center justify-between w-full px-2 py-2">
                <span className="text-sm">Theme</span>
                <DarkModeToggle />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
