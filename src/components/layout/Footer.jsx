import React from 'react';
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { Link } from 'react-router-dom';



const Footer = () => {
const currentYear = new Date().getFullYear();

return ( <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"> <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> <div className="grid grid-cols-1 md:grid-cols-4 gap-8"> <div className="col-span-1 md:col-span-2"> <Link
           to="/"
           className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
         >
Ahmed.dev </Link>

        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
          Building exceptional digital experiences with modern technologies.
          Passionate about creating beautiful, functional, and scalable applications.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Quick Links
        </h3>

        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              About
            </Link>
          </li>

          <li>
            <Link
              to="/projects"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Projects
            </Link>
          </li>

          <li>
            <Link
              to="/blog"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Blog
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Connect
        </h3>

        <div className="flex space-x-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FaGithub size={20} />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FaLinkedin size={20} />
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <FaTwitter size={20} />
          </a>

          <a
            href="mailto:hello@ahmed.dev"
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <SiGmail size={20} />
          </a>
        </div>
      </div>
    </div>

    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
      <p>&copy; {currentYear} Ahmed.dev. All rights reserved.</p>
    </div>
  </div>
</footer>

);
};

export default Footer;
