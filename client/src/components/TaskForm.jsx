function TaskForm({
    title,
    setTitle,
    completed,
    setCompleted,
    onSubmit,
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
                    value={name}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : submitLabel}
            </button>
        </form>
    );
}

export default TaskForm;