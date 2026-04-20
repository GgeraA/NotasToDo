import { getProgress, getTaskStatus } from "../types/task";
import type { Task } from "../types/task";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onMoveToTrash: (id: string) => void;
}

const priorityStyles = {
  low: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const priorityLabel = { low: "Baja", medium: "Media", high: "Alta" };

const TaskCard = ({ task, onEdit, onToggleSubtask, onMoveToTrash }: Props) => {
  const progress = getProgress(task);
  const status = getTaskStatus(task);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-3 transition-colors duration-300">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{task.description}</p>
          )}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${priorityStyles[task.priority]}`}>
          {priorityLabel[task.priority]}
        </span>
      </div>

      {task.subtasks.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {task.subtasks.map((sub) => (
            <label key={sub.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sub.completed}
                onChange={() => onToggleSubtask(task.id, sub.id)}
                className="w-4 h-4 accent-indigo-600"
              />
              <span className={`text-sm ${sub.completed ? "line-through text-gray-400" : "text-gray-700 dark:text-gray-300"}`}>
                {sub.title}
              </span>
            </label>
          ))}
        </div>
      )}

      {task.subtasks.length > 0 && (
        <div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>
              {status === "completed" ? "✅ Completada" : status === "in-progress" ? "🔄 En progreso" : "⏳ Pendiente"}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        {task.category && (
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded-full">
            {task.category}
          </span>
        )}
        <div className="flex gap-2 ml-auto">
          <button onClick={() => onEdit(task)} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
            Editar
          </button>
          <button onClick={() => onMoveToTrash(task.id)} className="text-sm text-red-400 hover:underline">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;