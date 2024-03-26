import {
  NavigationMenu,
  // NavigationMenuContent,
  // NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  // NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  // NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { MyAvatar } from "@/components/MyAvatar";

export function Navbar() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="flex items-center ml-2">
        <figure className="mr-3">
          <MyAvatar />
        </figure>
        <div className="hidden sm:flex">
          <h1 className="text-base font-semibold">Cristian Preda</h1>
        </div>
      </div>

        <div className="flex justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/about">
                  About
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/projects">
                  Projects
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/skills">
                  Skills
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/contacts">
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

      <div className="flex justify-end m-2 mr-3">
        <DarkModeToggle />
      </div>
    </div>
  );
}
