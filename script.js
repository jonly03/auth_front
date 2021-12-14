const authButton = document.querySelector("#auth");
const API_BASE_URL = "https://alan-auth.herokuapp.com";
const LOCAL_STORAGE_AUTH_ITEM = "authEmail";
const LOGIN_TEXT = "Login";
const LOGOUT_TEXT = "Logout";
const PLACEHOLDER_PROFILE_PHOTO =
  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

authButton.addEventListener("click", handleAuth);
function handleAuth() {
  const email = localStorage.getItem(LOCAL_STORAGE_AUTH_ITEM);

  if (email === null) {
    window.location =
      "https://dev-v8yhc0o7.us.auth0.com/authorize?response_type=token&scope=openid profile email&client_id=tM4rxIGpbjNLFjuWxNcojBsOCy1hIQzP&redirect_uri=https://www.nellysugu.com/auth_front/";
  } else {
    // user attempting to logout
    // clear the localstorage and call our logout endpoint
    fetch(`${API_BASE_URL}/logout`).then((res) => {
      localStorage.removeItem(LOCAL_STORAGE_AUTH_ITEM);
      toggleAuthButton();
    });
  }
}

function toggleAuthButton() {
  const authButton = document.getElementById("auth");
  if (authButton.innerText === LOGIN_TEXT) {
    authButton.innerText = LOGOUT_TEXT;
  } else {
    authButton.innerText = LOGIN_TEXT;
  }
}

// on load, check user is authenticated
// we are authenticated when the user got to from a url with an accesstoken
// grab the access token, send it to our backend to get the user profile
// when we get the userProfile, store the email in our localstorage
checkAuth();
function checkAuth() {
  const url = window.location.href;
  if (!url.includes("#access_token")) {
    // not authenticate
    // check if there is an email in our localstorage
    const email = localStorage.getItem(LOCAL_STORAGE_AUTH_ITEM);
    const authButton = document.getElementById("auth");

    if (email && authButton.innerText === LOGIN_TEXT) {
      authButton.innerText = LOGOUT_TEXT;
    } else if (!email && authButton.innerText === LOGOUT_TEXT) {
      authButton.innerText = LOGIN_TEXT;
    }

    return;
  }

  const startIdx = url.indexOf("=") + 1;
  const endIdx = url.indexOf("&");
  const access_token = url.substring(startIdx, endIdx);

  fetch(`${API_BASE_URL}/userinfo?accessToken=${access_token}`)
    .then((res) => res.json())
    .then((data) => {
      const { email, name, picture } = data;

      if (email) {
        localStorage.setItem(LOCAL_STORAGE_AUTH_ITEM, email);

        toggleAuthButton();

        document.getElementById("greeting").innerHTML = `
            <img src=${
              picture ? picture : PLACEHOLDER_PROFILE_PHOTO
            } class="profile_pic"/>
            <span>Welcome back${name ? "," : ""} ${name ? name : ""}</span>
            `;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
