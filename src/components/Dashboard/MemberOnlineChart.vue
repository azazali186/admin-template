<template>
  <div
    class="col-md-6 col-sm-12 col-xs-12 q-mt-md chart-container"
    v-if="!statsLoading"
    :style="{ height: '400px' }"
  >
    <q-bar dark class="chart-qbar q-py-lg">
      <span class="text-body1">{{ $t(Utils.getKey("Online Count")) }}</span>
      <q-space />
      <el-date-picker
        class="q-mt-xs q-mr-sm input_whiteF"
        v-model="onlineStats.range"
        type="daterange"
        :range-separator="$t(Utils.getKey('To'))"
        :start-placeholder="$t(Utils.getKey('Start date'))"
        :end-placeholder="$t(Utils.getKey('End date'))"
        value-format="YYYY-MM-DD"
      />
    </q-bar>
    <v-chart id="online-chart" :option="onlineStats.option" autoresize />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import moment from "moment";
import Utils from "src/helpers/Utils";
import useStats from "../../composables/useStats";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { useI18n } from "vue-i18n";

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

const onlineStats = ref({
  range: defaultDate,
  option: {
    tooltip: {
      trigger: "item",
      formatter: `{b} <br/>${t(Utils.getKey("Online Counts"))} : {c}`,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [],
        type: "line",
        areaStyle: {},
        color: ["#03507e"],
        emphasis: {
          label: {
            show: true,
            fontSize: "16",
            fontWeight: "bold",
          },
        },
      },
    ],
  },
});

getOnlineStats();

watch(
  () => onlineStats.value.range,
  async (newValue, oldValue) => {
    getOnlineStats();
  },
  { deep: true }
);

async function getOnlineStats() {
  try {
    // const response = await stats.getOnlineStats({
    //   dates: (onlineStats.value.range = onlineStats.value.range || defaultDate),
    // });
    // onlineStats.value.option.xAxis.data = response.data.map(
    //   (item) => item.date
    // );
    // onlineStats.value.option.series[0].data = response.data.map(
    //   (item) => item.total
    // );
    // statsLoading.value = false;
  } catch (e) {}
}
</script>
