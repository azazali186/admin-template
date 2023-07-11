<template>
  <q-layout>
    <q-page-container class="bg-part-login">
      <div
        class="fixed-width"
        :class="
          $q.dark.isActive
            ? 'style_dark_bg pl-0 text-theme'
            : 'style_bg pl-0 text-theme'
        "
      >
        <div class="two-columns">
          <div class="d_flex_center q-mb-md">
            <div class="max-width: 150px;">
              <img style="height: 40px" src="~assets/logo.png" />
            </div>
            <div class="q-ml-lg">
              <p class="template-heading">
                {{ $t(Utils.getKey("template admin")) }}
              </p>
            </div>
          </div>
          <div
            :class="
              $q.dark.isActive
                ? 'style_dark_bg pl-0 text-theme'
                : 'style_bg pl-0 text-theme'
            "
            class="p-3"
            outlined="0"
            flat
            style="width: 100%"
          >
            <q-card-section>
              <label>{{ $t(Utils.getKey("Language")) }}</label>
              <q-select
                v-model="locale"
                :options="localeOptions"
                :label="$t(Utils.getKey('Language'))"
                dense
                emit-value
                map-options
                option-label="name"
                option-value="code"
                outlined
                lazy-rules
                @update:model-value="resetFilters()"
                :rules="[
                  (val) =>
                    (val && val.length) ||
                    $t(Utils.getKey('Select Language') && val),
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="fas fa-language" size="sm" class="q-pr-sm" />
                </template>
              </q-select>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <label>{{ $t(Utils.getKey("email")) }}</label>
              <q-input
                autofocus
                :disable="loading"
                outlined
                dense
                :placeholder="$t(Utils.getKey('Enter Your Email'))"
                v-model="name"
                maxlength="30"
                ref="nameInputRef"
                :rules="[
                  (val) =>
                    (val && val.length) || $t(Utils.getKey('Enter Your Email')),
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="fas fa-user" size="sm" class="q-pr-sm" />
                </template>
              </q-input>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <label>{{ $t(Utils.getKey("Password")) }}</label>
              <q-input
                :disable="loading"
                outlined
                dense
                :type="showPassword ? 'text' : 'password'"
                maxlength="15"
                :placeholder="$t(Utils.getKey('Enter Password'))"
                v-model="password"
                ref="passwordInputRef"
                :rules="[
                  (val) =>
                    (val && val.length) || $t(Utils.getKey('Enter password')),
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="fas fa-lock" size="sm" class="q-pr-sm" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
                    size="xs"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
            </q-card-section>
            <div class="row">
              <q-card-section class="col-md-4 col-xs-12">
                <q-input
                  ref="codeInputRef"
                  dense
                  outlined
                  v-model="code"
                  :maxlength="6"
                  :oninput="(evt) => Utils.onlyPostiveInteger(evt, true)"
                  :label="$t(Utils.getKey('Six Digits Code'))"
                  :rules="[
                    (val) =>
                      parseInt(val) || $t(Utils.getKey('Please Enter Code')),
                  ]"
                ></q-input>
              </q-card-section>

              <q-card-section class="col-md-8 col-xs-12">
                <q-btn
                  type="button"
                  dense
                  :label="$t(Utils.getKey('Google Authenticator'))"
                  class="g-auth-btn full-width"
                  @click="onVerify2FA"
                  :disable="loading"
                />
              </q-card-section>
            </div>

            <q-card-section>
              <q-btn
                type="submit"
                :disable="loading"
                :loading="loading"
                class="full-width"
                :label="$t(Utils.getKey('Login'))"
                :class="$q.dark.isActive ? 'style_dark_btn' : 'primary'"
                @click="onSubmit"
              />
            </q-card-section>
          </div>
        </div>
        <!-- <div class="half right bg-color-blue-dark">
            <div class="v-align-div">
              <div class="logo-box-heading">
                <div class="logo-mid">
                  <q-img src="~assets/logo-big.png"></q-img>
                </div>
              </div>
            </div>
          </div> -->
      </div>
    </q-page-container>
  </q-layout>

  <q-dialog v-model="show2FAdialog" persistent>
    <google2-f-a :data="google2faData" @onClose="show2FAdialog = false" />
  </q-dialog>
</template>

<script setup>
import { ref, inject, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { api } from "../boot/axios";
import { useQuasar } from "quasar";
import Utils from "../helpers/Utils";
import useLanguage from "../composables/useLanguage";
import useUser from "src/composables/useUser";
import Google2FA from "src/components/Login/Google2FA.vue";

import axios from "axios";

const axoisInstance = axios.create({
  baseURL: process.env.API_URL_LOGIN,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const { t, locale } = useI18n({ useScope: "global" });
const { all } = useLanguage();
const { verifyUser2FA, verifyCode, enableGa } = useUser();

const auth = inject("auth");
const $q = useQuasar();
const router = useRouter();
const name = ref("");
const password = ref("");
const nameInputRef = ref(null);
const passwordInputRef = ref(null);
const codeInputRef = ref(null);
const showPassword = ref(false);
const loading = ref(false);
const show2FAdialog = ref(false);
const localeOptions = ref([]);
const google2faData = ref(null);
const code = ref("");

getLanguages();

watch(locale, (newValue, _) => {
  localStorage.setItem("locale", newValue);
  // this.form.reset();
});

async function getLanguages() {
  try {
    const response = await all();
    localeOptions.value = response.data;
    locale.value = response?.data[0]?.code;
  } catch (error) {}
}

async function onVerify2FA() {
  nameInputRef.value.validate();
  passwordInputRef.value.validate();

  if (!nameInputRef.value.hasError && !passwordInputRef.value.hasError) {
    loading.value = true;

    try {
      const response = await verifyUser2FA({
        email: name.value,
        password: password.value,
      });

      google2faData.value = {
        ...response.data,
        name: name.value,
      };

      show2FAdialog.value = true;
      loading.value = false;
    } catch (err) {
      loading.value = false;
      let errorMessage = Utils.getErrorMessage(err);

      $q.notify({
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey(errorMessage)),
      });
    }
  }
}

if (auth.state.token) {
  router.push("/");
}

async function onSubmit() {
  nameInputRef.value.validate();
  passwordInputRef.value.validate();

  if (!nameInputRef.value.hasError && !passwordInputRef.value.hasError) {
    loading.value = true;

    try {
      const response = await api.post("/auth/login", {
        username: name.value,
        password: password.value,
      });
      auth.setAuth(response.data);
      router.push("/");
      loading.value = false;
    } catch (err) {
      console.log(err.code);
      if (err.message && err.code != "ERR_BAD_REQUEST") {
        $q.notify({
          type: "negative",
          icon: "fas fa-exclamation-triangle",
          message: err.message,
        });
        loading.value = false;
        return;
      }
      loading.value = false;
      let errorMessage = Utils.getErrorMessage(err);
      console.log("erro message", errorMessage.message);
      $q.notify({
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: errorMessage?.message,
      });
    }
  }
}
const resetFilters = () => {
  nameInputRef.value.validate();
  passwordInputRef.value.validate();
  codeInputRef.value.validate();
};
</script>

<style scoped>
.style_bg {
  background: rgb(2, 0, 36);
  background: linear-gradient(
    3deg,
    rgba(2, 0, 36, 1) 0%,
    #7367f5 40%,
    #13112c 100%
  );
}

.style_dark_bg {
  background: rgb(2, 0, 36);
  background: linear-gradient(
    3deg,
    rgba(2, 0, 36, 1) 0%,
    #0a0557 40%,
    #13112c 100%
  );
}

.style_dark_btn {
  background: rgb(2, 0, 36);
  background: linear-gradient(
    3deg,
    rgb(80 76 141) 0%,
    #1c0fd1 40%,
    #3d3978 100%
  );
}

.agent {
  font-size: 26px;
  line-height: 35px;
  color: #ebeef5;
  border-left: 4px solid #ebeef5;
  padding-left: 16px;
  text-transform: capitalize;
}

.template-heading {
  font-size: 25px;
  font-weight: bold;
  line-height: 35px;
  color: #ebeef5;
  border-left: 4px solid #ebeef5;
  padding-left: 16px;
  text-transform: uppercase;
}
</style>
