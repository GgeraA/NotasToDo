// src/components/TaskCard.tsx
import { motion } from 'framer-motion';
import { getProgress, getTaskStatus } from "../types/task";
import type { Task } from "../types/task";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onMoveToTrash: (id: string) => void;
}

const priorityStyles = {
  low: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500"
  },
  medium: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500"
  },
  high: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
    dot: "bg-rose-500"
  },
};

const priorityLabel = {
  low: "Baja",
  medium: "Media",
  high: "Alta"
};

const statusConfig = {
  pending: { icon: "⏳", text: "Pendiente", color: "text-gray-500 dark:text-gray-400" },
  "in-progress": { icon: "🔄", text: "En progreso", color: "text-blue-500 dark:text-blue-400" },
  completed: { icon: "✅", text: "Completada", color: "text-emerald-500 dark:text-emerald-400" }
};

const TaskCard = ({ task, onEdit, onToggleSubtask, onMoveToTrash }: Props) => {
  const progress = getProgress(task);
  const status = getTaskStatus(task);
  const statusInfo = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg 
        border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-4 
        hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Priority Badge */}
        <div className={`
          shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold
          border ${priorityStyles[task.priority].bg} ${priorityStyles[task.priority].text} 
          ${priorityStyles[task.priority].border} flex items-center gap-1.5
        `}>
          <span className={`w-1.5 h-1.5 rounded-full ${priorityStyles[task.priority].dot}`} />
          {priorityLabel[task.priority]}
        </div>
      </div>

      {/* Category Tag */}
      {task.category && (
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 
            dark:from-indigo-950/30 dark:to-purple-950/30 text-indigo-600 dark:text-indigo-400 
            border border-indigo-200 dark:border-indigo-800 font-medium">
            📂 {task.category}
          </span>
        </div>
      )}

      {/* Subtasks Section */}
      {task.subtasks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Subtareas ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
            {task.subtasks.map((sub) => (
              <motion.label
                key={sub.id}
                initial={false}
                animate={{ opacity: sub.completed ? 0.7 : 1 }}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer
                  hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group/subtask"
              >
                <input
                  type="checkbox"
                  checked={sub.completed}
                  onChange={() => onToggleSubtask(task.id, sub.id)}
                  className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600
                    text-indigo-600 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-0
                    cursor-pointer transition-all duration-200"
                />
                <span className={`text-sm flex-1 transition-all duration-200
                  ${sub.completed
                    ? 'line-through text-gray-400 dark:text-gray-500'
                    : 'text-gray-700 dark:text-gray-300'
                  }`}>
                  {sub.title}
                </span>
              </motion.label>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {task.subtasks.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className={`text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
              <span>{statusInfo.icon}</span>
              <span>{statusInfo.text}</span>
            </span>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
              {progress}%
            </span>
          </div>
          <div className="relative w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r 
                ${status === 'completed'
                  ? 'from-emerald-500 to-green-500'
                  : status === 'in-progress'
                    ? 'from-blue-500 to-indigo-500'
                    : 'from-gray-400 to-gray-500'
                }`}
            />
          </div>
        </div>
      )}

      {/* Actions Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {task.createdAt?.toDate().toLocaleDateString('es-ES', {
            month: 'short',
            day: 'numeric'
          })}
        </span>

        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(task)}
            className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 
              hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors"
          >
            ✏️ Editar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMoveToTrash(task.id)}
            className="px-3 py-1.5 text-xs font-medium text-rose-500 dark:text-rose-400 
              hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
          >
            🗑️ Eliminar
          </motion.button>
        </div>
      </div>

      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
        transition-opacity duration-500 pointer-events-none
        bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
    </motion.div>
  );
};

export default TaskCard;