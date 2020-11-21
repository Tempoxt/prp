<template>
  <div class="flex-column wrap">
    <head class="flex-align write">
      <el-button class="write_btn" size="mini" @click="open_follow"
        ><i class="icon iconfont icon-daibanshixiang" /> 写跟进</el-button
      >
      <el-input
        class="write_search"
        prefix-icon="el-icon-search"
        placeholder="关键字搜索"
        size="small"
        v-model="key_word"
        @blur="(v) => $emit('search', v)"
        @keypress.enter.native="$event.target.blur()"
      ></el-input>
    </head>

    <main class="main">
      <el-timeline>
        <template v-for="(item, index) in option.data_list">
          <el-timeline-item :key="index" placement="top">
            <div class="timestamp">{{ item.create_time }}</div>
            <div class="flex info">
              <div class="photo">in</div>
              <div class="flex-column info_main">
                <div class="main_item">
                  <el-tag type="warning" size="mini">{{
                    item.follow_type
                  }}</el-tag>
                </div>
                <div class="main_item remark">
                  {{ item.remark }}
                </div>
                <div class="flex main_item nexttime">
                  <i class="icon iconfont icon-shijian"></i>
                  <span>下次联系时间：{{ item.follow_time }}</span>
                </div>
                <div
                  v-for="(file, num) in item.object_dicts"
                  :key="num"
                  class="flex main_item appendix"
                >
                  <i class="icon iconfont icon-wenjian"></i>
                  <span class="fileName">{{ file.name }}</span>
                  <span class="fileSize">（{{ file.size }}）</span>
                  <el-link class="link" :underline="false">下载</el-link>
                </div>
                <div class="main_item operator">
                  <el-button
                    circle
                    size="mini"
                    class="flex-align operator_btn"
                    @click="edit_follow(item)"
                  >
                    <i class="icon iconfont icon-daibanshixiang"></i>
                  </el-button>

                  <el-button 
                    circle size="mini" 
                    class="flex-align operator_btn"
                    @click="delete_follow(item)"
                  >
                    <i class="icon iconfont icon-lajitong"></i>
                  </el-button>
                </div>
              </div>
            </div>
          </el-timeline-item>
        </template>
      </el-timeline>
    </main>

    <el-dialog
      :title="isEdit ? '修改跟进' : '新建跟进'"
      :visible.sync="dialogVisible"
      width="500px"
      append-to-body
      :before-close="close_follow"
    >
      <el-form ref="dialog" :model="form">
        <el-form-item prop="follow_type">
          <el-select
            class="selectModel"
            v-model="form.follow_type"
            placeholder="请选择"
          >
            <el-option
              v-for="item in option.method_options"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="follow_time">
          <el-date-picker
            class="picker"
            v-model="form.follow_time"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item prop="remark">
          <el-input
            class="textarea"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.remark"
          >
          </el-input>
        </el-form-item>

        <el-form-item prop="data_list">
          <el-upload
            ref="up"
            class="upload-demo mar"
            action="#"
            multiple
            :auto-upload="false"
            :file-list="form.data_list"
            :on-remove="handleRemove"
            :on-change="handleFile"
          >
            <el-button size="small" type="primary">上传附件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="close_follow">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import auth from "@/utils/auth";
export default {
  name: "follow",
  props: {
    option: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      key_word: '',
      form: {
        follow_type: undefined,
        follow_time: undefined,
        remark: undefined,
        data_list: [],
      },
      // 已上传文件基础信息缓存
      file_list_cache: [],
      // 已上传但修改被删除的附件标记
      file_deleted_from_cache: [],
    };
  },
  async mounted() {
    this.$emit("req");
    // this.init()
  },
  methods: {
    async init_dialog(item) {
      this.data_recall(this.form, item);
      this.$set(
        this.form,
        "data_list",
        JSON.parse(JSON.stringify(item.object_dicts))
      );
      this.$set(this.form, "id", item.id);
      this.file_list_cache = JSON.parse(JSON.stringify(item.object_dicts));
    },
    // 默认回显数据方式
    data_recall(form, data) {
      let f = Object.entries(form);
      for (let item of f) {
        data[item[0]] ? (form[item[0]] = data[item[0]]) : "";
      }
    },
    open_follow() {
      this.isEdit = false;
      this.dialogVisible = true;
    },
    edit_follow(item) {
      this.isEdit = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.init_dialog(item);
      });
    },
    async delete_follow(item) {
      this.$confirm("此操作将永久删除所选跟进记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let obj = {
          token: auth.getToken(),
          delete_id: item.id,
          bus_id: qs.parse(sessionStorage.getItem('require_info')).bus_id,
        }
        if (this.option.status === 0) {
          obj['task_id'] = '0'
        } else {

        }
        let res = await this.$request.delete('/p/front/demand/follow', {
          params: obj
        })
        if (res.code === 0) {
          this.$message({ type: "success", message: res.msg });
          this.$emit("req");
        } else {
          this.$message({ type: "error", message: res.msg });
        }
      }).catch(() => {

      })
      
    },
    close_follow() {
      console.log(this.$refs["dialog"]);
      this.$refs["dialog"].resetFields();
      this.dialogVisible = false;
    },
    handleFile(file, fileList) {
      console.log(file);
      this.$set(this.form, "data_list", fileList);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.add_file_deleted(file);
    },
    // 添加已上传被删除的文件标记
    add_file_deleted(file) {
      if (file.o_id) {
        for (let item of this.file_list_cache) {
          if (item.o_id === file.o_id) {
            return this.file_deleted_from_cache.push(file.o_id);
          }
        }
      }
    },
    get_file_size(size) {
      return size < 1024
        ? size + "Byte"
        : size / 1024 < 1024
        ? (size / 1024).toFixed(2) + "Kb"
        : size / 1024 / 1024 < 1024
        ? (size / 1024 / 1024).toFixed(2) + "Mb"
        : (size / 1024 / 1024 / 1024).toFixed(2) + "Gb";
    },
    async confirm() {
      // if (this.ruleForm.data_list.length === 0) return this.$message({ type: 'warning', message: '请上传附件' })
      let f = new FormData();

      let obj = JSON.parse(JSON.stringify(this.form));
      let arr = Object.entries(obj);
      // 需求路线
      if (this.option.status === 0) {
        for (let item of arr) {
          if (item[0] !== "data_list") {
            f.append(item[0], item[1]);
          } else {
            let data_arr = [];
            for (let i in this.form.data_list) {
              if (this.form.data_list[i].raw) {
                let word_arr = this.form.data_list[i].name.split(".");
                f.append("files", this.form.data_list[i].raw);
                data_arr.push({
                  siz: this.get_file_size(this.form.data_list[i].size),
                  format: "." + word_arr[word_arr.length - 1],
                  name: this.form.data_list[i].name,
                });
              }
            }
            f.append(item[0], JSON.stringify(data_arr));
          }
        }
        if (this.isEdit && this.file_deleted_from_cache.length > 0) {
          f.append(
            "delete_related_ids",
            this.file_deleted_from_cache.join(",")
          );
        }
        f.append("task_id", 0);
        f.append(
          "bus_id",
          qs.parse(sessionStorage.getItem("require_info")).bus_id
        );
        let res;
        if (this.isEdit) {
          res = await this.$request.post("/p/front/demand/follow/update", f, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          res = await this.$request.post("/p/front/demand/follow", f, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        if (res.code === 0) {
          this.$message({ type: "success", message: res.msg });
          this.dialogVisible = false;
          this.$emit("req");
          this.close_follow();
        } else {
          this.$message({ type: "error", message: res.msg });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  .write {
    height: 40px;
    margin-bottom: 20px;
    .write_btn {
      margin-right: 10px;
    }
    .write_search {
      width: 200px;
    }
  }
  .main {
    flex: 1;
    overflow: auto;
    .timestamp {
      display: inline-block;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 16px;
      color: #41494d;
      height: 26px;
      background: #f5f5f5;
      opacity: 1;
      border-radius: 13px;
      line-height: 26px;
      padding: 0 15px;
      margin-bottom: 10px;
    }
    .info {
      .photo {
        width: 22px;
        height: 22px;
        background: #1fa9e6;
        border-radius: 50%;

        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 22px;
        text-align: center;
        color: #ffffff;
        margin-right: 10px;
      }
      .info_main {
        flex: 1;
        .main_item {
          margin-bottom: 10px;
        }
        .remark {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 16px;
          color: #aeaeae;
        }
        .nexttime {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 16px;
          color: #5b6367;
          i {
            padding-right: 10px;
          }
        }
        .appendix {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 16px;
          color: #5b6367;
          i,
          .fileSize {
            padding-right: 10px;
          }
          .fileSize {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            line-height: 16px;
            color: #adb4b8;
          }
          .fileName {
          }
          .link {
            font-size: 12px;
          }
        }
        .operator {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 16px;
          color: #5b6367;
          .operator_btn {
            width: 24px;
            height: 24px;
            padding: 0px;
            i {
              font-size: 12px !important;
            }
          }
        }
      }
    }
  }
}
.selectModel {
  width: 100px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.textarea,
.picker {
  margin-right: 10px;
  margin-bottom: 10px;
}
/deep/.el-timeline-item__content {
  margin-top: -8px;
}
/deep/.el-timeline-item__node--normal,
/deep/.el-timeline-item__tail {
  top: 6px;
}
/deep/.el-timeline-item__tail {
  left: 5px;
}
/deep/.el-timeline-item__node--normal {
  left: 0px;
}
</style>