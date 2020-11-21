<template>
  <el-dialog title="客户反馈" :visible="show" width="800px" @close="close">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item class="global_style" prop="title">
        <el-radio-group v-model="ruleForm.res">
          <el-radio :label="0">通过</el-radio>
          <el-radio :label="1">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="global_style" label="反馈内容" prop="remark">
        <el-input type="textarea" v-model="ruleForm.res_info"></el-input>
      </el-form-item>
      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import qs from "qs";
export default {
  name: 'add_appendix',
  props: {
    show: {
      type: Boolean,
      default: true
    },
    select_items: {
      type: Object,
      default: {}
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ruleForm: {
        res_info: undefined,
        res: undefined
      },
      rules: {

      }
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    handleFile(file, fileList) {
      this.$set(this.ruleForm, 'data_list', fileList)
    },
    async close() {
      await Promise.resolve(this.$emit('update:show', false))
      this.$emit("close");
    },
    get_file_size(size) {
      return size < 1024
      ? size + "Byte"
      : size / 1024 < 1024
      ? (size / 1024).toFixed(2) + "Kb"
      : size / 1024 / 1024 < 1024
      ? (size / 1024 / 1024).toFixed(2) + "Mb"
      : (size / 1024 / 1024 / 1024).toFixed(2) + "Gb";
    },
    init() {
      if (this.select_items.feedback_tag !== 2) this.ruleForm.res = this.select_items.feedback_tag
    },
    async confirm() {
      this.$refs['ruleForm'].validate(async val => {
        if (val) {
          let f = new FormData()
          
          let obj = JSON.parse(JSON.stringify(this.ruleForm))
          let arr = Object.entries(obj)
          for (let item of arr) {
            f.append(item[0], item[1])
          }
          f.append('scheme_id', this.select_items.scheme_id)
          // f.append('bus_id', qs.parse(sessionStorage.getItem('require_info')).bus_id)
          let res = await this.$request.post("/p/front/demand/schemedetail/list", f, {
            headers: {
              "Content-Type": "multipart/form-data",
            }
          })
          if (res.code === 0) {
            this.$message({ type: 'success', message: res.msg })
            this.$emit('update:show', false)
            this.$emit('close')
          } else {
            this.$message({ type: 'error', message: res.msg })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .global_style {
    width: 560px;
    /deep/.el-form-item__content {
      width: 520px;
    }
    .el-select {
      width: 100%;
    }
    
  }
</style>