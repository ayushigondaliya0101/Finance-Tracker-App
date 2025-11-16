const express = require("express");
const router = express.Router();
const expensesController = require("../controllers/expensesController");

// Routes
router.get("/", expensesController.getAllExpenses);
router.post("/", expensesController.createExpense);
router.get("/:id", expensesController.getExpenseById);
router.put("/:id", expensesController.updateExpense);
router.delete("/:id", expensesController.deleteExpense);

module.exports = router;

