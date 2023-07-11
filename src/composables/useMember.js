import { reactive, toRefs, ref } from "vue";
import { date } from "quasar";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";

export default function useMember() {
  const state = reactive({
    loading: false,
    saving: false,
    deleting: false,
    items: [],
    totalAmounts: {},
    totalWalletAmounts: {},
    totalBetAmounts: {},
    totalWinAmounts: {},

  });
  const token = localStorage.getItem('bi-admin-token') ? localStorage.getItem('bi-admin-token') : state.token
  const headers = {};
  if (token) {
    headers.authorization = "Bearer " + token
  }

  const columns = [
    // {
    //   name: "sl",
    //   label: "#",
    //   required: true,
    //   field: (row) => row,
    //   align: "left",
    //   sortable: false,
    // },
    {
      name: "member_ID",
      label: "MEMBER ID",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: true,
    },
    {
      name: "phone_number",
      label: "PHONE NUMBER",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: true,
    },
    {
      name: "amount",
      label: "Wallet Amount",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: true,
    },

    {
      name: "bet_amount",
      label: "Bet Amount",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: true,
    },


    {
      name: "win_loss",
      label: "Win Loss",
      required: true,
      field: (row) => row,
      align: "center",
      sortable: true,
    },
    {
      name: "registration_time",
      label: "Registration Time",
      required: true,
      field: (row) => date.formatDate(row.created_at, "YYYY-MM-DD HH:mm:ss"),
      align: "center",
      sortable: true,
    },
    {
      name: "last_login_time",
      label: "Last Login Time",
      required: true,
      field: (row) => date.formatDate(row.updated_at, "YYYY-MM-DD HH:mm:ss"),
      align: "center",
      sortable: true,
    },
    // {
    //   name: "first_name",
    //   label: "NAME",
    //   required: true,
    //   field: (row) => row,
    //   align: "left",
    //   sortable: true,
    // },
    // {
    //   name: "password",
    //   label: "Password",
    //   required: true,
    //   field: (row) => row,
    //   align: "left",
    //   sortable: true,
    // },
    // {
    //   name: "confirm password",
    //   label: "Confirm Password",
    //   required: true,
    //   field: (row) => row,
    //   align: "left",
    //   sortable: true,
    // },
    // {
    //   name: "display_name",
    //   label: "DISPLAY NAME",
    //   required: true,
    //   field: (row) => row,
    //   align: "left",
    //   sortable: true,
    // },
    // {
    //   name: "email",
    //   label: "EMAIL",
    //   required: true,
    //   field: (row) => row,
    //   align: "left",
    //   sortable: true,
    // },
    // {
    //   name: "referral_code",
    //   label: " REFERRAL CODE",
    //   required: true,
    //   field: (row) => row,
    //   align: "left",
    //   sortable: true,
    // },
    // {
    //   name: "parent_referral_code",
    //   label: "PARENT REFERRAL CODE",
    //   required: true,
    //   field: (row) => row,
    //   align: "left",
    //   sortable: true,
    // },

    {
      name: "status",
      label: "status",
      required: true,
      field: (row) => row,
      align: "center",
    },

    {
      bottomColumns: function () {
        var retVal = []
        for (let i = 0; i < this.columns.length; i++) {
          var isVisible = false
          for (let j = 0; j < this.visibleColumns.length; j++) {
            if (this.visibleColumns[j] === this.columns[i].name) {
              isVisible = true
              break
            }
          }
          if (isVisible) {
            if (this.columns[i].sums) {
              // need to calculate sum, wonder how
              retVal.push({ name: this.columns[i].name, text: ' the sum of ' + this.columns[i].name })
            } else {
              retVal.push({ name: this.columns[i].name, text: '' })
            }
          }
        }
        return retVal
      }

    },

    // {
    //   name: "actions",
    //   label: "ACTIONS",
    //   required: true,
    //   field: (row) => row,
    //   align: "center",
    // },
  ];

  const add = async (data) => {
    try {
      state.saving = true;
      await api.post("/members", data);
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
      await api.patch(`/members/${id}`, data);
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
      await api.delete(`/members/${id}`);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.deleting = false;
    }
  };

  const get = async (id) => {
    try {
      const response = await api.get(`/members/${id}`);
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
      const response = await api.get(`/members/paginate?${parameter.slice(0, -1)}`, { headers: headers });
      state.items = response.data.data.data;
      state.loading = false;
      // state.totalAmounts = response.data.totalAmounts;
      console.log('response.data.data    ', response.data.total_values);
      state.totalWalletAmounts = response.data.total_values.total_wallet_amount;
      state.totalBetAmounts = response.data.total_values.total_bet_amount;
      state.totalWinAmounts = response.data.total_values.total_win_loss_amount;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const all = async () => {
    try {
      const response = await api.get("/members/all");
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const getAllLevel = async () => {
    try {
      const response = await api.get("/members/all");
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const updatePassword = async (id, data) => {
    try {
      state.saving = true;
      return await api.post(`/customers/set-new-password/${id}`, data);
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    } finally {
      state.saving = false;
    }
  };



  const paginateBot = async (props) => {
    state.loading = true;
    let params =
      props.filter !== undefined
        ? Object.assign(props.pagination, { ...props.filter })
        : props.pagination;
    let parameter = Object.entries(params).map(([k, v]) => `${k}=${v}&`).join("")
    try {
      const response = await api.get("/bots/paginate", { params });
      state.items = response.data.data;
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const allBot = async () => {
    try {
      const response = await api.get("/bots/all");
      return response;
    } catch (err) {
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  const addBotCount = async (data) => {
    try {
      const response = await api.post("/customers/create-bot-customer", data);
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
    updatePassword,
    paginateBot,
    allBot,
    getAllLevel,
    addBotCount
  };
}
