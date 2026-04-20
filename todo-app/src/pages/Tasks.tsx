import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import type { Task } from "../types/task";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

type Filter = "all" | "pending" | "in-progress";

const Tasks = () => {
  const { activeTasks, loading, createTask, updateTask, toggleSubtask, moveToTrash } = useTasks(); // ← única instancia
  const [filter, setFilter] = useState<Filter>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const filtered = activeTasks.filter((t) => {
    const done = t.subtasks.filter((s) => s.completed).length;
    const total = t.subtasks.length;
    if (filter === "pending") return done === 0;
    if (filter === "in-progress") return done > 0 && done < total;
    return true;
  });

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Mis Tareas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
        >
          + Nueva tarea
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "in-progress"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f === "all" ? "Todas" : f === "pending" ? "Pendientes" : "En progreso"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Cargando tareas...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-sm">No hay tareas aquí.</p>
      ) : (
        <div className="flex flex-col gap-3">
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
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleClose}
        taskToEdit={taskToEdit}
        onCreate={createTask}      
        onUpdate={updateTask}      
      />
    </div>
  );
};

export default Tasks;