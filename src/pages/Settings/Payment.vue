<template>
  <q-card style="margin-left: 0px; box-shadow: none; min-height: 85vh">
      <div class="row py-2">
        <div class="col-12 col-md-5 q-pr-md"></div>
        <div class="col-12 col-md-7 q-pr-md">
          <q-toolbar-title>
            {{ $t(Utils.getKey("Global Payment Settings")) }}
          </q-toolbar-title>
        </div>
      </div>
    <q-separator />
    <q-card-section class="pt-0">
      <div class="row">
        <div class="col-12 col-md-5 q-pr-md">
          <q-toolbar class="pl-0 text-theme">
            <q-toolbar-title>
              {{ $t(Utils.getKey("Wallets Configurations")) }}
            </q-toolbar-title>
          </q-toolbar>
        </div>
        <div class="col-12 col-md-7 q-pr-md">
          <q-toolbar class="pl-0 text-theme">
            <q-toolbar-title>
              {{ $t(Utils.getKey("Payment Gateways Configurations")) }}
            </q-toolbar-title>
          </q-toolbar>
        </div>
      </div>

      <q-separator />

      <div class="row q-pt-none">
        <div class="col-12 col-md-6 q-pr-md">
          <div class="row">
            <div class="col-12 col-md-6 q-pr-md">
              <div v-for="wallet in walletData" :key="wallet.code">
                <q-toggle v-model="wallet.status" size="lg" icon="mdi-wallet" />
                <span class="text-bold">
                  {{ wallet.code }} {{ wallet.name }}
                  {{ $t(Utils.getKey("wallet payment")) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 q-pr-md">
          <div class="row">
            <div class="col-12 col-md-6 q-pr-md">
              <div v-for="wallet in paymentData" :key="wallet.name">
                <q-toggle
                  v-model="wallet.status"
                  size="lg"
                  icon="mdi-currency-usd"
                />
                <span class="text-bold">
                  {{ wallet.code }} {{ wallet.name }}
                  {{ $t(Utils.getKey("payment Gateway")) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="text-left q-mt-md">
      <q-btn
        outline
        color="negative"
        class="q-px-md red"
        @click="resetCodeBasic"
        :disable="saving"
        >{{ $t(Utils.getKey("Reset")) }}</q-btn
      >
      <q-btn
        color="accent"
        outline
        class="q-px-md q-ml-md green"
        @click="onSubmit"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
    <Loading :loading="loading" />
  </q-card>
</template>

<script setup>
import { inject, ref, onMounted, watch } from "vue";
import useConfiguration from "../../composables/useConfiguration";
import useCurrency from "../../composables/useCurrency";
import usePayment from "../../composables/usePayment";
import Utils from "../../helpers/Utils";
import Loading from "src/components/Shared/Loading.vue";
// use=
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
const { t } = useI18n();
const $q = useQuasar();

const currency_id = inject("currency_id");
const locale = inject("locale");
const { loading, getPaymentConfiguration, addPaymentConfiguration } =
  useConfiguration();
const { all } = useCurrency();
const { allPayment } = usePayment();
const payment = ref({
  payment: [],
  wallet: [],
});
const curriencies = ref([]);
const paymentGateway = ref([]);
const paymentRes = ref({});
const walletData = ref();
const paymentData = ref();

const getCurrencyData = async () => {
  const res = await all();
  curriencies.value = res.data;
};

const getPaymentData = async () => {
  const res = await allPayment();
  paymentGateway.value = res.data;
};

const setGatewayData = () => {
  let wd = [];
  paymentGateway?.value.forEach((currencyData, index) => {
    let code = {};
    if (payment?.value?.payment[index]?.name != currencyData.name) {
      code = JSON.parse(`{
      "name" : "${currencyData.name}",
      "type" : "payment",
      "status":false
    }`);
    } else {
      if (payment?.value?.payment[index]?.type == "payment") {
        code = JSON.parse(`{
      "name" : "${payment?.value?.payment[index].name}",
      "type" : "${payment?.value?.payment[index].type}",
      "status":${payment?.value?.payment[index].status}
    }`);
      }
    }
    wd.push(code);
  });

  paymentData.value = wd;
};

const setWalletData = () => {
  let wd = [];
  curriencies?.value.forEach((currencyData, index) => {
    let code = {};
    if (payment?.value?.wallet[index]?.code != currencyData.code) {
      code = JSON.parse(`{
      "code" : "${currencyData.code}",
      "name" : "${currencyData.name}",
      "type" : "wallet",
      "status":false
    }`);
    } else {
      if (payment?.value?.wallet[index]?.type == "wallet") {
        code = JSON.parse(`{
      "code" : "${payment?.value?.wallet[index]?.code}",
      "name" : "${payment?.value?.wallet[index].name}",
      "type" : "${payment?.value?.wallet[index].type}",
      "status":${payment?.value?.wallet[index].status}
    }`);
      }
    }
    wd.push(code);
  });

  walletData.value = wd;
};

onMounted(async () => {
  getCurrencyData();
  getPaymentData();
  const res = await getPaymentConfiguration(payment.value);
  const resData = res.data?.data?.data;
  if (resData) {
    payment.value = JSON.parse(resData);
    paymentRes.value = JSON.parse(resData);
  }
  setWalletData();
  setGatewayData();
});

const onSubmit = async () => {
  try {
    payment.value.wallet = walletData.value;
    payment.value.payment = paymentData.value;

    const res = await addPaymentConfiguration(payment.value);

    const resData = res.data?.data?.data;

    payment.value = JSON.parse(resData) || payment.value;
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("Updated successfully")),
    });
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
};

const resetCodeBasic = async () => {
  payment.value = paymentRes.value;
};
</script>
<style scoped></style>
