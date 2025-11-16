import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SimpleInput from "../components/SimpleInput";
import SuccessMessage from "../components/SuccessMessage";

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [type, setType] = useState("personal");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    date: "",
    amount: "",
    description: "",
    category: "",
    paidBy: "",
    groupId: "",
    split: {},
    type: ""
  });

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:5000/users"),
      axios.get("http://localhost:5000/groups"),
      axios.get(`http://localhost:5000/expenses/${id}`)
    ]).then(([usersRes, groupsRes, expenseRes]) => {
      setUsers(usersRes.data);
      setGroups(groupsRes.data);
      const expense = expenseRes.data;
      setForm({
        date: expense.date,
        amount: expense.amount,
        description: expense.description,
        category: expense.category,
        paidBy: expense.paidBy,
        groupId: expense.groupId || "",
        split: expense.split || {},
        type: expense.type
      });
      setType(expense.type || "personal");
      if (expense.groupId) {
        const group = groupsRes.data.find(g => g.id === expense.groupId);
        if (group) setSelectedGroup(group);
      }
      setLoading(false);
    }).catch(() => {
      alert("Failed to load expense");
      navigate("/");
    });
  }, [id, navigate]);

  useEffect(() => {
    if (form.groupId) {
      const group = groups.find(g => g.id === form.groupId);
      if (group) setSelectedGroup(group);
    }
  }, [form.groupId, groups]);

  function handleGroupSelect(groupId) {
    setForm({ ...form, groupId });
    const group = groups.find(g => g.id === groupId);
    setSelectedGroup(group);
  }

  function equalSplit() {
    if (!selectedGroup) return;
    const perHead = parseFloat(form.amount) / selectedGroup.members.length;
    const splitObj = {};
    selectedGroup.members.forEach(uid => {
      splitObj[uid] = parseFloat(perHead.toFixed(2));
    });
    setForm({ ...form, split: splitObj });
  }

  function updateCustomSplit(userId, value) {
    setForm({
      ...form,
      split: {
        ...form.split,
        [userId]: Number(value)
      }
    });
  }

  function submit() {
    const updatedForm = {
      ...form,
      type: type
    };
    
    axios.put(`http://localhost:5000/expenses/${id}`, updatedForm)
      .then(() => {
        setSuccess("Expense updated successfully!");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      })
      .catch(() => {
        alert("Failed to update expense");
      });
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <SuccessMessage message={success} />
      <h2>Edit Expense</h2>

      <div className="card">
        <SimpleInput
          label="Date"
          type="date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
        />

        <SimpleInput
          label="Amount"
          type="number"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
        />

        <SimpleInput
          label="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        {/* CATEGORY DROPDOWN */}
        <label><b>Category</b></label><br />
        <select
          className="input"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Bills">Bills</option>
          <option value="Groceries">Groceries</option>
          <option value="Shopping">Shopping</option>
          <option value="Travel">Travel</option>
          <option value="Medical">Medical</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>

        {form.category === "Other" && (
          <>
            <br /><br />
            <SimpleInput
              label="Enter custom category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </>
        )}

        {/* Paid By */}
        <label><b>Paid By</b></label><br />
        <select
          className="input"
          value={form.paidBy}
          onChange={e => setForm({ ...form, paidBy: e.target.value })}
        >
          <option value="">Select user</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>

        <br /><br />

        {/* Type */}
        <label><b>Expense Type</b></label><br />
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="personal">Personal</option>
          <option value="group">Group</option>
        </select>

        {/* GROUP FIELDS */}
        {type === "group" && (
          <>
            <br /><br />
            <label><b>Select Group</b></label><br />
            <select 
              className="input" 
              value={form.groupId}
              onChange={e => handleGroupSelect(e.target.value)}
            >
              <option value="">Select group</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>

            {/* SPLIT UI */}
            {selectedGroup && (
              <>
                <h3>Split Options</h3>
                <button className="btn" onClick={equalSplit}>Equal Split</button>

                <h4>Custom Split</h4>
                {selectedGroup.members.map(uid => (
                  <div key={uid} style={{ marginBottom: 8 }}>
                    {users.find(u => u.id === uid)?.name}:
                    <input
                      type="number"
                      className="input"
                      style={{ width: 120, marginLeft: 10 }}
                      value={form.split[uid] || ""}
                      onChange={(e) => updateCustomSplit(uid, e.target.value)}
                    />
                  </div>
                ))}

                <p style={{ color: "grey" }}>
                  Total Split: <b>
                    {Object.values(form.split).reduce((a, b) => a + b, 0)}
                  </b>
                </p>
                {Object.values(form.split).reduce((a, b) => a + b, 0) !== form.amount && (
                  <p style={{ color: "red" }}>⚠️ Split must equal total amount!</p>
                )}
              </>
            )}
          </>
        )}

        <br /><br />
        <button className="btn-primary" onClick={submit}>Update Expense</button>
        <button className="btn" onClick={() => navigate("/")} style={{ marginLeft: 10 }}>Cancel</button>
      </div>
    </div>
  );
}

