<template>
  <q-page>
    <q-card class="pa-3 mt-4">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="white"
        indicator-color="primary"
        align="left"
      >
        <q-tab name="Country" :label="$t('country')"></q-tab>
        <q-tab name="State" :label="$t('state')"></q-tab>
        <q-tab name="City" :label="$t('city')"></q-tab>
      </q-tabs>

      <q-separator></q-separator>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel class="pa-0" name="Country">
          <Country />
        </q-tab-panel>

        <q-tab-panel class="pa-0" name="State">
          <State />
        </q-tab-panel>

        <q-tab-panel class="pa-0" name="City">
          <City />
        </q-tab-panel>

      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import Country from "./Country.vue";
import State from "./State.vue";
import City from "./City.vue";

const tab = ref("Country");
</script>
