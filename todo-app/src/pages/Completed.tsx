// src/pages/Completed.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../hooks/useTasks";
import { getProgress } from "../types/task";
import { useEffect, useState } from "react";
import confetti from 'canvas-confetti';

const Completed = () => {
  const { activeTasks, loading } = useTasks();
  const [showConfetti, setShowConfetti] = useState(false);

  const completed = activeTasks.filter(
    (t) => t.subtasks.length > 0 && getProgress(t) === 100
  );

  // Lanzar confetti cuando se completa una tarea
  useEffect(() => {
    if (completed.length > 0 && !showConfetti) {
      setShowConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0']
      });
      
      // Segundo confetti con delay
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 100,
          origin: { y: 0.5, x: 0.3 },
          colors: ['#8B5CF6', '#A78BFA', '#C4B5FD']
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            spread: 100,
            origin: { y: 0.5, x: 0.7 },
            colors: ['#3B82F6', '#60A5FA', '#93C5FD']
          });
        }, 200);
      }, 150);
    }
  }, [completed.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-8 text-white shadow-xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🏆</span>
            <h1 className="text-3xl font-bold">Mis Logros</h1>
          </div>
          <p className="text-emerald-50 text-lg">
            Celebra tus victorias y mantén el impulso
          </p>
        </motion.div>

        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/20 rounded-full -ml-24 -mb-24 blur-2xl" />
        
        {/* Patrón de puntos */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
            backgroundSize: '30px 30px'
          }} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 dark:text-gray-400">Cargando logros...</p>
          </div>
        </div>
      ) : completed.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 
            dark:border-gray-700 p-12 text-center"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            ¡Aún no hay tareas completadas!
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Cada tarea que completes aparecerá aquí como un logro.
            <br />
            ¡Sigue así, estás en el camino correcto!
          </p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-8 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-full"
          />
        </motion.div>
      ) : (
        <>
          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 
              dark:to-green-950/30 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200 
              dark:border-emerald-800 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 
                  flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🎉</span>
                </div>
                <div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">
                    Total de logros
                  </p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">
                    {completed.length}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ¡Sigue así!
                </p>
                <div className="flex gap-1 mt-1">
                  {[...Array(Math.min(completed.length, 5))].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-2xl"
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Lista de tareas completadas */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
              Tareas completadas recientemente
            </h3>
            
            <AnimatePresence>
              <div className="space-y-3">
                {completed.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="group bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 
                      dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300
                      bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/80"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: index * 0.05 }}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 
                            flex items-center justify-center shadow-md"
                        >
                          <span className="text-white text-lg">✓</span>
                        </motion.div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-white text-lg line-through opacity-75">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-through opacity-60">
                            {task.description}
                          </p>
                        )}
                        
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full 
                            bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 
                            text-xs font-medium">
                            <span>✅</span>
                            <span>100% completada</span>
                          </span>
                          
                          {task.category && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full 
                              bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs">
                              <span>📂</span>
                              <span>{task.category}</span>
                            </span>
                          )}
                          
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                            ${task.priority === 'high' 
                              ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300' 
                              : task.priority === 'medium'
                                ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
                                : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                            }`}>
                            <span>{task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}</span>
                            <span>{task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Decoración sutil */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 
                      to-green-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Completed;