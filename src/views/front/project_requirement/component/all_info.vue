<template>
  <div class="outside">

    <div class="wrap">

      <div class="info">
        <div class="flex-align info_head">
          <div class="info_title">基础信息<div class="pillar"></div></div>
          <div class="dotted"></div>
        </div>
        
        <div class="flex info_main">
          <div v-for="(item, index) in option.basic_info" :key="index" class="flex-align info_main_item">
            <div class="item_key">{{ item.key }}</div>
            <div class="item_value">{{ item.value }}</div>
          </div>
        </div>
      </div>
      
      <div class="info">
        <div class="flex-align info_head">
          <div class="info_title">系统信息<div class="pillar"></div></div>
          <div class="dotted"></div>
        </div>
        
        <div class="flex info_main">
          <div v-for="(item, index) in option.system_info" :key="index"  class="flex-align info_main_item">
            <div class="item_key">{{ item.key }}</div>
            <div class="item_value">{{ item.value }}</div>
          </div>
        </div>
      </div>
      

    </div>

  </div>
</template>

<script>
export default {
  props: {
    option: {
      type: Object,
      default() {
        return {
          basic_info: [],
          system_info: []
        }
      }
    }
  }
}
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

  .outside {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
    background: #fff;
    .wrap {
      height: 100%;
      overflow: scroll;
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
            color: #41494D;
            padding-left: 14px;
          }
          .pillar {
            position: absolute;
            left: 0;
            top: 3px;
            display: block;
            width: 4px;
            height: 14px;
            background: #0BB2D4;
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
          width: 480px;
          margin-left: 14px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-column-gap: 12px;
          grid-row-gap: 12px;
          justify-content: space-between;
          .info_main_item {
            // width: 240px;
            height: 40px;
            .item_key {
              width: 98px;
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 16px;
              color: #868D91; 
              margin-right: 10px;
            }
            .item_value {
              font-size: 12px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              line-height: 16px;
              color: #41494D;
            }
          }
        }
      }
    }
  }
</style>