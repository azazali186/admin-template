import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";

export default function useAudit() {
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
    },
    {
      name: "created_at",
      label: "Date Time",
      required: true,
      field: (row) => date.formatDate(row.created_at, "YYYY-MM-DD HH:mm:ss"),
      align: "center",
      sortable: true,
    },
    {
      name: "user_id",
      label: "User",
      required: true,
      field: (row) =>
        (
          row?.user?.name ||
          row?.user?.display_name ||
          (row?.user?.last_name || "") + " " + (row?.user?.first_name || "") ||
          "N/A"
        ).toUpperCase(),
      align: "center",
      sortable: true,
    },
    {
      name: "event",
      label: "Action",
      required: true,
      field: (row) => row?.event?.toUpperCase(),
      align: "center",
      sortable: true,
    },
    {
      name: "auditable_type",
      label: "Model",
      required: true,
      field: (row) => {
        let arr = row.auditable_type?.split("\\");
        return arr[arr.length - 1];
      },
      align: "center",
      sortable: true,
    },
    {
      name: "new_values",
      label: "New Value",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: false,
    },
    {
      name: "ip_address",
      label: "IP Address",
      required: true,
      field: (row) => row.ip_address,
      align: "center",
      sortable: true,
    },
    {
      name: "user_agent",
      label: "Device Details",
      required: true,
      field: (row) => row.user_agent,
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
        `/audits/paginate?${parameter.slice(0, -1)}`,
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

  const auditModels = async () => {
    try {
      const response = await api.get("/audits/models", { headers: headers });
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  return {
    ...toRefs(state),
    columns,
    paginate,
    auditModels,
  };
}
