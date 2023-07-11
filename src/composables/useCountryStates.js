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
      name: "country_name",
      label: "COUNTRY NAME",
      required: true,
      field: (row) => row.country?.name,
      align: "left",
      sortable: false,
    },
    {
      name: "state_name",
      label: "STATE NAME",
      required: true,
      field: (row) => row.state_name,
      align: "center",
      sortable: true,
    },
    // {
    //   name: "state_code",
    //   label: "STATE CODE",
    //   required: true,
    //   field: (row) => row.state_code,
    //   align: "center",
    //   sortable: true,
    // },
    {
      name: "status",
      label: "status",
      required: true,
      field: (row) => row,
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
      await api.post("/states", data);
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
      await api.patch(`/states/${id}`, data);
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
      await api.delete(`/states/${id}`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/states/${id}`);
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const getByCountryId = async (id) => {
    try {
      const response = await api.get(`/country-state/${id}`);
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
      const response = await api.get(`/states/paginate?${parameter.slice(0, -1)}`, { headers: headers });
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
      const response = await api.get("/states/all");
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
    getByCountryId
  };
}
