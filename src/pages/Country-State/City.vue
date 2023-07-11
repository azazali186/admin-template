<template>
  <q-card>
    <q-card-section>
      <q-table
        flat
        class="q-pt-md"
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
            v-model="filters.state_name"
            :placeholder="$t(Utils.getKey('Search by state Name'))"
            style="width: 300px;margin-right: 10px"
          />

          <q-input
            dense
            outlined
            debounce="300"
            v-model="filters.city_name"
            :placeholder="$t(Utils.getKey('Search by city Name'))"
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
            v-if="Utils.hasPermissions(['State: Create State'])"
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
        <template v-slot:body-cell-status="props">
          <q-td class="text-center">
            <q-chip size="sm" :label="$t(Utils.getKey(props.row.status.toUpperCase())).toUpperCase()" :color="getStatusColor(props)" :class="
              props.row.status !== 'active' ? 'text-black' : 'text-white'
            " />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td class="text-center">
            <q-btn
              v-if="Utils.hasPermissions(['State: Edit/Update State'])"
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
              v-if="Utils.hasPermissions(['State: Delete State'])"
              class="q-mr-sm"
              size="xs"
              rounded
              padding="5px"
              color="negative"
              icon="fas fa-trash"
              @click="onDeleteClick(props.row)"
            >
              <q-tooltip>{{ $t(Utils.getKey("Delete")) }}</q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-country_name="props">
            <q-td>
              <div>
                {{ props.row?.country?.translates?.[locale]?.name }}
              </div>
            </q-td>
        </template>
        <template v-slot:body-cell-state_name="props">
            <q-td>
              <div>
                {{ props.row?.state?.translates?.[locale]?.name }}
              </div>
            </q-td>
        </template>
        <template v-slot:body-cell-city_name="props">
            <q-td>
              <div>
                {{ props.row?.translates?.[locale]?.name }}
              </div>
            </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>

  <q-dialog v-model="showAdd" position="top" persistent>
    <add-states @onClose="showAdd = false" :country="countries" :languages="languages" :city="city" @onAdded="onRefresh" />
  </q-dialog>


  <q-dialog v-model="showEdit" position="top" persistent>
    <edit-states
      :data="selectedstates"
      :country="countries"
      :languages="languages"
      :city="city"
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
</template>

<script setup>
import { onMounted, reactive, ref, inject } from "vue";
import useTable from "../../composables/useTable";
import useCountryStates from "../../composables/useCountryStates";
import useCountry from "../../composables/useCountry";
import useLanguage from "../../composables/useLanguage";
import useCity from "../../composables/useCity";
import Utils from "../../helpers/Utils";

import Breadcrumbs from "../../components/Menu/BreadCrumbs.vue";
import AddButton from "../../components/Buttons/AddButton.vue";
import AddStates from "../../components/City/Add.vue";
import EditStates from "../../components/City/Edit.vue";
import Confirm from "../../components/Shared/Confirm.vue";

const { loading, columns, items, trash, paginate } = useCity();


const { all } = useCountry();
const languages = ref([]);
const states =  useCountryStates();
const lang =  useLanguage();
const locale = inject('locale');

getData();
async function getData() {
  try {
    const response = await lang.all();
    languages.value = response.data;
  } catch (error) { }
}
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

const selectedstates = ref();
const countries = ref();
const city = ref()
const showAddstates = ref(false);
const filters = reactive({
name: "",
});

onMounted(async () => {
onRequest({
  pagination: {
    ...pagination.value,
    sortBy: "city_name",
  },
  filter: undefined,
});
countries.value = await all();
city.value = await states.all();
});

const onEditClick = (row) => {
showEdit.value = true;
selectedstates.value = row;
};
const getStatusColor = (props) => {
  if (props.row.status === "active") {
    return "positive";
  }

  if (props.row.status === "inactive") {
    return "negative";
  }

  return "gray";
};
const onDeleteClick = (row) => {
showConfirm.value = true;
selected.value = [row];
};
const resetFilters = () => {
for (const [key, value] of Object.entries(filters)) {
  filters[key] = "";
}

range.value = null;
};
</script>
