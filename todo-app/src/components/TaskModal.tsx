// src/components/TaskModal.tsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Task, Priority, SubTask } from "../types/task";
import type { CreateTaskInput, UpdateTaskInput } from "../hooks/useTasks";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  onCreate: (input: CreateTaskInput) => Promise<void>;
  onUpdate: (id: string, input: UpdateTaskInput) => Promise<void>;
}

const inputClass = `
  w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 
  bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm
  outline-none transition-all duration-200
  focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-transparent
  placeholder:text-gray-400 dark:placeholder:text-gray-500
`;

const TaskModal = ({ isOpen, onClose, taskToEdit, onCreate, onUpdate }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState("");
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const subtasksContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description ?? "");
        setPriority(taskToEdit.priority);
        setCategory(taskToEdit.category ?? "");
        setSubtasks(taskToEdit.subtasks);
      } else {
        setTitle(""); 
        setDescription(""); 
        setPriority("medium"); 
        setCategory(""); 
        setSubtasks([]);
      }
      // Focus en el input de título al abrir
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [taskToEdit, isOpen]);

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [
      ...prev, 
      { id: `subtask-${Date.now()}`, title: newSubtask.trim(), completed: false }
    ]);
    setNewSubtask("");
    
    // Auto-scroll al final de la lista de subtareas
    setTimeout(() => {
      if (subtasksContainerRef.current) {
        subtasksContainerRef.current.scrollTop = subtasksContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const removeSubtask = (id: string) => setSubtasks((prev) => prev.filter((s) => s.id !== id));

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    
    const promise = taskToEdit 
      ? onUpdate(taskToEdit.id, { title, description, priority, category, subtasks })
      : onCreate({ title, description, priority, category, subtasks });
    
    await promise;
    toast.success(taskToEdit ? "Tarea actualizada correctamente" : "Tarea creada correctamente");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Baja', icon: '🟢', color: 'text-emerald-600 dark:text-emerald-400' },
    { value: 'medium', label: 'Media', icon: '🟡', color: 'text-amber-600 dark:text-amber-400' },
    { value: 'high', label: 'Alta', icon: '🔴', color: 'text-rose-600 dark:text-rose-400' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg max-h-[90vh] bg-white dark:bg-gray-800 
              rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 
                dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                {taskToEdit ? "✏️ Editar Tarea" : "Nueva Tarea"}
              </h2>
              <button
                onClick={onClose}
                className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 
                  dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Título <span className="text-rose-500">*</span>
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="¿Qué necesitas hacer?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Descripción
                </label>
                <textarea
                  placeholder="Agrega más detalles..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Prioridad y Categoría */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Prioridad
                  </label>
                  <div className="relative">
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      {priorityOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.icon} {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Categoría
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Trabajo, Personal"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Subtareas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Subtareas ({subtasks.length})
                </label>
                
                {/* Input para nueva subtarea */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Agregar subtarea..."
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSubtask()}
                    className={`${inputClass} flex-1`}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addSubtask}
                    className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 
                      text-white rounded-xl text-sm font-medium hover:shadow-lg 
                      transition-all duration-200"
                  >
                    + Agregar
                  </motion.button>
                </div>

                {/* Lista de subtareas con scroll */}
                <div 
                  ref={subtasksContainerRef}
                  className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar"
                >
                  <AnimatePresence>
                    {subtasks.map((subtask, index) => (
                      <motion.div
                        key={subtask.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-xl
                          bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600
                          hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-gray-400 dark:text-gray-500 text-sm">
                            {index + 1}.
                          </span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {subtask.title}
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeSubtask(subtask.id)}
                          className="ml-2 p-1.5 rounded-lg text-gray-400 hover:text-rose-500 
                            hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {subtasks.length === 0 && (
                    <div className="text-center py-8">
                      <span className="text-4xl mb-2 block opacity-50">📝</span>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        No hay subtareas. ¡Agrega una!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600
                  text-gray-700 dark:text-gray-300 text-sm font-medium
                  hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!title.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600
                  text-white text-sm font-medium shadow-lg
                  hover:from-indigo-700 hover:to-purple-700
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {taskToEdit ? "Guardar Cambios" : "Crear Tarea"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;