<template>
  <q-card :style="{
    width: $q.platform.is.mobile ? '100%' : '700px',
    maxWidth: '100%',
  }">
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{
        $t(Utils.getKey("Edit Country State"))
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
        maxlength="20" lazy-rules :oninput="(evt) => Utils.containsNumbersAndCaracter(evt)"
        :rules="[(val) => !Utils.containsNumbersAndCaracter(val)]" />
    </q-card-section>
    <!-- <q-card-section class="q-pt-none">
      <q-input
        :autofocus="true"
        v-model="countryState.state_code"
        :label="$t(Utils.getKey('State Code'))"
        dense
        outlined
        maxlength="20"
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
    <q-card-section class="q-pt-none">
      <q-select v-model="countryState.status" :options="['active', 'inactive']" outlined dense emit-value map-options
        :label="$t('status')" :option-label="(name) => $t(Utils.getKey(name))" clearable />
    </q-card-section>

    <q-card-section class="text-right q-mt-md">
      <q-btn flat color="negative" class="q-px-md" @click="emit('onClose')" :disable="saving">{{
        $t(Utils.getKey("Cancel")) }}</q-btn>
      <q-btn color="accent" class="q-px-md q-ml-md" style="color: var(--q-primary) !important" @click="onSubmit"
        :disable="saving">{{ $t(Utils.getKey("Save")) }}</q-btn>
    </q-card-section>
  </q-card>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import { useQuasar } from "quasar";
import useCountryStates from "src/composables/useCountryStates";
import useCity from "src/composables/useCity";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({ data: Object, country: Array, languages: Array });
//const props = defineProps({ country: Array, city: Array, data: Object,  languages: Array });
const emit = defineEmits(["onClose", "onUpdated"]);

const $q = useQuasar();
const { saving, update } = useCountryStates();
const countryOption = ref(props.country.data);
const countryState = ref({ ...props.data, translation_name: {} });
const stateOption = ref([]);
const state = useCountryStates();

const languages = ref(props.languages);

console.log(countryState.value);

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

    let allFill = false;
    let stateData = [];
    languages.value.forEach((lg, index) => {
      let cd = {};
      if (countryState.value.translation_name[lg.code] == "") {
        allFill = true;
      } else {
        cd.language_id = lg.id;
        cd.field_name = "name";
        cd.translation = countryState.value.translation_name[lg.code];
      }
      stateData.push(cd);
    });

    if (allFill == true) {
      $q.notify({
        position: "top",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("please fill all translation fileld")),
      });
      return;
    }

    await update(countryState.value.id, {
      ...countryState.value,
      translation_name: stateData,
    });
    emit("onUpdated");
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });
  } catch (err) {
    var errMessage = t(Utils.getKey(err.message.toString()));
    if (errMessage && errMessage.match("___"))
      errMessage = err.message.toString()
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
    countryState.value.translation_name[lg.code] =
      countryState.value?.translates[lg.code]?.name || "";
  });
});
</script>
