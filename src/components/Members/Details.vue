<template>
  <q-card
    :style="{
      width: $q.platform.is.mobile ? '100%' : '700px',
      maxWidth: '100%',
    }"
  >
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">{{ $t(Utils.getKey("Detail")) }}</span>
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
      <table style="width: 100%;" class="c_table">
        <tr>
          <th class="text-left">{{$t('no')}}</th>
          <th class="text-left">{{$t('member_name_phone')}}</th>
           <th class="text-left">{{$t('member_id')}}</th>
          <th  class="text-right">{{$t('transaction_amount')}}</th>
        </tr>
        <tr v-for="(mem,index) in member.members" :key="mem.id">
          <td>{{index+1}}</td>
          <td>{{mem.display_name ? mem.display_name: `${mem.idd}-${mem.phone_number}`}}</td>
          <td>{{mem.member_ID}}</td>
          <td class="text-right">{{Utils.formatCurrency(mem.order_product_sum_amount)}}</td>
        </tr>
      </table>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import useMember from "src/composables/useMember";
import Utils from "../../helpers/Utils";
import useTable from "../../composables/useTable";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onUpdated"]);
const $q = useQuasar();
const { loading, columns, trash, paginate } = useMember();
const {
  pagination,
  onRequest,
  onRefresh,
} = useTable(paginate, trash);
const member = ref({ ...props.data });
console.log('memner', member.value)
</script>

<style scoped>
.d_icon {
  cursor: pointer;
  top: 1px;
  z-index: 1000;
  font-size: 22px;
  position: absolute;
  left: 1px;
  background: gray;
  padding: 8px;
}
.card_img {
  position: relative;
  box-shadow: 0px 3px 5px 8px rgb(0 0 0 / 15%);
  margin: 10px;
}
.c_table {
    border-collapse:separate;
    border:solid #c3c3c3 1px;
    border-radius:6px;
}
.c_table td, th {
    border-left:solid #c3c3c3 1px;
    border-top:solid #c3c3c3 1px;
}
.c_table th {
    padding: 4px;
    background-color: #dfdddd;
    border-top: none;
}
.c_table td {
     border-left: solid #c3c3c3 1px;
     border-right: none;
     padding: 4px;
  }
.c_table tr:last-child td {
    border-bottom: none;
}
.c_table tr  td:first-child {
    border-left:none !important;
}
</style>




