const express = require("express");
const cors = require("cors");

// Import routes
const usersRoutes = require("./routes/users");
const groupsRoutes = require("./routes/groups");
const expensesRoutes = require("./routes/expenses");
const summaryRoutes = require("./routes/summary");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", usersRoutes);
app.use("/groups", groupsRoutes);
app.use("/expenses", expensesRoutes);
app.use("/summary", summaryRoutes);

// Server
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
