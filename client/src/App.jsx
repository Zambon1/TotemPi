import { Routes, Route } from "react-router";
import Sidebar from "./components/Sidebar";
import './App.css'
import Home from "./pages/Home";

function App() {
  
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
