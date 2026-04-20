// src/pages/Trash.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../hooks/useTasks";

const Trash = () => {
  const { trashedTasks, restoreTask, deleteForever, loading } = useTasks();
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);

  const handleEmptyTrash = async () => {
    
    setShowEmptyConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 p-8 text-white shadow-xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🗑️</span>
            <h1 className="text-3xl font-bold">Papelera</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Las tareas eliminadas permanecen aquí por 30 días
          </p>
        </motion.div>

        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-500/10 rounded-full -ml-24 -mb-24 blur-2xl" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-gray-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 dark:text-gray-400">Cargando papelera...</p>
          </div>
        </div>
      ) : trashedTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 
            dark:border-gray-700 p-12 text-center"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            La papelera está vacía
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Las tareas que elimines aparecerán aquí.
            <br />
            Podrás restaurarlas o eliminarlas permanentemente.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Info y acciones */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 
            dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/50 
                  flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 text-lg">⚠️</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {trashedTasks.length} {trashedTasks.length === 1 ? 'tarea en papelera' : 'tareas en papelera'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Se eliminarán automáticamente después de 30 días
                  </p>
                </div>
              </div>
              
              {trashedTasks.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEmptyConfirm(true)}
                  className="px-4 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 
                    text-rose-600 dark:text-rose-400 text-sm font-medium
                    border border-rose-200 dark:border-rose-800
                    hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors"
                >
                  Vaciar papelera
                </motion.button>
              )}
            </div>
          </div>

          {/* Lista de tareas en papelera */}
          <div className="space-y-3">
            <AnimatePresence>
              {trashedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 
                    dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 
                        flex items-center justify-center shadow-md">
                        <span className="text-white text-lg">🗑️</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 dark:text-white text-lg">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {task.description}
                        </p>
                      )}
                      
                      {/* Info adicional */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {task.category && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full 
                            bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs">
                            <span>📂</span>
                            <span>{task.category}</span>
                          </span>
                        )}
                        
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2 shrink-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => restoreTask(task.id)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 
                          text-indigo-600 dark:text-indigo-400 text-sm font-medium
                          hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors"
                      >
                        ↻ Restaurar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => deleteForever(task.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 
                          text-rose-600 dark:text-rose-400 text-sm font-medium
                          hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors"
                      >
                        ✕ Eliminar
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Modal de confirmación para vaciar papelera */}
      <AnimatePresence>
        {showEmptyConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">⚠️</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  ¿Vaciar papelera?
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Esta acción eliminará permanentemente todas las tareas en la papelera.
                  <br />
                  <span className="text-rose-500 dark:text-rose-400 font-medium">
                    No se puede deshacer.
                  </span>
                </p>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEmptyConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 
                    dark:border-gray-600 text-gray-700 dark:text-gray-300
                    hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEmptyTrash}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 
                    text-white font-medium hover:shadow-lg transition-all"
                >
                  Sí, vaciar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Trash;