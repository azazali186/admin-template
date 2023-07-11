<template>
  <div class="col-md-6 col-sm-12 col-xs-12 ">
    <q-bar dark class="chart-qbar q-py-lg">
      <span class="text-body1">{{ $t(Utils.getKey("Recently Online")) }}</span>
    </q-bar>
    <q-card-section
      class="q-pa-md bordered"
      style="border: 1px solid #ebeef5 !important"
    >
      <q-table
        flat
        class="q-pa-none"
        color="primary"
        :loading="memberLoading"
        :rows="memberItems"
        row-key="id"
        :columns="memberColumns"
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
      </q-table>
    </q-card-section>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Utils from "src/helpers/Utils";
import useStats from "../../composables/useStats";
import useTable from "../../composables/useTable";

const { memberLoading, memberColumns, memberItems, getRecentMemberOnline } =
  useStats();
const { pagination, onRequest } = useTable(getRecentMemberOnline);

onMounted(() => {
  onRequest({
    pagination: { ...pagination.value, rowsPerPage: 10 },
    filter: undefined,
  });
});
</script>
