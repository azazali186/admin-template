<template>
  <q-page :class="!store.leftDrawerOpen ? 'ml-5' : '' ">
  <keep-alive>
    <q-card class="pa-3 mt-4">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="white"
        indicator-color="primary"
        align="left"
      >
        <q-tab name="Bot" :label="$t('Bot')"></q-tab>
        <q-tab name="MLM" :label="$t('MLM')"></q-tab>
        <q-tab name="Order" :label="$t('Order')"></q-tab>
        <!-- <q-tab name="Payment" :label="$t('Payment')"></q-tab> -->
      </q-tabs>

      <q-separator></q-separator>
        <KeepAlive>
          <q-tab-panels v-model="tab"  animated>

            <q-tab-panel class="pa-0" name="Bot">
                <Bot/>
            </q-tab-panel>

            <q-tab-panel class="pa-0" name="MLM">
              <MLM/>
            </q-tab-panel>

            <q-tab-panel class="pa-0" name="Order">
              <Order/>
            </q-tab-panel>
            <!-- <q-tab-panel class="pa-0" name="Payment">
              <Payment/>
            </q-tab-panel> -->


          </q-tab-panels>
      </KeepAlive>
    </q-card>
  </keep-alive>

  </q-page>
</template>

<script setup>
import { ref, inject, computed } from "vue";
import Bot from './Bot.vue'
import MLM from './MLM.vue'
import Order from './Order.vue'
import Payment from './Payment.vue'
import Utils from "../../helpers/Utils";
import {store} from '../../store/store'
const tab = ref('Bot')
</script>
