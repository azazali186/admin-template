<template>
  <q-card :style="{
    width: $q.platform.is.mobile ? '100%' : '700px',
    maxWidth: '100%',
  }">
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{
        $t(Utils.getKey("Add Country State"))
      }}</span>
      <q-space />
      <q-btn dense flat icon="fas fa-times" @click="emit('onClose')" :disable="saving">
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section class="q-pt-lg">
      <label>{{ $t(Utils.getKey("Country")) }}</label>
      <q-select v-model="countryState.country_id" :options="countryOption" outlined dense emit-value map-options
        option-value="id" option-label="name" clearable
        :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]" />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-input :autofocus="true" v-model="countryState.state_name" :label="$t(Utils.getKey('State Name'))" dense outlined
        maxlength="50" lazy-rules :oninput="(evt) => Utils.containsNumbersAndCaracter(evt)"
        :rules="[(val) => !Utils.containsNumbersAndCaracter(val)]" />
    </q-card-section>
    <!-- <q-card-section class="q-pt-none">
      <q-input
        :autofocus="true"
        v-model="countryState.state_code"
        :label="$t(Utils.getKey('State Code'))"
        dense
        outlined
        maxlength="50"
        lazy-rules
        :oninput="(evt) => Utils.containsNumbersAndCaracter(evt)"
        :rules="[(val) => !Utils.containsNumbersAndCaracter(val)]"
      />
    </q-card-section> -->
    <q-card-section class="q-pt-none">
      <div class="row">
        <div class="col-12 col-md-6 q-pr-md" v-for="lang in languages" :key="lang.code">
          <label class="text-uppercase">{{ $t(lang.locale) }}</label>
          <q-input v-model="countryState.translation_name[lang.code]" :label="$t(Utils.getKey('name'))" dense autogrow
            type="textarea" outlined />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="text-right q-mt-md">
      <q-btn flat color="negative" class="q-px-md" @click="emit('onClose')" :disable="saving">{{
        $t(Utils.getKey("Cancel")) }}</q-btn>
      <q-btn color="accent" style="color: var(--q-primary) !important" class="q-px-md q-ml-md" @click="onSubmit"
        :disable="saving">{{ $t(Utils.getKey("Save")) }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import useCountryStates from "src/composables/useCountryStates";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);
const props = defineProps({ country: Array, languages: Array });
const $q = useQuasar();
const { saving, add } = useCountryStates();
const countryOption = ref(props.country.data);
const countryState = ref({
  state_name: "",
  state_code: "",
  country_id: "",
  status: "active",
  translation_name: {},
});

const languages = ref(props.languages);

console.log("countryOption", props.country.data);

async function onSubmit() {
  try {
    if (

      countryState.value.country_id == "" ||
      countryState.value.country_id == undefined
    ) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("country field is required")),
      });
      return;
    }
    if (
      countryState.value.state_name == ""

    ) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("state name field is required")),
      });
      return;
    }
    // if (!Utils.containsNumbersAndCaracter(countryState.value.state_code)) {
    //   $q.notify({
    //     position: "top-right",
    //     type: "negative",
    //     icon: "fas fa-exclamation-triangle",
    //     message: t(Utils.getKey("only character")),
    //   });
    //   return;
    // }

    console.log("countryState.value            ", countryState.value);

    let currencyData = [];
    let allFill = false;
    languages.value.forEach((lg, index) => {
      let cd = {};
      if (countryState.value.translation_name[lg.code]?.trim() == "") {
        allFill = true;
      } else {
        cd.language_id = lg.id;
        cd.field_name = "name";
        cd.translation = countryState?.value?.translation_name[lg.code];
      }
      currencyData.push(cd);
    });

    if (allFill == true) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("please fill all translation fileld")),
      });
      return;
    }

    console.log(currencyData);
    await add({ ...countryState.value, translation_name: currencyData });
    emit("onAdded");
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("created successfully")),
    });
  } catch (err) {
    var errMessage = t(Utils.getKey(err.message.toString()));
    if (errMessage && errMessage.match("___"))
      errMessage = err.message.toString();
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: errMessage,
    });
  }
}

onMounted(() => {
  languages.value.forEach((lg) => {
    countryState.value.translation_name[lg.code] = "";
  });
});
</script>
