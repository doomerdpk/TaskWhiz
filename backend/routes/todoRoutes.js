const express = require("express");
const { readFile, writeFile } = require("../utils/fileUtils");
const path = require("path");
const auth = require("../middlewares/Auth");

const router = express.Router();

router.use(auth);

const getUserFilePath = (username) =>
  path.resolve(__dirname, `../../data/usersData/${username}.json`);

router.get("/view-todos", async (req, res) => {
  try {
    if (!req.username) {
      return res
        .status(401)
        .json({ error: "Unauthorized access. Please log in." });
    }

    const userPath = getUserFilePath(req.username);

    const data = await readFile(userPath);
    const todos = JSON.parse(data);

    if (todos.length === 0) {
      return res.status(200).json({
        message: "Empty list!",
      });
    }

    res.status(200).json({
      message: todos,
    });
  } catch (err) {
    console.error("Error Occured!", err);
    res.status(500).json({
      error: "Error while Fetching Todos!",
    });
  }
});

router.post("/create-todo", async (req, res) => {
  try {
    if (!req.username) {
      return res
        .status(401)
        .json({ error: "Unauthorized access. Please log in." });
    }

    const title = req.body.title;
    const id = req.body.id;

    if (!title || !title.trim() || !id) {
      return res.status(400).json({
        error:
          "Please provide a valid title and a valid id to create the todo!",
      });
    }

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        error: "Invalid id!...id must be a number",
      });
    }

    const userPath = getUserFilePath(req.username);

    const data = await readFile(userPath);
    const todos = JSON.parse(data);

    const todoexist = todos.some((todo) => todo.id === id);

    if (!todoexist) {
      todos.push({
        title,
        id,
      });

      const todosData = JSON.stringify(todos, null, 2);
      await writeFile(userPath, todosData);
      res.status(201).json({
        message: `Successfully create a todo with title ${title}`,
      });
    } else {
      res.status(409).json({
        error: `Todo with id ${id} already exists, Please select another id!`,
      });
    }
  } catch (err) {
    console.error("Error occured:", err);
    res.status(500).json({
      error: "Error while creating todo!",
    });
  }
});

router.put("/update-todo/:id", async (req, res) => {
  try {
    if (!req.username) {
      return res
        .status(401)
        .json({ error: "Unauthorized access. Please log in." });
    }

    const title = req.body.title;
    const todoId = parseInt(req.params.id);

    if (!title || !title.trim()) {
      return res.status(400).json({
        error: "Please provide a valid title update the todo!",
      });
    }

    const userPath = getUserFilePath(req.username);

    const data = await readFile(userPath);
    const todos = JSON.parse(data);

    const todoIndex = todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex >= 0) {
      todos[todoIndex].title = title;
      const todosData = JSON.stringify(todos, null, 2);
      await writeFile(userPath, todosData);
      res.status(200).json({
        message: `Successfully updated the todo with id ${todoId}`,
      });
    } else {
      res.status(404).json({
        error: `Todo with id ${todoId} is not present in the list!`,
      });
    }
  } catch (err) {
    console.error("Error Occured!", err);
    res.status(500).json({
      error: "Error while updating todo!",
    });
  }
});

router.delete("/delete-todo/:id", async (req, res) => {
  try {
    if (!req.username) {
      return res
        .status(401)
        .json({ error: "Unauthorized access. Please log in." });
    }

    const todoId = parseInt(req.params.id);

    const userPath = getUserFilePath(req.username);

    const data = await readFile(userPath);
    const todos = JSON.parse(data);

    const todoIndex = todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex < 0) {
      return res.status(404).json({
        error: `Todo with id ${todoId} does not exist in the list!`,
      });
    } else {
      todos.splice(todoIndex, 1);
      const todosData = JSON.stringify(todos, null, 2);
      await writeFile(userPath, todosData);
      res.status(200).json({
        message: `Todo with id ${todoId} deleted successfully!`,
      });
    }
  } catch (err) {
    console.error("Error Occured:", err);
    res.status(500).json({
      error: "Error while deleting todo!",
    });
  }
});

module.exports = router;
