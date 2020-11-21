<template>
  <div class="wrap">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="info">
      <template v-if="form">

        <div v-for="(i, d) in form_option" :key="d">
          <div class="flex-align info_head">
            <div class="info_title">
              {{ i.c_nam }}
              <div class="pillar"></div>
            </div>
            <div class="dotted"></div>
          </div>

          <div class="flex info_main">
            <template v-for="(item, index) in i.children">
              <el-form-item v-if="item.types !== '' " :key="index" :prop="item.nam" :label="item.c_nam" :class="[is_all_style(item.types) ? 'info_main_item' : 'order_all']">
                <el-input v-if="item.types === 2" :disabled="item.is_edit === 1" v-model="form[item.nam]"></el-input>
                <el-select v-if="item.types === 6" :disabled="item.is_edit === 1" v-model="form[item.nam]">
                  <el-option 
                    v-for="(option, option_index) in item.details" :key="option_index"
                    :label="option.label"
                    :value="option.value"
                  ></el-option>
                </el-select>
                <el-date-picker
                  v-if="item.types === 3"
                  v-model="form[item.nam]"
                  type="date"
                  placeholder="选择日期"
                  >
                </el-date-picker>
                <div 
                  v-if="item.types === 1"
                  class="form_upload"
                >
                  <el-upload
                    multiple
                    action="#"
                    :key="item.id"
                    :auto-upload="false"
                    :file-list="form[item.nam]"
                    :show-file-list="false"
                    :on-change="(file, fileList) => handleFile(item.nam, file, fileList)"
                    >
                    <el-button size="small" type="primary">选择文件</el-button>
                  </el-upload>
                  <template v-for="(file_item, file_index) in form[item.nam]">
                    <div :key="file_index" class="flex flex-between fileList">
                      <div class="file_main">
                        <i class="icon iconfont icon-wodewendang"></i>
                        <el-link class="file_name" :underline="false" type="primary">{{ file_item.name }}</el-link>
                      </div>
                      <div class="file_operate">
                        <i class="icon iconfont icon-xiazai" @click="download(file_item.raw, file_item)"></i>
                        <i class="icon iconfont icon-lajitong" @click="file_delete(form[item.nam], file_index)"></i>
                      </div>
                    </div>
                  </template>
                </div>
                
                <el-input
                  class="form_textarea"
                  v-if="item.types === 4"
                  v-model="form[item.nam]"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                >
                </el-input>
                <div
                  v-if="item.types === 7"
                >
                  123
                </div>
              </el-form-item>
              <div v-else :key="index" :class="[is_all_style(item.types) ? 'info_main_item' : 'order_all']">
                <employee-table
                  v-if="item.show_tables !== '' && all_table_option[item.nam]" 
                  class="outside_table"
                  :key="index"
                  :table="all_table_option[item.nam]"
                  @handlerCb="handlerCb"
                  @selectChange="(val) => selectChange(item.nam, val)"
                  @currentChange="currentChange"
                  @search="docSearch"
                  @sortChange="sortChange"
                >
                </employee-table>
              </div>
              
            </template>
            
          </div>
        </div>
        
      </template>
      
    </el-form>
  </div>
</template>

<script>
import employeeTable from "@/components/public/table/employeeTable";

// 自定义校验规则集合
let validate = {
  valid(rule, value, callback) {
    if (value === '123') {
      callback(new Error('请再次输入密码'));
    } else {
      callback();
    }
  }
}

export default {
  name: "form_c",
  components: {
    employeeTable
  },
  props: {
    show: {
      type: Boolean,
      default() {
        return true;
      },
    },
    // 表单生成配置信息
    form_option: {
      type: Array,
      default() {
        return [
          {
            id: 8,
            c_nam: '原材料价格信息',
            children: [
              {
                id: 2,
                nam: 'cce',
                is_fill: 1,
                valid: ['valid'],
                types: 2,
                is_edit: 0,
                c_nam: "生产厂商",
                value: '123'

              },
              {
                id: 3,
                nam: 'ccd',
                types: 6,
                is_edit: 1,
                c_nam: "生产厂商",
                details: [
                  { value: 0, label: '周仲介' },
                  { value: 1, label: '两幻想' }
                ],
                value: undefined
              },
              {
                id: 4,
                nam: 'ccc',
                types: 3,
                is_edit: 0,
                c_nam: "生产厂商",
                details: [
                  { value: 0, label: '周仲介' },
                  { value: 1, label: '两幻想' }
                ],
                value: undefined
              },
            ]
          },
          {
            id: 9,
            c_nam: '原材料价格信息',
            children: [
              {
                id: 5,
                nam: 'cac',
                types: 2,
                is_edit: 0,
                c_nam: "生产厂商",
                value: undefined
              },
              {
                id: 6,
                nam: 'cvc',
                types: 6,
                is_edit: 1,
                c_nam: "生产厂商",
                details: [
                  { value: 0, label: '周仲介' },
                  { value: 1, label: '两幻想' }
                ],
                value: undefined
              },
              {
                id: 10,
                nam: 'ccew',
                types: 1,
                is_edit: 0,
                c_nam: "客户回签的合同或订单",
                details: [
                  { value: 0, label: '周仲介' },
                  { value: 1, label: '两幻想' }
                ],
                value: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
              },
              {
                id: 11,
                nam: 'ccx',
                types: 4,
                is_edit: 0,
                c_nam: "客户回签的合同或订单",
                details: [
                  { value: 0, label: '周仲介' },
                  { value: 1, label: '两幻想' }
                ],
                value: undefined
              },
              {
                id: 11,
                nam: 'qcc',
                types: 7,
                is_edit: 0,
                c_nam: "客户回签的合同或订单",
                details: [
                  { value: 0, label: '周仲介' },
                  { value: 1, label: '两幻想' }
                ],
                value: undefined
              },
              {
                id: 19,
                nam: 'qcc',
                types: 4,
                is_edit: 0,
                c_nam: "客户回签的合同或订单",
                details: [
                  { value: 0, label: '周仲介' },
                  { value: 1, label: '两幻想' }
                ],
                value: undefined
              },
              {
                id: 17,
                nam: 'qre',
                show_tables: 'qwe',
                types: '',
                is_edit: 1,
                c_nam: "客户回签的合同或订单",
                details: '',
                value: '',
                children: [
                  {
                    id: 20,
                    nam: 'qjjgfs',
                    c_nam: "客户回签的合同或订单",
                    types: 2,
                    is_edit: 0,
                  },
                  {
                    id: 20,
                    nam: 'dgcpyl',
                    c_nam: "333",
                    types: 2,
                    is_edit: 1  ,
                  },
                  {
                    id: 26,
                    nam: 'fujian',
                    c_nam: "3323",
                    types: 1,
                    is_edit: 1,
                  }
                ],
                values_data: [
                  { id: 30, form_id: 4, qjjgfs: '模具加工', dgcpyl: '10.2k', fujian: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}] },
                  { id: 31, form_id: 4, qjjgfs: '模具加工', dgcpyl: '10.2k', fujian: [] },
                  { id: 32, form_id: 4, qjjgfs: '模具加工', dgcpyl: '10.2k', fujian: [] },
                  { id: 33, form_id: 4, qjjgfs: '模具加工', dgcpyl: '10.2k', fujian: [] },
                  { id: 34, form_id: 4, qjjgfs: '模具加工', dgcpyl: '10.2k', fujian: [] },
                  { id: 35, form_id: 4, qjjgfs: '模具加工', dgcpyl: '10.2k', fujian: [] }
                ]
              },
              {
                id: 35,
                nam: 'caca',
                types: 2,
                is_edit: 0,
                c_nam: "生产厂商",
                value: undefined
              },
            ]
          }
        ]
      }
    },
    

  },
  data() {
    return {
      form: {},
      rules: {},
      // 表格控件配置映射
      table_option_map: {
        1: 'upload',
        2: 'input',
        6: 'select'
      },
      // 全部表格配置项
      all_table_option: {

      },
      // 表格初始化模板
      table_init_template: {
        check: true, // 是否出现表格勾选
        size: "mini", // 控件大小统一
        loading: false, // 表格loading
        // total: 0, // 表格总页数
        // currentPage: 1, // 表格分页值
        selectArr: [], // 保存勾选项的数组
        // width: 100,
        header: [],
        main: {
          head: [],
          body: null
        }
      },
      table_option: {
        check: true, // 是否出现表格勾选
        size: "mini", // 控件大小统一
        loading: false, // 表格loading
        // total: 0, // 表格总页数
        // currentPage: 1, // 表格分页值
        selectArr: [], // 保存勾选项的数组
        // width: 100,
        header: {
          // 设置组件头部操作及查询控件
          left: [
            // 左边控件
            {
              type: "buttonGroup", // 设置操作项组合
              data: [
                {
                  text: "添加",
                  icon: "icon-tianjia",
                  func: "addDocShows",
                  disabled: true
                },
                {
                  text: "更版",
                  icon: "icon-banben",
                  func: "versionShows",
                  isSelects: true,
                  disabled: true
                }
              ],
            }
          ],
        },
        main: {
          // 表格核心展示部分配置
          head: [
            {
              type: "index",
              title: "#",
              fixed: true,
            }, // 序号
            {
              type: "link",
              keys: "doc_nam",
              title: "文档名称",
              func: "seek",
              width: 320,
              fixed: true,
              sort: 'custom'
            }, // 路由转向文字控件
            {
              type: "text",
              keys: "version",
              title: "版本号",
            }, // 普通文本展示
            {
              type: 'textRules', keys: 'lev', title: '文件级别', rules: {
                [1]: '一级文件',
                [2]: '二级文件',
                [3]: '三级文件',
                [4]: '四级文件',
                [5]: '五级文件'
              }
            },
            {
              type: 'text',
              keys: 'doc_type',
              title: '文件类型'
            },
            { type: "text", keys: "doc_route", title: "文件夹", width: 160 },
            {
              type: "text",
              keys: "doc_num",
              title: "文件编号",
            },
            {
              type: "text",
              keys: "size",
              title: "文件大小",
            },
            {
              type: "icon",
              keys: "format",
              title: "文件格式", // 图标展示
              rules: {
                // 展示规则
                ".pptx": {
                  // 键为接口对应字段的值 值为图标相关配置属性
                  icon: "icon-ppt", // 图标icon
                  color: "#F2353C", // 颜色
                },
                ".ppt": {
                  icon: "icon-ppt",
                  color: "#F2353C",
                },
                ".doc": {
                  icon: "icon-Word",
                  color: "#1A85E4",
                },
                ".docx": {
                  icon: "icon-Word",
                  color: "#1A85E4",
                },
                ".xlsx": {
                  icon: "icon-excel",
                  color: "#18CC72",
                },
                ".xls": {
                  icon: "icon-excel",
                  color: "#18CC72",
                },
                ".pdf": {
                  icon: "icon-pdf1",
                  color: "orange",
                },
              },
            },
            {
              type: "text",
              keys: "remark",
              title: "备注",
              width: 160,
            },
            {
              type: "text",
              keys: "control",
              title: "受控级别",
            },
            {
              type: "text",
              keys: "nam",
              title: "创建人",
            },
            {
              type: "slot",
              keys: "attachfiles",
              title: "附件",
              slotName: "attachfiles",
              width: "160px",
            },
            {
              type: "text",
              keys: "cr_time",
              title: "创建时间",
              sort: true,
              width: 160,
            },
            {
              type: "text",
              keys: "push_time",
              title: "发布时间",
              sort: true,
              width: 160,
            },
            {
              type: "text",
              keys: "doc_expir",
              title: "文档有效期",
              width: 160,
            },
            {
              type: "slot",
              keys: "status",
              title: "文档状态",
              slotName: "status",
              fixed: "right",
            }, // 自定义slot
            {
              type: "tag",
              keys: "audit",
              title: "审核状态",
              fixed: "right",
            }, // 业务tag 目前已改写通用为tags类型区分
          ],
          body: null, // 表格接口获取展示数据存放处
          // rowClass: this.tableRowClassName
        },
      },
    };
  },
  mounted() {
    this.create_rules()
    // this.table_map()
  },
  methods: {
    handlerCb(func, data, table) {
      this[func](data, table);
    },
    selectChange(table, val) {
      // this.$set(this.table, "selectArr", val);
      // console.log(this.table_option_map[table], val)
      this.$set(this.all_table_option[table], 'selectArr', val)
      
    },
    currentChange(val) {

    },
    docSearch() {},
    sortChange() {},
    // 设置控件是否占领一行
    is_all_style(v) {
      const arr = [2, 3, 5, 6]
      return arr.includes(v)
    },
    // 处理表单外部的上传文件
    handleFile(key, file, fileList) {
      console.log(key, file, fileList)
      this.form[key] = fileList
    },
    // 表格数据映射
    table_map(item) {
      console.log(item)
      let that = this
      this.$set(this.all_table_option, item.nam, this.table_init_template)
      console.log(this.all_table_option)
      if(item.is_edit === 1) {
        let option = {
          left: [
            // 左边控件
            {
              type: "buttonGroup", // 设置操作项组合
              data: [
                {
                  text: "添加",
                  func: "table_add",
                  color: 'success'
                },
                {
                  text: "删除",
                  func: "table_reduce"
                }
              ]
            }
          ]
        }
        this.$set(this.all_table_option[item.nam], 'header', option)

      }
      item.children.forEach((head_item, head_index) => {
        console.log(head_item)
        let obj = {
          type: that.table_option_map[head_item.types],
          title: head_item.c_nam,
          keys: head_item.nam,
          disabled: head_item.is_edit === 0 ? true : false,
          disableRule(scope) {
            return head_item.is_edit === 0 ? true : false
          },
          handleFile(file, fileList, scope) {
            scope.row[head_item.nam] = fileList
          }
        }
        console.log(obj, that.all_table_option)
        that.all_table_option[item.nam].main.head.push(obj)

      })
      this.$set(this.all_table_option[item.nam].main, 'body', item.values_data)
    },
    // 表单校验规则生成
    create_rules() {
      let rules = {}
      let form = {}
      // 通用简易校验
      
      this.form_option.forEach((option_item, option_index) => {
        if (option_item.children && option_item.children.length > 0) {
          option_item.children.forEach((item, index) => {
            // 处理表格和其他类型数据
            if (item.show_tables && item.show_tables !== '') {
              this.table_map(item)
            } else {
              rules[item.nam] = []
              form[item.nam] = item.value
              // 判断是否必填
              if (item.is_fill && item.is_fill === 1) {
                rules[item.nam] = [...this.normal_rule()]
              }
              // 装载自定义校验
              if (item.valid && item.valid.length > 0) {
                item.valid.forEach(it => {
                  rules[item.nam] = [...this.diy_rule(it), ...rules[item.nam]]
                })
              }
            }
            
          })
          
        }
        
      })
      this.rules = rules
      this.form = form
      console.log(this.form, this.rules)
    },
    // 文件删除逻辑
    file_delete(arr, index) {
      arr.splice(index, 1)
      // Todo 删除后端传过来的已有文件，将被删除文件storeid放入delete字段
    },
    // 下载
    download(data, file) {
      // 代理文件流下载
      return this.fileStream_download(data, file)
      // Todo 代理链接下载
    },
    // 文件流下载
    fileStream_download(data, file) {
      // file.name.substring(file.name.lastIndexOf("."));
      // let arr = file.name.split('.')
      // arr[arr.length - 1]
      let a = document.createElement("a");
      data = new Blob([data])
      a.href = window.URL.createObjectURL(data);
      a.setAttribute('download', file.name);
      a.target = "_blank";
      a.click();
    },
    // Todo文件链接下载

    // 通用简易校验
    normal_rule(msg = '必填') {
      let rule_arr = [
        { required: true, message: msg, trigger: 'change' },
        { required: true, message: msg, trigger: 'blur' }
      ]
      return rule_arr
    },
    // 装载自定义校验规则
    diy_rule(name, msg) {
      let rule_arr = [
        { validator: validate[name], trigger: 'change' },
        { validator: validate[name], trigger: 'blur' }
      ]
      return rule_arr
    },
    table_add(...data) {
      console.log(data)
    },
    table_reduce(...data) {
      console.log(data)
    }
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  overflow-y: scroll;
  .info {
    margin-bottom: 10px;
    .info_head {
      margin-bottom: 10px;
      .info_title {
        position: relative;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 19px;
        color: #41494d;
        padding-left: 14px;
      }
      .pillar {
        position: absolute;
        left: 0;
        top: 3px;
        display: block;
        width: 4px;
        height: 14px;
        background: #0bb2d4;
        border-radius: 2px;
        margin-right: 10px;
      }
      .dotted {
        display: block;
        flex: 1;
        height: 1px;
        margin-left: 10px;
        border-bottom: 1px dotted #e4e4e4;
      }
    }
    .info_main {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 12px;
      grid-row-gap: 10px;
      grid-auto-flow: row;
      justify-content: space-between;
      .info_main_item {
        // width: 240px;
        height: 40px;
      }
      .order_all {
        grid-column-start: 1;
        grid-column-end: 4;  
      }
      .form_textarea {
        width: 600px;
      }

      .form_upload {
        width: 600px;
      }
      .fileList {
        .file_main {
          font-size: 14px;
          .icon {
            margin-right: 10px;
          }
          .file_name {
            font-size: 14px;
          }
        }
        .file_operate {
          .icon {
            margin-right: 10px;
            cursor: pointer;
          }
          .icon:hover {
            color: #0bb2d4;
          }
        }
      }
      .outside_table {
        width: 100%;
        // /deep/.el-table__body {
        //   width: 100%;
        // }
        // /deep/.table /deep/.table-main {
        //   height: unset;
        // }
      }
    }
  }
}
/deep/.el-table__body-wrapper {
  height: unset !important;
}
/deep/.el-table--small {
  height: unset !important;
}
</style>