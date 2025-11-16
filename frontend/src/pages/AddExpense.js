import { useState, useEffect } from "react";
import axios from "axios";
import SimpleInput from "../components/SimpleInput";
import SuccessMessage from "../components/SuccessMessage";


export default function AddExpense() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [type, setType] = useState("personal");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    date: "",
    amount: "",
    description: "",
    category: "",
    paidBy: "",
    groupId: "",
    split: {}
  });

  useEffect(() => {
    axios.get("http://localhost:5000/users").then(res => setUsers(res.data));
    axios.get("http://localhost:5000/groups").then(res => setGroups(res.data));
  }, []);

  function handleGroupSelect(groupId) {
    setForm({ ...form, groupId });

    const group = groups.find(g => g.id === groupId);
    setSelectedGroup(group);
  }

  /* -------------------- Equal Split ----------------------- */
  function equalSplit() {
    if (!selectedGroup) return;

    const perHead = parseFloat(form.amount) / selectedGroup.members.length;

    const splitObj = {};
    selectedGroup.members.forEach(uid => {
      splitObj[uid] = parseFloat(perHead.toFixed(2));
    });

    setForm({ ...form, split: splitObj });
  }

  /* -------------------- Custom Split ----------------------- */
  function updateCustomSplit(userId, value) {
    setForm({
      ...form,
      split: {
        ...form.split,
        [userId]: Number(value)
      }
    });
  }

  /* -------------------- Submit ----------------------- */
  function submit() {
    axios.post("http://localhost:5000/expenses", form)
      .then(() => {
        setSuccess("Expense added successfully!");
        setForm({
          date: "",
          amount: "",
          description: "",
          category: "",
          paidBy: "",
          groupId: "",
          split: {}
        });
      });
  }  

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <SuccessMessage message={success} />

      <h2>Add Expense</h2>

      <div className="card">
        <SimpleInput
          label="Date"
          type="date"
          onChange={e => setForm({ ...form, date: e.target.value })}
        />

        <SimpleInput
          label="Amount"
          type="number"
          onChange={e => setForm({ ...form, amount: Number(e.target.value) })}
        />

        <SimpleInput
          label="Description"
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

        {/* Custom category input box */}
        {form.category === "Other" && (
          <>
            <br /><br />
            <SimpleInput
              label="Enter custom category"
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </>
        )}

        {/* Paid By */}
        <label><b>Paid By</b></label><br />
        <select
          className="input"
          onChange={e => setForm({ ...form, paidBy: e.target.value })}
        >
          <option>Select user</option>
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
            <select className="input" onChange={e => handleGroupSelect(e.target.value)}>
              <option>Select group</option>
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

                {/* Total Check */}
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
        <button className="btn-primary" onClick={submit}>Save Expense</button>
      </div>
    </div>
  );
}
