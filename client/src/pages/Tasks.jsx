import { useEffect, useState } from "react";
import { Link } from "react-router";

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
                const res = await fetch("/api/task?all=true");
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
        setDescription("");
        setCompleted(false);
    }

    function startEdit(task) {
        setEditingId(task.id);
        setName(task.name);
        setDescription(task.description || "");
        setCompleted(Boolean(task.completed));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            const res = await fetch("/api/task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingId,
                    name,
                    description,
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
}