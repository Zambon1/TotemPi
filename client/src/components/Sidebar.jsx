import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            <Link to="/">Home</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/tasks">Tasks</Link>
            <Link to="/goals">Goals</Link>
        </div>
    )
}

export default Sidebar;