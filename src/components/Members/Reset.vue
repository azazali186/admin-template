<template>
  <q-card
    :style="{ width: '400px', minHeight: '150px' }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ !confirm ? $t(Utils.getKey("Confirm")) :  $t(Utils.getKey("Operation succeeded"))}}</span>
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

    <q-card-section  class="q-mt-m d-flex">
      <q-input
        type="text"
        v-model="member.password"
        class="flex-1"
        :label="$t(Utils.getKey('new password'))"
        dense
        :readonly="true"
        outlined
        maxlength="20"
      />
      <q-btn
        flat
        color="negative"
        @click="textCopy"
        class="q-px-md"
        >{{ !isCopy ?  $t(Utils.getKey("copy")) :  $t(Utils.getKey("copied")) }}
        <q-tooltip> {{ !isCopy ?  $t(Utils.getKey("copy")) :  $t(Utils.getKey("copied")) }} </q-tooltip>
        </q-btn
      >
    </q-card-section>


    <!-- confirm -->
    <q-card-section  class="text-right q-mt-md">
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
        >{{ $t(Utils.getKey("confirm")) }}</q-btn
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
const { saving, updatePassword } = useMember();
const member = ref({ ...props.data, password: Utils.randomString(8)});
const confirm = ref(false)
const isCopy = ref(false)

const textCopy = () => {
  isCopy.value = true
  Utils.clipboard(member.value.password)

}
async function onSubmit() {
  try {
    console.log('user=', member.value)
    // if(user.value.password.length < 6){
    //   $q.notify({
    //     position: "top-right",
    //     type: "negative",
    //     icon: "fas fa-exclamation-triangle",
    //     message:t(Utils.getKey('minimum must biger than 6 length')),
    //   });
    //   return
    // }
    let result = await updatePassword(member.value.id, { ...member.value });
    if(result.data.status){
      $q.notify({
        position: "top-right",
        type: "positive",
        icon: "fas fa-check",
        message: t(Utils.getKey("updated successfully")),
      });
      confirm.value = true
       emit("onUpdated");
       emit("onClose");
    } else {
      $q.notify({
        position: "top-right",
        type: "negative",
        icon: "fas fa-exclamation-triangle",
        message:t(Utils.getKey('Current password is incorrect')),
      });
    }

  } catch (err) {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message:t(Utils.getKey(err.message.toString())),
    });
  }
}
</script>
