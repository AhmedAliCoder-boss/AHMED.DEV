import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
const { theme, toggleTheme } = useTheme();
const [isOpen, setIsOpen] = useState(false);
const location = useLocation();

const navLinks = [
{ name: 'Home', path: '/' },
{ name: 'About', path: '/about' },
{ name: 'Projects', path: '/projects' },
{ name: 'Blog', path: '/blog' },
{ name: 'Contact', path: '/contact' },
];

const isActive = (path) => location.pathname === path;

return ( <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800"> <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> <div className="flex items-center justify-between h-16"> <Link
         to="/"
         className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
       >
Ahmed.dev </Link>

```
      <div className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`text-sm font-medium transition-colors ${
              isActive(link.path)
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
          >
            {link.name}
          </Link>
        ))}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <div className="md:hidden flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </div>

    {isOpen && (
      <div className="md:hidden py-4 space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 rounded-lg"
          >
            {link.name}
          </Link>
        ))}
      </div>
    )}
  </nav>
</header>

);
};

export default Header;
