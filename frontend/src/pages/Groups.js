import { useState, useEffect } from "react";
import axios from "axios";
import SuccessMessage from "../components/SuccessMessage";

export default function Groups() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [success, setSuccess] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");
  const [editMembers, setEditMembers] = useState([]);

  // Fetch users + groups
  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    axios.get("http://localhost:5000/users").then(res => setUsers(res.data));
    axios.get("http://localhost:5000/groups").then(res => setGroups(res.data));
  }

  function toggleMember(userId) {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  }

  function toggleEditMember(userId) {
    if (editMembers.includes(userId)) {
      setEditMembers(editMembers.filter(id => id !== userId));
    } else {
      setEditMembers([...editMembers, userId]);
    }
  }

  function createGroup() {
    if (!groupName.trim()) {
      alert("Please enter a group name");
      return;
    }
    if (selectedMembers.length === 0) {
      alert("Please select at least one member");
      return;
    }
    axios.post("http://localhost:5000/groups", {
      name: groupName,
      members: selectedMembers
    }).then(() => {
      setSuccess("Group created successfully!");
      setGroupName("");
      setSelectedMembers([]);
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    }).catch(() => {
      alert("Failed to create group");
    });
  }

  function startEdit(group) {
    setEditingId(group.id);
    setEditGroupName(group.name);
    setEditMembers([...group.members]);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditGroupName("");
    setEditMembers([]);
  }

  function updateGroup(id) {
    if (!editGroupName.trim()) {
      alert("Please enter a group name");
      return;
    }
    if (editMembers.length === 0) {
      alert("Please select at least one member");
      return;
    }
    axios.put(`http://localhost:5000/groups/${id}`, {
      name: editGroupName,
      members: editMembers
    }).then(() => {
      setSuccess("Group updated successfully!");
      setEditingId(null);
      setEditGroupName("");
      setEditMembers([]);
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    }).catch(() => {
      alert("Failed to update group");
    });
  }

  function deleteGroup(id) {
    if (window.confirm("Are you sure you want to delete this group?")) {
      axios.delete(`http://localhost:5000/groups/${id}`).then(() => {
        setSuccess("Group deleted successfully!");
        fetchData();
        setTimeout(() => setSuccess(""), 3000);
      }).catch(() => {
        alert("Failed to delete group");
      });
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <SuccessMessage message={success} /> 
      <h2>Create Group</h2>
      <div className="card" style={{ marginBottom: 20 }}>
        <input
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={{ padding: 8, width: "300px", marginBottom: 15 }}
        />

        <h3>Select Members</h3>
        {users.map(u => (
          <div key={u.id} style={{ marginBottom: 8 }}>
            <label>
              <input
                type="checkbox"
                checked={selectedMembers.includes(u.id)}
                onChange={() => toggleMember(u.id)}
                style={{ marginRight: 8 }}
              />
              {u.name}
            </label>
          </div>
        ))}

        <br />
        <button className="btn-primary" onClick={createGroup}>Create Group</button>
      </div>

      <hr />
      <h2>Existing Groups</h2>
      <div className="card">
        {groups.length === 0 ? (
          <p>No groups found. Create a group to get started!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Members</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groups.map(g => (
                <tr key={g.id}>
                  <td>
                    {editingId === g.id ? (
                      <input
                        type="text"
                        value={editGroupName}
                        onChange={(e) => setEditGroupName(e.target.value)}
                        style={{ padding: 6, width: "200px" }}
                      />
                    ) : (
                      <strong>{g.name}</strong>
                    )}
                  </td>
                  <td>
                    {editingId === g.id ? (
                      <div>
                        {users.map(u => (
                          <div key={u.id} style={{ marginBottom: 5 }}>
                            <label>
                              <input
                                type="checkbox"
                                checked={editMembers.includes(u.id)}
                                onChange={() => toggleEditMember(u.id)}
                                style={{ marginRight: 8 }}
                              />
                              {u.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      g.members
                        .map(id => users.find(u => u.id === id)?.name)
                        .filter(Boolean)
                        .join(", ") || "No members"
                    )}
                  </td>
                  <td>
                    {editingId === g.id ? (
                      <>
                        <button className="btn-primary" onClick={() => updateGroup(g.id)}>Save</button>
                        <button className="btn" onClick={cancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn" onClick={() => startEdit(g)}>Edit</button>
                        <button 
                          className="btn" 
                          onClick={() => deleteGroup(g.id)}
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
