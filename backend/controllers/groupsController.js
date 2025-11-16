const { v4: uuid } = require("uuid");
const { readData, writeData } = require("../utils/dataUtils");

// Get all groups
const getAllGroups = (req, res) => {
  try {
    const data = readData();
    res.json(data.groups);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
};

// Create a new group
const createGroup = (req, res) => {
  try {
    const data = readData();
    const newGroup = {
      id: uuid(),
      name: req.body.name,
      members: req.body.members || [], // array of userIds
    };
    data.groups.push(newGroup);
    writeData(data);
    res.json(newGroup);
  } catch (error) {
    res.status(500).json({ error: "Failed to create group" });
  }
};

// Get group by ID
const getGroupById = (req, res) => {
  try {
    const data = readData();
    const group = data.groups.find(g => g.id === req.params.id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch group" });
  }
};

// Update group by ID
const updateGroup = (req, res) => {
  try {
    const data = readData();
    const groupIndex = data.groups.findIndex(g => g.id === req.params.id);
    if (groupIndex === -1) {
      return res.status(404).json({ error: "Group not found" });
    }
    data.groups[groupIndex] = {
      ...data.groups[groupIndex],
      name: req.body.name || data.groups[groupIndex].name,
      members: req.body.members || data.groups[groupIndex].members,
    };
    writeData(data);
    res.json(data.groups[groupIndex]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update group" });
  }
};

// Delete group by ID
const deleteGroup = (req, res) => {
  try {
    const data = readData();
    const groupIndex = data.groups.findIndex(g => g.id === req.params.id);
    if (groupIndex === -1) {
      return res.status(404).json({ error: "Group not found" });
    }
    const deletedGroup = data.groups.splice(groupIndex, 1)[0];
    writeData(data);
    res.json({ message: "Group deleted successfully", group: deletedGroup });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete group" });
  }
};

module.exports = {
  getAllGroups,
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup
};

