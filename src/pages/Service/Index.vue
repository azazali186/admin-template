<template>
  <q-page :class="!store.leftDrawerOpen ? 'ml-5' : ''">
    <q-card
      class="mt-3"
      style="margin-left: 0px; box-shadow: none; min-height: 100vh"
    >
      <q-card-section>
        <q-table
          flat
          color="primary"
          :loading="loading"
          :rows="items"
          row-key="id"
          :columns="columns"
          v-model:pagination="pagination"
          :filter="filters"
          @request="onRequest"
          :rows-per-page-options="[10, 15, 20, 50, 100, 150, 200, 500]"
          binary-state-sort
          :rows-per-page-label="$t(Utils.getKey('Records per page'))"
        >
          <template v-slot:top>
            <q-input
              dense
              outlined
              debounce="300"
              v-model="filters.search"
              :placeholder="$t(Utils.getKey('Search'))"
              style="width: 300px"
            />
            <q-btn
              class="q-mr-sm q-mt-xs"
              dense
              color="primary"
              icon="mdi-filter-remove-outline"
              rounded
              style="margin-left: 10px"
              @click="resetFilters"
            />
            <q-space />

            <add-button
              v-if="Utils.hasPermissions(['CustomerServiceSetting: Create CustomerServiceSetting'])"
              :disable="loading"
              @click="showAdd = true"
              tooltip-text="Add"
              color="primary"
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
          <template v-slot:body-cell-description="props">
            <q-td>
              {{
                props.row.description != "undefined"
                  ? props.row.description
                  : ""
              }}
            </q-td>
          </template>

          <template v-slot:body-cell-app_display="props">
            <q-td class="text-center">
              <img :src="props.row?.image[0].path" style="height: 40px" />
            </q-td>
          </template>
          <template v-slot:body-cell-icon="props">
            <q-td class="text-center">
              <img :src="props.row?.image[1].path" style="height: 40px" />
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td class="text-center">
              <q-chip
                size="sm"
                :label="props.row.status == 1 ? $t('active') : $t('inactive')"
                :color="getStatusColor(props)"
                :class="'text-white'"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              <q-btn
                v-if="Utils.hasPermissions(['CustomerServiceSetting: Edit/Update CustomerServiceSetting'])"
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
                v-if="Utils.hasPermissions(['CustomerServiceSetting: Create CustomerServiceSetting'])"
                class="q-mr-sm"
                size="xs"
                rounded
                padding="5px"
                color="negative"
                icon="fas fa-trash"
                @click="onDeleteClick(props.row)"
              >
                <q-tooltip>{{ $t(Utils.getKey("Edit")) }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <Loading :loading="loading" />
    </q-card>

    <q-dialog v-model="showAdd" position="top" persistent>
      <add-service @onClose="showAdd = false" @onAdded="onRefresh" />
    </q-dialog>

    <q-dialog v-model="showEdit" position="top" persistent>
      <edit-service
        :data="selectedCategory"
        @onClose="showEdit = false"
        @onUpdated="onRefresh"
      />
    </q-dialog>

    <q-dialog v-model="showConfirm" persistent>
      <confirm
        @confirm="onDelete"
        @cancel="showConfirm = false"
        message="Are you sure you want to delete it"
        :button-label="$t(Utils.getKey('Delete'))"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import useTable from "../../composables/useTable";
import useCustomerService from "../../composables/useCustomerService";
import Utils from "../../helpers/Utils";
import Loading from "src/components/Shared/Loading.vue";
import { store } from "../../store/store";
import AddButton from "../../components/Buttons/AddButton.vue";
import EditService from "../../components/Service/Edit.vue";
import AddService from "../../components/Service/Add.vue";
import Confirm from "../../components/Shared/Confirm.vue";
import useLanguage from "src/composables/useLanguage";

const { all } = useLanguage();
const { loading, columns, items, trash, paginate } = useCustomerService();
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
const languages = ref([]);
const selectedCategory = ref();
const filters = reactive({
  search: "",
});

getData();
async function getData() {
  try {
    const response = await all();
    languages.value = response.data;
  } catch (error) {}
}

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "created_at",
    },
    filter: undefined,
  });
});

const onEditClick = (row) => {
  showEdit.value = true;
  selectedCategory.value = row;
};

const onDeleteClick = (row) => {
  showConfirm.value = true;
  selected.value = [row];
};

const getStatusColor = (props) => {
  if (props.row.status === 1) {
    return "positive";
  }
  return "negative";
};

const resetFilters = () => {
  for (const [key, value] of Object.entries(filters)) {
    filters[key] = "";
  }

  range.value = null;
};
</script>
