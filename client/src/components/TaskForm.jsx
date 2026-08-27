function TaskForm({
    title,
    setName,
    completed,
    setCompleted,
    onSubmit,
    submitLabel,
    error,
    loading
}) {
    return (
        <form className="task-form" onSubmit={onSubmit}>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <label htmlFor="task-title">Task Title</label>
                <input
                    id="task-title"
                    type="text"
                    value={title}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : submitLabel}
            </button>
        </form>
    );
}

export default TaskForm;