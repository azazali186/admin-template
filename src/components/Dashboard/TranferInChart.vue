<template>
  <div class="col-md-6 col-sm-12 col-xs-12 px-2 q-mt-sm chart-container">
    <!-- <v-chart id="online-chart" :option="optionsBar" autoresize /> -->
    <q-card-section class="d_flex_center pt-0">
      <div class="">
        <span class="text-body1 text-bold">{{
          $t(Utils.getKey("Tranfer In"))
        }}</span>
        <el-date-picker
          class="q-mt-xs d_100"
          v-model="TranferIn.range"
          type="daterange"
          :range-separator="$t(Utils.getKey('To'))"
          :start-placeholder="$t(Utils.getKey('Start date'))"
          :end-placeholder="$t(Utils.getKey('End date'))"
          value-format="YYYY-MM-DD"
        />
        <div
          style="width: 100%"
          class="b_l_orange green  pa-2 mt-2 d_flex_center r_4 text-bold"
        >
          {{ Utils.formatCurrency(purchase.total) || "0.00" }}
        </div>
      </div>
    </q-card-section>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import moment from "moment";
import Utils from "src/helpers/Utils";
import useStats from "../../composables/useStats";
import { useI18n } from "vue-i18n";

// for chart
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, LineChart, BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  BarChart,
]);
// end

const { t } = useI18n();
const { locale } = useI18n({ useScope: "global" });

use([
  CanvasRenderer,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
]);
const stats = useStats();
const statsLoading = ref(true);
const defaultDate = [
  moment().startOf("day").format("YYYY-MM-DD"),
  moment().endOf("day").format("YYYY-MM-DD"),
];
const TranferIn = ref({
  range: defaultDate,
});
const purchase = ref({
  total: 0,
});
const optionsBar = ref({
  // tooltip: {
  //   trigger: "item",
  //   formatter: `{b} <br/>${t(Utils.getKey("Amounts"))} : {c}`,
  // },
  grid: {
    left: 30,
    right: 5,
    top: 30,
    // bottom: 30,
  },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  color: ["#009f27", "#2b7eeb"],
  series: [
    {
      data: [653, 56, 901, 934, 44, 66, 1320],
      type: "line",
      smooth: true,
    },
  ],
});
getTranferIn();

watch(
  () => TranferIn.value.range,
  async (newValue, oldValue) => {
    getTranferIn();
  },
  { deep: true }
);

async function getTranferIn() {
  try {
    const response = await stats.tranferAmount({
      dates: TranferIn.value.range,
      type: "Credit",
    });
    purchase.value = response.data;
  } catch (e) {}
}
</script>

<style scoped>

</style>
