import {
  NavigationMenu,
  // NavigationMenuItem,
  // NavigationMenuLink,
  // NavigationMenuList,
  // navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { MyAvatar } from "@/components/MyAvatar";
import { LanguageSelector } from "@/components/LanguageSelector";

export function Navbar() {
  return (
    <div className="relative flex justify-between items-center">
      <div className="flex items-center">
        <figure className="px-3">
          <MyAvatar />
        </figure>
        <div className="hidden md:flex">
          <h1 className="text-base font-semibold">Laurențiu Cristian Preda</h1>
        </div>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <NavigationMenu>
        {/* <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/"
            >
              About
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/"
            >
              Projects
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/"
            >
              Skills
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              href="/"
            >
              Contact
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList> */}
      </NavigationMenu>
      </div>
      
      <div className="p-2 pr-3 flex items-center space-x-4">
        <LanguageSelector />
        <DarkModeToggle />
      </div>
    </div>
  );
}
