import { reactive, readonly } from "vue";
import { api } from "../../boot/axios";
import { useRouter } from "vue-router";

const router = useRouter();

const state = reactive({
  loggedIn: false,
  user: null,
  token: null,
  roles: [],
  permissions: [],
  languages: [],
});

function setAuth(data) {
  state.loggedIn = true;
  state.user = data.user;
  state.token = data.token;
  state.user.roles = data?.roles || [];
  state.user.permissions = data.permissions?.map((p) => p.name) || [];
  localStorage.setItem('bi-admin-token', data.token)
}

const token = localStorage.getItem('bi-admin-token') ? localStorage.getItem('bi-admin-token') : state.token
const headers = {};
if (token) {
  headers.authorization = "Bearer " + token
}

async function checkAuth() {
  try {
    const response = await api.get("/auth/user", { headers: headers });
    setAuth(response.data);
    // router.push("/");
    // loading.value = false;
  } catch (err) {
    await logout();
    console.log(err)
  }
}

async function logout() {
  try {
    state.loggedIn = false;
    state.user = null;
    state.token = null;
    localStorage.removeItem('bi-admin-token')
    await api.post("/user/logout");
  } catch (err) {
    // Force redirect
    window.location = "/#/auth/login";
  }
}

export default {
  state: readonly(state),
  setAuth,
  checkAuth,
  logout,
};
