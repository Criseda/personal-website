import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

export function GithubIcon() {
  return (
    <a
      href="https://github.com/Criseda"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon
        icon={faGithub}
        size="3x"
        className="text-gray-900 dark:text-white"
      />
    </a>
  );
}

export function LinkedinIcon() {
  return (
    <a
      href="https://linkedin.com/in/criseda"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon
        icon={faLinkedin}
        size="3x"
        className="text-gray-900 dark:text-white"
      />
    </a>
  );
}
