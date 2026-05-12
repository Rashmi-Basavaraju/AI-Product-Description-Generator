import { BrowserRouter } from "react-router-dom";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Output from "./pages/Output";
import "./App.css";


function App() {
  return (
    <BrowserRouter>
       <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/output" element={<Output />} />
       </Routes>
    </BrowserRouter>
  );
}

export default App;