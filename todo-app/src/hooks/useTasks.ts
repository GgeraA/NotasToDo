import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../firebase/config";
import type { Task, SubTask, Priority } from "../types/task";

// ─── Tipos para crear / editar ───────────────────────────────────────────────
export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: Priority;
  category?: string;
  subtasks?: Omit<SubTask, "id">[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: Priority;
  category?: string;
  subtasks?: SubTask[];
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Escucha cambios en tiempo real desde Firestore
  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];
        setTasks(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error escuchando tareas:", err);
        setError("No se pudieron cargar las tareas.");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Limpia el listener al desmontar
  }, []);

  // ➕ Crear tarea
  const createTask = async (input: CreateTaskInput) => {
    try {
      const subtasksWithId: SubTask[] = (input.subtasks ?? []).map((s, i) => ({
        id: `subtask-${Date.now()}-${i}`,
        title: s.title,
        completed: false,
      }));

      await addDoc(collection(db, "tasks"), {
        title: input.title,
        description: input.description ?? "",
        priority: input.priority,
        category: input.category ?? "",
        subtasks: subtasksWithId,
        createdAt: serverTimestamp(),
        deleted: false,
      });
      toast.success("Tarea creada correctamente"); // ← toast
    } catch (err) {
      console.error("Error creando tarea:", err);
      toast.error("No se pudo crear la tarea");
    }
  };

  // ✏️ Editar tarea
  const updateTask = async (id: string, input: UpdateTaskInput) => {
    try {
      const ref = doc(db, "tasks", id);
      await updateDoc(ref, { ...input });
    } catch (err) {
      console.error("Error actualizando tarea:", err);
      toast.error(" No se pudo actualizar la tarea");
    }
  };

  // ☑️ Marcar / desmarcar una subtarea
  const toggleSubtask = async (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );

    await updateTask(taskId, { subtasks: updatedSubtasks });
  };

  // 🗑️ Mover a papelera (soft delete)
  const moveToTrash = async (id: string) => {
    try {
      const ref = doc(db, "tasks", id);
      await updateDoc(ref, { deleted: true });
      toast.error("Tarea enviada a la papelera");
    } catch (err) {
      console.error("Error moviendo a papelera:", err);
      toast.error(" No se pudo mover a la papelera");
    }
  };

  // ♻️ Restaurar desde papelera
  const restoreTask = async (id: string) => {
    try {
      const ref = doc(db, "tasks", id);
      await updateDoc(ref, { deleted: false });
      toast.success("Tarea restaurada correctamente");
    } catch (err) {
      console.error("Error restaurando tarea:", err);
      toast.error("No se pudo restaurar la tarea");
    }
  };

  // 💀 Eliminar definitivamente
  const deleteForever = async (id: string) => {
    try {
      const ref = doc(db, "tasks", id);
      await deleteDoc(ref);
      toast.error("Tarea eliminada permanentemente");
    } catch (err) {
      console.error("Error eliminando tarea:", err);
      toast.error("No se pudo eliminar la tarea");
    }
  };

  // ─── Vistas filtradas (derivadas del estado, sin consultas extra) ──────────
  const activeTasks = tasks.filter((t) => !t.deleted);
  const trashedTasks = tasks.filter((t) => t.deleted);

  return {
    // Estado
    tasks,
    activeTasks,
    trashedTasks,
    loading,
    error,
    // Operaciones
    createTask,
    updateTask,
    toggleSubtask,
    moveToTrash,
    restoreTask,
    deleteForever,
  };
};