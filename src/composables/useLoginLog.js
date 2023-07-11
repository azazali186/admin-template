import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";

export default function useLoginLog() {
  const state = reactive({
    loading: false,
    saving: false,
    deleting: false,
    items: [],
  });
  const token = localStorage.getItem('bi-admin-token') ? localStorage.getItem('bi-admin-token') : state.token
  const headers = {};
  if (token) {
    headers.authorization = "Bearer " + token
  }

  const adminColumns = [
    {
      name: "sl",
      label: "#",
      required: true,
      field: (row) => row,
      align: "left",
    },
    {
      name: "created_at",
      label: "Login Time",
      required: true,
      field: (row) => date.formatDate(row.created_at, "YYYY-MM-DD HH:mm:ss"),
      align: "center",
      sortable: true,
    },
    {
      name: "user_id",
      label: "User",
      required: true,
      field: (row) => row?.user?.name?.toUpperCase(),
      align: "center",
      sortable: true,
    },

    {
      name: "role_id",
      label: "Role",
      required: true,
      field: (row) => row?.role_name?.toUpperCase(),
      align: "center",
      sortable: true,
    },
    {
      name: "ip_address",
      label: "Login IP",
      required: true,
      field: (row) => row.ip_address,
      align: "center",
      sortable: true,
    },
    {
      name: "user_agent",
      label: "Device",
      required: true,
      field: (row) => row.user_agent,
      align: "center",
      sortable: true,
    },
  ];

  const memberColumns = [
    {
      name: "sl",
      label: "#",
      required: true,
      field: (row) => row,
      align: "left",
    },
    {
      name: "created_at",
      label: "Login Time",
      required: true,
      field: (row) => date.formatDate(row.created_at, "YYYY-MM-DD HH:mm:ss"),
      align: "center",
      sortable: true,
    },

    {
      name: "user_id",
      label: "Member ID",
      required: true,
      field: (row) => row.user.member_ID,
      align: "center",
      sortable: true,
    },
    {
      name: "ip_address",
      label: "Login IP",
      required: true,
      field: (row) => row.ip_address,
      align: "center",
      sortable: true,
    },
    {
      name: "user_agent",
      label: "Device",
      required: true,
      field: (row) => row.user_agent,
      align: "center",
      sortable: true,
    },
  ];

  const paginateAdmins = async (props) => {
    state.loading = true;
    let params =
      props.filter !== undefined
        ? Object.assign(props.pagination, { ...props.filter })
        : props.pagination;
    let parameter = Object.entries(params).map(([k, v]) => `${k}=${v}&`).join("")
    try {
      const response = await api.get(`/login-logs/paginate/admins?${parameter.slice(0, -1)}`, { headers: headers });
      state.items = response.data.data;
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      throw Error(Utils.getErrorMessage(err));
    }
  };

  const paginateMembers = async (props) => {
    state.loading = true;
    let params =
      props.filter !== undefined
        ? Object.assign(props.pagination, { ...props.filter })
        : props.pagination;
    let parameter = Object.entries(params).map(([k, v]) => `${k}=${v}&`).join("")
    try {
      const response = await api.get("/login-logs/paginate/members", {
        params,
      });
      state.items = response.data.data;
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      throw Error(Utils.getErrorMessage(err));
    }
  };

  const auditModels = async () => {
    try {
      const response = await api.get("/login-logs/models");
      return response;
    } catch (err) {
      throw Error(Utils.getErrorMessage(err));
    }
  };

  return {
    ...toRefs(state),
    memberColumns,
    adminColumns,
    paginateAdmins,
    paginateMembers,
    auditModels,
  };
}
