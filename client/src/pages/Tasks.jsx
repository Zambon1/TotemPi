import { useEffect, useState } from "react";
import { Link } from "react-router";
import TaskForm from "../components/TaskForm";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState("");
    const [completed, setCompleted] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchTasks() {
            setLoading(true);
            setError("");

            try {
                const res = await fetch("/api/tasks?all=true");
                const data = await res.join();

                if (cancelled) {
                    return;
                }

                if (!res.ok) {
                    throw new Error(data.error || "Unable to load tasks.");
                }

                setTasks(data.tasks || []);
            } catch (requestError) {
                if (!cancelled) {
                    setError(requestError.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
    }
        return () => {
            cancelled = true;
        };
    }, []);

    function resetForm() {
        setEditingId(null);
        setName("");
        setCompleted(false);
    }

    function startEdit(task) {
        setEditingId(task.id);
        setName(task.name);
        setCompleted(Boolean(task.completed));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingId,
                    name,
                    completed
                }),
            });
            const data = await res.json();

            if (!res.ok)  {
                throw new Error(data.error || "Unable to save task.");
            }

            if (editingId) {
                setTasks((currentTasks) =>
                    currentTasks.map((task) => (task.id === data.task.id ? data.task : task))
                );
            } else {
                setTasks((currentTasks) => [data.task, ...currentTasks]);
            }

            resetForm();
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleToggleComplete(task) {
        setSaving(true);
        setError("");

        try {
            const nextCompleted = !task.completed;
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: task.id,
                    name: task.name,
                    completed: nextCompleted,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Unable to update task status.");
            }

            setTasks((currentTasks) => 
                currentTasks.map((currentTask) => (currentTask.id === data.task.id ? data.task : currentTask))
            );

            if (editingId === data.task.id) {
                setCompleted(data.task.completed);
            }
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(taskId) {
        setSaving(true);
        setError("");

        try {
            const res = await fetch(`api/tasks/${taskId}`, {
                method: "DELETE"
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Unable to delete task.");
            }

            setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
            if (editingId === taskId) {
                resetForm();
            }
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="task-page">
            <div className="page-header">
                <div>
                    <h1>Tasks</h1>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="task-layout">
                <section className="detail-card">
                    <div className="section-heading">
                        <h2>{editingId ? "Edit task" : "Add task"}</h2>
                    </div>
                    <TaskForm
                        name={name}
                        setName={setName}
                        onSubmit={handleSubmit}
                        submitLabel={editingId ? "Save changes" : "Add task"}
                        error={""}
                        loading={saving}
                    />
                    {editingId && (
                        <button className="btn task-cancel-button" onClick={resetForm}>
                            Cancel edit
                        </button>
                    )}
                </section>

                <section className="detail-card">
                    <div className="section-heading">
                        <h2>All tasks</h2>
                    </div>

                    {loading ? (
                        <p className="info-message">Loading tasks...</p>
                    ) : tasks.length === 0 ? (
                        <p className="info-message">No active tasks</p>
                    ) : (
                        <div className="task-list">
                            {tasks.map((task) => (
                                <article className="task-item" key={task.id}>
                                    <div>
                                        <h3>{task.name}</h3>
                                    </div>
                                    <div className="task-actions">
                                        <button
                                            type="button"
                                            className="status-pill task-status-pill"
                                            onClick={() => handleToggleComplete(task)}
                                            disabled={saving}
                                            >
                                                {task.completed ? "Done" : "Not done"}
                                        </button>
                                        <button className="btn btn-primary" onClick={() => startEdit(task)}>
                                            Edit
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(task.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )
                    }
                </section>
            </div>
        </section>
    )
}

export default Tasks;