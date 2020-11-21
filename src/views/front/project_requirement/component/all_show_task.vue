<template>
  <div class="flex-column wrap">
    <nav class="nav">
      <el-radio-group
        v-model="activeName"
        @change="tabClick(activeName)"
        style="margin-bottom: 30px"
      >
        <template v-for="(item, index) in nav_option">
          <el-radio-button :key="index" :label="item.label"></el-radio-button>
        </template>
      </el-radio-group>
    </nav>

    <main class="main">
      <div class="flex board">
        <div class="flex-column board_item stage">
          <div class="stage_title">项目阶段</div>

          <div class="stage_tree">
            <el-tree
              :data="option.stage_arr"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              @node-click="stage_click"
            >
              <div
                class="flex flex-between tree_leave"
                slot-scope="{ node, data }"
              >
                <div @click="test(data, node)" class="leave_main">
                  <i
                    class="icon iconfont icon-daibanshixiang"
                    :class="[data.icon_color]"
                  ></i>
                  {{ data.p_name }}
                </div>
                <div class="flex-reverse tree_leave_tag">
                  <span
                    v-if="data.name !== '全部阶段'"
                    class="cir"
                    :class="[data.bg_color]"
                  >
                  </span>
                  <el-tag
                    class="leave_tag"
                    v-if="data.name !== ''"
                    size="mini"
                    :type="option.status_option[data.status].type"
                    >{{ data.name }}</el-tag
                  >
                </div>
              </div>
            </el-tree>
          </div>

          <!--<el-button class="stage_add" plain>
            <i class="el-icon-plus"></i> 添加阶段
          </el-button>-->
        </div>
        <template v-if="activeName === '看板'">
          <div
            class="flex-column board_item step"
            v-for="(tag, id) in option.task_tag"
            :key="id"
          >
            <div class="flex flex-between step_head">
              <div class="doing">
                {{ tag.name }} ({{
                  option.task_arr[tag.key]
                    ? option.task_arr[tag.key].length
                    : 0
                }})
              </div>
              <div><i class="el-icon-more-outline"></i></div>
            </div>
            <!--<el-button class="step_add" plain>
            <i class="el-icon-plus"></i> 添加任务
          </el-button>-->
            <div class="step_task">
              <template v-for="(item, index) in option.task_arr[tag.key]">
                <div class="flex-column flex-between task_items" :key="index">
                  <div class="flex flex-between task_item">
                    <div class="flex-align">
                      <i
                        class="icon iconfont icon-daibanshixiang task_icon"
                      ></i>
                      <span class="task_name">{{ item.nam }}</span>
                    </div>
                    <div>
                      <i
                        class="el-icon-more-outline"
                        style="transform: rotate(90deg)"
                      ></i>
                    </div>
                  </div>

                  <div class="flex task_item">
                    <div class="flex-align">
                      <i class="icon iconfont icon-icon_date task_icon"></i>
                      <span class="task_name"
                        >{{ item.start_time }} - {{ item.end_time }}</span
                      >
                    </div>
                  </div>

                  <div class="flex task_item">
                    <div class="flex-align">
                      <i class="icon iconfont icon-geren task_icon"></i>
                      <el-tag class="item_tag">{{ item.u_name }}</el-tag>
                    </div>
                  </div>

                  <div class="flex task_item">
                    <div class="flex-align">
                      <i
                        class="icon iconfont icon-daibanshixiang task_icon"
                      ></i>
                      <el-tag
                        class="item_tag"
                        :type="option.status_option[item.task_status].type"
                      >
                        {{ option.status_option[item.task_status].name }}
                      </el-tag>
                      <el-tag
                        class="item_tag"
                        :type="option.priority_option[item.priority].type"
                      >
                        {{ option.priority_option[item.priority].name }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
        <template v-if="activeName === '列表'">
          <el-col class="mainwrap">
            <employeeTable
              ref="board_list"
              :table.sync="board_list_table"
              @handlerCb="handlerCb"
              @selectChange="selectChange"
              @currentChange="currentChange"
              @search="table_search"
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
        </template>
      </div>
    </main>
    <el-dialog
      :title="dialog_option.is_add ? '添加任务': '修改任务'"
      :visible="dialog_option.is_show"
      :before-close="close_dialog"
      width="800px"
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="mini" :inline="true">
        <el-form-item class="global_style" label="所属阶段" prop="stage_name">
          <el-select v-model="ruleForm.stage_name" placeholder="请选择">
            <template v-if="option.stage_arr.length > 0 && option.stage_arr[0].children">
              <el-option v-for="(item, index) in option.stage_arr[0].children" :key="index" :label="item.p_name" :value="item.p_name"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item class="global_style" label="任务名称" prop="task_name">
          <el-input v-model="ruleForm.task_name"></el-input>
        </el-form-item>
        <el-form-item class="global_style" label="责任人" prop="owner_uid">
          <el-select 
            v-model="ruleForm.owner_uid" 
            placeholder="请选择需求负责人"
            filterable
            remote
            :loading="loading"
            :remote-method="(v) => get_to_uid_option(v, 1)"
          >
            <el-option v-for="(item, index) in to_uid_option" :key="index" :label="item.nam" :value="item.uid">
              <!-- <div class="by_uid flex">
                <div>
                  <el-tooltip effect="dark" :content="item.nam" placement="top">
                    <div class="font_light_blue"> {{ item.nam }} </div>
                  </el-tooltip>
                </div>
                
                <div>{{ item.sta }}</div>
                <div>{{ item.ch_nam }}</div>
                <div>{{ item.dep_nam }}</div>
                <div>{{ item.position }}</div>
              </div> -->
            </el-option>

          </el-select>
        </el-form-item>
        <el-form-item class="global_style" label="任务成员" prop="members">
          <el-select 
            v-model="ruleForm.members" 
            placeholder="请选择任务成员"
            filterable
            remote
            multiple
            :loading="loading"
            :remote-method="(v) => get_to_uid_option(v, 2)"
          >
            <el-option v-for="(item, index) in by_uid_option" :key="index" :label="item.nam" :value="item.uid">
            </el-option>

          </el-select>
        </el-form-item>
        <el-form-item class="global_style date-editor" label="起止日期" prop="time">
          <el-date-picker
            v-model="ruleForm.time"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['12:00:00']">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="global_style" label="优先级" prop="priority">
          <el-select v-model="ruleForm.priority" placeholder="请选择优先级">
            <el-option label="一般" :value="0"></el-option>
            <el-option label="重要" :value="1"></el-option>
            <el-option label="非常重要" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="global_style date-editor" label="备注" prop="remark">
          <el-input type="textarea" v-model="ruleForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close_dialog">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import employeeTable from "@/components/public/table/employeeTable";
import auth from "@/utils/auth";
import qs from "qs";

export default {
  name: "all_show_head",
  props: {
    option: {
      type: Object,
      default() {
        return {};
      },
    }
  },
  components: {
    employeeTable,
  },
  mounted() {
    this.$emit("req");
    
  },
  data() {
    return {
      loading: false,
      activeName: "看板",
      nav_option: [{ label: "看板" }, { label: "列表" }],
      // stage_arr: [
      //   {
      //     icon_color: "#67C23A",
      //     label: "全部阶段",
      //     id: 0,
      //     children: [
      //       { icon_color: "#67C23A", label: "需求评估", id: 1 },
      //       { icon_color: "#E6A23C", label: "谈判报价", id: 2 },
      //       { icon_color: "#67C23A", label: "需求评估", id: 4 },
      //       { icon_color: "#E6A23C", label: "谈判报价", id: 5 },
      //       { icon_color: "#67C23A", label: "需求评估", id: 6 },
      //       { icon_color: "#E6A23C", label: "谈判报价", id: 7 },
      //       { icon_color: "#67C23A", label: "需求评估", id: 8 },
      //       { icon_color: "#E6A23C", label: "谈判报价", id: 9 },
      //       { icon_color: "#909399", label: "项目立项", id: 3, atTime: true },
      //     ],
      //   },
      // ],
      // task_arr: [
      //   {
      //     step: "未开始",
      //     task_item: [
      //       // {
      //       //   title: '工程报价', title_icon: undefined, title_icon_color: '#67C23A',
      //       //   time: '1999-12-22', time_icon: undefined, time_icon_color: '#67C23A',
      //       //   person: 'ccc', person_icon: undefined, persion_icon_color: '#67C23A',
      //       // }
      //       {},
      //       {},
      //     ],
      //   },
      // ],
      board_list_table: {

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
                  func: "add_task",
                },
                {
                  text: "修改",
                  icon: "icon-daibanshixiang",
                  func: "edit_task",
                  isSelects: true,
                },
                {
                  text: "删除",
                  icon: "icon-lajitong",
                  func: "task_delete",
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
            // { type: "index", title: "#", fixed: true },
            {
              type: "text",
              keys: "number",
              title: "序号",
              fixed: true,
            },
            {
              type: "link",
              keys: "task_nam",
              title: "任务名称",
              width: "160px",
              func: "seek",
              fixed: true,
            },
            {
              type: "text",
              keys: "owner_nam",
              title: "责任人",
            },
            // {
            //   type: "text",
            //   keys: "doc_type",
            //   title: "需求类型",
            // },
            { type: "text", keys: "start_time", title: "任务到达时间", width: '160px' },
            { type: "text", keys: "spend_time", title: "已耗时(h)" },
            { type: 'tags', keys: 'task_status', title: '任务状态', options: {
                2: {color: 'success', tip: '已完成'},
                1: {color: 'warning', tip: '进行中'},
                0: {color: 'info', tip: '未开始'},
              }
            },
            // { type: "text", keys: "importance", title: "需求等级" },
            {
              type: "text",
              keys: "importance",
              title: "优先级",
            },
            { type: "text", keys: "cr_name", title: "创建人" },
            {
              type: "text",
              keys: "cr_time",
              title: "创建日期",
              width: 160,
            },
            // { type: "text", keys: "c_nam", title: "创建人" },
            // {
            //   type: "text",
            //   keys: "cr_time",
            //   title: "创建时间",
            //   width: 160,
            // },
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

      // 弹出框部分
      dialog_option: {
        is_add: true,
        is_show: false,
      },
      ruleForm: {
        task_name: '',
        time: undefined,
        members: undefined,
        stage_name: undefined,
        owner_uid: undefined,
        priority: undefined,
        remark: undefined
      },
      // 负责人下拉列表
      to_uid_option: [],
      // 成员下拉列表
      by_uid_option: []
    };
  },
  methods: {
    test(...data) {
      console.log(data);
    },
    handlerCb(func, ...data) {
      this[func](...data);
    },
     // 设置分页
    setPage(val) {
      this.$set(this.board_list_table, "currentPage", val);
    },
    // 返回分页
    returnPage() {
      return this.board_list_table.currentPage;
    },
    selectChange(val) {
      this.$set(this.board_list_table, "selectArr", val);
    },
    sizeChange(size) {
      this.$set(this.board_list_table.footer, "rangeValue", size);
      this.$set(this.board_list_table, "currentPage", 1);
      // this.getTab().footer.rangeValue = size;
      this.getTable({ size: size });
    },
    async getTable(query = { page: 1 }) {
      let obj = Object.assign(
        { bus_id: qs.parse(sessionStorage.getItem('require_info')).bus_id },
        // this.table.search_obj,
        { size: this.board_list_table.footer.rangeValue },
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
      this.$set(this.board_list_table, "loading", true);
      // this.getTab().loading = true;
      try {
        let url = "/p/front/demand/task/listview/list";
        const data = await this.$request.get(url, { params: obj });
        this.$set(this.board_list_table, "loading", false);
        this.$set(this.board_list_table.main, "body", data.data.data_list);
        this.$set(this.board_list_table, "pagesize", data.data.page_size);
        this.$set(this.board_list_table, "total", data.data.total);
        this.$set(this.board_list_table, "pageindex", data.data.pageindex);
        this.$refs["board_list"].resizeTable(500);
      } catch (error) {
        this.$set(this.board_list_table, "loading", false);
      }
    },
    currentChange(val, table) {
      this[table].currentPage = val;
      this.pagereq({
        page: val,
        size: this[table].footer.rangeValue,
      });
    },
    
    // Todo...表格搜索相关
    table_search() {

    },
    // Todo...排序相关
    sortChange(column, prop, order) {
      this.getTable({ page: this.board_list_table.currentPage })
    },
    tabClick(activeName) {
      if(activeName === '列表') {
        this.getTable()
        this.get_to_uid_option()
      }
    },
    add_task() {
      this.dialog_option.is_add = true
      this.open_dialog()
    },
    edit_task() {
      this.dialog_option.is_add = false
      this.open_dialog()
    },
    delete() {

    },
    seek() {

    },
    // 获取人员信息
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
        this.by_uid_option = res.data.data_list
      }
      this.loading = false
    },
    close_dialog() {
      this.$refs['ruleForm'].resetFields()
      this.$set(this.dialog_option, 'is_show', false)
    },
    open_dialog() {
      this.$set(this.dialog_option, 'is_show', true)
    },
    async confirm() {
      this.$refs['ruleForm'].validate(async val => {
        if (val) {
          console.log(this.ruleForm.time)
          let f = new FormData()

          let obj = JSON.parse(JSON.stringify(this.ruleForm))
          let arr = Object.entries(obj)
          for (let item of arr) {
            if (item[0] !== 'time') {
              f.append(item[0], item[1])
            } else {
              f.append('start_time', item[1][0])
              f.append('end_time', item[1][1])
            }
          }
          f.append('bus_id', qs.parse(sessionStorage.getItem('require_info')).bus_id)

          let res
          if (this.dialog_option.is_add) {
            res = await this.$request.post("/p/front/demand/task/listview/list", f, {
              headers: {
                "Content-Type": "multipart/form-data",
              }
            })
            if (res.code === 0) {
              this.$message({ type: 'success', message: res.msg })
              this.close_dialog()
              this.fresh_task()
            } else {
              this.$message({ type: 'error', message: res.msg })
            }
          } else {
            res = await this.$request.post("/p/front/demand", f, {
              headers: {
                "Content-Type": "multipart/form-data",
              }
            })
            if (res.code === 0) {
              this.$message({ type: 'success', message: res.msg })
              this.close_dialog()
              this.fresh_task()
            } else {
              this.$message({ type: 'error', message: res.msg })
            }
          }
           
        }
      })
    },
    stage_click(data) {
      if (this.activeName === '看板') this.$emit('stage_click', data.p_name)
      if (this.activeName === '列表') data.p_name === '全部阶段' ? this.getTable() : this.getTable({ p_name: data.p_name })
    },
    async task_delete() {
      let res = await this.$request.delete("/p/front/demand/task/listview/list",{
        params: {
          token: auth.getToken(),
          task_id: this.board_list_table.selectArr[0].id,
          bus_id: qs.parse(sessionStorage.getItem('require_info')).bus_id,
        }
      })
      if (res.code === 0) {
        this.$message({ type: 'success', message: res.msg })
        this.fresh_task()
      } else {
        this.$message({ type: 'error', message: res.msg })
      }
    },
    async fresh_task() {
      await Promise.resolve(this.$emit('req'))
      if (this.activeName === '看板') this.$emit('stage_click')
      if (this.activeName === '列表') this.getTable()
    }
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.flex-reverse {
  display: flex;
  flex-direction: row-reverse;
}
.flex-between {
  justify-content: space-between;
}
.flex-align {
  display: flex;
  align-items: center;
}

.wrap {
  width: 100%;
  height: 100%;
}
.nav {
  .el-radio-group {
    margin-bottom: 10px !important;
  }
}
.main {
  flex: 1;
  height: 100%;
  overflow: hidden;
  .board {
    height: 100%;
    .board_item {
      flex-basis: 260px;
    }
    .stage {
      height: 100%;
      padding: 20px 15px;
      background: #fff;
      .stage_title {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 19px;
        color: #37474f;
        margin-bottom: 20px;
      }
      .stage_main,
      .stage_main_child {
        flex: 1;
      }
      .stage_main_all {
        height: 30px;
        background: #f8f8f8;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 30px;
        color: #143040;
        padding: 0 15px;
        .icon {
          margin-right: 10px;
        }
      }
      .stage_main_child {
        background: #fff;
        padding: 0 25px;
        height: 30px;
        line-height: 30px;
        .icon {
          margin-right: 10px;
        }
      }
      .tree_leave {
        flex: 1;
        .tree_leave_tag {
          width: 80px;
          align-items: center;
          .leave_tag {
            margin-right: 10px;
          }
        }
        .leave_main {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 5px;
        }
      }
      .icon {
        margin-right: 10px;
      }
      .cir {
        display: inline-block;
        border-radius: 50%;
        width: 6px;
        height: 6px;
      }
      .stage_add {
        height: 36px;
        color: #4c5d66;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        margin-top: 10px;
      }
      .stage_tree {
        height: calc(100% - 60px);
        overflow: auto;
      }
    }
    .step {
      height: 100%;
      padding: 10px 15px 20px 15px;
      .step_head {
        color: #37474f;
        margin-bottom: 10px;
        .doing {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          line-height: 19px;
          color: #37474f;
        }
      }
      .step_add {
        height: 36px;
        color: #4c5d66;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        margin-top: 10px;
        border: none;
        margin-bottom: 10px;
      }
      .step_task {
        max-height: calc(100% - 30px);

        overflow: auto;
        .task_items {
          width: 100%;
          height: 150px;
          box-shadow: 0px 0px 5px #ddd;
          background: #fff;
          padding: 10px;
          margin-bottom: 10px;
          .task_item {
            font-size: 12px;
          }
          .task_name {
            padding-left: 10px;
          }
          .task_item {
            .item_tag {
              margin-left: 10px;
            }
          }
          .tag_name {
          }
        }
      }
    }
    .mainwrap {
      height: 100%;
      padding-right: 0px 20px;
      background: #fff;
      overflow: hidden;
    }
  }
}

/deep/.el-tree-node__content {
  display: flex !important;
  height: 30px;
  line-height: 30px;
}
.global_style {
  width: 360px;
  /deep/.el-form-item__content {
    width: 220px;
  }
  .el-select {
    width: 100%;
  }
}
.date-editor {
  width: 450px;
  /deep/.el-form-item__content {
    width: 320px;
  }
  .el-select {
    width: 100%;
  }
}
</style>