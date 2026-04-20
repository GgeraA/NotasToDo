import { useTasks } from "../hooks/useTasks";
import { getProgress } from "../types/task";

const Completed = () => {
    const { activeTasks, loading } = useTasks();

    const completed = activeTasks.filter(
        (t) => t.subtasks.length > 0 && getProgress(t) === 100
    );

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold text-gray-800">✅ Completadas</h1>

            {loading ? (
                <p className="text-gray-400 text-sm">Cargando...</p>
            ) : completed.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <p className="text-4xl mb-2">🎯</p>
                    <p>Aún no has completado ninguna tarea.</p>
                </div>
            ) : (
                <>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                        <p className="text-2xl">🎉</p>
                        <p className="font-semibold text-green-700 mt-1">
                            ¡Completaste {completed.length} {completed.length === 1 ? "tarea" : "tareas"}!
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        {completed.map((task) => (
                            <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-4 opacity-75">
                                <h3 className="font-semibold text-gray-700 line-through">{task.title}</h3>
                                <p className="text-xs text-green-600 mt-1">✅ 100% completada</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Completed;