import { reactive, toRefs } from "vue";
import Utils from "../helpers/Utils";
import { api } from "../boot/axios";
import { date } from "quasar";

export default function useUser() {
  const state = reactive({
    loading: false,
    saving: false,
    deleting: false,
    items: [],
  });
  const token = localStorage.getItem("template-admin-token")
    ? localStorage.getItem("template-admin-token")
    : state.token;
  const headers = {};
  if (token) {
    headers.authorization = "Bearer " + token;
  }

  const columns = [
    {
      name: "sl",
      label: "#",
      required: true,
      field: (row) => row.id,
      align: "left",
      sortable: false,
    },
    {
      name: "name",
      label: "NAME",
      required: true,
      field: (row) => row.name,
      align: "center",
      sortable: true,
    },
    {
      name: "email",
      label: "EMAIL",
      required: true,
      field: (row) => row.email,
      align: "center",
      sortable: true,
    },
    {
      name: "roles.name",
      label: "Roles",
      required: true,
      field: (row) => row?.roleName?.toUpperCase(),
      align: "center",
      sortable: true,
    },
    {
      name: "created_at",
      label: "CREATED AT",
      required: true,
      field: (row) => date.formatDate(row.createdAt, "YYYY-MM-DD HH:mm:ss"),
      align: "center",
      sortable: true,
    },
    {
      name: "enable_ga",
      label: "google authenticator",
      required: false,
      field: (row) => row,
      align: "center",
      sortable: false,
    },
    {
      name: "actions",
      label: "ACTIONS",
      required: true,
      field: (row) => row,
      align: "center",
    },
  ];

  const add = async (data) => {
    try {
      state.saving = true;
      await api.post("/users", data, { headers: headers });
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const update = async (id, data) => {
    try {
      state.saving = true;
      await api.patch(`/users/${id}`, data, { headers: headers });
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const trash = async (id, params = "") => {
    try {
      state.deleting = true;
      await api.delete(`/users/${id}?${params}`, { headers: headers });
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const resetPassword = async (data) => {
    try {
      state.saving = true;
      await api.post(`/users/reset-password`, data, { headers: headers });
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const updatePassword = async (id, data) => {
    try {
      state.saving = true;
      return await api.post(`/users-password/${id}`, data, {
        headers: headers,
      });
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const get = async (id) => {
    try {
      state.loading = true;
      await api.get(`/users/${id}`, { headers: headers });
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.loading = false;
    }
  };
  const isDeteteAble = async (id) => {
    try {
      const response = await api.get(`/users/${id}`, { headers: headers });
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };
  const paginate = async (props) => {
    state.loading = true;
    let params =
      props.filter !== undefined
        ? Object.assign(props.pagination, { ...props.filter })
        : props.pagination;
    let parameter = Object.entries(params)
      .map(([k, v]) => `${k}=${v}&`)
      .join("");
    try {
      const response = await api.get(`/users?${parameter.slice(0, -1)}`, {
        headers: headers,
      });

      console.log("response    ", response.data);

      state.items = response.data.data;
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const all = async () => {
    try {
      const response = await api.get(`/users?${parameter.slice(0, -1)}`, {
        headers: headers,
      });
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const verifyUser2FA = async (data) => {
    try {
      const response = await api.post("/auth/2fa/verify-user", data, {
        headers: headers,
      });
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const verifyCode = async (data) => {
    try {
      const response = await api.post("/auth/2fa/verify-code", data, {
        headers: headers,
      });
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const enableGa = async (data) => {
    try {
      const response = await api.post("/auth/2fa/enable-ga", data, {
        headers: headers,
      });
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  return {
    ...toRefs(state),
    columns,
    add,
    get,
    update,
    trash,
    paginate,
    resetPassword,
    updatePassword,
    isDeteteAble,
    all,
    verifyUser2FA,
    verifyCode,
    enableGa,
  };
}
