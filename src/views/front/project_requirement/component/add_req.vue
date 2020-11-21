<template>
  <el-dialog :title="isEdit ? '修改需求' : '添加需求'" :visible="show" width="800px" @close="close">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" :inline="true" class="demo-ruleForm">
      <el-form-item class="global_style" label="所属部门" prop="dep_id">
        <select-tree v-if="depId_option"  ref="dep_tree" :treeOption="depId_option" :operate="false" @handlerCb="handlerCb" :labelValue.sync="depId_option.treeData.labelValue">
          <template #treeSlot="{data}">
            <div @click="test(data)">
              <i v-if="data.node" class="icon iconfont icon-wenjian1"></i>
              &nbsp;
              <span>{{ data.node.label }}</span>
            </div>
          </template>
        </select-tree>
      </el-form-item>
      <el-form-item class="global_style" label="需求模板" prop="m_id">
        <el-select v-model="ruleForm.m_id" placeholder="请选择需求模板" @change="set_template_type">
          <el-option v-for="(item, index) in template_option" :key="index" :label="item.nam" :value="item.m_id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="global_style" label="总负责人" prop="to_uid">
        <el-select 
          v-model="ruleForm.to_uid" 
          placeholder="请选择总负责人"
          filterable
          remote
          :loading="loading"
          :remote-method="(v) => get_to_uid_option(v, 1)"
        >
          <el-option v-for="(item, index) in to_uid_option" :key="index" :label="item.nam" :value="item.uid">
            <div class="to_uid flex">
              <div class="font_light_blue"> {{ item.nam }} </div>
              <div>{{ item.sta }}</div>
              <div>{{ item.position }}</div>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item 
        v-if="template_type === 1" 
        class="global_style" 
        label="需求负责人" 
        prop="by_uid"
      >
        <el-select 
          v-model="ruleForm.by_uid" 
          placeholder="请选择需求负责人"
          filterable
          remote
          :loading="loading"
          :remote-method="get_by_uid_option"
        >
          <el-option v-for="(item, index) in by_uid_option" :key="index" :label="item.ch_nam" :value="item.by_uid">
            <div class="by_uid flex">
              <div>
                <el-tooltip effect="dark" :content="item.nam" placement="top">
                  <div class="font_light_blue"> {{ item.nam }} </div>
                </el-tooltip>
              </div>
              
              <div>{{ item.sta }}</div>
              <div>{{ item.ch_nam }}</div>
              <div>{{ item.dep_nam }}</div>
              <div>{{ item.position }}</div>
            </div>
          </el-option>

        </el-select>
      </el-form-item>

      <el-form-item 
        v-if="template_type === 9" 
        class="global_style" 
        label="标准品类型" 
        prop="standard"
      >
        <el-select v-model="ruleForm.standard" placeholder="请选择标准品类型">
          <el-option v-for="(item, index) in standard_option" :key="index" :label="item.nam" :value="item.nam">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="global_style" label="需求名称" prop="nam">
        <el-input v-model="ruleForm.nam"></el-input>
      </el-form-item>
      <el-form-item class="global_style" label="客户名称" prop="client_nam">
        <el-input v-model="ruleForm.client_nam"></el-input>
      </el-form-item>
      <el-form-item class="global_style" label="产品名称" prop="pro_nam">
        <el-input v-model="ruleForm.pro_nam"></el-input>
      </el-form-item>
      <!-- <el-form-item class="global_style" label="业务员" prop="bus_uid">
        <el-select v-model="ruleForm.bus_uid" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item class="global_style" label="业务员" prop="bus_uid">
        <el-select 
          v-model="ruleForm.bus_uid" 
          placeholder="请选择业务员"
          filterable
          remote
          :loading="loading"
          :remote-method="(v) => get_to_uid_option(v, 2)"
        >
          <el-option v-for="(item, index) in bus_option" :key="index" :label="item.nam" :value="item.uid">
            <div class="to_uid flex">
              <div class="font_light_blue"> {{ item.nam }} </div>
              <div>{{ item.sta }}</div>
              <div>{{ item.position }}</div>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="global_style" label="需求来源" prop="source">
        <el-select v-model="ruleForm.source" placeholder="请选择活动区域">
          <el-option v-for="(item, index) in source_option" :key="item.id" :label="item.nam" :value="item.nam"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="global_style" label="应用领域" prop="industry">
        <el-select v-model="ruleForm.industry" placeholder="请选择活动区域">
          <el-option v-for="(item, index) in apparea_option" :key="item.id" :label="item.nam" :value="item.nam"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="global_style" label="需求提出日期" prop="for_time">
        <el-date-picker
          v-model="ruleForm.for_time"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="global_style" label="希望出方案日期" prop="put_time">
        <el-date-picker
          v-model="ruleForm.put_time"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="global_style" label="需求等级" prop="importance">
        <el-select v-model="ruleForm.importance" placeholder="请选择需求等级">
          <el-option label="一般" :value="0"></el-option>
          <el-option label="重要" :value="1"></el-option>
          <el-option label="非常重要" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <div style="width: 100%;border-top: 1px dotted #555;">
        <el-form-item class="remark" label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            autosize
            placeholder="请输入内容"
            v-model="ruleForm.remark">
          </el-input>
        </el-form-item>
        <el-form-item v-if="!isEdit" label="图纸">
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
      </div>
    </el-form> 
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import qs from "qs";
import axios from "axios";
import auth from "@/utils/auth";
import org from "@/components/public/tree/org"
import selectTree from "./select_tree"
// import { delete } from 'vue/types/umd';

export default {
  name: "add_req",
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
  components: {
    org,
    selectTree
  },
  data() {
    return {
      loading: false,
      rules: {
        dep_id: [
          { required: true, message: '必选', trigger: 'change' },
        ],
        m_id: [
          { required: true, message: '必选', trigger: 'change' },
        ],
        to_uid: [
          { required: true, message: '必选', trigger: 'change' },
        ],
        by_uid: [
          { required: true, message: '必选', trigger: 'change' },
        ],
        standard: [
          { required: true, message: '必选', trigger: 'change' },
        ],
        nam: [
          { required: true, message: '必填', trigger: 'blur' },
        ],
        client_nam: [
          { required: true, message: '必填', trigger: 'blur' },
        ],
        source: [
          { required: true, message: '必选', trigger: 'change' },
        ],
        industry: [
          { required: true, message: '必选', trigger: 'change' },
        ],
        for_time: [
          { required: true, message: '必选', trigger: 'change' },
        ],
        put_time: [
          { required: true, message: '必选', trigger: 'change' },
        ],
        importance: [
          { required: true, message: '必选', trigger: 'change' },
        ],
      },
      ruleForm: {
        dep_id: undefined,
        m_id: undefined,
        to_uid: undefined,
        by_uid: undefined,
        standard: undefined,
        data_list: [],
        nam: '',
        client_nam: '',
        pro_nam: undefined,
        bus_uid: undefined,
        source: undefined,
        industry: undefined,
        for_time: undefined,
        put_time: undefined,
        importance: undefined,
        remark: undefined
      },
      // 部门选择树配置
      depId_option: {
        show: true,
        showSearch: true,
        ex_cb: 'change_dep',
        search: {
          text: "",
        },
        treeData: {
          data: [],
          labelValue: undefined,
          treeProps: {
            children: 'children',
            label: 'dep_nam'
          },
          expandedArr: [],
          filterMethod(value, data) {
            if (!value) return true;
            return data.dep_nam.indexOf(value) !== -1;
          },
          highlightCurrent: true,
          checkOnClick: false,
          nodeKey: "dep_id",
          nodeClick: (() => {
            let req = this.req;
            return (val, node, req) => {
              this.ruleForm.dep_id = val.dep_id
              this.depId_option.treeData.labelValue = val.dep_nam
              this.$refs['dep_tree'].changeValue(val.dep_id)
            };
          })()
        },
      },
      // 模板类型
      template_type: undefined,
      // 总负责人列表
      to_uid_option: [],
      // 需求负责人列表
      by_uid_option: [],
      // 需求模板列表
      template_option: [],
      // 需求来源列表
      source_option: [],
      // 应用领域列表
      apparea_option: [],
      // 所属部门树
      dep_belong_data: [],
      // 标准品类型列表
      standard_option: [],
      // 业务员列表
      bus_option: []
    };
  },
  watch: {
    
  },
  computed: {
    
  },
  async mounted() {
    await Promise.resolve(this.get_source_option())
    await Promise.resolve(this.get_apparea_option())
    await Promise.resolve(this.get_dep_belong())
    await Promise.resolve(this.get_to_uid_option())
    await Promise.resolve(this.get_standard_option())
    if (this.isEdit) {
      await Promise.resolve(this.init_data())
    }
  },
  methods: {
    init() {

    },
    test(...data) {
      console.log(data)
    },
    async close() {
      await Promise.resolve(this.$emit('update:show', false))
      this.$emit("close");
    },
    handlerCb(func, ...data) {
      this[func](...data);
    },
    handleFile(file, fileList) {
      // this.ruleForm.data_list = fileList
      this.$set(this.ruleForm, 'data_list', fileList)
    },
    change_dep(id) {
      this.ruleForm.m_id = undefined
      this.template_option = []
      this.get_template_option(id)
    },
    async get_by_uid_option(v) {
      this.loading = true
      let res = await this.$request.get('/p/front/demand/history/responsible', {
        params: {
          nam: v
        }
      })
      this.by_uid_option = res.data.data_list
      this.loading = false
    },
    async get_template_option(id) {
      let res = await this.$request.get('/p/front/demand/tem', {
        params: {
          dep_id: id
        }
      })
      this.template_option = res.data
    }, 
    async get_source_option() {
      let res = await this.$request.get('/p/front/demand/source/list')
      this.source_option = res.data
    },
    async get_apparea_option() {
      let res = await this.$request.get('/p/front/demand/apparea/list')
      this.apparea_option = res.data
    },
    async get_dep_belong() {
      let res = await this.$request.get('/doc/departfolder')
      this.depId_option.treeData.data = [res.data]
      this.depId_option.treeData.expandedArr = [[res.data][0].dep_id]
    },
    async get_to_uid_option(v, type = 0) {
      let obj = {}
      if (v && v !== '') {
        if (/^[0-9]+$/.test(v)) { obj.sta = v }
        else { obj.nam = v }
      }
      this.loading = true

      let res = await this.$request.get('/doc/get/user/', {
        params: Object.assign({
          dep_id: 0, type: 1
        }, obj)
      })

      // this.to_uid_option = res.data.data_list
      if (type === 0 || type === 1) {
        this.to_uid_option = res.data.data_list
      }
      if (type === 0 || type === 2) {
        this.bus_option = res.data.data_list
      }
      this.loading = false
    },
    async get_standard_option() {
      let res = await this.$request.get('/p/front/demand/standard/list')
      this.standard_option = res.data
    },
    set_template_type(m_id) {
      this.template_type = undefined
      for (let i of this.template_option) {
        if (i.m_id === m_id) {
          return this.template_type = i.is_type
        }
      }
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
    async init_data() {
      let obj = {
        dep_id: Number(this.select_items.dep_id),
        m_id: this.select_items.m_nam,
        to_uid: this.select_items.to_uid,
        by_uid: this.select_items.by_uid,
        standard: this.select_items.standard,
        data_list: this.select_items.related_doc,
        nam: this.select_items.nam,
        client_nam: this.select_items.client_nam,
        pro_nam: this.select_items.pro_nam, 
        bus_uid: this.select_items.bus_uid,
        source: this.select_items.source,
        industry: this.select_items.industry,
        for_time: this.select_items.for_time,
        put_time: this.select_items.put_time,
        importance: this.select_items.importance,
        remark: this.select_items.remark
      }
      this.ruleForm = JSON.parse(JSON.stringify(obj))
      this.set_dep_nam(this.depId_option.treeData.data, obj.dep_id)
      await Promise.resolve(this.change_dep(obj.dep_id))
      if (obj.by_uid) {
        await Promise.resolve(this.get_by_uid_option(this.select_items.nam))
      }     
      this.ruleForm = JSON.parse(JSON.stringify(obj))

    },
    set_dep_nam(arr, id) {
      for (let i in arr) {
        if (arr[i].dep_id === id) {
          return this.depId_option.treeData.labelValue = arr[i].dep_nam
        }
        if (arr[i].children.length > 0) {
          this.set_dep_nam(arr[i].children, id)
        }
      }
    },
    async confirm(status = 0) {
      console.log(this.ruleForm.data_list)
      this.$refs['ruleForm'].validate(async val => {
        if (val) {
          let f = new FormData()
          // for (let i in this.ruleForm.data_list) {
          //   let word_arr = this.ruleForm.data_list[i].name.split('.')
          //   f.append('files', this.ruleForm.data_list[i].raw)
          // }
          let obj = JSON.parse(JSON.stringify(this.ruleForm))
          if (this.template_type !== 9) delete obj.standard
          if (this.template_type !== 1) delete obj.by_uid
          let arr = Object.entries(obj)
          for (let item of arr) {
            if (item[0] !== 'data_list') {
              f.append(item[0], item[1])
            } else if (!this.isEdit) {
              let data_arr = []
              for (let i in this.ruleForm.data_list) {
                let word_arr = this.ruleForm.data_list[i].name.split('.')
                f.append('files', this.ruleForm.data_list[i].raw)
                data_arr.push({
                  siz: this.get_file_size(this.ruleForm.data_list[i].size),
                  format: '.' + word_arr[word_arr.length - 1],
                  name: this.ruleForm.data_list[i].name
                })
              }
              f.append(item[0], JSON.stringify(data_arr))
            }
          }
          try {
            let res
            if (this.isEdit) {
              f.append('bus_id', this.select_items.bus_id)
              res = await this.$request.put("/p/front/demand", f, {
                headers: {
                  "Content-Type": "multipart/form-data",
                }
              })
            } else {
              res = await this.$request.post("/p/front/demand", f, {
                headers: {
                  "Content-Type": "multipart/form-data",
                }
              })
              this.$message({ type: 'success', message: res.msg })
            }
            
            // this.show = false
            this.$emit('update:show', false)
            this.$emit('close')
          } catch(e) {
            // this.$message({ type: 'error', message: e.msg })
          }
        }
      })
    }
  }
};
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