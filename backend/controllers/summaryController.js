const { readData } = require("../utils/dataUtils");

// Get monthly summary
const getMonthlySummary = (req, res) => {
  try {
    const year = req.params.year;
    const month = req.params.month;

    const data = readData();

    const expenses = data.expenses.filter(exp => {
      const date = new Date(exp.date);
      return (
        date.getFullYear() == year &&
        date.getMonth() + 1 == month
      );
    });

    // PERSONAL TOTAL
    const personalTotal = expenses
      .filter(e => e.type === "personal" || e.type === "Personal")
      .reduce((sum, e) => sum + Number(e.amount), 0);

    // CATEGORY BREAKDOWN
    const categoryBreak = {};
    expenses.forEach(e => {
      if (!categoryBreak[e.category]) categoryBreak[e.category] = 0;
      categoryBreak[e.category] += Number(e.amount);
    });

    // GROUP SUMMARY — who owes whom
    const balances = {}; // { userId: +amount or -amount }

    expenses
      .filter(e => e.type === "group")
      .forEach(e => {
        const payer = e.paidBy;

        Object.entries(e.split).forEach(([userId, amt]) => {
          if (!balances[userId]) balances[userId] = 0;
          if (!balances[payer]) balances[payer] = 0;

          balances[userId] -= amt;   // this user owes
          balances[payer] += amt;    // payer should receive
        });
      });

    res.json({
      personalTotal,
      categoryBreak,
      balances
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch summary" });
  }
};

module.exports = {
  getMonthlySummary
};

