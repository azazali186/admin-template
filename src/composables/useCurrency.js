import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";

export default function useCurrency() {
  const state = reactive({
    loading: false,
    saving: false,
    deleting: false,
    items: [],
  });

  const columns = [
    {
      name: "sl",
      label: "#",
      required: true,
      field: (row) => row,
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
      name: "code",
      label: "Code",
      required: true,
      field: (row) => row.code,
      align: "center",
      sortable: true,
    },
    {
      name: "symbol",
      label: "Symbol",
      required: true,
      field: (row) => row.symbol,
      align: "center",
      sortable: true,
    },
    {
      name: "actions",
      label: "ACTIONS",
      required: true,
      field: (row) => row,
      align: "center",
    },
  ];

  const token = localStorage.getItem('bi-admin-token') ? localStorage.getItem('bi-admin-token') : state.token
  const headers = {};
  if (token) {
    headers.authorization = "Bearer " + token
  }

  const add = async (data) => {
    try {
      state.saving = true;
      await api.post("/currencies", data);
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
      await api.patch(`/currencies/${id}`, data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };

  const trash = async (id) => {
    try {
      state.deleting = true;
      await api.delete(`/currencies/${id}`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/currencies/${id}`);
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
    let parameter = Object.entries(params).map(([k, v]) => `${k}=${v}&`).join("")
    try {
      const response = await api.get(`/currencies/paginate?${parameter.slice(0, -1)}`, { headers: headers });
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
      const response = await api.get("/currencies/all");
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
    update,
    trash,
    get,
    paginate,
    all,
  };
}
