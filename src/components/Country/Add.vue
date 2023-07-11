<template>
  <q-card :style="{
    width: $q.platform.is.mobile ? '100%' : '700px',
    maxWidth: '100%',
  }">
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Add Country")) }}</span>
      <q-space />
      <q-btn dense flat icon="fas fa-times" @click="emit('onClose')" :disable="saving">
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>
    <q-card-section class="q-pt-lg">
      <div class="row">
        <div class="col-12 col-md-12 q-pr-md">
          <q-input :autofocus="true" v-model="country.name" :label="$t(Utils.getKey('Name'))"
            :oninput="(evt) => Utils.containsOnlyCharacter2(evt)" :rules="[(val) => !Utils.containsOnlyCharacter2(val)]"
            dense outlined maxlength="20" />
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="row">
        <div class="col-12 col-md-6 q-pr-md">
          <q-input :autofocus="true" v-model="country.iso" :label="$t(Utils.getKey('ISO'))"
            :oninput="(evt) => Utils.validationOnlyNumberForIso(evt)" :rules="[
              (val) =>
                !Utils.validationOnlyNumber(val) ||
                $t(Utils.getKey('only number')),
            ]" dense outlined maxlength="5" />
        </div>

        <div class="col-12 col-md-6 q-pr-md">
          <q-input :autofocus="true" v-model="country.iso3" :label="$t(Utils.getKey('ISO3'))"
            :oninput="(evt) => Utils.validationOnlyNumberForIso(evt)" :rules="[
              (val) =>
                !Utils.validationOnlyNumber(val) ||
                $t(Utils.getKey('only number')),
            ]" dense outlined maxlength="5" />
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="row">
        <div class="col-12 col-md-6 q-pr-md">
          <q-input :autofocus="true" v-model="country.idd" :label="$t(Utils.getKey('IDD'))"
            :oninput="(evt) => Utils.validationOnlyNumberForIso(evt)" :rules="[
              (val) =>
                !Utils.validationOnlyNumber(val) ||
                $t(Utils.getKey('only number')),
            ]" dense outlined maxlength="5" />
        </div>
        <div class="col-12 col-md-6 q-pr-md">
          <q-input :autofocus="true" v-model="country.nationality" :label="$t(Utils.getKey('Nationality'))" dense outlined
            maxlength="20" lazy-rules :rules="[
              (val) =>
                !!val || $t(Utils.getKey('Field is required nationality')),
              (val) =>
                Utils.containsOnlyCharacter(val) ||
                $t(Utils.getKey('only character nationality')),
            ]" />
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-6 q-pr-md" v-for="lang in languages" :key="lang.code">
          <label class="text-uppercase">{{ $t(lang.locale) }}</label>
          <q-input v-model="country.translation_name[lang.code]" :label="$t(Utils.getKey('name'))" dense autogrow
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
import useCountry from "src/composables/useCountry";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({ languages: Array });
const emit = defineEmits(["onClose", "onAdded"]);

const $q = useQuasar();
const { saving, add } = useCountry();
const country = ref({
  name: "",
  iso: "",
  iso3: "",
  idd: "",
  nationality: "",
  translation_name: {},
});
const languages = ref(props.languages);
// watch(
//   () => country.value.name,
//   () => {

//   }
// );

async function onSubmit() {
  try {

    if (!Utils.containsOnlyCharacter2(country.value.name)) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("only character allow in country name")),
      });
      return;
    }

    let currencyData = []
    let allFill = false;
    languages.value.forEach((lg, index) => {
      let cd = {}
      if (country.value.translation_name[lg.code] == "") {
        allFill = true;
      } else {
        cd.language_id = lg.id
        cd.field_name = "name"
        cd.translation = country.value.translation_name[lg.code]
      }
      currencyData.push(cd)
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
    console.log(currencyData)
    await add({ ...country.value, translation_name: currencyData });
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
    country.value.translation_name[lg.code] = "";
  });
});
</script>
