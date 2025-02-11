const express = require("express");
const { readFile, writeFile } = require("../utils/fileUtils");
const path = require("path");
const auth = require("../middlewares/Auth");
const { timeEnd } = require("console");

const router = express.Router();

router.use(auth);

router.get("/view-todos", async (req, res) => {
  try {
    const userPath = path.join(
      __dirname,
      "../../data/usersData/" + req.username + ".json"
    );

    const data = await readFile(userPath);
    const todos = JSON.parse(data);

    if (todos.length === 0) {
      res.status(200).json({
        message: "Empty list!",
      });
      return;
    }

    res.status(200).json({
      message: todos,
    });
  } catch (err) {
    console.error("Error Occured!", err);
    res.status(500).json({
      error: "Unexpected error occured....",
    });
  }
});

router.post("/create-todo", async (req, res) => {
  try {
    const title = req.body.title;
    const id = req.body.id;

    if (!req.body.title || !req.body.id) {
      res.status(400).json({
        error:
          "Please provide a valid title and a valid id to create the todo!",
      });
      return;
    }

    if (isNaN(parseInt(id))) {
      res.status(400).json({
        error: "Invalid id!...id must be a number",
      });
      return;
    }

    const userPath = path.join(
      __dirname,
      "../../data/usersData/" + req.username + ".json"
    );

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
      error: "Unexpected Error Occured..",
    });
  }
});

router.put("/update-todo/:id", async (req, res) => {
  try {
    const title = req.body.title;

    if (!title) {
      res.status(400).json({
        error: "Please provide a valid title to update the todo!",
      });
      return;
    }

    const userPath = path.join(
      __dirname,
      "../../data/usersData/" + req.username + ".json"
    );

    const data = await readFile(userPath);
    const todos = JSON.parse(data);
    const todoId = parseInt(req.params.id);
    const todoIndex = todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex >= 0) {
      todos[todoIndex].title = title;
      const todosData = JSON.stringify(todos, null, 2);
      await writeFile(userPath, todosData);
      res.status(200).json({
        message: `Successfully updated the todo with id ${todoId}`,
      });
    } else {
      res.status(400).json({
        error: `Todo with id ${todoId} is not present in the list!`,
      });
    }
  } catch (err) {
    console.error("Error Occured!", err);
    res.status(500).json({
      error: "Unexpected Error Occured..",
    });
  }
});

router.delete("/delete-todo/:id", async (req, res) => {
  try {
    const userPath = path.join(
      __dirname,
      "../../data/usersData/" + req.username + ".json"
    );

    const data = await readFile(userPath);
    const todos = JSON.parse(data);
    const todoId = parseInt(req.params.id);

    const todoIndex = todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex < 0) {
      res.status(400).json({
        error: `Todo with id ${todoId} does not exist in the list!`,
      });
      return;
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
      error: "Unexpected Error Occured..",
    });
  }
});

module.exports = router;
