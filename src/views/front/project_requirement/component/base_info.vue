<template>
  <div class="flex-column main_right">
    <div class="nav">
      <el-tabs :value="'0'">
        <el-tab-pane label="基本信息" :name="'0'"></el-tab-pane>
      </el-tabs>
    </div>

    <div class="content">
      <div class="flex-align content_item">
        <i class="icon iconfont icon-daibanshixiang"></i>
        <div class="item_name">路径</div>
        <div class="flex-align item_value">
          <el-link :underline="false">谈判报价</el-link>
          <i class="el-icon-arrow-right"></i>
          <el-link type="primary" :underline="false">工程报价</el-link>
        </div>
      </div>

      <div class="flex-align content_item">
        <i class="icon iconfont icon-daibanshixiang"></i>
        <div class="item_name">任务状态</div>
        <div class="flex-align item_value">
          <el-tag size="mini" type="warning">进行中</el-tag>
        </div>
      </div>

      <div class="flex-align content_item">
        <i class="icon iconfont icon-daibanshixiang"></i>
        <div class="item_name">起止日期</div>
        <div class="flex-align item_value">2020.10.28-</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "base_info",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.main_right {
        width: 300px;
        height: 100%;
        border-top: 1px solid #E4E4E4;
        border-left:  1px solid #E4E4E4;
        .nav {
          height: 40px;
          padding-left: 20px;
          border-bottom:  1px solid #E4E4E4;
          /deep/.el-tabs__nav-wrap::after {
              content: "";
              position: absolute;
              left: 0;
              bottom: 0;
              width: 100%;
              height: 0px;
              background-color: #fff;
              z-index: 1;
          }
        }
        .content {
          flex: 1;
          padding: 15px;
          background: #fff;
          .content_item {
            height: 32px;
            .icon, .item_name, .item_value {
              margin-right: 10px;
            }
            .item_name {
              width: 61px;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              line-height: 16px;
              color: #41494D;
            }
            .item_value {
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              i {
                margin: 0 10px;
              }
            }
          }
        }
      }
</style>