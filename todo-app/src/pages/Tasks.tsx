// src/pages/Tasks.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/task";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

type Filter = "all" | "pending" | "in-progress";

const Tasks = () => {
  const { activeTasks, loading, createTask, updateTask, toggleSubtask, moveToTrash } = useTasks();
  const [filter, setFilter] = useState<Filter>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = activeTasks
    .filter((t) => {
      const done = t.subtasks.filter((s) => s.completed).length;
      const total = t.subtasks.length;
      if (filter === "pending") return done === 0;
      if (filter === "in-progress") return done > 0 && done < total;
      return true;
    })
    .filter((t) => {
      if (!searchTerm) return true;
      return (
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  // Estadísticas rápidas
  const stats = {
    total: activeTasks.length,
    pending: activeTasks.filter(t => t.subtasks.every(s => !s.completed)).length,
    inProgress: activeTasks.filter(t => {
      const completed = t.subtasks.filter(s => s.completed).length;
      return completed > 0 && completed < t.subtasks.length;
    }).length,
  };

  const filterOptions = [
    { value: "all", label: "Todas", icon: "📋", color: "from-gray-500 to-gray-600" },
    { value: "pending", label: "Pendientes", icon: "⏳", color: "from-amber-500 to-orange-500" },
    { value: "in-progress", label: "En progreso", icon: "🔄", color: "from-blue-500 to-indigo-500" },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 
        dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
              dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Mis Tareas
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Organiza y gestiona tus proyectos
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 
              text-white rounded-xl text-sm font-medium shadow-lg hover:shadow-xl 
              transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span>
            <span>Nueva tarea</span>
          </motion.button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20">
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stats.pending}</p>
            <p className="text-xs text-amber-600 dark:text-amber-500">Pendientes</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20">
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.inProgress}</p>
            <p className="text-xs text-blue-600 dark:text-blue-500">En progreso</p>
          </div>
        </div>
      </div>

      {/* Search y Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 
        dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 
                dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 
                dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-400 
                transition-all duration-200"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                  hover:text-gray-600 dark:hover:text-gray-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtros */}
          <div className="flex gap-2">
            {filterOptions.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 
                  flex items-center gap-2 ${filter === option.value 
                    ? `bg-gradient-to-r ${option.color} text-white shadow-md` 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                <span>{option.icon}</span>
                <span className="hidden sm:inline">{option.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Tareas */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 dark:text-gray-400">Cargando tareas...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 
            dark:border-gray-700 p-12 text-center"
        >
          <div className="text-6xl mb-4">
            {searchTerm ? "🔍" : "📝"}
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {searchTerm ? "No se encontraron tareas" : "No hay tareas aún"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm 
              ? `No hay resultados para "${searchTerm}"`
              : "¡Crea tu primera tarea y empieza a organizar tu día!"
            }
          </p>
          {!searchTerm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 
                text-white rounded-xl text-sm font-medium shadow-lg"
            >
              Crear primera tarea
            </motion.button>
          )}
        </motion.div>
      ) : (
        <>
          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} {filtered.length === 1 ? 'tarea encontrada' : 'tareas encontradas'}
            </p>
          </div>
          
          <AnimatePresence mode="popLayout">
            <div className="grid gap-4">
              {filtered.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onToggleSubtask={toggleSubtask}   
                  onMoveToTrash={moveToTrash}        
                />
              ))}
            </div>
          </AnimatePresence>
        </>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleClose}
        taskToEdit={taskToEdit}
        onCreate={createTask}      
        onUpdate={updateTask}      
      />
    </motion.div>
  );
};

export default Tasks;