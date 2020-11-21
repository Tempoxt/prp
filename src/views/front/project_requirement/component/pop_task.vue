<template>
  <div>
      <el-drawer
        :visible="false"
        direction="rtl"
        :with-header="false"
        size="50%">
        <div class="flex-column wrap">

          <header class="head">
            <all-head :option="head_option" @handlercb="handlerCb"></all-head>
          </header>

          <main class="flex main">
            <div class="flex-column main_left">
              <nav class="nav">
                <el-tabs v-model="activeName" @tab-click="tabClick(activeName)">
                  <template v-for="(item, index) in nav_option">
                    <el-tab-pane :key="index" :label="item.label" :name="item.name"></el-tab-pane>
                  </template>
                </el-tabs>
              </nav>

              <div class="content">
                <follow></follow>
              </div>
            </div>
            <div class="flex-column main_right">
              <!--<div class="nav">
                <el-tabs :value="0">
                    <el-tab-pane label="基本信息" :name="0"></el-tab-pane>
                </el-tabs>
              </div>

              <div class="content">
                <div class="flex-align content_item">
                  <i class="icon iconfont icon-daibanshixiang"></i>
                  <div class="item_name">路径</div>
                  <div class="flex-align item_value">
                    <el-link :underline="false">谈判报价</el-link> <i class="el-icon-arrow-right"></i> <el-link type="primary" :underline="false">工程报价</el-link>
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
                  <div class="flex-align item_value">
                    2020.10.28-
                  </div>
                </div>
              </div>-->
              <base-info></base-info>
            </div>
          </main>
        </div>

      </el-drawer>
    

  </div>
</template>

<script>
import allHead from "./all_show_head"
import allTask from "./all_show_task"
import allInfo from "./all_info"
import baseInfo from "./base_info"
import follow from "./follow"


export default {
  name: 'pop_task',
  components: {
    allHead,
    allTask,
    allInfo,
    baseInfo,
    follow
  },
  data() {
    return {
      // 导航
      activeName: '0',
      nav_option: [
        { label: '跟进', name: '0' },
        { label: '表单', name: '1' },
        { label: '文档', name: '2' },
        { label: '问题', name: '3' },
      ],
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
            { type: '客户名称', value: 'HG00565'},
            { type: '客户名称', value: 'HG00565'},
            { type: '客户名称', value: 'HG00565'},
            { type: '客户名称', value: 'HG00565'}
          ]
        },
        right: {
          top: [
            
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
        }
      },
    }
  },
  methods: {
    handlerCb(func, ...data) {
      console.log(func, data)
      this[func](...data);
    },
    tabClick(activeName) {

    }
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-drawer__body {
    overflow: hidden;
  }
  .wrap {
    height: 100%;
    overflow: hidden;
    .head {
      padding: 10px 0;
    }
    .main {
      flex: 1;
      background: #F5F5F5;
      padding-top: 10px;
      overflow: hidden;
      .main_left {
        flex: 1;
        margin-right: 10px;
        height: 100%;
        
        border-top: 1px solid #E4E4E4;
        border-right:  1px solid #E4E4E4;
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
          overflow: hidden;
        }
      }
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
          overflow: hidden;
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
    }
  }
</style>