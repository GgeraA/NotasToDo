import { useTasks } from "../hooks/useTasks";

const Trash = () => {
    const { trashedTasks, restoreTask, deleteForever, loading } = useTasks();

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold text-gray-800">🗑️ Papelera</h1>

            {loading ? (
                <p className="text-gray-400 text-sm">Cargando...</p>
            ) : trashedTasks.length === 0 ? (
                <p className="text-gray-400 text-sm">La papelera está vacía.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {trashedTasks.map((task) => (
                        <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-2">
                            <div>
                                <h3 className="font-medium text-gray-600">{task.title}</h3>
                                {task.description && (
                                    <p className="text-sm text-gray-400">{task.description}</p>
                                )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => restoreTask(task.id)}
                                    className="text-sm text-indigo-600 hover:underline"
                                >
                                    Restaurar
                                </button>
                                <button
                                    onClick={() => deleteForever(task.id)}
                                    className="text-sm text-red-500 hover:underline"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Trash;