<template>
  <el-row class="h-full public-table-container">
    <el-col class="h-full tree-wrap">
      <div class="h-full">
        <org
          ref="tree"
          v-if="treeShow"
          :option="treeOption"
          :operate="false"
          @handlerCb="handlerCb"
        >
          <template #treeSlot="{ data }">
            <div>
              <i v-if="data.node" class="icon iconfont icon-wenjian1"></i>
              &nbsp;
              <span>{{ data.node.label }}</span>
            </div>
          </template>
        </org>
      </div>
    </el-col>
    <el-col
      class="table-wrap"
      style="border-left: 1px solid rgb(232, 232, 232); height: 100%"
    >
      <el-tabs v-model="activeName" @tab-click="tab_click(activeName)">
        <el-tab-pane label="全部需求" name="1">
          <el-col class="mainwrap">
            <employeeTable
              v-if="activeName === '1'"
              ref="table"
              :table.sync="table1"
              @handlerCb="handlerCb"
              @selectChange="selectChange"
              @currentChange="currentChange"
              @search="docSearch"
              @sortChange="sortChange"
            >
              <template #focusState="{ scope }">
                <i
                  v-if="scope.row.focus_state === 1"
                  class="el-icon-star-on font_light_yellow font_16 select_cursor"
                ></i>
                <i v-else class="el-icon-star-off font_16 select_cursor"></i>
              </template>
            </employeeTable>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="我负责的" name="2">
          <el-col class="mainwrap">
            <employeeTable
              v-if="activeName === '2'"
              ref="table"
              :table.sync="table2"
              @handlerCb="handlerCb"
              @selectChange="selectChange"
              @currentChange="currentChange"
              @search="docSearch"
              @sortChange="sortChange"
            >
            </employeeTable>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="我关注的" name="3">
          <el-col class="mainwrap">
            <employeeTable
              v-if="activeName === '3'"
              ref="table"
              :table.sync="table3"
              @handlerCb="handlerCb"
              @selectChange="selectChange"
              @currentChange="currentChange"
              @search="docSearch"
              @sortChange="sortChange"
            >
            </employeeTable>
          </el-col>
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <add-req
      v-if="add_req_show"
      :show.sync="add_req_show"
      :isEdit="isEdit"
      :select_items="getTab().selectArr.length > 0 ? getTab().selectArr[0] : {}"
      @close="getTable"
      @req="getTable"
    />
  </el-row>
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
import addReq from "./component/add_req";

export default {
  name: "project_requirement",
  // mixins: [table_mixin],
  components: {
    employeeTable,
    org,
    addReq,
  },
  data() {
    return {
      flatArr: [], // 扁平化树
      showTip: false, // 提示显隐
      tableShow: false,
      searchOption: {},
      highSearchOption: {},
      selectFile: {},
      activeName: "",
      orgid: 0,
      treeShow: true,
      // 抽出排序参数
      sort_order: undefined,
      sort_key: undefined,
      // 主页左侧树配置
      treeOption: {
        // 业务属性 部门id
        dep_id: undefined,
        show: true,
        showSearch: true,
        search: {
          text: "",
        },
        treeData: {
          data: [],
          mainIconRules: [],
          operate: [
            {
              icon: "icon-lajitong",
              func: "del",
            },
            {
              icon: "icon-bianji",
              func: "edit",
            },
          ],
          treeProps: {
            children: "children",
            label: "dep_nam",
          },
          expandedArr: [], //默认展开
          // defaultKey: 0,
          nodeKey: "dep_id",
          filterMethod(value, data) {
            if (!value) return true;
            return data.fol_nam && data.fol_nam.indexOf(value) !== -1;
          },
          highlightCurrent: true,
          checkOnClick: false,
          nodeClick: (() => {
            // let req = this.req;
            return (val, node, req) => {
              this.getTab().currentPage = 1;
              this.$set(this.treeOption, "dep_id", val.dep_id);
              this.getTable();
            };
          })(),
          // nodeExpand: (data, node, vm) => {
          //   if (!this.treeOption.treeData.expandedArr.includes(data.fol_id))
          //     this.treeOption.treeData.expandedArr.push(data.fol_id);
          // },
          // nodeCollapse: (data, node, vm) => {
          //   // 节点收缩时遍历默认展开的数组
          //   this.checkExpand(data);
          // },
          expandOnClick: false,
        },
      },
      //主页表格
      table: {},
      table1: {
        // 业务属性 请求的类型
        types: 0,

        check: true,
        size: "mini",
        loading: false,
        total: 0,
        currentPage: 1,
        selectArr: [],
        header: {
          left: [
            {
              type: "buttonGroup",
              data: [
                {
                  text: "添加",
                  icon: "icon-tianjia",
                  func: "add_require",
                },
                {
                  text: "修改",
                  icon: "icon-daibanshixiang",
                  func: "edit_require",
                  isSelects: true,
                },
                {
                  text: "删除",
                  icon: "icon-lajitong",
                  func: "delete",
                  isSelects: true,
                },
              ],
            },
          ],
          right: [
            {
              type: "buttonGroup",
              data: [
                { icon: "icon-xingzhuang", func: "full" },
                { icon: "icon-shuaxin", func: "getTable" },
                { icon: "icon-lie", type: "list" },
              ],
            },
          ],
        },
        main: {
          head: [
            { type: "index", title: "#", fixed: true },
            // {
            //   type: "text",
            //   keys: "focus_state",
            //   title: "关注",
            //   func: "seek",
            //   width: 60,
            //   fixed: true,
            // },
            {
              type: "slot",
              keys: "focus_state",
              title: "关注",
              slotName: "focusState",
              width: "60px",
              fixed: true,
            },
            {
              type: "link",
              keys: "nam",
              title: "需求名称",
              width: "160px",
              func: "seek",
              fixed: true,
            },
            {
              type: "text",
              keys: "demand_num",
              title: "需求编号",
            },
            // {
            //   type: "text",
            //   keys: "doc_type",
            //   title: "需求类型",
            // },
            { type: "text", keys: "client_nam", title: "客户名称" },
            { type: "text", keys: "industry", title: "应用领域" },
            {
              type: "text",
              keys: "pro_nam",
              title: "产品名称",
            },
            // { type: "text", keys: "importance", title: "需求等级" },
            {
              type: "textRules",
              keys: "importance",
              title: "需求等级",
              rules: {
                [0]: "一般",
                [1]: "重要",
                [2]: "非常重要",
              },
            },
            { type: "text", keys: "source", title: "需求来源" },
            {
              type: "text",
              keys: "bus_nam",
              title: "业务员",
              width: 160,
            },
            {
              type: "text",
              keys: "to_nam",
              title: "总负责人",
              width: 160,
            },
            { type: "text", keys: "c_nam", title: "创建人" },
            {
              type: "text",
              keys: "cr_time",
              title: "创建时间",
              width: 160,
            },
          ],
          body: null,
        },
        footer: {
          rangeValue: 20,
          holder: "",
          func: "sizeChange",
          range: [
            { label: 10, value: 10 },
            { label: 20, value: 20 },
          ],
        },
      },
      table2: {
        // 业务属性 请求的类型
        types: 1,

        check: true,
        size: "mini",
        loading: false,
        total: 0,
        currentPage: 1,
        selectArr: [],
        header: {
          left: [
            {
              type: "buttonGroup",
              data: [
                {
                  text: "标签",
                  icon: "icon-biaoqian",
                  func: "labelShows",
                  isSelects: true,
                },
              ],
            },
            {
              type: "slot",
              color: "success",
              slotName: "but",
            },
          ],
          right: [
            {
              type: "buttonGroup",
              data: [
                { icon: "icon-xingzhuang", func: "full" },
                { icon: "icon-shuaxin", func: "getTable" },
                { icon: "icon-lie", type: "list" },
              ],
            },
          ],
        },
        main: {
          head: [
            { type: "index", title: "#", fixed: true },
            // {
            //   type: "text",
            //   keys: "focus_state",
            //   title: "关注",
            //   func: "seek",
            //   width: 60,
            //   fixed: true,
            // },
            {
              type: "slot",
              keys: "focus_state",
              title: "关注",
              slotName: "focusState",
              width: "60px",
              fixed: true,
            },
            {
              type: "link",
              keys: "nam",
              title: "需求名称",
              width: "160px",
              func: "seek",
              fixed: true,
            },
            {
              type: "text",
              keys: "demand_num",
              title: "需求编号",
            },
            // {
            //   type: "text",
            //   keys: "doc_type",
            //   title: "需求类型",
            // },
            { type: "text", keys: "client_nam", title: "客户名称" },
            { type: "text", keys: "industry", title: "应用领域" },
            {
              type: "text",
              keys: "pro_nam",
              title: "产品名称",
            },
            // { type: "text", keys: "importance", title: "需求等级" },
            {
              type: "textRules",
              keys: "importance",
              title: "需求等级",
              rules: {
                [0]: "一般",
                [1]: "重要",
                [2]: "非常重要",
              },
            },
            { type: "text", keys: "source", title: "需求来源" },
            {
              type: "text",
              keys: "bus_nam",
              title: "业务员",
              width: 160,
            },
            {
              type: "text",
              keys: "to_nam",
              title: "总负责人",
              width: 160,
            },
            { type: "text", keys: "c_nam", title: "创建人" },
            {
              type: "text",
              keys: "cr_time",
              title: "创建时间",
              width: 160,
            },
          ],
          body: null,
        },
        footer: {
          rangeValue: 20,
          holder: "",
          func: "sizeChange",
          range: [
            { label: 10, value: 10 },
            { label: 20, value: 20 },
          ],
        },
      },
      table3: {
        // 业务属性 请求的类型
        types: 2,

        check: true,
        size: "mini",
        loading: false,
        total: 0,
        currentPage: 1,
        selectArr: [],
        header: {
          left: [
            {
              type: "buttonGroup",
              data: [
                {
                  text: "标签",
                  icon: "icon-biaoqian",
                  func: "labelShows",
                  isSelects: true,
                },
              ],
            },
            {
              type: "selectWith",
              tag: "create_time_end",
              select: {
                value: 0,
                holder: "",
                options: [
                  { label: "年", value: 0 },
                  { label: "月", value: 1 },
                  { label: "日", value: 2 },
                ],
              },
              date: {
                type: ["year", "month", "date"],
              },
              value: "",
            },
            {
              type: "inputSearch",
              holder: "请输入文档名称关键词搜索",
              value: "",
              tag: "dim_doc_name",
            },
            {
              type: "slot",
              color: "success",
              slotName: "but",
            },
          ],
          right: [
            {
              type: "buttonGroup",
              data: [
                { icon: "icon-xingzhuang", func: "full" },
                { icon: "icon-shuaxin", func: "getTable" },
                { icon: "icon-lie", type: "list" },
              ],
            },
          ],
        },
        main: {
          head: [
            { type: "index", title: "#", fixed: true },
            // {
            //   type: "text",
            //   keys: "focus_state",
            //   title: "关注",
            //   func: "seek",
            //   width: 60,
            //   fixed: true,
            // },
            {
              type: "slot",
              keys: "focus_state",
              title: "关注",
              slotName: "focusState",
              width: "60px",
              fixed: true,
            },
            {
              type: "link",
              keys: "nam",
              title: "需求名称",
              width: "160px",
              func: "seek",
              fixed: true,
            },
            {
              type: "text",
              keys: "demand_num",
              title: "需求编号",
            },
            // {
            //   type: "text",
            //   keys: "doc_type",
            //   title: "需求类型",
            // },
            { type: "text", keys: "client_nam", title: "客户名称" },
            { type: "text", keys: "industry", title: "应用领域" },
            {
              type: "text",
              keys: "pro_nam",
              title: "产品名称",
            },
            // { type: "text", keys: "importance", title: "需求等级" },
            {
              type: "textRules",
              keys: "importance",
              title: "需求等级",
              rules: {
                [0]: "一般",
                [1]: "重要",
                [2]: "非常重要",
              },
            },
            { type: "text", keys: "source", title: "需求来源" },
            {
              type: "text",
              keys: "bus_nam",
              title: "业务员",
              width: 160,
            },
            {
              type: "text",
              keys: "to_nam",
              title: "总负责人",
              width: 160,
            },
            { type: "text", keys: "c_nam", title: "创建人" },
            {
              type: "text",
              keys: "cr_time",
              title: "创建时间",
              width: 160,
            },
          ],
          body: null,
        },
        footer: {
          rangeValue: 20,
          holder: "",
          func: "sizeChange",
          range: [
            { label: 10, value: 10 },
            { label: 20, value: 20 },
          ],
        },
      },
      // 高级搜索
      searchShow: false,
      // 添加需求
      add_req_show: false,
      // 修改标志
      isEdit: false,
    };
  },
  mounted() {
    this.activeName = "1";
    this.getTable();
  },
  methods: {
    test(data) {
      console.log(data);
    },
    handlerCb(func, data, table) {
      this[func](data, table);
    },
    // 设置分页
    setPage(val) {
      this.$set(this.getTab(), "currentPage", val);
    },
    // 返回分页
    returnPage() {
      return this.getTab().currentPage;
    },
    getTab() {
      let table;
      switch (this.activeName) {
        case "1":
          table = this.table1;
          break;
        case "2":
          table = this.table2;
          break;
        case "3":
          table = this.table3;
          break;
        default:
          table = this.table1;
          break;
      }
      return table;
    },
    currentChange(val) {
      this.setPage(val);
      this.getTable({
        fol_id: this.fol_id,
        page: val,
        size: this.getTab().footer.rangeValue,
      });
    },
    selectChange(val) {
      this.$set(this.getTab(), "selectArr", val);
    },
    sizeChange(size) {
      this.$set(this.getTab().footer, "rangeValue", size);
      this.$set(this.getTab(), "currentPage", 1);
      // this.getTab().footer.rangeValue = size;
      this.getTable({ size: size });
    },
    async sortChange(column) {
      console.log(column);
      let obj = {
        descending: "desc",
        ascending: "asc",
      };
      this.sort_key = column.prop;
      this.sort_order = obj[column.order];
      this.getTable({ page: this.getTab().currentPage });
    },
    tab_click(v) {
      this.sort_key = undefined;
      this.sort_prop = undefined;
      this.getTable({ page: this.getTab().currentPage });
    },
    async departmentReq() {
      let data = await this.$request.get("/doc/departfolder/");
      this.addRightTreeData = [data.data];
    },
    async getTable(query = { page: 1 }) {
      let obj = Object.assign(
        { types: this.getTab().types, dep_id: this.treeOption.dep_id },
        this.table.search_obj,
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
        let url = "/p/front/demand";
        const data = await this.$request.get(url, { params: obj });
        if (this.treeOption.treeData.data.length < 1) {
          this.$set(this.treeOption.treeData, "data", data.data.folder_tree);
          this.$set(this.treeOption.treeData, "expandedArr", [
            data.data.folder_tree[0].dep_id,
          ]);
        }
        this.$set(this.getTab(), "loading", false);
        this.$set(this.getTab().main, "body", data.data.data_list);
        this.$set(this.getTab(), "pagesize", data.data.page_size);
        this.$set(this.getTab(), "total", data.data.total);
        this.$set(this.getTab(), "pageindex", data.data.pageindex);
        this.$refs["table"].resizeTable(500);
        console.log(this.treeOption.treeData.data, data);
      } catch (error) {
        this.$set(this.getTab(), "loading", false);
      }
      console.log(this.getTab());
    },
    async init() {
      this.getTable();
      this.departmentReq();
    },

    full() {
      this.isFullScreen() ? screenfull.exit() : screenfull.request();
    },
    isFullScreen() {
      return (
        document.isFullScreen ||
        document.mozIsFullScreen ||
        document.webkitIsFullScreen
      );
    },
    isOverFlow(e) {
      if (e.target.nodeName !== "DIV") return true;
      if (e.target.scrollWidth > e.target.offsetWidth) {
        this.showTip = false;
      } else this.showTip = true;
    },
    // 搜索整合
    searchMerge() {
      return {};
    },
    mergeHigh(query, act = true) {
      this.highSearchOption = query;
      if (act) this.getTable();
    },
    docSearch(val) {
      this.getTable();
    },
    add_require() {
      this.isEdit = false;
      this.add_req_show = true;
    },
    edit_require() {
      this.isEdit = true;
      this.add_req_show = true;
    },
    delete() {
      this.$confirm("此操作将永久删除该需求, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let res = await this.$request.delete("/p/front/demand", {
              params: {
                token: auth.getToken(),
                bus_id: this.getTab().selectArr[0].bus_id,
              },
            });
            this.$message({ type: "success", message: res.msg });
            this.getTable({ page: this.getTab().currentPage })
          } catch (e) {}
        })
        .catch(() => {});
    },
    // 查看需求
    async seek(data) {
      // console.log(data)
      await Promise.resolve(this.$store.dispatch('set_require_info', data))
      this.$router.push("/allShow?date=" + new Date().getTime());
      // this.$store.state.app.require_info
      // sessionStorage.getItem('TokenKey')
      // console.log(this.$store.getters.get_require_info)
      // console.log(qs.parse(sessionStorage.getItem('require_info')))
    }
  },

  async created() {
    this.init();
    // const { menu } = await getTabs(this.$route.query.menuid)
    // this.menu = menu
  },
};
</script>

<style lang="scss" scoped>
.tree_operate {
  display: none;
  margin: 0 5px;
}

.flexBetween:hover .tree_operate {
  display: inline-block !important;
}

/deep/ .flexBetween div:nth-child(1) {
  width: unset;
}

.appendix {
  width: 140px;
  word-break: break-all;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.tree-wrap {
  flex-basis: 300px;
  width: 300px;
}

.public-table-container {
  display: flex;
}

.table-wrap {
  width: calc(100% - 300px);
  padding: 10px;
}

/deep/.flexBetween,
/deep/ .el-tree-node__content {
  width: unset !important;
}
.node_operate {
  min-width: 60px;
  margin-left: 20px;
}
/deep/ .el-tab-pane,
/deep/.el-tabs,
/deep/.el-tabs__content,
.mainwrap {
  height: 100%;
}
/deep/.el-tabs__content {
  height: calc(100% - 50px);
}
.table {
  padding: 0px;
}
</style>