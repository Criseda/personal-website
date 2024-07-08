import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { MyAvatar } from "@/components/MyAvatar";

export function Navbar() {
  return (
    <div className="relative flex justify-between items-center">
      <div className="relative flex items-center">
        <figure className="hidden md:flex md:px-3 px-2">
          <MyAvatar />
        </figure>
        <div className="hidden md:flex">
          <h1 className="text-base font-semibold">Cristian Preda</h1>
        </div>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/about"
              >
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/projects"
              >
                Projects
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/skills"
              >
                Skills
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/contacts"
              >
                Contact
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="relative flex p-2 md:pr-4 pr-2">
        <DarkModeToggle />
      </div>
    </div>
  );
}
