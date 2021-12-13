const authButton = document.querySelector("#auth");
const API_BASE_URL = "https://alan-auth.herokuapp.com";
const LOCAL_STORAGE_AUTH_ITEM = "authEmail";

authButton.addEventListener("click", handleAuth);
function handleAuth() {
  const id = localStorage.getItem(LOCAL_STORAGE_AUTH_ITEM);

  if (!id) {
    // user attempting to login
    fetch(`${API_BASE_URL}/myLogin`, { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        const { user } = data;
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    // user attempting to logout
    // clear the localstorage and call our logout endpoint
    fetch(`${API_BASE_URL}/logout`).then((res) => {
      localStorage.removeItem(LOCAL_STORAGE_AUTH_ITEM);
    });
  }
}

// on load, check if user is authenticated
// when user is authenticated, store their email in our localstorage
// on load, check if there is an email in our localstorage
// if no email in our local storage, force user to login again
function checkAuth() {
  const id = localStorage.getItem(LOCAL_STORAGE_AUTH_ITEM);

  if (!id) {
    authButton.innerText = "Login";
  } else {
    authButton.innerText = "Logout";
  }
}
