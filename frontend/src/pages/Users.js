import { useState, useEffect } from "react";
import axios from "axios";
import SuccessMessage from "../components/SuccessMessage";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    axios.get("http://localhost:5000/users").then(res => setUsers(res.data));
  }

  function addUser() {
    if (!name.trim()) {
      alert("Please enter a name");
      return;
    }
    axios.post("http://localhost:5000/users", { name }).then(() => {
      setSuccess("User added successfully!");
      setName("");
      fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    }).catch(() => {
      alert("Failed to add user");
    });
  }

  function startEdit(user) {
    setEditingId(user.id);
    setEditName(user.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  function updateUser(id) {
    if (!editName.trim()) {
      alert("Please enter a name");
      return;
    }
    axios.put(`http://localhost:5000/users/${id}`, { name: editName }).then(() => {
      setSuccess("User updated successfully!");
      setEditingId(null);
      setEditName("");
      fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    }).catch(() => {
      alert("Failed to update user");
    });
  }

  function deleteUser(id) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.delete(`http://localhost:5000/users/${id}`).then(() => {
        setSuccess("User deleted successfully!");
        fetchUsers();
        setTimeout(() => setSuccess(""), 3000);
      }).catch(() => {
        alert("Failed to delete user");
      });
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <SuccessMessage message={success} />
      <h2>Add User</h2>
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="User name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 8, marginRight: 10, width: "200px" }}
        />
        <button className="btn-primary" onClick={addUser}>Add User</button>
      </div>

      <hr />
      <h2>All Users</h2>
      <div className="card">
        {users.length === 0 ? (
          <p>No users found. Add a user to get started!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    {editingId === u.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{ padding: 6, width: "200px" }}
                      />
                    ) : (
                      u.name
                    )}
                  </td>
                  <td>
                    {editingId === u.id ? (
                      <>
                        <button className="btn-primary" onClick={() => updateUser(u.id)}>Save</button>
                        <button className="btn" onClick={cancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn" onClick={() => startEdit(u)}>Edit</button>
                        <button 
                          className="btn" 
                          onClick={() => deleteUser(u.id)}
                          style={{ background: "#dc3545", color: "white" }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
