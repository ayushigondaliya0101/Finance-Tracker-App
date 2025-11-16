const { v4: uuid } = require("uuid");
const { readData, writeData } = require("../utils/dataUtils");

// Get all expenses
const getAllExpenses = (req, res) => {
  try {
    const data = readData();
    res.json(data.expenses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

// Create a new expense
const createExpense = (req, res) => {
  try {
    const data = readData();
    const newExpense = {
      id: uuid(),
      date: req.body.date,
      amount: req.body.amount,
      description: req.body.description,
      category: req.body.category,
      type: req.body.type, // personal/group
      paidBy: req.body.paidBy,
      groupId: req.body.groupId || null,
      split: req.body.split || {},
    };
    data.expenses.push(newExpense);
    writeData(data);
    res.json(newExpense);
  } catch (error) {
    res.status(500).json({ error: "Failed to create expense" });
  }
};

// Get expense by ID
const getExpenseById = (req, res) => {
  try {
    const data = readData();
    const expense = data.expenses.find(e => e.id === req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch expense" });
  }
};

// Update expense by ID
const updateExpense = (req, res) => {
  try {
    const data = readData();
    const expenseIndex = data.expenses.findIndex(e => e.id === req.params.id);
    if (expenseIndex === -1) {
      return res.status(404).json({ error: "Expense not found" });
    }
    data.expenses[expenseIndex] = {
      ...data.expenses[expenseIndex],
      date: req.body.date || data.expenses[expenseIndex].date,
      amount: req.body.amount !== undefined ? req.body.amount : data.expenses[expenseIndex].amount,
      description: req.body.description || data.expenses[expenseIndex].description,
      category: req.body.category || data.expenses[expenseIndex].category,
      type: req.body.type || data.expenses[expenseIndex].type,
      paidBy: req.body.paidBy || data.expenses[expenseIndex].paidBy,
      groupId: req.body.groupId !== undefined ? req.body.groupId : data.expenses[expenseIndex].groupId,
      split: req.body.split || data.expenses[expenseIndex].split,
    };
    writeData(data);
    res.json(data.expenses[expenseIndex]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update expense" });
  }
};

// Delete expense by ID
const deleteExpense = (req, res) => {
  try {
    const data = readData();
    const expenseIndex = data.expenses.findIndex(e => e.id === req.params.id);
    if (expenseIndex === -1) {
      return res.status(404).json({ error: "Expense not found" });
    }
    const deletedExpense = data.expenses.splice(expenseIndex, 1)[0];
    writeData(data);
    res.json({ message: "Expense deleted successfully", expense: deletedExpense });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
};

module.exports = {
  getAllExpenses,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense
};

