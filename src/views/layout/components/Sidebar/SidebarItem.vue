<template>
  <!-- <div v-if="!item.hidden" class="menu-wrapper" v-once> -->
  <div class="menu-wrapper">
    <!-- <template
      v-if="hasOneShowingChild(item.subs,item) && (item.tabs||!onlyOneChild.subs||onlyOneChild.noShowingChildren)&&!item.alwaysShow"
    >
      <el-menu-item :index="resolvePath(item.url)+(item.isTabs?`?menuid=${item.id}`:'')" :class="{'submenu-title-noDropdown':!isNest}">
        <i :class="onlyOneChild.icon" style="margin-right:10px" :title="resolvePath(item.url)"></i>
        <span slot="title">{{onlyOneChild.name}}</span>
      </el-menu-item>
    </template> -->
    <!-- <el-menu-item>
      <span slot="title">文档</span>
    </el-menu-item> -->
    <template v-if="isNest">
      <div v-for="(item, index) in items" :key="index">
        <router-link
          v-if="!('child' in item) || (item.child.length === 0)"
          :to="item.route"
        >
          <el-menu-item :index="item.route">
            <i
              class="icon iconfont"
              :class="[item.icon]"
              style="margin-right: 10px"
            ></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </router-link>
        <el-submenu v-else :index="item.title">
          <template slot="title">
            <i
              class="icon iconfont"
              :class="[item.icon]"
              style="margin-right: 10px"
            ></i>
            <span>{{ item.title }}</span>
          </template>
          <sidebar-item
            :is-nest="true"
            :items="item.child"
            :key="item.child.route"
            class="nest-menu"
          />
        </el-submenu>
      </div>
    </template>
    <template v-else>
      <div v-for="(item, index) in menusList" :key="index">
        <router-link
          v-if="!('child' in item) || (item.child.length === 0)"
          :to="item.route"
        >
          <el-menu-item :index="item.route">
            <i
              class="icon iconfont"
              :class="[item.icon]"
              style="margin-right: 10px"
            ></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </router-link>
        <template v-else>
          <el-submenu :index="item.title">
            <template slot="title">
              <i
                class="icon iconfont"
                :class="[item.icon]"
                style="margin-right: 10px"
              ></i>
              <span>{{ item.title }}</span>
            </template>
            <sidebar-item
              :is-nest="true"
              :items="item.child"
              :key="item.child.route"
              class="nest-menu"
            />
          </el-submenu>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";
import auth from "@/utils/auth";
import qs from "qs";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    items: {
      type: Array,
      default: () => [],
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
    parentRoute: {},
  },
  data() {
    return {
      onlyOneChild: null,
      menusList: [
        {
          icon: "icon-bumenwendang",
          title: "组件",
          act: false,
          child: [
            {
              icon: "icon-bumenwendang",
              title: "图例集合",
              act: false,
              route: "/home",
            },
            {
              icon: "icon-bumenwendang",
              title: "富文本",
              act: false,
              route: "/rich_text",
            },
          ],
        },
        {
          icon: "icon-bumenwendang",
          title: "工作台",
          act: false,
          child: [
            {
              icon: "icon-bumenwendang",
              title: "我的任务",
              act: false,
              route: "/myWork",
            }
          ],
        },
        {
          icon: "icon-bumenwendang",
          title: "项目需求",
          act: false,
          route: "/projectRequirement",
          child: [
            {
              icon: "icon-bumenwendang",
              title: "总览",
              act: false,
              route: "/allShow",
            },
            {
              icon: "icon-bumenwendang",
              title: "项目表单",
              act: false,
              route: "/itemForm",
            },
            {
              icon: "icon-bumenwendang",
              title: "项目需求",
              act: false,
              route: "/projectRequirement",
            }
          ],
        },
      ],
    };
  },
  created() {
    console.log(qs.parse(auth.getLogInfo()));
  },
  computed: {
    // menusList() {
    //   let data = qs.parse(auth.getLogInfo()).route_msg
    //   let arr = []
    //   data.forEach((item, index) => {
    //     this.menusLists.forEach((i, d) => {
    //       if (i.route.indexOf(item) !== -1) arr.push(i)
    //     })
    //   })
    //   return arr
    // }
  },
  // methods: {
  //   hasOneShowingChild(children = [], parent) {
  //     if(parent.subs.some(item=>item.menutype===3)){
  //       this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
  //       parent.isTabs = true
  //       return true
  //     }
  //     const showingChildren = children.filter(item => {

  //       if (item.hidden) {
  //         return false;
  //       } else {
  //         // Temp set(will be used if only has one showing child)
  //         this.onlyOneChild = item;
  //         return true;
  //       }
  //     });
  //     // When there is only one child router, the child router is displayed by default
  //     if (showingChildren.length === 1) {
  //       return true;
  //     }

  //     // Show parent if there are no child router to display
  //     if (showingChildren.length === 0) {
  //       this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
  //       return true;
  //     }

  //     return false;
  //   },
  //   resolvePath(routePath) {
  //     if (!routePath) {
  //       routePath = "/";
  //     }
  //     if (this.isExternalLink(routePath)) {
  //       return routePath;
  //     }
  //     return this.parentRoute?path.resolve(this.basePath || "/", routePath):this.basePath
  //   },
  //   isExternalLink(routePath) {
  //     return isExternal(routePath);
  //   }
  // }
};
</script>
