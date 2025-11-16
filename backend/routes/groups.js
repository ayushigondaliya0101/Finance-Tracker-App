const express = require("express");
const router = express.Router();
const groupsController = require("../controllers/groupsController");

// Routes
router.get("/", groupsController.getAllGroups);
router.post("/", groupsController.createGroup);
router.get("/:id", groupsController.getGroupById);
router.put("/:id", groupsController.updateGroup);
router.delete("/:id", groupsController.deleteGroup);

module.exports = router;

