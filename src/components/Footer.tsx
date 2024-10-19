import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-300 dark:border-gray-700 pt-8 pb-4">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center">
          <p className="text-base text-muted-foreground">
            Created by <span className="font-semibold">Yasin Oruc</span>
          </p>
        </div>

        <div className="flex space-x-6">
          <a
            href="https://github.com/YasinOruc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            <FaGithub size={24} />
            <span className="sr-only">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/yasin-oru%C3%A7-134233228/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 transition-colors"
          >
            <FaLinkedin size={24} />
            <span className="sr-only">LinkedIn</span>
          </a>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Yasin Oruc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
