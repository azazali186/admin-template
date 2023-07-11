<template>
  <q-card
    id="cardScrolling"
    :style="{
      width: $q.platform.is.mobile ? '100%' : '800px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{
        $t(Utils.getKey("Edit Customer Service"))
      }}</span>
      <q-space />
      <q-btn
        dense
        flat
        icon="fas fa-times"
        @click="emit('onClose')"
        :disable="saving"
      >
        <q-tooltip>{{ $t(Utils.getKey("Close")) }}</q-tooltip>
      </q-btn>
    </q-bar>

    <q-card-section class="q-pt-lg pb-0">
      <q-form ref="refForm">
        <div class="row">
          <div class="col-12 col-md-12 q-pr-md">
            <q-input
              v-model="customerSevice.service"
              :label="$t(Utils.getKey('service'))"
              dense
              :oninput="(evt)=> Utils.validationNumberAndCaracter(evt)"
              outlined
              maxlength="50"
              lazy-rules
              :rules="[(val) => !!val || $t(Utils.getKey('field is required'))]"
            />
          </div>
          <div class="col-12 col-md-12 q-pr-md">
            <q-input
              v-model="customerSevice.account"
              :label="$t(Utils.getKey('account'))"
              dense
              outlined
              :oninput="(evt)=> Utils.validationNumberAndCaracter(evt)"
              maxlength="500"
              lazy-rules
              :rules="[(val) => !!val || $t(Utils.getKey('field is required'))]"
            />
          </div>

          <div class="col-12 col-md-12 q-pr-md">
            <q-radio
              v-model="customerSevice.status"
              :val="1"
              :label="$t('active')"
            />
            <q-radio
              v-model="customerSevice.status"
              :val="0"
              :label="$t('inactive')"
            />
          </div>
        </div>
        <div class="mt-3 row">
          <div class="col-6 col-sm-4">
            <label class="">{{ $t("icon") }}</label>
            <div class="mt-3">
              <label
                class="pa-2 border"
                :class="!iconRequired ? 'border' : 'border_red'"
              >
                <i class="fa fa-image"></i> {{ $t("choose_image") }}
                <input
                  class="mt-2"
                  style="display: none"
                  accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
                  type="file"
                  id="file-input"
                  @change="uploadChange"
                  max="200"
                  name="image"
                />
              </label>
              <p v-if="iconRequired" class="red mt-3">
                {{ $t("image_is_required") }}
              </p>
              <div>
                <img style="height: 90px" class="mt-3" :src="images_url" />
              </div>
            </div>
          </div>
          <div class="col-6 col-sm-4">
            <label class="">{{ $t("app_display") }}</label>
            <div class="mt-3">
              <label
                class="pa-2"
                :class="!appDisplayRequired ? 'border' : 'border_red'"
              >
                <i class="fa fa-image"></i> {{ $t("choose_image") }}
                <input
                  class="mt-2"
                  style="display: none"
                  accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
                  type="file"
                  id="file-imageH5"
                  @change="uploadChangeH5"
                  name="imageH5"
                />
              </label>
              <p v-if="appDisplayRequired" class="red mt-3">
                {{ $t("image_is_required") }}
              </p>
              <div>
                <img style="height: 90px" class="mt-3" :src="images_url_h5" />
              </div>
            </div>
          </div>
        </div>
      </q-form>
    </q-card-section>

    <q-card-section class="text-right q-mt-md">
      <q-btn
        flat
        color="negative"
        class="q-px-md"
        @click="emit('onClose')"
        :disable="saving"
        >{{ $t(Utils.getKey("Cancel")) }}</q-btn
      >
      <q-btn
        color="accent"
        class="q-px-md q-ml-md"
        @click="onSubmit"
        style="color: var(--q-primary) !important"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
    <Loading :loading="isLoading" />
  </q-card>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import useCustomerService from "../../composables/useCustomerService";
import { useI18n } from "vue-i18n";
import Loading from "src/components/Shared/Loading.vue";
import Utils from "../../helpers/Utils";

const form = ref(null);
const { t } = useI18n();
const props = defineProps({ data: Object, languages: Array });
const emit = defineEmits(["onClose", "onAdded"]);

const $q = useQuasar();
const { saving, add } = useCustomerService();
const customerSevice = ref({
  service: "",
  account: "",
  status: 1,
});
const isLoading = ref(false);
const icon = ref("");
const iconRequired = ref(false);
const appDisplayRequired = ref(false);
const images_url = ref("");
const app_display = ref("");
const images_url_h5 = ref("");
const refForm = ref(null);

const uploadChange = (e) => {
  iconRequired.value = false;
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target.result) {
      images_url.value = e.target.result;
    }
  };
  icon.value = e.target.files[0];

  reader.readAsDataURL(e.target.files[0]);
};

const uploadChangeH5 = (e) => {
  appDisplayRequired.value = false;
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target.result) {
      images_url_h5.value = e.target.result;
    }
  };
  app_display.value = e.target.files[0];

  reader.readAsDataURL(e.target.files[0]);
};

async function onSubmit() {
  try {
    let validation = await refForm.value.validate();
    if (!validation) {
      return;
    }
    if (icon.value == "") {
      iconRequired.value = true;
      return;
    }
    if (app_display.value == "") {
      appDisplayRequired.value = true;
      return;
    }

    const FormData = require("form-data");
    const fomrData = new FormData();
    for (const key in customerSevice.value) {
      fomrData.append(key, customerSevice.value[key]);
    }
    fomrData.append("icon", icon.value);
    fomrData.append("app_display", app_display.value);
    await add(fomrData);
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });
    isLoading.value = false;
    emit("onAdded");
    emit("onClose");
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
}
onMounted(async () => {});
</script>
