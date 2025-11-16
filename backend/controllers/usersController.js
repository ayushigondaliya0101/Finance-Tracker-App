const { v4: uuid } = require("uuid");
const { readData, writeData } = require("../utils/dataUtils");

// Get all users
const getAllUsers = (req, res) => {
  try {
    const data = readData();
    res.json(data.users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Create a new user
const createUser = (req, res) => {
  try {
    const data = readData();
    const newUser = {
      id: uuid(),
      name: req.body.name,
    };
    data.users.push(newUser);
    writeData(data);
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Get user by ID
const getUserById = (req, res) => {
  try {
    const data = readData();
    const user = data.users.find(u => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Update user by ID
const updateUser = (req, res) => {
  try {
    const data = readData();
    const userIndex = data.users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    data.users[userIndex] = {
      ...data.users[userIndex],
      name: req.body.name || data.users[userIndex].name,
    };
    writeData(data);
    res.json(data.users[userIndex]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete user by ID
const deleteUser = (req, res) => {
  try {
    const data = readData();
    const userIndex = data.users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    const deletedUser = data.users.splice(userIndex, 1)[0];
    writeData(data);
    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};

