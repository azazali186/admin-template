<template>
  <q-card style="margin-left: 0px; box-shadow: none; min-height: 85vh">
    <q-toolbar class="pl-0 text-theme text-left ml-5">
      <q-toolbar-title>
        {{ $t(Utils.getKey("Global Bot Settings")) }}
      </q-toolbar-title>
    </q-toolbar>
    <q-separator />
    <q-card-section>
      <q-form ref="pageForm">
        <!-- <div class="row">
          <div class="col-12 col-md-4 q-pr-md">
            <q-toolbar class="pl-0 text-theme">
              <q-toolbar-title>
                {{ $t(Utils.getKey("Time Setting For 1st Bot Insertion")) }}
              </q-toolbar-title>
            </q-toolbar>
          </div>

          <div class="col-12 col-md-4 q-pr-md">
            <q-toolbar class="pl-0 text-theme">
              <q-toolbar-title>
                {{ $t(Utils.getKey("Global Bot Running")) }}
              </q-toolbar-title>
            </q-toolbar>
          </div>
        </div> -->

        <!-- <q-separator /> -->

        <div class="row q-pt-md">
          <div class="col-12 col-md-8">
            <div class="row q-gutter-sm">
              <!-- <div class="col-12 col-md-3">
                <label>{{ $t(Utils.getKey("Bot Start Minutes")) }}</label>
                <q-input
                  :autofocus="true"
                  v-model="bot.start"
                  dense
                  outlined
                  maxlength="10"
                  lazy-rules
                  :rules="[
                    (val) => !!val || $t(Utils.getKey('Field is required')),
                    (val) =>
                      Utils.containsOnlyNumbers(val) ||
                      $t(Utils.getKey('only Number')),
                  ]"
                />
              </div> -->
              <!-- <div class="col-12 col-md-3">
                <label>{{ $t(Utils.getKey("Bot End Minutes")) }}</label>
                <q-input
                  :autofocus="true"
                  v-model="bot.end"
                  dense
                  outlined
                  maxlength="10"
                  lazy-rules
                  :rules="[
                    (val) => !!val || $t(Utils.getKey('Field is required')),
                    (val) =>
                      Utils.containsOnlyNumbers(val) ||
                      $t(Utils.getKey('only Number')),
                  ]"
                />
              </div> -->
              <div class="col-12 col-md-3">
                <label>{{ $t(Utils.getKey("Bot Status")) }}</label>
                <q-select
                  v-model="bot.status"
                  :options="status"
                  outlined
                  dense
                  emit-value
                  style="width: 250px"
                  map-options
                  option-value="name"
                  :rules="[
                    (val) => !!val || $t(Utils.getKey('Field is required'))
                    ]"
                  :label="$t(Utils.getKey('Bot Status'))"
                  :option-label="(name) => $t(Utils.getKey(name))"
                  clearable
                  class="input_white"
                />
              </div>
            </div>
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-card-section class="text-left">
      <q-btn
        color="negative"
        class="q-px-md"
        outline
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
const { loading, botSettings, addbotSettings } = useConfiguration();
const bot = ref({status: "active"});
const botRes = ref({});
const status = ref(["active", "inactive"]);
const pageForm = ref(null);
watch(locale, (newVal, oldVal) => {
  pageForm.value.resetValidation()
  pageForm.value.validate()
})
onMounted(async () => {
  const res = await botSettings(bot.value);
  const resData = res.data?.data?.bot_global_configuration?.data;

  bot.value = JSON.parse(resData) || bot.value;
  botRes.value = JSON.parse(resData) || bot.value;
});

const onSubmit = async () => {
  try {
    if (bot.value.status == "" || !bot.value.status) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("Bot Status Required")),
      });
      return false;
    }
    const res = await addbotSettings(bot.value);
    const resData = res.data?.data?.bot_global_configuration?.data;

    bot.value = JSON.parse(resData) || bot.value;
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
  bot.value = botRes.value;
};
</script>
<style scoped></style>
