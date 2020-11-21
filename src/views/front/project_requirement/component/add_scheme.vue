<template>
  <el-dialog title="添加附件" :visible="show" width="800px" @close="close">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item class="global_style" label="方案名称" prop="title">
        <el-input v-model="ruleForm.title" placeholder="请输入方案名称"></el-input>
      </el-form-item>
      <el-form-item class="global_style" label="备注" prop="remark">
        <el-input type="textarea" v-model="ruleForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item class="global_style" label="附件">
        <el-upload
          ref="up"
          class="upload-demo mar"
          action="#"
          multiple
          :auto-upload="false"
          :file-list="ruleForm.data_list"
          :on-change="handleFile"
        >
          <el-button size="mini" type="primary">
            选择文件
          </el-button>
        </el-upload>
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
        remark: undefined,
        data_list: [],
        title: undefined
      },
      rules: {
        title: [
          {required: true, message:'请输入方案名称', trigger: 'blur'}
        ]
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
      if (this.isEdit) {
        this.ruleForm.title = this.select_items.title
      }
    },
    async confirm() {
      this.$refs['ruleForm'].validate(async val => {
        if (val) {
          if (this.ruleForm.data_list.length === 0) return this.$message({ type: 'warning', message: '请上传附件' }) 
          let f = new FormData()
          
          let obj = JSON.parse(JSON.stringify(this.ruleForm))
          let arr = Object.entries(obj)
          for (let item of arr) {
            if (item[0] !== 'data_list') {
              // f.append(item[0], item[1])
            } else {
              let data_arr = []
              for (let i in this.ruleForm.data_list) {
                let word_arr = this.ruleForm.data_list[i].name.split('.')
                f.append('files', this.ruleForm.data_list[i].raw)
                data_arr.push({
                  siz: this.get_file_size(this.ruleForm.data_list[i].size),
                  format: '.' + word_arr[word_arr.length - 1],
                  name: this.ruleForm.data_list[i].name,
                  title: this.ruleForm.title,
                  remark: this.ruleForm.remark
                })
              }
              f.append(item[0], JSON.stringify(data_arr))
            }
          }
          if (this.isEdit) {f.append('scheme_id', this.select_items.scheme_id)}
          f.append('bus_id', qs.parse(sessionStorage.getItem('require_info')).bus_id)
          let res = await this.$request.post("/p/front/demand/scheme/list", f, {
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