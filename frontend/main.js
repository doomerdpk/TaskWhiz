const heroSection = document.getElementById("home-section");
const signupSection = document.getElementById("signup-section");
const signinSection = document.getElementById("signin-section");
const todosSection = document.getElementById("todos-section");
const navbarButtons = document.getElementById("navbar-buttons");

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (token) {
    updateNavbarForLoggedInUser();
    if (location.hash === "#todos") {
      handleRoute();
    }
  } else {
    handleRoute();
  }
});

window.addEventListener("hashchange", handleRoute);

async function handleRoute() {
  const routes = ["home", "signup", "signin", "todos"];
  let page = location.hash.replace("#", "") || "home";

  if (!routes.includes(page)) page = "home";

  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("hidden");
  });

  const targetSection = document.getElementById(`${page}-section`);
  if (targetSection) {
    targetSection.classList.remove("hidden");
  } else {
    console.error(`Section with id "${page}-section" not found.`);
  }

  if (page === "todos") {
    const savedTodos = JSON.parse(localStorage.getItem("todos"));
    if (savedTodos) {
      renderTodos(savedTodos);
    } else {
      getTodos();
    }
  }
}

function navigateTo(page) {
  location.hash = page;
}

function updateNavbarForLoggedInUser() {
  navbarButtons.innerHTML = "";

  const username = localStorage.getItem("username") || "User";
  const welcomeMessage = document.createElement("h3");
  welcomeMessage.innerHTML = "Welcome " + username;

  const logoutBtn = document.createElement("button");
  logoutBtn.innerHTML = "Log Out";
  logoutBtn.setAttribute("onclick", "logOut()");

  navbarButtons.append(welcomeMessage, logoutBtn);
}

async function signup() {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;

  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/user/signup",
      { username, password }
    );
    alert(response.data.message);
  } catch (error) {
    alert(
      error.response?.data?.error ||
        "An unexpected error occurred. Please try again."
    );
    return;
  }

  document.getElementById("signup-username").value = "";
  document.getElementById("signup-password").value = "";
}

async function signin() {
  const username = document.getElementById("signin-username").value;
  const password = document.getElementById("signin-password").value;

  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/user/signin",
      { username, password }
    );
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("username", response.data.username);

    updateNavbarForLoggedInUser();
    navigateTo("todos");
    getTodos();
  } catch (error) {
    alert(
      error.response?.data?.error ||
        "An unexpected error occurred. Please try again."
    );
  }
}

function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("todos");

  navbarButtons.innerHTML = "";

  const signupBtn = document.createElement("button");
  signupBtn.id = "signup";
  signupBtn.innerText = "Signup";
  signupBtn.type = "button";
  signupBtn.onclick = () => navigateTo("signup");

  const signinBtn = document.createElement("button");
  signinBtn.id = "signin";
  signinBtn.innerText = "Login";
  signinBtn.type = "button";
  signinBtn.onclick = () => navigateTo("signin");

  navbarButtons.append(signupBtn, signinBtn);

  navigateTo("home");
}

async function getTodos() {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/v1/todo/view-todos",
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    let todos;
    if (typeof response.data.message === "string") {
      todos = response.data.message;
    } else {
      todos = response.data.message.sort((a, b) => a.id - b.id);
    }

    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos(todos);
  } catch (error) {
    alert(
      error.response?.data?.error ||
        "An unexpected error occurred. Please try again."
    );
  }
}

function renderTodos(todos) {
  const todosContainer = document.getElementById("todos-container");
  todosContainer.innerHTML = "";

  if (typeof todos === "string") {
    todosContainer.innerHTML = todos;
  } else {
    todos.forEach(({ id, title }) => {
      let todo = `<div class="todo">
          <span>${id}. ${title}</span>
          <div>
            <button onclick="deleteTodo(${id})">Delete</button>
            <button onclick="updateTodo(${id})">Update</button>
          </div>
        </div>`;
      todosContainer.innerHTML += todo;
    });
  }
}

async function createTodo() {
  try {
    const title = document.getElementById("title-create").value;
    const id = document.getElementById("id-create").value;
    await axios.post(
      "http://localhost:3000/api/v1/todo/create-todo",
      { title, id },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    getTodos();
    document.getElementById("title-create").value = "";
    document.getElementById("id-create").value = "";
  } catch (error) {
    alert(
      error.response?.data?.error ||
        "An unexpected error occurred. Please try again."
    );
  }
}

async function updateTodo(id) {
  try {
    let title = prompt("Enter the title to update the todo:");
    if (!title || title.trim() === "") return;

    await axios.put(
      `http://localhost:3000/api/v1/todo/update-todo/${id}`,
      { title },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    getTodos();
  } catch (error) {
    alert(
      error.response?.data?.error ||
        "An unexpected error occurred. Please try again."
    );
  }
}

async function deleteTodo(id) {
  try {
    await axios.delete(`http://localhost:3000/api/v1/todo/delete-todo/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    getTodos();
  } catch (error) {
    alert(
      error.response?.data?.error ||
        "An unexpected error occurred. Please try again."
    );
  }
}
