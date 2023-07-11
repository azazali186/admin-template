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
              outlined
              maxlength="40"
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
                <img style="height: 90px" class="mt-3" :src="app_display_url" />
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
const emit = defineEmits(["onClose", "onUpdated"]);

const $q = useQuasar();
const { saving, update } = useCustomerService();
const customerSevice = ref({ ...props.data });
const isLoading = ref(false);
const icon = ref("");
const iconRequired = ref(false);
const appDisplayRequired = ref(false);
const images_url = ref("");
const app_display = ref("");
const app_display_url = ref("");
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
      app_display_url.value = e.target.result;
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

    const FormData = require("form-data");
    const fomrData = new FormData();
    for (const key in customerSevice.value) {
      fomrData.append(key, customerSevice.value[key]);
    }
    if (icon.value != "") {
      fomrData.append("icon", icon.value);
    }
    if (app_display.value != "") {
      fomrData.append("app_display", app_display.value);
    }
    await update(customerSevice.value.id, fomrData);
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });
    isLoading.value = false;
    emit("onUpdated");
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
onMounted(async () => {
  // app_display = 0
  // icon = 1
  images_url.value = props.data.image[0]?.path;
  app_display_url.value = props.data.image[1]?.path;
});
</script>
