<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Edit Member")) }}</span>
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
      <q-form ref="refForm">
        <div class="row">
          <div class="col-12 col-md-6 q-pr-md">
            <q-input
              v-model="member.idd"
              :oninput="(evt) => Utils.validationOnlyNumberPhone(evt)"
              :label="$t(Utils.getKey('Idd'))"
              dense
              outlined
              :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
              maxlength="20"
            />
          </div>
          <div class="col-12 col-md-6 q-pr-md">
            <q-input
              v-model="member.phone_number"
              :oninput="(evt) => Utils.validationOnlyNumberPhone(evt)"
              :label="$t(Utils.getKey('Phone Number'))"
              dense
              outlined
              :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
              maxlength="20"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-12 col-md-6 q-pr-md">
            <q-input
              v-model="member.first_name"
              :oninput="(evt) => Utils.onlyLettersAndNumbersandSpaceEvent(evt)"
              :label="$t(Utils.getKey('First Name'))"
              dense
              outlined
              :rules="[(val) => !!val || $t(Utils.getKey('Field is required'))]"
              maxlength="20"
            />
          </div>
          <div class="col-12 col-md-6 q-pr-md">
            <q-input
              v-model="member.last_name"
              :oninput="(evt) => Utils.onlyLettersAndNumbersandSpaceEvent(evt)"
              :label="$t(Utils.getKey('Last Name'))"
              dense
              outlined
              maxlength="20"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-12 col-md-6 q-pr-md">
            <q-input
              type="email"
              v-model="member.email"
              :label="$t(Utils.getKey('Email'))"
              dense
              outlined
              :rules="[
                (val) => !!val || $t(Utils.getKey('Field is required')),
                (val) => Utils.onlyEmail(val) || $t('invalid_email_address'),
              ]"
              required
              maxlength="50"
            />
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
        style="color: var(--q-primary) !important"
        @click="onSubmit"
        :disable="saving"
        >{{ $t(Utils.getKey("Save")) }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import useMember from "src/composables/useMember";
import Utils from "../../helpers/Utils";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onUpdated"]);

const $q = useQuasar();
const { saving, update } = useMember();
const member = ref({ ...props.data });
const refForm = ref(null);
async function onSubmit() {
  try {
    let validation = await refForm.value.validate();
    if (!validation) {
      return;
    }
    // if (
    //   !Utils.containsOnlyCharacter(member.value.name) ||
    //   !Utils.containsOnlyCharacter(member.value.iso)
    // ) {
    //   $q.notify({
    //     position: "top-right",
    //     type: "negative",
    //     icon: "fas fa-exclamation-triangle",
    //     message: t(Utils.getKey("only character")),
    //   });
    //   return;
    // }
    await update(member.value.id, { ...member.value });
    emit("onUpdated");
    $q.notify({
      position: "top-right",
      type: "positive",
      icon: "fas fa-check",
      message: t(Utils.getKey("updated successfully")),
    });
  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
  }
}
</script>
