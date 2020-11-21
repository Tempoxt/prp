<template>
  <div>
    <el-popover
      placement="bottom"
      width="400"
      trigger="click">
      <org ref="tree" :option="treeOption" :operate="operate" @handlerCb="handlerCb">
        <template #treeSlot="{data}">
          <slot name="treeSlot" :data="data"></slot>
          <!--<div class="node_operate">
            <template v-if="data.option.treeData.operate.length && data.data.lock === 0">
              <i
                v-for="(item, i) in data.option.treeData.operate"
                :key="i"
                class="icon iconfont tree_operate"
                :class="[item.icon]"
                @click.stop="handlerCb(item.func, data.data)"
              ></i>
            </template>
          </div>-->
        </template>
      </org>
      <el-input slot="reference" :value="labelValue"></el-input>
    </el-popover>
  </div>
</template>
<script>
import org from "@/components/public/tree/org"

export default {
  props: {
    treeOption: {
      default: {},
      type: Object
    },
    operate: {
      type: Boolean,
      default: false
    },
    keyValue: {
      type: [Object, Array, String, Boolean, Number],
      default: undefined
    },
    labelValue: {
      type: String,
      default: ''
    }
  },
  components: {
    org
  },
  data() {
    return {

    }
  },
  methods: {
    handlerCb() {

    },
    async changeValue(v) {
      console.log(v)
      // await Promise.resolve(this.$emit('update:keyValue', v))
      if (this.treeOption.ex_cb) {
        if (this.treeOption.ex_cb) this.$emit("handlerCb", this.treeOption.ex_cb, v);
      }
    }
  }
  
}
</script>
<style lang="scss" scoped>
  /deep/.el-scrollbar {
    max-height: 360px !important;
    overflow: auto;
  }
  /deep/.scrollbar-wrapper {
      margin-bottom: -8px !important;
    }
</style>