import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const useResponsiveIconSize = () => {
  type SizeProp = "1x" | "2x" | "3x";
  const [iconSize, setIconSize] = useState<SizeProp>("3x");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // the same as tailwind md: class
        setIconSize("2x");
      } else {
        setIconSize("3x");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return iconSize;
}

export function GithubIcon() {
  const iconSize = useResponsiveIconSize();
  return (
    <a
      href="https://github.com/Criseda"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon
        icon={faGithub}
        size={iconSize}
        className="text-gray-900 dark:text-white"
      />
    </a>
  );
}

export function LinkedinIcon() {
  const iconSize = useResponsiveIconSize();

  return (
    <a
      href="https://linkedin.com/in/criseda"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon
        icon={faLinkedin}
        size={iconSize}
        className="text-gray-900 dark:text-white"
      />
    </a>
  );
}
