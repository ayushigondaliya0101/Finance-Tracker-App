const express = require("express");
const router = express.Router();
const summaryController = require("../controllers/summaryController");

// Routes
router.get("/:year/:month", summaryController.getMonthlySummary);

module.exports = router;

