import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";

export default function useCity() {
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
      field: (row) => row?.state?.state_name,
      align: "center",
      sortable: true,
    },
    // {
    //   name: "city_code",
    //   label: "city code",
    //   required: true,
    //   field: (row) => row?.city_code,
    //   align: "center",
    //   sortable: true,
    // },
    {
      name: "city_name",
      label: "CITY NAME",
      required: true,
      field: (row) => row?.city_name,
      align: "center",
      sortable: true,
    },
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

  const token = localStorage.getItem("template-admin-token")
    ? localStorage.getItem("template-admin-token")
    : state.token;
  const headers = {};
  if (token) {
    headers.authorization = "Bearer " + token;
  }

  const add = async (data) => {
    try {
      state.saving = true;
      await api.post("/cities", data, { headers: headers });
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
      await api.patch(`/cities/${id}`, data, { headers: headers });
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
      await api.delete(`/cities/${id}`, { headers: headers });
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/cities/${id}`, { headers: headers });
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
      const response = await api.get(
        `/cities/paginate?${parameter.slice(0, -1)}`,
        { headers: headers }
      );
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
      const response = await api.get("/cities/all", { headers: headers });
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
