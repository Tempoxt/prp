<template>
  <el-dialog :title="isEdit ? '修改需求' : '添加需求'" :visible="show" width="800px" @close="close">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" :inline="true" class="demo-ruleForm">
      <el-form-item class="global_style" label="姓名" prop="nam">
        <el-input v-model="ruleForm.nam" placeholder="请输入"></el-input>
      </el-form-item>
      
      <el-form-item class="global_style" label="性别" prop="gender">
        <el-select v-model="ruleForm.gender" placeholder="请输入">
          <el-option label="男" :value="0"></el-option>
          <el-option label="女" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="global_style" label="手机" prop="phone">
        <el-input v-model="ruleForm.phone" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item class="global_style" label="邮箱" prop="mail">
        <el-input v-model="ruleForm.mail" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item class="global_style" label="部门" prop="dep">
        <el-input v-model="ruleForm.dep" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item class="global_style" label="职务" prop="duty">
        <el-input v-model="ruleForm.duty" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item class="global_style" label="年龄" prop="age">
        <el-input v-model="ruleForm.age" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item class="global_style" label="备注" prop="remark">
        <el-input type="textarea" v-model="ruleForm.remark" placeholder="请输入"></el-input>
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
  name: 'add_relation',
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    select_items: {
      type: Object,
      default: {},
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ruleForm: {
        // nam: undefined,
        // gender: undefined,
        // phone: undefined,
        // mail: undefined,
        // dep: undefined,
        // duty: undefined,
        // age: undefined,
        // remark: undefined
        nam: 'ccc',
        gender: 1,
        phone: '15017082144',
        mail: '844735554@qq.com',
        dep: '资讯科技部',
        duty: 'ccc323',
        age: '99',
        remark: 'ddd'
      },
      rules: {

      }
    }
  },
  async mounted() {
    this.init()
  },
  methods: {
    async close() {
      await Promise.resolve(this.$emit('update:show', false))
      this.$emit("close");
    },
    handlerCb(func, ...data) {
      this[func](...data);
    },
    init() {
      if (this.isEdit) {
        this.data_recall(this.ruleForm, this.select_items)
      }
    },
    // 默认回显数据方式
    data_recall(form, data) {
      let f = Object.entries(form)
      for (let item of f) {
        data[item[0]] ? form[item[0]] = data[item[0]] : ''
      }
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
          f.append('bus_id', qs.parse(sessionStorage.getItem('require_info')).bus_id)
          let res
          if (!this.isEdit) {
            res = await this.$request.post('/p/front/demand/link', f, {
              headers: {
                "Content-Type": "multipart/form-data",
              }
            }) 
          } else {
            f.append('id', this.select_items.id)
            res = await this.$request.put('/p/front/demand/link', f, {
              headers: {
                "Content-Type": "multipart/form-data",
              }
            }) 
          }
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
  },
}
</script>

<style lang="scss" scoped>
.global_style {
  width: 360px;
  /deep/.el-form-item__content {
    width: 220px;
  }
  .el-select {
    width: 100%;
  }
  
}
.by_uid, .to_uid {
  width: 360px;
  div {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }
}
.to_uid {
  width: 260px;
}
.remark {
  width: 100%;
  padding: 10px 0px;
  /deep/.el-form-item__content {
    width: 590px;
  }
}
</style>
</style>