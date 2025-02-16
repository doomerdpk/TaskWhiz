const heroSection = document.getElementById("hero-section");
const signupSection = document.getElementById("signup-section");
const signinSection = document.getElementById("signin-section");
const signupButton = document.getElementById("signup");
const signinButton = document.getElementById("signin");
const navbarButtons = document.getElementById("navbar-buttons");
const todosSection = document.getElementById("todos-section");

document.addEventListener("DOMContentLoaded", handleRoute);
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
    try {
      const response = await axios.get("http://localhost:3000/api/v1/todo/me", {
        headers: {
          Authorization: localStorage.getItem(token),
        },
      });
      console.log("A");
      signupButton.style.display = "none";
      signinButton.style.display = "none";
      console.log("B");
      const welcomeMessage = document.createElement("h3");
      welcomeMessage.innerHTML = "Welcome " + response.data.message;
      const logoutBtn = document.createElement("button");
      logoutBtn.innerHTML = "logOut";
      logoutBtn.setAttribute("onclick", "logOut()");
      document
        .getElementById("navbar-buttons")
        .append(welcomeMessage, logoutBtn);
      console.log("C");
      navigateTo("todos");
      todosSection.style.display = "flex";
      getTodos();
    } catch (error) {
      if (error.response && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    }
  }
}

function navigateTo(page) {
  location.hash = page;
}

function signupPage() {
  signupSection.style.display = "flex";
}

function signinPage() {
  signinSection.style.display = "flex";
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
    if (error.response && error.response.data.error) {
      alert(error.response.data.error);
    } else {
      alert("An unexpected error occurred. Please try again.");
    }
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

    signupButton.style.display = "none";
    signinButton.style.display = "none";

    const welcomeMessage = document.createElement("h3");
    welcomeMessage.innerHTML = "Welcome " + response.data.username;
    const logoutBtn = document.createElement("button");
    logoutBtn.innerHTML = "logOut";
    logoutBtn.setAttribute("onclick", "logOut()");
    document.getElementById("navbar-buttons").append(welcomeMessage, logoutBtn);

    navigateTo("todos");
    todosSection.style.display = "flex";
    getTodos();
  } catch (error) {
    if (error.response && error.response.data.error) {
      alert(error.response.data.error);
    } else {
      alert("An unexpected error occurred. Please try again.");
    }
  }
}

function logOut() {
  localStorage.removeItem("token");

  navbarButtons.innerHTML = `
    <button type="button" onclick="navigateTo('signup')">Signup</button>
    <button type="button" onclick="navigateTo('signin')">Login</button>
  `;

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

    if (typeof response.data.message === "string") {
      document.getElementById("todos-container").innerHTML =
        response.data.message;
    } else {
      document.getElementById("todos-container").innerHTML = "";
      const todos = response.data.message.sort((a, b) => a.id - b.id);
      for (let i = 0; i < todos.length; i++) {
        const title = todos[i].title;
        const id = todos[i].id;
        let todo = `<div class="todo"><span>${id}. ${title}</span><div><button onclick="deleteTodo(${id})">Delete</button>  <button onclick="updateTodo(${id})">Update</button></div></div>`;
        document.getElementById("todos-container").innerHTML += todo;
      }
    }
  } catch (error) {
    if (error.response && error.response.data.error) {
      alert(error.response.data.error);
    } else {
      alert("An unexpected error occurred. Please try again.");
    }
  }
}

async function createTodo() {
  try {
    const title = document.getElementById("title-create").value;
    const id = document.getElementById("id-create").value;
    await axios.post(
      "http://localhost:3000/api/v1/todo/create-todo",
      {
        title,
        id,
      },
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
    if (error.response && error.response.data.error) {
      alert(error.response.data.error);
    } else {
      alert("An unexpected error occurred. Please try again.");
    }
  }
}

async function updateTodo(id) {
  try {
    let title = prompt("Enter the title to update the todo:");

    await axios.put(
      "http://localhost:3000/api/v1/todo/update-todo/" + id,
      {
        title,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    getTodos();
  } catch (error) {
    if (error.response && error.response.data.error) {
      alert(error.response.data.error);
    } else {
      alert("An unexpected error occurred. Please try again.");
    }
  }
}

async function deleteTodo(id) {
  try {
    await axios.delete("http://localhost:3000/api/v1/todo/delete-todo/" + id, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
    getTodos();
  } catch (error) {
    if (error.response && error.response.data.error) {
      alert(error.response.data.error);
    } else {
      alert("An unexpected error occurred. Please try again.");
    }
  }
}
