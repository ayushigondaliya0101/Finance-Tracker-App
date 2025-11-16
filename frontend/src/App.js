import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// Pages
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import Groups from "./pages/Groups";
import Users from "./pages/Users";
import Expenses from "./pages/Expenses";
import Summary from "./pages/Summary";

export default function App() {

  useEffect(() => {
    const currentPath = window.location.pathname;

    document.querySelectorAll(".nav-item").forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active");
      }
    });
  }, []);

  return (
    <BrowserRouter>
      {/* NAVBAR */}
      <nav className="navbar">
        <a href="/" className="nav-item">All Expenses</a>
        <a href="/add" className="nav-item">Add Expense</a>
        <a href="/groups" className="nav-item">Groups</a>
        <a href="/users" className="nav-item">Users</a>
        <a href="/summary" className="nav-item">Summary</a>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Expenses />} />
        <Route path="/add" element={<AddExpense />} />
        <Route path="/edit-expense/:id" element={<EditExpense />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/users" element={<Users />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </BrowserRouter>
  );
}
