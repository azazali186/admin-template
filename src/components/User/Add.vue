<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Add User")) }}</span>
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

    <q-card-section class="q-pt-lg">
      <q-form ref="refForm" autocomplete="off">
        <form autocomplete="off">
          <q-input
            v-model="user.name"
            autocomplete="off"
            :label="$t(Utils.getKey('Name'))"
            :oninput="(evt) => Utils.containsOnlyCharacterAllLanguageEvent(evt)"
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required')),
              (val) =>
                Utils.containsOnlyCharacterAllLanguage(val) ||
                $t(Utils.getKey('Only character, numbers and space')),
            ]"
            dense
            outlined
            maxlength="20"
          />
        </form>
        <form autocomplete="off">
          <q-input
            type="email"
            v-model="user.email"
            :label="$t(Utils.getKey('Email Id'))"
            dense
            outlined
            autocomplete="off"
            maxlength="20"
            @keydown.space="(event) => event.preventDefault()"
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required')),
              (val, rules) =>
                rules.email(val) || $t(Utils.getKey('invalid email address')),
            ]"
          />
        </form>
        <form autocomplete="off">
          <q-input
            type="password"
            v-model="user.password"
            :label="$t(Utils.getKey('Password'))"
            dense
            outlined
            maxlength="20"
            lazy-rules
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required')),
              (val) => val.length || $t(Utils.getKey('Please enter password')),
            ]"
          />
        </form>
        <form autocomplete="off">
          <q-select
            v-model="user.role_id"
            :options="roleOptions"
            :label="$t(Utils.getKey('Role'))"
            emit-value
            map-options
            option-label="name"
            option-value="id"
            dense
            outlined
            maxlength="20"
            lazy-rules
            :rules="[
              (val) => !!val || $t(Utils.getKey('Field is required')),
              (val) => val || $t(Utils.getKey('Please select Role')),
            ]"
          />
        </form>
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
        style="color: var(--q-primary) !important"
        @click="onSubmit"
        :disable="saving"
      >
        {{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import useUser from "src/composables/useUser";
import useACL from "src/composables/useACL";

import { useI18n } from "vue-i18n";
import Utils from "src/helpers/Utils";
const { t } = useI18n();
const emit = defineEmits(["onClose", "onAdded"]);
const refForm = ref(null);
const $q = useQuasar();
const { saving, add } = useUser();
const { getAllRoles } = useACL();
const roleOptions = ref([]);
const user = ref({
  name: "",
  email: "",
  password: "",
  role_id: "",
});

Promise.allSettled([fetchRoles()]);

watch(
  () => user.value.role_id,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      let role = roleOptions.value.find((item) => item.id == newValue);
    }
  }
);

async function fetchRoles() {
  try {
    const response = await getAllRoles();
    roleOptions.value = response.data;
    if (response.data.length) {
      user.value.role_id = response.data[0].id;
    }
  } catch (e) {}
}

async function onSubmit() {
  let role = roleOptions.value.find((item) => item.id == user.value.role_id);

  try {
    // if (Utils.containsOnlyCharacterAllLanguage(user.value.name)) {
    //   $q.notify({
    //     position: "top-right",
    //     type: "negative",
    //     icon: "fas fa-exclamation-triangle",
    //     message: t(Utils.getKey("only character, number, and space are allow in user name")),
    //   });
    //   return;
    // }
    let validation = await refForm.value.validate();
    if (!validation) {
      return;
    }
    if (!Utils.onlyEmail(user.value.email)) {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message: t(Utils.getKey("invalid email address")),
      });
      return;
    }
    await add(user.value);
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
</script>
