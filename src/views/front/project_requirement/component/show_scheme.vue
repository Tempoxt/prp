<template>
  <el-drawer
    title="方案详情"
    :visible.sync="show"
    direction="rtl"
    :before-close="close"
    size="60%">
    <el-form label-width="80px" :inline="true">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>方案信息</span>
        </div>
        <el-form-item class="global_style" label="方案名称">
          <span>{{ option.scheme_info[0].title }}</span>
        </el-form-item>
        <el-form-item class="global_style" label="版本">
          <span>{{ option.scheme_info[0].version }}</span>
        </el-form-item>
        <el-form-item class="global_style" label="上传人">
          <span>{{ option.scheme_info[0].up_name }}</span>
        </el-form-item>
        <el-form-item class="global_style" label="上传日期">
          <span>{{ option.scheme_info[0].up_time }}</span>
        </el-form-item>
        <el-form-item class="global_style remark" label="备注">
          <span>{{ option.scheme_info[0].remark }}</span>
        </el-form-item>
        <el-form-item class="global_style appendix" label="附件">
          <span>{{ option.scheme_info[0].nam }}</span>
        </el-form-item>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>状态信息</span>
        </div>
        <!-- <el-table :data="option.status_info">
          <el-table-column property="title" label="名称" width="150"></el-table-column>
          <el-table-column property="create_time" label="日期" width="200"></el-table-column>
          <el-table-column property="result" label="结果"></el-table-column>
          <el-table-column property="data" label="原因/反馈内容"></el-table-column>
        </el-table> -->
        <employeeTable 
          :key="'table_scheme'"
          :table="table"
        />
      </el-card>
      
    </el-form>
  </el-drawer>
</template>

<script>
import employeeTable from "@/components/public/table/employeeTable";

export default {
  name: 'show_scheme',
  components: {
    employeeTable,
  },
  props: {
    show: {
      type: Boolean,
      default: true
    },
    option: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      table: {
        size: "mini", // 控件大小统一
        selectArr: [], // 保存勾选项的数组
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
              keys: "title",
              title: "名称",
            }, // 普通文本展示
            {
              type: 'text',
              keys: 'create_time',
              title: '日期'
            },
            { type: 'tags', keys: 'result', title: '客户反馈', options: {
                0: {color: 'success', tip: '通过'},
                1: {color: 'danger', tip: '不通过'}
              }
            },
            {
              type: 'text',
              keys: 'data',
              title: '原因/反馈内容'
            },
          ],
          body: this.option.status_info, // 表格接口获取展示数据存放处
        },
        
      },
    }
  },
  async mounted() {
    console.log(this.option)
  },
  methods: {
    async close() {
      await Promise.resolve(this.$emit('update:show', false))
      // this.$emit("close");
    },
  }
}
</script>

<style lang="scss" scoped>
  .global_style {
    width: 40%;
  }
  .remrk, .appendix {
    width: 90%;
  }
  .box-card {
    margin: 10px;
    max-height: 400px;
    overflow: auto;
  }
  .table {
    padding: 0px;
  }
</style>