import { useState } from 'react'
import { Routes, Route } from "react-router";
import { Navigate } from 'react-router';
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Home from "./pages/Home";

function App() {
  
  return (
    <>
      <main className='container'>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
