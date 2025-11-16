import { useState, useEffect } from "react";
import axios from "axios";
import SuccessMessage from "../components/SuccessMessage";
import { useNavigate } from "react-router-dom";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    axios.get("http://localhost:5000/expenses").then(res => setExpenses(res.data));
    axios.get("http://localhost:5000/users").then(res => setUsers(res.data));
    axios.get("http://localhost:5000/groups").then(res => setGroups(res.data));
  }

  const getUserName = (id) => users.find(u => u.id === id)?.name || "";
  const getGroupName = (id) => groups.find(g => g.id === id)?.name || "";

  function deleteExpense(id) {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      axios.delete(`http://localhost:5000/expenses/${id}`).then(() => {
        setSuccess("Expense deleted successfully!");
        fetchData();
        setTimeout(() => setSuccess(""), 3000);
      }).catch(() => {
        alert("Failed to delete expense");
      });
    }
  }

  function editExpense(id) {
    navigate(`/edit-expense/${id}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <SuccessMessage message={success} />
      <h2>All Expenses</h2>

      {expenses.length === 0 ? (
        <div className="card">
          <p>No expenses found. Add an expense to get started!</p>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Paid By</th>
              <th>Type</th>
              <th>Split (if group)</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map(e => (
              <tr key={e.id}>
                <td>{e.date}</td>
                <td>{e.description}</td>
                <td>{e.category}</td>
                <td>{e.amount}</td>
                <td>{getUserName(e.paidBy)}</td>
                <td>{e.type}</td>
                <td>
                  {e.type === "group" ? (
                    <div>
                      <strong>Group:</strong> {getGroupName(e.groupId)}<br />
                      {Object.entries(e.split).map(([uid, amt]) => (
                        <div key={uid}>{getUserName(uid)} owes {amt}</div>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <button className="btn" onClick={() => editExpense(e.id)}>Edit</button>
                  <button 
                    className="btn" 
                    onClick={() => deleteExpense(e.id)}
                    style={{ background: "#dc3545", color: "white" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
