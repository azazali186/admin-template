<template>
  <q-page>
    <q-card >
      <q-card-section>
        <q-table
          flat
          class="q-pt-md"
          color="primary"
          :loading="loading"
          :rows="items"
          row-key="id"
          :columns="memberColumns"
          v-model:pagination="pagination"
          :filter="filters"
          @request="onRequest"
          :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]"
          binary-state-sort
          :selected="selected"
          :rows-per-page-label="$t(Utils.getKey('Records per page'))"
        >
          <template v-slot:top>
            <!-- <q-input
              dense
              outlined
              debounce="500"
              v-model="filters.user_id"
              :placeholder="$t(Utils.getKey('Member ID'))"
              style="width: 150px"
              class="q-mr-sm q-mt-xs"
            /> -->
            <q-input
              dense
              outlined
              debounce="500"
              v-model="filters.ip_address"
              :placeholder="$t(Utils.getKey('Login IP'))"
              style="width: 220px"
              class="q-mr-sm q-mt-xs"
            />
            <q-input
              dense
              class="q-mr-sm q-mt-xs"
              outlined
              debounce="180"
              v-model="filters.member_id"
              :label="$t('member_id')"
              style="width: 180px"
            />

            <el-date-picker
              class="q-mt-xs q-mr-sm input_whiteF"
              v-model="filters.dates"
              type="daterange"
              :range-separator="$t(Utils.getKey('To'))"
              :start-placeholder="$t(Utils.getKey('Start date'))"
              :end-placeholder="$t(Utils.getKey('End date'))"
              value-format="YYYY-MM-DD"
            />

            <q-btn
              class="q-mr-sm q-mt-xs"
              dense
              color="primary"
              icon="mdi-filter-remove-outline"
              rounded
              @click="resetFilters"
            />
          </template>

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
          <template v-slot:body-cell-sl="props">
            <q-td>{{ props.rowIndex + 1 }} </q-td>
          </template>

          <template v-slot:body-cell-user_agent="props">
            <q-td class="text-center">
              <span class="cursor-pointer q-ma-none"
                >{{ getUserAgent(props.row.user_agent) }}
              </span>
            </q-td>
          </template>
          <!-- no data -->
          <template v-slot:no-data>
            <q-icon
              style="margin-right: 5px"
              class="fas fa-exclamation-triangle"
            />
            {{ $t(Utils.getKey("No matching records found")) }}
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref, computed, watch, nextTick } from "vue";
import { useQuasar } from "quasar";
import moment from "moment";
import useTable from "../../composables/useTable";
import useLoginLog from "../../composables/useLoginLog";
// import useMerchant from "../../composables/useMerchant";
import Utils from "../../helpers/Utils";
import { useI18n } from "vue-i18n";
import _ from "lodash";

const { t } = useI18n();
var uaParser = require("ua-parser-js");
const $q = useQuasar();
const { loading, memberColumns, items, paginateMembers } = useLoginLog();
// const { all } = useMerchant();
const { pagination, onRequest, selected } = useTable(paginateMembers);

let tempMerchants = [];
const merchants = ref([]);

const defaultDate = [
  moment().startOf("day").format("YYYY-MM-DD"),
  moment().endOf("day").format("YYYY-MM-DD"),
];

const filters = reactive({
  user_id: "",
  ip_address: "",
  merchant_id: "",
  dates: defaultDate,
});

// Promise.all([getMerchants()]);

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "login_logs.created_at",
      descending: true,
    },
    filter: { ...filters },
  });
});

async function getMerchants() {
  try {
    const response = await all();
    merchants.value = tempMerchants = response.data;
  } catch (err) {}
}

const getUserAgent = (uaString) => {
  let parsed = uaParser(uaString);
  let ua = "";

  // if (typeof parsed.device.model !== "undefined") {
  //   ua += `${t(Utils.getKey("Device"))}: ${t(
  //     Utils.getKey(parsed.device.model)
  //   )}, `;
  // } else {
  //   ua += `${t(Utils.getKey("Device"))}: ${getDeviceName(parsed.os.name)}, `;
  // }

  // if (typeof parsed.os.name !== "undefined") {
  //   ua += `${t(Utils.getKey("OS"))}: ${parsed.os.name} ${parsed.os.version}, `;
  // }

  // if (typeof parsed.browser.name !== "undefined") {
  //   ua += `${t(Utils.getKey("Browser"))}: ${parsed.browser.name} ${
  //     parsed.browser.version
  //   }`;
  // }

  return getDeviceName(parsed.os.name);
};

const getDeviceName = (os) => {
  if (os == undefined || os == null || os == "" || !os) {
    return "N/A";
  }

  let pcs = ["Windows", "Linux", "Unix", "MacOS"];

  if (pcs.includes(os)) {
    return "PC";
  }

  return os;
};

const resetFilters = () => {
  filters.dates = [];
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }
};

const filterMerchant = (val, update) => {
  merchants.value = Utils.filterDropdownOptions(
    tempMerchants,
    val,
    update,
    "name"
  );
};
</script>
