import { Link } from "react-router";

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>TotemPi Config</h2>
            <Link to="/">Home</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/tasks">Tasks</Link>
            <Link to="/goals">Goals</Link>
        </div>
    )
}

export default Sidebar;