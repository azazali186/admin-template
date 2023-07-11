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
              v-model="filters.name"
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
              v-if="Utils.hasPermissions(['Country: Create Country'])"
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
          <template v-slot:body-cell-iso="props">
            <q-td>
              <div>
                {{ props.row.iso }} &nbsp; {{ props.row.iso3 }}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-name="props">
            <q-td>
              <div>
                {{ props.row?.translates?.[locale]?.name }}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td class="text-center">
              <q-btn
                v-if="Utils.hasPermissions(['Country: Edit/Update Country'])"
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
                v-if="Utils.hasPermissions(['Country: Delete Country'])"
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
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showAdd" position="top" persistent>
      <add-Country @onClose="showAdd = false" :languages="languages" @onAdded="onRefresh" />
    </q-dialog>


    <q-dialog v-model="showEdit" position="top" persistent>
      <edit-Country
        :data="selectedCountry"
        :languages="languages"
        @onClose="showEdit = false"
        @onUpdated="onRefresh"
      />
    </q-dialog>

    <q-dialog v-model="showConfirm" persistent>
      <confirm
        @confirm="onDelete"
        @cancel="showConfirm = false"
        message="Are you sure you want to delete this Country"
        :button-label="$t(Utils.getKey('Delete'))"
      />
    </q-dialog>
</template>

<script setup>
import { onMounted, reactive, ref, inject } from "vue";
import useTable from "../../composables/useTable";
import useCountry from "../../composables/useCountry";
import Utils from "../../helpers/Utils";

import AddButton from "../../components/Buttons/AddButton.vue";
import AddCountry from "../../components/Country/Add.vue";
import EditCountry from "../../components/Country/Edit.vue";
import Confirm from "../../components/Shared/Confirm.vue";
import useLanguage from "src/composables/useLanguage";
const { all } = useLanguage();

const languages = ref([]);
const locale = inject('locale');
getData();
async function getData() {
  try {
    const response = await all();
    languages.value = response.data;
  } catch (error) { }
}
const { loading, columns, items, trash, paginate } = useCountry();
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

const selectedCountry = ref();
const filters = reactive({
  name: "",
});

onMounted(() => {
  onRequest({
    pagination: {
      ...pagination.value,
      sortBy: "updated_at",
    },
    filter: undefined,
  });
});

const onEditClick = (row) => {
  showEdit.value = true;
  selectedCountry.value = row;
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
