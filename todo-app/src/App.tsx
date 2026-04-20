import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import Completed from "./pages/Completed";
import Trash from "./pages/Trash";
import { useDarkMode } from "./hooks/useDarkMode";

function App() {
  const { isDark, toggle } = useDarkMode();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar isDark={isDark} onToggleDark={toggle} />
        <main className="max-w-3xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/completed" element={<Completed />} />
            <Route path="/trash" element={<Trash />} />
          </Routes>
          {/* Footer minimalista */}
          <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-800">
            <p>© 2026 List ToDo • Gerardo Hernández López</p>
          </footer>
        </main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: isDark ? "#1f2937" : "#ffffff",
              color: isDark ? "#f9fafb" : "#111827",
              border: isDark ? "1px solid #374151" : "1px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "14px",
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;