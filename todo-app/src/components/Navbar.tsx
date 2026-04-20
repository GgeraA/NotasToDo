// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isDark: boolean;
  onToggleDark: () => void;
}

const links = [
  { to: "/", label: "Inicio", icon: "🏠" },
  { to: "/tasks", label: "Tareas", icon: "📝" },
  { to: "/completed", label: "Completadas", icon: "✅" },
  { to: "/trash", label: "Papelera", icon: "🗑️" },
];

const Navbar = ({ isDark, onToggleDark }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 w-full z-50 transition-all duration-500
          ${scrolled
            ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-700'
            : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* LOGO */}
            <NavLink to="/" className="flex items-center gap-2 group">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="text-2xl sm:text-3xl"
              >
                📋
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent hidden sm:block"
              >
                TaskManager
              </motion.span>
            </NavLink>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) => `
                    relative px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition-all duration-300
                    ${isActive
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {/* Fondo animado para el item activo */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-lg"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <span className="text-lg">{link.icon}</span>
                        <span className="hidden lg:inline">{link.label}</span>
                      </span>
                    </>
                  )}
                </NavLink>
              ))}

              {/* BOTÓN MODO OSCURO */}
              <motion.button
                onClick={onToggleDark}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                  hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                aria-label="Cambiar tema"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">{isDark ? "☀️" : "🌙"}</span>
                  <span className="hidden lg:inline">{isDark ? "Claro" : "Oscuro"}</span>
                </span>
              </motion.button>
            </div>

            {/* MOBILE HAMBURGER */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Botón modo oscuro móvil */}
              <motion.button
                onClick={onToggleDark}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <span className="text-xl">{isDark ? "☀️" : "🌙"}</span>
              </motion.button>

              {/* Hamburguesa */}
              <motion.button
                onClick={() => setMobileOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 
                  text-white flex items-center justify-center shadow-lg"
                aria-label="Abrir menú"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menú lateral */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-72 bg-white dark:bg-gray-900 
                shadow-2xl md:hidden overflow-y-auto"
            >
              {/* Header del menú */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
                    dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    TaskManager
                  </span>
                  <motion.button
                    onClick={() => setMobileOpen(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 
                      text-gray-600 dark:text-gray-400 flex items-center justify-center"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              {/* Links móviles */}
              <div className="p-4 space-y-2">
                {links.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                        ${isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <span className="text-xl">{link.icon}</span>
                      <span className="font-medium">{link.label}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {/* Footer del menú móvil */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <p>© 2024 TaskManager</p>
                  <p className="mt-1">Organiza tu vida ✨</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Espaciador para contenido debajo del navbar */}
      <div className="h-16 sm:h-20" />
    </>
  );
};

export default Navbar;