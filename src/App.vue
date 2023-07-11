<template>
  <el-config-provider :locale="elLocale">
    <router-view />
  </el-config-provider>
</template>

<script>
export default {
  preFetch() {
    console.log("running preFetch");
  },
};
</script>
<script setup>
import { provide, computed, ref } from "vue";
import { useMeta, useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { ElConfigProvider } from "element-plus";
import auth from "./store/auth";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";
import km from "element-plus/dist/locale/km.mjs";
import Utils from "./helpers/Utils";

const { t, locale } = useI18n({ useScope: "global" });

const elLocale = computed(() => {
  switch (locale.value) {
    case "en":
      return en;
    case "ch":
      return zhCn;
    case "kh":
      return km;
    default:
      return en;
  }
});

const $q = useQuasar();
const onCheckTheme = async () => {
  $q.dark.set(true);
};
onCheckTheme();

const title = computed(() => t(Utils.getKey("Template Admin")));

useMeta(() => {
  return {
    title: title.value,
  };
});
const localKey = computed(() => {
  return locale.value;
});

// console.log('localKey       ', localKey.value)

provide("auth", auth);
provide("locale", localKey);
provide("currency_id", 1);
provide("leftDrawerOpen", "homeee");
</script>
