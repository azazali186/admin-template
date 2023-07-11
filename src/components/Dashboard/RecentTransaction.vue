<template>
  <div class="col-md-6 col-sm-12 col-xs-12">
    <q-bar dark class="chart-qbar q-py-lg">
      <span class="text-body1">{{
        $t(Utils.getKey("Last 10 Transactions"))
      }}</span>
    </q-bar>
    <q-card-section
      class="q-pa-md bordered"
      style="border: 1px solid #ebeef5 !important"
    >
      <q-table
        flat
        class="q-pa-none"
        color="primary"
        :loading="transactionLoading"
        :rows="transactionItems"
        row-key="id"
        :columns="transactionColumns"
        @request="onRequest"
        hide-no-data
        :hide-pagination="true"
        bordered
        :pagination="{ rowsPerPage: 10 }"
      >
        <!-- header column -->
        <template v-slot:header-cell="props">
          <q-th :props="props">
            {{
              props.col.label === "#"
                ? props.col.label
                : $t(Utils.getKey(props.col.label))
            }}
          </q-th>
        </template>
        <template v-slot:body-cell-amount="props">
          <q-td class="text-right">
            <span :class="props.row.transaction_type === 'transfer_in' ? 'green' : 'red' ">{{Utils.formatCurrency(props.row.amount)}}</span>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Utils from "src/helpers/Utils";
import useStats from "../../composables/useStats";
import useTable from "../../composables/useTable";

const {
  transactionLoading,
  transactionColumns,
  transactionItems,
  getRecentTransactions,
} = useStats();
const { pagination, onRequest } = useTable(getRecentTransactions);

onMounted(() => {
  onRequest({
    pagination: { ...pagination.value, rowsPerPage: 10 },
    filter: undefined,
  });
});
</script>
