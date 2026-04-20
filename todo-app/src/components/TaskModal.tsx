import { useState, useEffect } from "react";
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

const inputClass = "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400 dark:placeholder:text-gray-500";

const TaskModal = ({ isOpen, onClose, taskToEdit, onCreate, onUpdate }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState("");
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description ?? "");
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category ?? "");
      setSubtasks(taskToEdit.subtasks);
    } else {
      setTitle(""); setDescription(""); setPriority("medium"); setCategory(""); setSubtasks([]);
    }
  }, [taskToEdit, isOpen]);

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [...prev, { id: `subtask-${Date.now()}`, title: newSubtask.trim(), completed: false }]);
    setNewSubtask("");
  };

  const removeSubtask = (id: string) => setSubtasks((prev) => prev.filter((s) => s.id !== id));

  const handleSubmit = async () => {
    if (!title.trim()) return;
    if (taskToEdit) {
      await onUpdate(taskToEdit.id, { title, description, priority, category, subtasks });
      toast.success("Tarea actualizada correctamente");
    } else {
      await onCreate({ title, description, priority, category, subtasks });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4 transition-colors duration-300">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          {taskToEdit ? "Editar tarea" : "Nueva tarea"}
        </h2>

        <input type="text" placeholder="Título *" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        <textarea placeholder="Descripción (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={`${inputClass} resize-none`} />

        <div className="flex gap-2">
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={`${inputClass} flex-1`}>
            <option value="low">🟢 Baja</option>
            <option value="medium">🟡 Media</option>
            <option value="high">🔴 Alta</option>
          </select>
          <input type="text" placeholder="Categoría" value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} flex-1`} />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtareas</p>
          <div className="flex gap-2 mb-2">
            <input type="text" placeholder="Agregar subtarea..." value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSubtask()} className={`${inputClass} flex-1`} />
            <button onClick={addSubtask} className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-indigo-700">+</button>
          </div>
          <div className="flex flex-col gap-1">
            {subtasks.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-1.5">
                <span className="text-sm text-gray-700 dark:text-gray-300">{s.title}</span>
                <button onClick={() => removeSubtask(s.id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={!title.trim()} className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm hover:bg-indigo-700 disabled:opacity-50">
            {taskToEdit ? "Guardar cambios" : "Crear tarea"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;