<template>
  <div class="wrap">
    <div class="wrap_left">
      <div class="info">
        <div class="info_logo">
          <slot name="logo">
          </slot>
        </div>
        <div class="flex-column info_main">
          <div class="info_main_type">{{ option.left.main_type }}</div>
          <div class="info_main_title">
            <span class="info_main_title_left">{{ option.left.title }}</span>
            <el-tag size="mini" :type="option.left.tag.type">{{ option.left.tag.value }}</el-tag>
          </div>
        </div>
      </div>
      <div class="flex other">
        <div class="other_item" v-for="(item, index) in option.left.other_item" :key="index">
          <div class="other_item_type">{{ item.type }}</div>
          <div class="other_item_value">{{ item.value }}</div>
        </div>
      </div>
    </div>
    <div class="wrap_right">
      <div class="flex-reverse top">
        <template v-for="(it, id) in option.right.top">
          <div class="top_item" :key="id">
            <template v-if="it.name === 'btn_group'">
              <el-button 
                v-for="(item, index) in it.option" 
                :key="index" 
                :size="item.size ? item.size : 'mini'"
                :type="item.type"
                @click="handlerCb(item.func)"
              >
                <i v-if="item.icon" class="icon iconfont" :class="[item.icon]"></i>{{ item.text }}
              </el-button>
            </template>
            <div v-if="it.name === 'drop'">
              <el-dropdown @command="handlerDrop">
                <el-button type="it.type ? it.type : ''" size="small"><i class="el-icon-more-outline el-icon--left"></i></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item 
                    v-for="(item, index) in it.option" 
                    :key="index" 
                    :disabled="item.disabled ? item.disabled : false"
                    :command="item.func"
                    >
                    <i v-if="item.icon" class="icon iconfont" :class="[item.icon]" />
                    {{ item.text }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </template>
      </div>
      <div class="flex-reverse progress">
        <div class="flex progress_wrap">
          <div class="progress_wrap-item">
            <template v-for="(item, index) in option.right.progress" >
              <el-link class="progress_item" :key="index" :underline="false" :type="item.type">{{ item.text }}<i v-if="index !== (option.right.progress.length - 1)" class="el-icon-arrow-right el-icon--right"></i></el-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'all_show_head',
  props: {
    option: {
      type: Object,
      default: {}
    }
  },
  mounted() {
    console.log(this.option)
  },
  methods: {
    test(...data) {
      console.log(data)
    },
    handlerCb(func, ...data) {
      console.log(123)
      if (func) this.$emit("handlerCb", func, ...data);
    },
    handlerDrop(func) {
      this.handlerCb(func)
    }
  }
}
</script>

<style lang="scss" scoped>

  .wrap {
    display: flex;
    width: 100%;
    height: 100%;
    background: #fff;
    .wrap_left {
      // display: flex;
      // flex-direction: column;
      height: 100%;
      flex: 1;
      margin-left: 20px;
      .info {
        display: flex;
        width: 100%;
        height: 46px;
        margin: 10px 0;
        .info_logo {
          width: 46px;
          height: 46px;
          margin: 0px 10px 0 0px;
        }
        .info_main {
          height: 46px;
          .info_main_type {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 16px;
            color: #8E999F;
            margin-bottom: 5px;
          }
          .info_main_title {
            .info_main_title_left {
              display: inline-block;
              font-size: 16px;
              font-family: Microsoft YaHei;
              font-weight: bold;
              line-height: 21px;
              color: #37474F;
              margin-right: 20px;
            }
            .info_main_title_right {

            }
          }
        }
      }
      .other {
        .other_item {
          width: 120px;
          margin-right: 20px;
          .other_item_type {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 16px;
            color: #8E999F;
            margin-bottom: 5px;
          }
          .other_item_value {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 16px;
            color: #41494D;
          }
        }
      }
    }
    .wrap_right {
      width:400px;
      height: 100%;
      margin-right: 20px;
      .top {
        width: 100%;
        height: 66px;
        margin: 10px;
        .top_item {
          margin-left: 10px;
        }
      }
      .progress {
        width: 100%;
        .progress_wrap {
          .progress_wrap-item {
            .progress_item {
              margin-left: 10px;
              cursor: default;
              i {
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }

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
  
</style>