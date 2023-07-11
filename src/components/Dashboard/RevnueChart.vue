<template>
  <div
    class="col-md-6 col-sm-12 q-mt-sm col-xs-12 px-2"
  >

    <!-- <v-chart id="online-chart" :option="optionsBar" autoresize /> -->
    <q-card-section class="pt-0">
        <span class="text-body1 text-bold">{{
        $t(Utils.getKey("Profit/Loss"))
      }}</span>
      <q-space />
      <el-date-picker
        class="q-mt-xs d_100"
        v-model="revenueChart.range"
        type="daterange"
        :range-separator="$t(Utils.getKey('To'))"
        :start-placeholder="$t(Utils.getKey('Start date'))"
        :end-placeholder="$t(Utils.getKey('End date'))"
        value-format="YYYY-MM-DD"
      />
      <div class="d_flex_between mt-2 ">
        <div  style="width: 100%" class="b_l_orange green pa-2 d_flex_center r_4 text-bold">
          {{ Utils.formatCurrency(revenue.profit_amount <0 ? revenue.profit_amount*(-1) : revenue.profit_amount ) || "0.00" }}
        </div>
            <div  style="width: 100%" class="b_l_orange red pa-2 ml-3 d_flex_center r_4 text-bold">
              {{ Utils.formatCurrency(revenue.loss_amount < 0 ? revenue.loss_amount*(-1): revenue.loss_amount) || "0.00" }}
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
  moment().startOf("month").format("YYYY-MM-DD"),
  moment().endOf("month").format("YYYY-MM-DD"),
];
const revenueChart = ref({
  range: defaultDate,
});

const revenue = ref({
  profit_amount: 0,
  loss_amount: 0,
});


const optionsBar = ref({
  // tooltip: {
  //   trigger: "item",
  //   formatter: `{b} <br/>${t(Utils.getKey("Profit Amounts"))} : {c}`,
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
  color: ["#F26522", "#2b7eeb"],
  series: [
    {
      data: [653, 56, 901, 934, 44, 66, 1320],
      type: "line",
      smooth: true,
    },
  ],
});
getRevenueChart();

watch(
  () => revenueChart.value.range,
  async (newValue, oldValue) => {
    getRevenueChart();
  },
  { deep: true }
);

async function getRevenueChart() {
  try {
    const response = await stats.revenueChart({
      dates: revenueChart.value.range,
    });
    revenue.value = response.data;
  } catch (e) {}
}
</script>
