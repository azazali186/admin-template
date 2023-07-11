<template>
  <q-card style="margin-left: 0px; box-shadow: none; min-height: 85vh">
    <q-toolbar class="pl-0 text-theme text-center">
      <q-toolbar-title>
        {{ $t(Utils.getKey("Global Order Settings")) }}
      </q-toolbar-title>
    </q-toolbar>
    <q-separator />
    <q-card-section>
      <div class="row">
        <div class="col-12 col-md-4 q-pr-md">
          <q-toolbar class="pl-0 text-theme">
            <q-toolbar-title>
              {{
                $t(Utils.getKey("Order Settings for cancel reserved orders"))
              }}
            </q-toolbar-title>
          </q-toolbar>
        </div>
      </div>

      <q-separator />

      <div class="row q-pt-md">
        <div class="col-12 col-md-10 q-pr-md">
          <div class="row">
            <div class="col-12 col-md-4 q-pr-md">
              <label>{{ $t(Utils.getKey("order Cancelled Minutes")) }}</label>
              <q-input
                :autofocus="true"
                v-model="order.cancelled"
                dense
                outlined
                maxlength="5"
                @change="onChange"
                :oninput="
                  (evt) => Utils.validationOnlyNumberDecimalEvent(evt, 4)
                "
                lazy-rules
                :rules="[
                  (val) => !!val || $t(Utils.getKey('Field is required')),
                  (val) =>
                    val >= 2 || $t(Utils.getKey('Minimum is two minutes')),
                  (val) =>
                    Utils.containsOnlyNumbers(val) ||
                    $t(Utils.getKey('only Number')),
                ]"
              />
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="text-left">
      <q-btn
        outline
        color="negative"
        class="q-px-md"
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
import Utils from "../../helpers/Utils";
import Loading from "src/components/Shared/Loading.vue";
// use=
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
const { t } = useI18n();
const $q = useQuasar();

const currency_id = inject("currency_id");
const locale = inject("locale");
const { loading, orderGetConfiguration, orderAddConfiguration } =
  useConfiguration();
const order = ref({});
const orderRes = ref({});

onMounted(async () => {
  const res = await orderGetConfiguration(order.value);
  const resData = res.data?.data?.data;
  order.value = JSON.parse(resData) || order.value;
  orderRes.value = JSON.parse(resData) || order.value;
});

const onChange = () => {
  if (order.value.cancelled < 2) {
    order.value.cancelled = 2;
  }
  if (order.value.cancelled[0] == "0") {
    order.value.cancelled =  order.value.cancelled.substring(1)
  }
};

const onSubmit = async () => {
  try {
    if (!Utils.containsOnlyNumbers(order.value.cancelled)) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("cancelled values required only number")),
      });
      return false;
    }

    const res = await orderAddConfiguration(order.value);
    const resData = res.data?.data?.data;

    order.value = JSON.parse(resData) || order.value;
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
  order.value = orderRes.value;
};
</script>
<style scoped></style>
