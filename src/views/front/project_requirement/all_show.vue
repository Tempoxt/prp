<template>
  <div class="outside">
    <!-- <div class="wrap">
      <header class="head">123213123</header>
    </div> -->
    <header class="head">
      <all-head :option="head_option" @handlercb="handlerCb"></all-head>
    </header>
    <nav class="nav">
      <el-tabs v-model="activeName" @tab-click="tabClick(activeName)">
        <template v-for="(item, index) in nav_option">
          <el-tab-pane :key="index" :label="item.label" :name="item.name"></el-tab-pane>
        </template>
      </el-tabs>
    </nav>
    <main class="main">
      <transition name="fade">
          <all-task v-if="activeName === '0'" :option="task_option" @req="get_task_progress" @stage_click="create_task_arr"></all-task>
          <all-info v-if="activeName === '1'" :option="basic_info_data"></all-info>
          <div v-if="activeName === '2'" class="main_wrap">
            <employee-table 
              class="outside_table"
              :key="'table_team'"
              :table="table_team"
              @handlerCb="handlerCb"
              @selectChange="selectChange"
              @currentChange="currentChange"
              @search="table_search"
              @sortChange="table_sort"
            ></employee-table>
          </div>
          <div v-if="activeName === '3'" class="main_wrap">
            <employee-table 
              class="outside_table"
              :key="'table_audit'"
              :table="table_audit"
              @handlerCb="handlerCb"
              @selectChange="selectChange"
              @currentChange="currentChange"
              @search="table_search"
              @sortChange="table_sort"
            ></employee-table>
          </div>
          <div v-if="activeName === '4'" class="main_wrap">
            <employee-table 
              class="outside_table"
              :key="'table_report'"
              :table="table_report"
              @handlerCb="handlerCb"
              @selectChange="selectChange"
              @currentChange="currentChange"
              @search="table_search"
              @sortChange="table_sort"
            ></employee-table>
          </div>
          <div v-if="activeName === '5'" class="main_wrap">
            <employee-table 
              class="outside_table"
              :key="'table_appendix'"
              :table="table_appendix"
              @handlerCb="handlerCb"
              @selectChange="selectChange"
              @currentChange="currentChange"
              @search="table_search"
              @sortChange="table_sort"
            ></employee-table>
          </div>
           <div v-if="activeName === '6'" class="main_wrap">
            <employee-table 
              class="outside_table"
              :key="'table_relation'"
              :table="table_relation"
              @handlerCb="handlerCb"
              @selectChange="selectChange"
              @currentChange="currentChange"
              @search="table_search"
              @sortChange="table_sort"
            ></employee-table>
          </div>
           <div v-if="activeName === '7'" class="main_wrap">
              <follow 
                :option="follow_option"
                @req="get_follow_data"
                @confirm="follow_confirm"
                @search="follow_search"
              ></follow>
            </div>
           <div v-if="activeName === '8'" class="main_wrap">
              <employee-table 
                class="outside_table"
                :key="'table_scheme'"
                :table="table_scheme"
                @handlerCb="handlerCb"
                @selectChange="selectChange"
                @currentChange="currentChange"
                @search="table_search"
                @sortChange="table_sort"
              ></employee-table>
            </div>
          
      </transition>
    </main>

    <pop-task></pop-task>
    <add-relation
      v-if="add_relation_show"
      :show.sync="add_relation_show"
      :isEdit="add_relation_isEdit"
      :select_items="getTab().selectArr.length > 0 ? getTab().selectArr[0] : {}"
      @close="getTable"
      @req="getTable"
    />
    <add-appendix
      v-if="add_appendix_show"
      :show.sync="add_appendix_show"
      :select_items="getTab().selectArr.length > 0 ? getTab().selectArr[0] : {}"
      @close="getTable"
      @req="getTable"
    />
    <add-scheme
      v-if="add_scheme_show"
      :show.sync="add_scheme_show"
      :isEdit="add_scheme_isEdit"
      :select_items="getTab().selectArr.length > 0 ? getTab().selectArr[0] : {}"
      @close="getTable"
      @req="getTable"
    />
    <show-scheme
      v-if="show_scheme"
      :show.sync="show_scheme"
      :option.sync="show_scheme_option"
      :select_items="getTab().selectArr.length > 0 ? getTab().selectArr[0] : {}"
      @close="getTable"
      @req="getTable"
    />
    
    <scheme-recall
      v-if="recall_scheme_show"
      :show.sync="recall_scheme_show"
      :select_items="getTab().selectArr.length > 0 ? getTab().selectArr[0] : {}"
      @close="getTable"
      @req="getTable"
    />
    <el-dialog
      title="添加成员"
      :visible.sync="add_members_show"
      width="600px"
      append-to-body
      :before-close="close_members"
    >
      <el-form ref="add_members" :model="add_members_form">
        <el-form-item class="global_style" label="任务成员" prop="members">
          <el-select 
            v-model="add_members_form.members" 
            placeholder="请选择任务成员"
            filterable
            remote
            multiple
            :loading="loading"
            :remote-method="(v) => get_to_uid_option(v)"
          >
            <el-option v-for="(item, index) in members_option" :key="index" :label="item.nam" :value="item.uid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="close_members">取 消</el-button>
        <el-button type="primary" @click="add_members_confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import screenfull from "screenfull";
import qs from "qs";
import * as api_common from "@/api/common";
import auth from "@/utils/auth";
// import table_mixin from "@c/Table/table_mixin";
// import { getTabs } from '@/api/common'
import org from "@/components/public/tree/org";
import employeeTable from "@/components/public/table/employeeTable";
import axios from "axios";
import addReq from "./component/add_req"
import allHead from "./component/all_show_head"
import allTask from "./component/all_show_task"
import allInfo from "./component/all_info"
import popTask from "./component/pop_task"
import addRelation from "./component/add_relation"
import follow from "./component/follow"
import addAppendix from "./component/add_appendix"
import addScheme from "./component/add_scheme"
import showScheme from "./component/show_scheme"
import schemeRecall from "./component/scheme_recall"

export default {
  name: "all_show",
  // mixins: [table_mixin],
  components: {
    employeeTable,    
    org,
    addReq,
    allHead,
    allTask,
    allInfo,
    popTask,
    addRelation,
    follow,
    addAppendix,
    addScheme,
    showScheme,
    schemeRecall
  },
  data() {
    return {
      loading: false,
      //主页表格
      
      // 高级搜索
      searchShow: false,
      // 添加需求
      add_req_show: true,
      
      // 标签配置
      tag_option: {
        ['正在进行']: {
          value: '进行中',
          type: 'warning'
        },
        ['已成交']: {
          value: '已成交',
          type: 'success'
        },
        ['已终止']: {
          value: '已终止',
          type: 'danger'
        },
      },
      // 待映射的页签配置
      nav_tag_option: {
        ['任务']: '0',
        ['基本信息']: '1',
        ['团队成员']: '2',
        ['审批']: '3',
        ['报价']: '4',
        ['附件']: '5',
        ['联系人']: '6',
        ['跟进记录']: '7',
        ['方案']: '8'
      },
      // 头部信息组件配置
      head_option: {
        left: {
          main_type: '项目需求',
          title: '新工模DKBA82060218',
          tag: {
            type: 'warning',
            value: '进行中'
          },
          other_item: [
            { type: '客户名称', value: 'HG00565'},
            { type: '应用领域', value: 'HG00565'},
            { type: '总负责人', value: 'HG00565'},
            { type: '需求负责人', value: 'HG00565'},
            { type: '业务员', value: 'HG00565'},
            { type: '创建时间', value: 'HG00565'}
          ]
        },
        right: {
          top: [
            {
              name: 'drop',
              option: [
                { func: 'add', icon: 'icon-daibanshixiang', text: '完成' },
                { func: 'add', icon: 'icon-daibanshixiang', text: '操作' },
                { func: 'add', icon: 'icon-daibanshixiang', text: '失败' }
              ]
            },
            {
              name: 'btn_group',
              option: [
                {
                  func: 'add', icon: 'icon-daibanshixiang', text: '完成', type: 'success'
                },
                {
                  func: 'add', icon: 'icon-daibanshixiang', text: '失败', type: 'warning'
                }
              ]
            }
          ],
          progress: [
            { text: '需求评估', type: 'success' },
            { text: '方案定制', type: 'warning' },
            { text: '谈判报价', type: 'danger' },
            { text: '项目立项', type: 'success' },
          ]
        }
      },
      // 导航
      activeName: '0',
      nav_option: [
        { label: '任务', name: '0' },
        { label: '信息', name: '1' },
        { label: '团队成员', name: '2' },
        { label: '审批', name: '3' },
        { label: '报价', name: '4' },
        { label: '附件', name: '5' },
      ],
      // 任务
      // 团队成员表格
      table_team: {
        request_url: '/p/front/demand/team',
        check: true, // 是否出现表格勾选
        size: "mini", // 控件大小统一
        loading: false, // 表格loading
        total: 0, // 表格总页数
        currentPage: 1, // 表格分页值
        selectArr: [], // 保存勾选项的数组
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
                  func: "add_members"
                },
                {
                  text: "删除",
                  icon: "icon-lajitong",
                  func: "delete_members",
                  isSelect: true
                },
                {
                  text: "初始化任务",
                  icon: "icon-shuaxin",
                  func: "editDocShows"
                },
              ],
            },

          ],
          right: [
            // // 右边控件
            // {
            //   type: "inputSearch", // 输入搜索框
            //   holder: "请输入文档名称关键词搜索", // placeHolder
            //   value: "", // 值
            //   tag: "dim_doc_name", // 接口绑定字段
            // },
            {
              type: "buttonGroup",
              data: [
                {
                  icon: "icon-xingzhuang",
                  func: "full",
                },
                {
                  icon: "icon-shuaxin",
                  func: "getTable",
                },
                {
                  icon: "icon-lie",
                  type: "list",
                },
              ],
            },
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
              type: "text",
              keys: "sta",
              title: "工号",
            }, // 普通文本展示
            
            {
              type: 'text',
              keys: 'nam',
              title: '姓名'
            },
            { type: "text", keys: "dep_nam", title: "部门", width: 160 },
            {
              type: "text",
              keys: "position",
              title: "职位",
            },
            {
              type: "text",
              keys: "tell_phone",
              title: "联系方式",
            },
          ],
          body: null, // 表格接口获取展示数据存放处
          // rowClass: this.tableRowClassName
        },
        footer: {
          // 设置表格底部
          rangeValue: 20, // 每页展示数据的范围
          holder: "", // 范围控件holder
          func: "sizeChange",
          range: [
            // 范围控件值与标签配置
            {
              label: 10,
              value: 10,
            },
            {
              label: 20,
              value: 20,
            },
          ],
        },
      },
      // 审核表格
      table_audit: {
        check: true, // 是否出现表格勾选
        size: "mini", // 控件大小统一
        loading: false, // 表格loading
        total: 0, // 表格总页数
        currentPage: 1, // 表格分页值
        selectArr: [], // 保存勾选项的数组
        width: 100,
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
                }
              ],
            },

          ],
          right: [
            // // 右边控件
            // {
            //   type: "inputSearch", // 输入搜索框
            //   holder: "请输入文档名称关键词搜索", // placeHolder
            //   value: "", // 值
            //   tag: "dim_doc_name", // 接口绑定字段
            // },
            {
              type: "buttonGroup",
              data: [
                {
                  icon: "icon-xingzhuang",
                  func: "full",
                },
                {
                  icon: "icon-shuaxin",
                  func: "getTable",
                },
                {
                  icon: "icon-lie",
                  type: "list",
                },
              ],
            },
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
        footer: {
          // 设置表格底部
          rangeValue: 20, // 每页展示数据的范围
          holder: "", // 范围控件holder
          func: "sizeChange",
          range: [
            // 范围控件值与标签配置
            {
              label: 10,
              value: 10,
            },
            {
              label: 20,
              value: 20,
            },
          ],
        },
      },
      // 报价表格
      table_report: {
        check: true, // 是否出现表格勾选
        size: "mini", // 控件大小统一
        loading: false, // 表格loading
        total: 0, // 表格总页数
        currentPage: 1, // 表格分页值
        selectArr: [], // 保存勾选项的数组
        width: 100,
        header: {
          // 设置组件头部操作及查询控件
          left: [
            // 左边控件
            {
              type: "buttonGroup", // 设置操作项组合
              data: [
                {
                  text: "修改",
                  icon: "icon-daibanshixiang",
                  func: "addDocShows",
                  disabled: true
                },
                {
                  text: "审核",
                  icon: "icon-shenhe",
                  func: "versionShows",
                  isSelects: true,
                  disabled: true
                },
                {
                  text: "客户反馈",
                  icon: "icon-xiaoxi",
                  func: "editDocShows",
                  isSelects: true,
                  disabled: true
                },
                {
                  text: "打印",
                  icon: "icon-dayin",
                  func: "editDocShows",
                  isSelects: true,
                  disabled: true
                },
              ],
            },

          ],
          right: [
            // // 右边控件
            // {
            //   type: "inputSearch", // 输入搜索框
            //   holder: "请输入文档名称关键词搜索", // placeHolder
            //   value: "", // 值
            //   tag: "dim_doc_name", // 接口绑定字段
            // },
            {
              type: "buttonGroup",
              data: [
                {
                  icon: "icon-xingzhuang",
                  func: "full",
                },
                {
                  icon: "icon-shuaxin",
                  func: "getTable",
                },
                {
                  icon: "icon-lie",
                  type: "list",
                },
              ],
            },
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
        footer: {
          // 设置表格底部
          rangeValue: 20, // 每页展示数据的范围
          holder: "", // 范围控件holder
          func: "sizeChange",
          range: [
            // 范围控件值与标签配置
            {
              label: 10,
              value: 10,
            },
            {
              label: 20,
              value: 20,
            },
          ],
        },
      },
      // 联系人表格
      table_relation: {
        request_url: '/p/front/demand/link', // 请求地址
        check: true, // 是否出现表格勾选
        size: "mini", // 控件大小统一
        loading: false, // 表格loading
        total: 0, // 表格总页数
        currentPage: 1, // 表格分页值
        selectArr: [], // 保存勾选项的数组
        width: 100,
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
                  func: "open_relation_dialog",
                },
                {
                  text: "修改",
                  icon: "icon-daibanshixiang",
                  func: "edit_relation_dialog",
                  isSelects: true,
                },
                {
                  text: "删除",
                  icon: "icon-lajitong",
                  func: "delete_relation",
                  isSelect: true,
                },
              ],
            },

          ],
          right: [
            // // 右边控件
            // {
            //   type: "inputSearch", // 输入搜索框
            //   holder: "请输入文档名称关键词搜索", // placeHolder
            //   value: "", // 值
            //   tag: "dim_doc_name", // 接口绑定字段
            // },
            {
              type: "buttonGroup",
              data: [
                {
                  icon: "icon-xingzhuang",
                  func: "full",
                },
                {
                  icon: "icon-shuaxin",
                  func: "getTable",
                },
                {
                  icon: "icon-lie",
                  type: "list",
                },
              ],
            },
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
              type: "text",
              keys: "nam",
              title: "姓名",
            }, // 路由转向文字控件
            {
              type: "textRules",
              keys: "gender",
              title: "性别",
              rules: {
                [0]: '男',
                [1]: '女'
              }
            }, // 普通文本展示
            {
              type: "text",
              keys: "dep",
              title: "部门",
            },
            {
              type: 'text',
              keys: 'duty',
              title: '职务'
            },
            { type: "text", keys: "phone", title: "手机", width: 160 },
            {
              type: "text",
              keys: "mail",
              title: "邮箱",
              width: 160
            },
            {
              type: "text",
              keys: "age",
              title: "年龄",
            },
            
            {
              type: "text",
              keys: "remark",
              title: "备注",
              width: 160,
            },
            // {
            //   type: "text",
            //   keys: "control",
            //   title: "首要联系人",
            // },
          ],
          body: null, // 表格接口获取展示数据存放处
          // rowClass: this.tableRowClassName
        },
        footer: {
          // 设置表格底部
          rangeValue: 20, // 每页展示数据的范围
          holder: "", // 范围控件holder
          func: "sizeChange",
          range: [
            // 范围控件值与标签配置
            {
              label: 10,
              value: 10,
            },
            {
              label: 20,
              value: 20,
            },
          ],
        },
      },
      table_follow: {
        check: true, // 是否出现表格勾选
        size: "mini", // 控件大小统一
        loading: false, // 表格loading
        total: 0, // 表格总页数
        currentPage: 1, // 表格分页值
        selectArr: [], // 保存勾选项的数组
        width: 100,
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
                  func: "add_relation",
                },
                {
                  text: "修改",
                  icon: "icon-daibanshixiang",
                  func: "edit_relation",
                  isSelects: true,
                },
                {
                  text: "删除",
                  icon: "icon-lajitong",
                  func: "delete_relation",
                  isSelects: true,
                },
              ],
            },

          ],
          right: [
            // // 右边控件
            // {
            //   type: "inputSearch", // 输入搜索框
            //   holder: "请输入文档名称关键词搜索", // placeHolder
            //   value: "", // 值
            //   tag: "dim_doc_name", // 接口绑定字段
            // },
            {
              type: "buttonGroup",
              data: [
                {
                  icon: "icon-xingzhuang",
                  func: "full",
                },
                {
                  icon: "icon-shuaxin",
                  func: "getTable",
                },
                {
                  icon: "icon-lie",
                  type: "list",
                },
              ],
            },
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
        footer: {
          // 设置表格底部
          rangeValue: 20, // 每页展示数据的范围
          holder: "", // 范围控件holder
          func: "sizeChange",
          range: [
            // 范围控件值与标签配置
            {
              label: 10,
              value: 10,
            },
            {
              label: 20,
              value: 20,
            },
          ],
        },
      },
      table_scheme: {
        request_url: '/p/front/demand/scheme/list',
        check: true, // 是否出现表格勾选
        size: "mini", // 控件大小统一
        loading: false, // 表格loading
        total: 0, // 表格总页数
        currentPage: 1, // 表格分页值
        selectArr: [], // 保存勾选项的数组
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
                  func: "open_scheme_dialog"
                },
                {
                  text: "修改",
                  icon: "icon-daibanshixiang",
                  func: "edit_scheme_dialog",
                  isSelects: true
                },
                {
                  text: "删除",
                  icon: "icon-lajitong",
                  func: "delete_scheme",
                  isSelect: true
                },
                {
                  text: "客户反馈",
                  icon: "icon-xiaoxi",
                  func: "recall_scheme",
                  isSelects: true
                }
              ],
            },

          ],
          right: [
            // // 右边控件
            // {
            //   type: "inputSearch", // 输入搜索框
            //   holder: "请输入文档名称关键词搜索", // placeHolder
            //   value: "", // 值
            //   tag: "dim_doc_name", // 接口绑定字段
            // },
            {
              type: "buttonGroup",
              data: [
                {
                  icon: "icon-xingzhuang",
                  func: "full",
                },
                {
                  icon: "icon-shuaxin",
                  func: "getTable",
                },
                {
                  icon: "icon-lie",
                  type: "list",
                },
              ],
            },
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
              keys: "title",
              title: "方案名称",
              func: "seek_scheme",
              width: 320,
              fixed: true
            }, // 路由转向文字控件
            {
              type: "text",
              keys: "version",
              title: "版本",
            }, // 普通文本展示
            {
              type: "icon",
              keys: "formats",
              title: "格式", // 图标展示
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
              type: 'text',
              keys: 'up_name',
              title: '上传人'
            },
            { type: "text", keys: "up_time", title: "上传日期", width: 160 },
            { type: 'tags', keys: 'feedback_tag', title: '客户反馈', options: {
                0: {color: 'success', tip: '通过'},
                1: {color: 'danger', tip: '不通过'},
                2: {color: 'info', tip: '暂无反馈'},
              }
            }
          ],
          body: null, // 表格接口获取展示数据存放处
          // rowClass: this.tableRowClassName
        },
        footer: {
          // 设置表格底部
          rangeValue: 20, // 每页展示数据的范围
          holder: "", // 范围控件holder
          func: "sizeChange",
          range: [
            // 范围控件值与标签配置
            {
              label: 10,
              value: 10,
            },
            {
              label: 20,
              value: 20,
            },
          ],
        },
      },
      table_appendix: {
        request_url: '/p/front/demand/accessory',
        check: true, // 是否出现表格勾选
        size: "mini", // 控件大小统一
        loading: false, // 表格loading
        total: 0, // 表格总页数
        currentPage: 1, // 表格分页值
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
                  func: "open_appendix_dialog"
                },
                {
                  text: "下载",
                  icon: "icon-xiazai",
                  func: "versionShows",
                  isSelects: true,
                  disabled: true
                },
                 {
                  text: "删除",
                  icon: "icon-lajitong",
                  func: "delete_appendix",
                  isSelect: true
                }
              ],
            },

          ],
          right: [
            // // 右边控件
            // {
            //   type: "inputSearch", // 输入搜索框
            //   holder: "请输入文档名称关键词搜索", // placeHolder
            //   value: "", // 值
            //   tag: "dim_doc_name", // 接口绑定字段
            // },
            {
              type: "buttonGroup",
              data: [
                {
                  icon: "icon-xingzhuang",
                  func: "full",
                },
                {
                  icon: "icon-shuaxin",
                  func: "getTable",
                },
                {
                  icon: "icon-lie",
                  type: "list",
                },
              ],
            },
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
              type: "text",
              keys: "nam",
              title: "附件名称",
            }, // 普通文本展示
            {
              type: "icon",
              keys: "format",
              title: "附件格式", // 图标展示
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
            { type: "text", keys: "siz", title: "文件大小", width: 160 },
            {
              type: "text",
              keys: "cr_time",
              title: "上传时间",
            },
            {
              type: "text",
              keys: "c_uid",
              title: "上传人员",
            },
            {
              type: "text",
              keys: "remark",
              title: "备注",
              width: 160,
            }
          ],
          body: null, // 表格接口获取展示数据存放处
          // rowClass: this.tableRowClassName
        },
        footer: {
          // 设置表格底部
          rangeValue: 20, // 每页展示数据的范围
          holder: "", // 范围控件holder
          func: "sizeChange",
          range: [
            // 范围控件值与标签配置
            {
              label: 10,
              value: 10,
            },
            {
              label: 20,
              value: 20,
            },
          ],
        },
      },
      // 跳转携带的需求基本信息
      require_basic_data: {},
      // 基础信息
      basic_info: {},
      // 组件可用基础信息数据结构
      basic_info_data: {},

      // 任务组件配置
      task_option: {
        // 任务阶段数据结构
        stage_arr: [],
        // 任务看板数据结构
        // 映射部分
        task_tag: [
          { name: '未开始', key: 'unfinish' },
          { name: '进行中', key: 'working' },
          { name: '已完成', key: 'finish' }
        ],
        status_option: {
          0: {
            name: '未开始',
            type: 'info'
          },
          1: {
            name: '进行中',
            type: 'warning'
          },
          2: {
            name: '已完成',
            type: 'success'
          }
        },
        priority_option: {
          0: {
            name: '一般',
            type: 'info'
          },
          1: {
            name: '重要',
            type: 'warning'
          },
          2: {
            name: '非常重要',
            type: 'danger'
          }
        },
        // 展示数据
        task_arr: []
      },

      // 弹窗部分
      // 添加/编辑联系人弹窗
      add_relation_isEdit: false,
      add_relation_show: false,
      // 添加/编辑 附件
      add_appendix_show: false,
      // add_appendix_isEdit: false,
      // 添加/编辑 方案
      add_scheme_show: false,
      add_scheme_isEdit: false,
      show_scheme: false,
      show_scheme_option: {
        scheme_info: [],
        status_info: []
      },
      recall_scheme_show: false,


      // 团队成员部分
      add_members_show: false,
      add_members_form: {
        members: []
      },
      members_option: [],

      // 跟进部分
      follow_option: {
        // 0是需求 1是任务
        status: 0,
        method_options: ['到访', '电话', '微信', '短信', '邮件', '其他'],
        data_list: []
      },

      
    };
  },
  async mounted() {
    await Promise.resolve(this.create_head_option())
    await Promise.resolve(this.create_nav_option())
  },
  methods: {
    test(data) {
      console.log(data);
    },
    handlerCb(func, ...data) {
      console.log(func, data)
      this[func](...data);
    },
    full() {
      this.isFullScreen() ? screenfull.exit() : screenfull.request();
    },
    add() {
      console.log(123)
    },
    isFullScreen() {
      return (
        document.isFullScreen ||
        document.mozIsFullScreen ||
        document.webkitIsFullScreen
      );
    },
    tabClick(activeName) {
      console.log(activeName)
      if (this.activeName !== '0' && this.activeName !== '1') {
        this.getTable()
      }
    },


    // 表格部分函数
    // 获取表格
    async getTable(query = { page: 1 }) {
      let obj = Object.assign(
        { bus_id: Number(this.require_basic_data.bus_id ) },
        // this.table.search_obj,
        { size: this.getTab().footer.rangeValue },
        query
      );
      // obj.page = page
      if (query.page === 1) {
        this.setPage(1);
      }
      console.log(this.sort_prop);
      if (this.sort_key) {
        obj.sort_key = this.sort_key;
        obj.sort_order = this.sort_order;
      }
      this.$set(this.getTab(), "loading", true);
      // this.getTab().loading = true;
      try {
        const data = await this.$request.get(this.getTab().request_url, { params: obj });
        this.$set(this.getTab(), "loading", false);
        this.$set(this.getTab().main, "body", data.data.data_list);
        this.$set(this.getTab(), "pagesize", data.data.page_size);
        this.$set(this.getTab(), "total", data.data.total);
        this.$set(this.getTab(), "pageindex", data.data.pageindex);
        this.$refs["table"].resizeTable(500);
        console.log(this.getTab().main.body);
      } catch (error) {
        this.$set(this.getTab(), "loading", false);
      }
      console.log(this.getTab());
    },
    // 设置分页
    setPage(val) {
      this.$set(this.getTab(), "currentPage", val);
    },
    // Todo...分页切换请求
    pagereq() {

    },
    // 返回分页
    returnPage() {
      return this.getTab().currentPage;
    },
    // Todo...分页切换请求
    currentChange(val) {
      this.setPage(val);
      this.getTable({
        // fol_id: this.fol_id,
        page: val,
        size: this.getTab().footer.rangeValue,
      });
    },
    // 表格列选择相关
    selectChange(val) {
      this.$set(this.getTab(), "selectArr", val);
    },
    // 分页范围切换相关
    sizeChange(size) {
      this.$set(this.getTab().footer, "rangeValue", size);
      this.$set(this.getTab(), "currentPage", 1);
      // this.getTab().footer.rangeValue = size;
      this.getTable({ size: size });
    },
    // Todo...表格搜索相关
    table_search() {

    },
    // Todo...排序相关
    table_sort(column, prop, order) {
      this.getTable({ page: this.currentPage })
    },

    // 联系人部分
    open_relation_dialog() {
      this.add_relation_show = true
      this.add_relation_isEdit = false
    },
    edit_relation_dialog() {
      this.add_relation_show = true
      this.add_relation_isEdit = true
    },
    async delete_relation() {
      this.$confirm("此操作将永久删除所选联系人, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let arr = []
        this.getTab().selectArr.forEach(item => {
          arr.push(item.id)
        })
        let res = await this.$request.delete('/p/front/demand/link', {
          params: {
            token: auth.getToken(),
            bus_id: qs.parse(sessionStorage.getItem('require_info')).bus_id,
            ids: arr.join(',')
          }
        })
        if (res.code === 0) {
          this.$message({ type: 'success', message: res.msg })
          this.getTable()
        } else {
          this.$message({ type: 'error', message: res.msg })
        }
      }).catch(() => {

      })
      
    },

    // 附件部分
    open_appendix_dialog() {
      this.add_appendix_show = true
    },
    // edit_appendix_dialog() {
    //   this.add_relation_show = true
    //   this.add_relation_isEdit = true
    // },
    async delete_appendix() {
      this.$confirm("此操作将永久删除所选附件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let arr = []
        this.getTab().selectArr.forEach(item => {
          arr.push(item.id)
        })
        let res = await this.$request.delete('/p/front/demand/accessory', {
          params: {
            token: auth.getToken(),
            bus_id: qs.parse(sessionStorage.getItem('require_info')).bus_id,
            ids: arr.join(',')
          }
        })
        if (res.code === 0) {
          this.$message({ type: 'success', message: res.msg })
          this.getTable()
        } else {
          this.$message({ type: 'error', message: res.msg })
        }
      }).catch(() => {

      })
      
    },

    // 方案部分
    open_scheme_dialog() {
      this.add_scheme_show = true
      this.add_scheme_isEdit = false
    },
    edit_scheme_dialog() {
      this.add_scheme_show = true
      this.add_scheme_isEdit = true
    },
    async delete_scheme() {
      this.$confirm("此操作将永久删除所选方案, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let arr = []
        this.getTab().selectArr.forEach(item => {
          arr.push(String(item.scheme_id))
        })
        let res = await this.$request.delete('/p/front/demand/scheme/list', {
          params: {
            token: auth.getToken(),
            scheme_ids: JSON.stringify(arr)
          }
        })
        if (res.code === 0) {
          this.$message({ type: 'success', message: res.msg })
          this.getTable()
        } else {
          this.$message({ type: 'error', message: res.msg })
        }
      }).catch(() => {

      })
      
    },
    async recall_scheme() {
      this.recall_scheme_show = true
      console.log(this.recall_scheme_show)
    },
    async seek_scheme(data) {
      this.show_scheme_option = {
        scheme_info: [],
        status_info: []
      }
      let res = await this.$request.get('/p/front/demand/schemedetail/list', {
        params: {
          scheme_id: data.scheme_id
        }
      })

      if (res.code === 0) {
        if (res.data.scheme_info) {this.show_scheme_option = res.data}
        console.log(this.show_scheme_option)
        this.show_scheme = true
        // this.$message({ type: 'success', message: res.msg })
      } else {
        this.$message({ type: 'error', message: res.msg })
      }

    },


    // 生成头部组件配置
    async create_head_option() {
      await Promise.resolve(this.get_basic_info())
      let option = {
        left: {
          main_type: '项目需求',
          title: this.require_basic_data.nam,
          tag: this.tag_option[this.require_basic_data.status],
          other_item: [
            { type: '客户名称', value: this.require_basic_data.client_nam},
            { type: '应用领域', value: this.require_basic_data.industry},
            { type: '总负责人', value: this.require_basic_data.to_nam},
            { type: '需求负责人', value: this.require_basic_data.by_nam},
            { type: '业务员', value: this.require_basic_data.bus_nam},
            { type: '创建时间', value: this.require_basic_data.cr_time}
          ]
        },
        right: {
          top: [
            {
              name: 'drop',
              option: [
                { func: 'add', icon: 'icon-daibanshixiang', text: '分配' },
                { func: 'add', icon: 'icon-daibanshixiang', text: '转移' }
              ]
            },
            {
              name: 'btn_group',
              option: [
                {
                  func: 'add', icon: 'icon-daibanshixiang', text: '成交', type: 'success'
                },
                {
                  func: 'add', icon: 'icon-daibanshixiang', text: '终止', type: 'warning'
                }
              ]
            }
          ],
          progress: []
        }
      }
      let progress_color = ['success', 'warning', 'danger']
      this.basic_info.stage.forEach((item, index) => {
        option.right.progress.push({
          text: item,
          type: index > progress_color.length - 1 ? 'info' : progress_color[index]
        })
      })
      console.log(option)
      this.head_option = option
    },
    create_nav_option() {
      let arr = []
      this.basic_info.tab.forEach(item => {
        if (this.nav_tag_option[item]) arr.push({ label: item, name: this.nav_tag_option[item]})
      })
      this.nav_option = arr
    },
    // 获取对应表格配置
    getTab() {
      let table;
      switch (this.activeName) {
        case "2":
          table = this.table_team;
          break;
        case "3":
          table = this.table_audit;
          break;
        case "4":
          table = this.table_report;
          break;
        case "5":
          table = this.table_appendix;
          break;
        case "6":
          table = this.table_relation;
          break;
        case "7":
          table = this.table_follow;
          break;
        case "8":
          table = this.table_scheme;
          break;
        default:
          table = undefined;
          break;
      }
      return table;
    },
    // 获取基础信息
    async get_basic_info() {
      let res = await this.$request.get('/p/front/demand/deatails', {
        params: {
          bus_id: Number(this.require_basic_data.bus_id)
        }
      })
      this.basic_info = res.data
      // 生成组件可用基础信息数据结构
      this.create_basic_info_data()
    },
    create_basic_info_data() {
      let basic_map = [
        { key: 'dep_nam', name: '所属部门'},
        { key: 'to_nam', name: '总负责人'},
        { key: 'demand_num', name: '需求编号'},
        { key: 'nam', name: '需求名称'},

        { key: 'client_nam', name: '客户名称'},
        { key: 'pro_nam', name: '产品名称'},
        { key: 'industry', name: '应用领域'},
        { key: 'importance', name: '需求等级'},

        { key: 'source', name: '需求来源'},
        { key: 'bus_nam', name: '业务员'},
        { key: 'dep_bus', name: '业务员部门'},

        { key: 'for_time', name: '需求提出日期'},
        { key: 'put_time', name: '希望出方案日期'},
        { key: 'dep_by', name: '负责人部门'},
        { key: 'by_nam', name: '需求负责人'},
        { key: 'remark', name: '备注信息'},
        // { key: '', name: '附件'}
      ]
      let system_map = [
        { key: 'c_nam', name: '创建人'},
        { key: 'cr_time', name: '创建时间'},
        { key: 'u_nam', name: '更新人'},
        { key: 'up_time', name: '更新日期'}
      ]
      let basic_info_data = {
        basic_info: [],
        system_info: []
      }
      basic_map.forEach((item) => {
        basic_info_data.basic_info.push({
          key: item.name,
          value: this.basic_info.basic_info[item.key]
        })
      })
      system_map.forEach((item) => {
        basic_info_data.system_info.push({
          key: item.name,
          value: this.basic_info.system_info[item.key]
        })
      })
      this.basic_info_data = basic_info_data
    },


    // 任务部分
    // 获取看板信息
    // 获取项目阶段
    async get_task_progress() {
      let res = await this.$request.get('/p/front/demand/taskfolder/list', {
        params: {
          bus_id: Number(this.require_basic_data.bus_id)
        }
      })
      let map_tree = {
        0: {
          name: '未开始',
          color: 'font_info',
          bg: 'bg_info',
        },
        1: {
          name: '进行中',
          color: 'font_warning',
          bg: 'bg_warning',
        },
        2: {
          name: '已完成',
          color: 'font_success',
          bg: 'bg_success',
        },
        3: {
          name: '',
          color: '',
          bg: 'bg_info'
        }
      }
      
      this.$set(this.task_option, 'stage_arr', res.data)
      this.create_stage_arr(this.task_option.stage_arr, map_tree)
      this.create_task_arr(this.task_option.stage_arr[0].children[0].p_name)
    },

    // 跟进部分
    async get_follow_data(query = {}) {
      let obj = Object.assign({},{
        task_id: '0',
        bus_id: String(qs.parse(sessionStorage.getItem('require_info')).bus_id),
        page: '1',
        size: '99',
      }, query)
      let res = await this.$request.get('/p/front/demand/follow', {
        params: obj
      })
      this.$set(this.follow_option, 'data_list', res.data.data_list)
    },
    async follow_confirm(...data) {

    },
    follow_search(v) {
      console.log(v)
      // this.get_follow_data({value: v})
    },

    // 团队成员部分
    // 添加成员
    add_members() {
      this.add_members_show = true
    },
    // 获取人员信息
    async get_to_uid_option(v) {
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

      this.members_option = res.data.data_list
      this.loading = false
    },
    close_members() {
      this.$refs.add_members.resetFields()
      this.add_members_show = false
    },
    async add_members_confirm() {
      if (this.add_members_form.members.length === 0) return this.$message({ type: 'warning', 请选择成员 })
      let f = new FormData()
      f.append('bus_id', qs.parse(sessionStorage.getItem('require_info')).bus_id)
      f.append('uids', this.add_members_form.members.join(','))
      let res = await this.$request.post('/p/front/demand/team', f, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      if (res.code === 0) {
        this.$message({ type: 'success', message: res.msg })
        this.close_members()
        this.getTable()
      } else {
        this.$message({ type: 'error', message: res.msg })
      }
    },
    async delete_members() {
      this.$confirm("此操作将永久删除所选成员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let res = await this.$request.delete('/p/front/demand/team', {
          params: {
            token: auth.getToken(),
            bus_id: qs.parse(sessionStorage.getItem('require_info')).bus_id,
            uids: this.getTab().selectArr.map((item) => item.uid).join(',')
          }
        })
        if (res.code === 0) {
          this.$message({ type: 'success', message: res.msg })
          this.getTable()
        } else {
          this.$message({ type: 'error', message: res.msg })
        }
      }).catch(() => {

      })
    },

    // 生成任务阶段数据结构
    create_stage_arr(data, map_tree) {
      data.forEach((item, index) => {
        if(item.status === null) {
          data[index]['name'] = ''
          data[index]['icon_color'] = ''
          data[index]['bg_color'] = 'bg_info'
        } else {
          data[index]['name'] = map_tree[item.status].name
          data[index]['icon_color'] = map_tree[item.status].color
          data[index]['bg_color'] =  map_tree[item.status].bg
        }
        
        if (item.children && item.children.length > 0) {
          this.create_stage_arr(data[index].children, map_tree)
        }
      })
    },
    // 生成任务看板数据结构
    async create_task_arr(p_name) {
      let obj = {
        bus_id: Number(this.require_basic_data.bus_id)
      }
      if (p_name) obj['p_name'] = p_name
      let res = await this.$request.get('/p/front/demand/task/list', {
        params: obj
      })
      console.log(res.data)
      this.$set(this.task_option, 'task_arr', res.data)
    }
  },

  async created() {
    this.require_basic_data = qs.parse(sessionStorage.getItem('require_info'))
    console.log(this.require_basic_data)
    this.$route.meta.title = this.require_basic_data.nam
    
  },
};
</script>

<style lang="scss" scoped>
 .outside {
   display: flex;
   flex-direction: column;
   width: 100%;
   height: 100%;
   box-sizing: border-box;
   padding: 10px;
 }
 
 .head {
   width: 100%;
   height: 120px;
 }
 .nav {
   margin: 10px 0;
   padding: 5px 10px 0;
   background: #fff;
   /deep/.el-tabs__header {
     margin: 0px;
   }
   /deep/.el-tabs__nav-wrap::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2px;
      background-color: #fff;
      z-index: 1;
   }
 }
 .main {
   flex: 1;
   width: 100%;
   height: 100%;
   overflow: hidden;
   .main_wrap {
     width: 100%;
     height: 100%;
     background: #fff;
   }
 }
 .global_style {
    width: 560px;
    /deep/.el-form-item__content {
      width: 500px;
    }
    .el-select {
      width: 100%;
    }
    
  }
</style>