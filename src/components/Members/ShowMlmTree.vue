<template>
  <div class="px-4">
    <q-btn class="" @click="emit('onClose')" flat icon="mdi-backburger">
      {{ $t("back") }}
    </q-btn>
    <q-separator class="mb-2" />
    <div>
      <div class="row row_content">
        <div class="col-md-4 col-sm-12 col-12">
          <div class="q-pa-md q-gutter-sm">
            <q-tree
              :nodes="items"
              default-expand-all
              lazy="false"
              v-model:selected="selected"
              node-key="id"
              @lazy-load="onLazyLoad"
            ></q-tree>
          </div>
        </div>
        <div style="padding-left: 128px" class="col-md-8 col-sm-12  col-12">
          <Loading :loading="isLoading" />
          <div class="progress-container">
            <div class="progress" id="progress"></div>
            <div class="circle active">
              <div class="icon">{{ $t("level_1") }}</div>
              <div class="progress" id="progress"></div>
              <div class="content px-3">
                <div class="row" style="min-height: 60px">
                  <div class="col-sm-6 col-12 col-md-3  py-3">
                    <p class="mb-1">{{ $t("members_count") }}</p>
                    <p class="font_18 text-bold">
                      {{ memberDetail.level_one?.members_count }}
                    </p>
                  </div>
                  <div class="col-sm-6 col-12 col-md-3 text-right py-3">
                    <p class="mb-1">{{ $t("transaction_amount") }}</p>
                    <p class="font_18 text-bold text-right">
                      {{ Utils.formatCurrency(memberDetail.level_one?.transaction_amount || 0) }}
                    </p>
                  </div>
                  <div class="col-sm-6 col-12 col-md-3 text-right py-3">
                    <p class="mb-1">{{ $t("commission") }}</p>
                    <p class="font_18 text-bold text-right">
                      {{ Utils.formatCurrency(memberDetail.level_one?.commission || 0) }}
                    </p>
                  </div>
                  <div class="col-sm-6 col-12 col-md-3 text-center  py-3">
                    <p class="mb-1">{{ $t("action") }}</p>
                    <p @click="onViewDetial(memberDetail.level_one)" class="font_12 blue text-bold pointer">
                      {{ $t("view_details") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="circle active">
              <div class="icon">{{ $t("level_2") }}</div>
              <div class="progress" id="progress"></div>
              <div class="content px-3">
                <div class="row" style="min-height: 60px">
                  <div class="col-sm-6 col-12 col-md-3  py-3">
                    <p class="mb-1">{{ $t("members_count") }}</p>
                    <p class="font_18 text-bold">
                      {{ memberDetail.level_two?.members_count }}
                    </p>
                  </div>
                  <div class="col-sm-6 col-12 col-md-3 text-right py-3">
                    <p class="mb-1">{{ $t("transaction_amount") }}</p>
                    <p class="font_18 text-bold text-right">
                      {{ Utils.formatCurrency(memberDetail.level_two?.transaction_amount || 0) }}
                    </p>
                  </div>
                  <div class="col-sm-6 col-12 col-md-3 text-right py-3">
                    <p class="mb-1">{{ $t("commission") }}</p>
                    <p class="font_18 text-bold text-right">
                      {{ Utils.formatCurrency( memberDetail.level_two?.commission || 0 ) }}
                    </p>
                  </div>
                  <div class="col-sm-6 col-12 col-md-3 text-center py-3">
                    <p class="mb-1">{{ $t("action") }}</p>
                    <p @click="onViewDetial(memberDetail.level_two)" class="font_12 blue text-bold pointer">
                      {{ $t("view_details") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="circle active">
              <div class="icon">{{ $t("level_3") }}</div>
              <div class="progress" id="progress"></div>
              <div class="content px-3">
                <div class="row" style="min-height: 60px">
                  <div class="col-sm-6 col-12 col-md-3  py-3">
                    <p class="mb-1">{{ $t("members_count") }}</p>
                    <p class="font_18 text-bold">
                      {{ memberDetail.level_three?.members_count }}
                    </p>
                  </div>
                  <div class="col-sm-6 col-12 col-md-3 text-right py-3">
                    <p class="mb-1">{{ $t("transaction_amount") }}</p>
                    <p class="font_18 text-bold text-right">
                      {{ Utils.formatCurrency( memberDetail.level_three?.transaction_amount || 0) }}
                    </p>
                  </div>
                  <div class="col-sm-6 col-12 col-md-3 text-right py-3">
                    <p class="mb-1">{{ $t("commission") }}</p>
                    <p class="font_18 text-bold text-right">
                      {{ Utils.formatCurrency(memberDetail.level_three?.commission || 0) }}
                    </p>
                  </div>
                  <div class="col-sm-6 col-12 col-md-3 text-center  py-3">
                    <p class="mb-1">{{ $t("action") }}</p>
                    <p @click="onViewDetial(memberDetail.level_three)" class="font_12 pointer blue text-bold">
                      {{ $t("view_details") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="circle active">
              <div class="icon total">{{ $t("total") }}</div>
              <div class="progress" id="progress"></div>
              <div class="content px-3 b_green">
                <div class="row" style="min-height: 60px">
                  <div class="col-sm-6 col-12 col-md-3  py-3">
                    <p class="mb-1">{{ $t("members_count") }}</p>
                    <p class="font_18 text-bold">
                      {{ memberDetail.total_members}}
                    </p>
                  </div>
                  <div class="col-sm-6 col-12  col-md-3  text-right py-3">
                    <p class="mb-1">{{ $t("transaction_amount") }}</p>
                    <p class="font_18 text-bold text-right">
                      {{ Utils.formatCurrency( memberDetail.total_transaction || 0) }}
                    </p>
                  </div>
                  <div class="col-sm-6 col-12 col-md-3 text-right  py-3">
                    <p class="mb-1">{{ $t("commission") }}</p>
                    <p class="font_18 text-bold ">
                      {{ Utils.formatCurrency(memberDetail.total_commissions || 0) }}
                    </p>
                  </div>
                  <div class="col-sm-6 col-12 col-md-3 text-center py-3">
                    <p class="mb-1">{{ $t("action") }}</p>
                    <p @click="onViewDetial(memberDetail.total_members_data)" class="font_12 blue pointer text-bold">
                      {{ $t("view_details") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <q-dialog v-model="showMemberDetail"  persistent>
      <detail
        :data="memberDetailSelect"
        @onClose="showMemberDetail = false"
      />
    </q-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import useMember from "src/composables/useMember";
import Utils from "../../helpers/Utils";
import detail from './Details.vue'
import { useI18n } from "vue-i18n";
import Loading from "src/components/Shared/Loading.vue";

const { t } = useI18n();
const props = defineProps({ data: Object });
const emit = defineEmits(["onClose", "onUpdated"]);

const $q = useQuasar();
const { update, get } = useMember();
const member = ref({ ...props.data });
const memberDetail = ref({});
const memberDetailSelect = ref({})
const showMemberDetail = ref(false)
const selected = ref("");
const isLoading = ref(true)
const items = [
  {
    label: member.value.member_ID,
    lazy: true,
    id: member.value.id,
    member: member.value,
    icon: 'fa fa-users',
  },
];

watch(()=> selected.value , ()=> {
  if(selected.value != null){
    getMember(selected.value)
  }
})
const onLazyLoad = async ({ node, key, done, fail }) => {
  // let memberGet = await get(node.id);
  setTimeout(() => {
    const member = node.member;
    const label = [];
    member.mlm_tree?.map((m) => {
      const obj = {
        label: m.member_ID,
        lazy: true,
        member: m,
        id: m.id,
        icon: "fa fa-users",
      };
      label.push(obj);
    });
    done(label);
  }, 100);
};

const onViewDetial = (lv) => {
  if(lv.members == undefined){
    console.log('va',lv)
    lv['members'] = lv
  }
  memberDetailSelect.value = lv
  showMemberDetail.value = true
}

const getMember = async (id) => {
  try{
    isLoading.value = true
    let memberGet = await get(id);
    memberDetail.value = memberGet.data;
    isLoading.value = false
  } catch (err)  {
    $q.notify({
      position: "top-right",
      type: "negative",
      icon: "fas fa-exclamation-triangle",
      message: t(Utils.getKey(err.message.toString())),
    });
    isLoading.value = false
  }

};
onMounted(() => {
  getMember(props.data.id);
});

</script>

<style scoped>
/* :root {
  --background-color: #fff;
  --light-grey: #c4c1c1;
  --accent-color: #f26522;
} */

/* body {
  font-family: "Poppins", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0;
  font-size: 16px;
  background-color: var(--background-color);
} */

.content p {
  line-height: 16px;
}

.progress-container {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 60px;
  max-width: 100%;
  height: 350px;
  flex-direction: column;
}

/* .progress-container::before {
    content: "";
    background-color: var(--light-grey);
    position: absolute;
    top: 50%;
    left: 6px;
    transform: translateY(-50%);
    height: 100%;
    width: 4px;
    z-index: -1;
} */

.circle .progress {
  height: 54px;
  width: 10px;
  margin-bottom: 93px;
  position: absolute;
  border-left: 6px;
  border-right: 6px;
  background: #e7e7e7;
}

.circle .content {
  position: absolute;
  width: 95%;
  color: #726565 !important;
  right: 0px;
  border: 1px solid #d1d1d1;
  border-radius: 6px;
  padding: 3px;
}
.circle .b_green {
  border: 1px solid #1aad19 !important;
}
.circle .content::before {
  content: "";
  position: absolute;
  bottom: 31%;
  width: 0px;
  left: -11px;
  /* border-right-color: red; */
  height: 0;
  border-right: 11px solid #cbcbcb;
  border-top: 12px solid #9d555500;
  border-bottom: 12px solid transparent;
}

.circle .progress::before {
  content: "";
  position: absolute;
  width: 0;
  left: -1px;
  height: 0;
  bottom: -8px;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 10px solid #e7e7e7;
}

.circle {
  background: #c4c1c1;
  color: #fff;
  border-radius: 50%;
  height: 8px;
  width: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 6px solid #c4c1c1;
  transition: 0.4s ease;
}

.circle.active {
  border-color: #f26522;
  background: #fff;
  /* background-color: #fff;
  color: var(--accent-color);
  scale: 1.1; */
}

.circle .icon {
  position: absolute;
  font-size: 25px;
  left: -128px;
  background: #f26522;
  width: 92px;
  height: 26px;
  line-height: 25px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
}
.circle .total {
  background: #1aad19 !important;
}
.circle .total::before {
  border-left: 20px solid #1aad19 !important;
}
.circle .icon::before {
  content: "";
  position: absolute;
  right: -20px;
  bottom: 0;
  width: 0;
  height: 0;
  border-left: 20px solid #f26522;
  border-top: 13px solid transparent;
  border-bottom: 17px solid transparent;
  border-bottom: 13px solid transparent;
}
.circle .icon::after {
  content: "";
  position: absolute;
  bottom: 0;
  width: 0;
  left: 0px;
  height: 0;
  border-left: 8px solid #ffffff;
  border-top: 13px solid transparent;
  border-bottom: 13px solid transparent;
}
.circle .caption {
  position: absolute;
  font-size: 14px;
  font-weight: bolder;
  color: #fff;
  bottom: -30px;
}

.btn {
  background: #f26522;
  color: #fff;
  border: 0;
  border-radius: 20px;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  padding: 8px 30px;
  margin: 5px;
}

.btn:active {
  transform: scale(0.9);
}

.btn:focus {
  outline: 0;
}

.btn:disabled {
  background-color: #c4c1c1;
  cursor: not-allowed;
}

@media only screen and (max-width: 1010px) {
  .progress-container {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 60px;
    max-width: 100%;
    height: 1150px;
    flex-direction: column;
    margin-bottom: 50px;
  }
  .px-4 {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .circle .content {
    position: absolute;
    width: 85%;
    color: #726565 !important;
    right: 0px;
    border: 1px solid #d1d1d1;
    border-radius: 6px;
    padding: 3px;
  }
  .circle .progress {
    height: 252px;
    width: 10px;
    margin-bottom: 296px;
    position: absolute;
    border-left: 6px;
    border-right: 6px;
    background: #e7e7e7;
  }
  .row_content {
    margin-bottom: 70px;
  }
  .circle .content::before {
    content: "";
    position: absolute;
    bottom: 44%;
    width: 0px;
    left: -11px;
    /* border-right-color: red; */
    height: 0;
    border-right: 11px solid #cbcbcb;
    border-top: 12px solid #9d555500;
    border-bottom: 12px solid transparent;
  }
  .circle .text-center{
    text-align: right !important;
  }
}
</style>
