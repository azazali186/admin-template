import { reactive, toRefs, ref } from "vue";
import { api } from "../boot/axios";
import Utils from "../helpers/Utils";

export default function useConfiguration() {
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


  const paginate = async (props) => {
    state.loading = true;
    let params =
      props.filter !== undefined
        ? Object.assign(props.pagination, { ...props.filter })
        : props.pagination;
    let parameter = Object.entries(params).map(([k, v]) => `${k}=${v}&`).join("")
    try {
      const response = await api.get("/config/paginate", { params });
      state.items = response.data.data;
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  };

  // config/mlm-master

  const botSettings = async () => {
    state.loading = true;
    try {
      const response = await api.get("/config/bot-master");
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  }

  const addbotSettings = async (bot) => {
    state.loading = true;
    try {
      const response = await api.post("/config/bot-master", bot);
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  }

  const mlmGetConfiguration = async () => {
    state.loading = true;
    try {
      const response = await api.get("/config/mlm-master");
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  }

  const mlmAddConfiguration = async (mlm) => {
    state.loading = true;
    try {
      const response = await api.post("/config/mlm-master", mlm);
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  }


  const orderGetConfiguration = async () => {
    state.loading = true;
    try {
      const response = await api.get("/config/order-master");
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  }

  const orderAddConfiguration = async (order) => {
    state.loading = true;
    try {
      const response = await api.post("/config/order-master", order);
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  }


  const getPaymentConfiguration = async () => {
    state.loading = true;
    try {
      const response = await api.get("/config/payment-master");
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  }

  const addPaymentConfiguration = async (payment) => {
    state.loading = true;


    console.log('payment           ', payment)

    try {
      const response = await api.post("/config/payment-master", payment);
      state.loading = false;
      return response;
    } catch (err) {
      state.loading = false;
      //throw Error(Utils.getErrorMessage(err));
      throw Utils.getErrorMessage(err);
    }
  }



  return {
    ...toRefs(state),
    paginate,
    botSettings,
    addbotSettings,
    mlmGetConfiguration,
    mlmAddConfiguration,
    orderGetConfiguration,
    orderAddConfiguration,
    getPaymentConfiguration,
    addPaymentConfiguration
  };
}
