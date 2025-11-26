import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button className="theme-toggle" aria-label="Toggle theme">
        <span className="toggle-icon">🌙</span>
      </button>
    );
  }

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="toggle-icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
      <span className="toggle-text">
        {theme === 'light' ? 'Dark' : 'Light'}
      </span>
      
      <style>{`
        .theme-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: var(--radius);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all var(--transition-base);
          backdrop-filter: blur(10px);
          font-family: var(--font-sans);
        }

        .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .theme-toggle:active {
          transform: translateY(0);
        }

        .toggle-icon {
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          transition: transform var(--transition-base);
        }

        .theme-toggle:hover .toggle-icon {
          transform: rotate(15deg) scale(1.1);
        }

        .toggle-text {
          font-weight: 700;
          letter-spacing: 0.025em;
        }

        @media (max-width: 640px) {
          .toggle-text {
            display: none;
          }
          
          .theme-toggle {
            padding: 0.5rem 0.75rem;
          }
        }
      `}</style>
    </button>
  );
}
