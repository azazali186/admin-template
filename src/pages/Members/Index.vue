<template>
  <q-page>

    <q-card style="margin-left:0px; box-shadow: none; min-height:85vh;">
      <q-card-section v-if="!showMlmTreeView">
        <q-table
          flat
          color="primary"
          :loading="loading"
          :rows="items"
          row-key="id"
          :columns="columns"
          v-model:pagination="pagination"
          @request="onRequest"
          :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]"
          binary-state-sort
          :rows-per-page-label="$t(Utils.getKey('Records per page'))"
        >
          <template v-slot:top>
          <q-select
              v-model="filters.status"
              :options="levelOptions"
              outlined
              style="width: 200px"
              dense
              emit-value
              map-options
              class="q-mr-sm q-mt-sm"
              :label="$t('member_status')"
              :option-label="(name) => $t(Utils.getKey(name))"
              clearable
            />
            <q-input
            v-model="filters.member_ID"
            outlined
            style="width: 200px"
            dense
            class="q-mr-sm q-mt-sm"
            :label="$t('member_ID')"
            :option-label="(name) => $t(Utils.getKey(name))"
            clearable
          />
            <el-date-picker
              class="q-mr-sm q-mt-sm"
              v-model="filters.dates"
              type="daterange"
              :range-separator="$t(Utils.getKey('To'))"
              :start-placeholder="$t(Utils.getKey('Start date'))"
              :end-placeholder="$t(Utils.getKey('End date'))"
              value-format="YYYY-MM-DD"
            />

             <q-btn
              class="q-mr-sm q-px-sm q-ml-sm capitalize"
              color="primary"
              @click="onSearch"
              >{{ $t("search") }}</q-btn
            >

            <q-btn
              class="q-mr-sm q-px-sm q-ml-sm capitalize"
              color="warning"
              @click="resetFilters"
              >{{ $t("reset") }}</q-btn
            >
            <!-- <q-btn
              :disable="loading"
              @click="showAdd = true"
              color="primary"
              :label="$t('new_member')"
            /> -->
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
          <!-- no data -->
          <template v-slot:no-data>
            <q-icon
              style="margin-right: 5px"
              class="fas fa-exclamation-triangle"
            />
            {{ $t(Utils.getKey("No matching records found")) }}
          </template>
          <template v-slot:body-cell-sl="props">
            <q-td>
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>
          <template v-slot:body-cell-phone_number="props">
            <q-td class="text-center">
              {{ props.row.idd }}-{{ props.row.phone_number }}
            </q-td>
          </template>
          <template v-slot:body-cell-member_ID="props">
            <q-td class="text-center">
              {{ props.row.member_ID }}
            </q-td>
          </template>

          <template v-slot:body-cell-first_name="props">
            <q-td class="text-left">
              {{ props.row.first_name }} {{ props.row.last_name }}
            </q-td>
          </template>

          <template v-slot:body-cell-display_name="props">
            <q-td class="text-left">
              {{ props.row.display_name }}
            </q-td>
          </template>

          <template v-slot:body-cell-email="props">
            <q-td class="text-left">
              {{ props.row.email }}
            </q-td>
          </template>

          <template v-slot:body-cell-referral_code="props">
            <q-td class="text-left">
              {{ props.row.referral_code }}
            </q-td>
          </template>

          <template v-slot:body-cell-parent_referral_code="props">
            <q-td class="text-left">
              {{ props.row.parent_referral_code }}
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td class="text-center">
            <q-chip
                size="sm"
                :label="
                  props.row.status == 'active' ? $t('active') : $t('inactive')
                "
                :color="getStatusColor(props)"
                :class="'text-white'"
              />
            </q-td>
          </template>

            <template v-slot:body-cell-amount="props">
            <q-td class="text-right">
              {{ props.row.amount?props.row.amount.toFixed(2):'0.00' }}
            </q-td>
          </template>

          <template v-slot:body-cell-bet_amount="props">
            <q-td class="text-right">
            {{ props.row.bet_amount?props.row.bet_amount.toFixed(2):'0.00' }}
            </q-td>
          </template>

          <template v-slot:body-cell-win_loss="props">
            <q-td class="text-right">
            {{ props.row.win_lose_amount?props.row.win_lose_amount.toFixed(2):'0.00' }}

            </q-td>
          </template>


          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              <q-btn
                v-if="Utils.hasPermissions(['Members: Edit/Update Members'])"
                class="q-mr-sm"
                size="xs"
                rounded
                padding="5px"
                color="primary"
                icon="fas fa-pen"
                @click="onEditClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
              </q-btn>

              <q-btn
                v-if="Utils.hasPermissions(['User: Edit/Update User'])"
                class="q-mr-sm"
                size="xs"
                rounded
                padding="5px"
                color="primary"
                icon="mdi-filter-remove-outline"
                @click="onResetClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Reset Password")) }}</q-tooltip>
              </q-btn>

              <q-btn
                v-if="Utils.hasPermissions(['Members: Edit/Update Members'])"
                class="q-mr-sm"
                size="xs"
                rounded
                padding="5px"
                color="primary"
                icon="fa fa-expand"
                @click="onShowMlmTreeClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("view mlm tree")) }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
          <template v-slot:bottom-row>
          <q-tr>
            <q-td class="text-center">
              Total
            </q-td>
            <q-td>

            </q-td>
            <q-td class="text-right">
            {{Utils.formatCurrency(totalWalletAmounts) }}
            </q-td>
            <q-td class="text-right">
            {{ Utils.formatCurrency(totalBetAmounts) }}
            </q-td>
            <q-td class="text-right">
            {{ Utils.formatCurrency(totalWinAmounts) }}
            </q-td>
            <q-td>

            </q-td>
            <q-td>

            </q-td>
            <q-td>

            </q-td>
          </q-tr>
         </template>

        </q-table>


      </q-card-section>
      <q-card-section v-else>
          <show-mlm-tree @onClose="showMlmTreeView = false" :data="selectedShowMlmTree" @onBack="onRefresh" />
      </q-card-section>
      <Loading :loading="saving" />
    </q-card>

    <q-dialog v-model="resetPassword" persistent>
      <reset
        :data="selectedMembers"
        @onClose="resetPassword = false"
        @onUpdated="resetPassword = false"
      />
    </q-dialog>

    <q-dialog v-model="showAdd" position="top" persistent>
      <add-user @onClose="showAdd = false" @onAdded="onRefresh(filter)" />
    </q-dialog>

    <q-dialog v-model="showEdit" position="top" persistent>
      <edit-member
      :data="selectedMembers"
        @onClose="showEdit = false"
        @onUpdated="onRefresh"
      />
    </q-dialog>

    <q-dialog v-model="showConfirm" persistent>
      <confirm
        @confirm="onDelete"
        @cancel="showConfirm = false"
        message="Are you sure you want to delete this Member?"
        :button-label="$t(Utils.getKey('Delete'))"
      />
    </q-dialog>
    <!-- <q-dialog v-model="showMlmTreeView" position="top" persistent>

    </q-dialog> -->
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import useTable from "../../composables/useTable";
import useMember from "../../composables/useMember";
import moment from "moment";
import Utils from "../../helpers/Utils";

import Breadcrumbs from "../../components/Menu/BreadCrumbs.vue";
import AddButton from "../../components/Buttons/AddButton.vue";
import AddMember from "../../components/Members/Add.vue";
import EditMember from "../../components/Members/Edit.vue";
import showMlmTree from "../../components/Members/ShowMlmTree.vue";
import Confirm from "../../components/Shared/Confirm.vue";
import Reset from "../../components/Members/Reset.vue";
import Loading from "src/components/Shared/Loading.vue";

import AddUser from "../../components/Members/Add.vue";
import Auth from "src/store/auth";

const { loading, getAllLevel, columns, items, trash, paginate, totalWalletAmounts, totalBetAmounts, totalWinAmounts } = useMember();
const {
  showAdd,
  showEdit,
  selected,
  showConfirm,
  pagination,
  onDelete,
  onRequest,
  onRefresh,
} = useTable(paginate, trash);

const showMlmTreeView = ref(false);
const selectedMembers = ref();
const selectedShowMlmTree = ref();
const showAddLanguage = ref(false);
const resetPassword = ref(false);

{/* const filters = reactive({
  level: [],
  member_ID: "",
  dates: [],
}); */}

const filters = ref({
  member_ID: "",
  dates: [],
  status: "all",
  agent_referral_code: Auth.state.user.referral_code
});
const levelOptions = ref(['all','active', 'inactive']);

const onSearch = () => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "member_ID",
      agent_referral_code: Auth.state.user.referral_code
    },
    filter: filters.value,
  });
};
onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "member_ID",
      agent_referral_code: Auth.state.user.referral_code
    },
    filter: undefined,
  });
});

const dates = ref([]);
const defaultDate = [
  moment().startOf("day").format("YYYY-MM-DD"),
  moment().endOf("day").format("YYYY-MM-DD"),
];

const onEditClick = (row) => {
  showEdit.value = true;
  selectedMembers.value = row;
};

const onShowMlmTreeClick = (row) => {
  showMlmTreeView.value = true;
  selectedShowMlmTree.value = row;
};

const onDeleteClick = (row) => {
  showConfirm.value = true;
  selected.value = [row];
};
const onResetClick = async (row) => {
  resetPassword.value = true;
  selectedMembers.value = row;
};
const resetFilters = () => {
  let f = {
    member_ID: "",
    level: 0,
    dates: []
  }
  filters.value = f
  filters.value.dates = []
  console.log('reset             ', filters.value);
  onSearch();
  // onRequest();
};

const getStatusColor = (props) => {
  if (props.row.status === "active") {
    return "positive";
  }
  return "negative";
};
</script>
