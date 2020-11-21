<template>
  <div class="outside">
    <el-dialog
      title="立项申请单"
      :visible.sync="show"
      width="1300px"
    >
      <form-c></form-c>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import formC from "./component/form_c"

export default {
  name: 'item_form',
  components: {
    formC,
  },
  props: {
    show: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
    
  },
}
</script>

<style lang="scss" scoped>
  .outside {
    width: 100%;
    height: 100%;
  }
</style>