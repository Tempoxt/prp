<template>
  <el-row class="h-full public-table-container">
    <el-col class="mainwrap">
      <employeeTable v-if="tableShow" :table="table" @handlerCb="handlerCb" @selectChange="selectChange"
        @currentChange="currentChange" @search="docSearch">
        <template #is_share="{scope}">
          <span v-if="scope.row.is_share === 1" style="color: #A3AFB7">已取消</span>
          <span v-if="scope.row.is_share === 0" style="color: #18CC72">已分享</span>
          <span v-if="scope.row.is_share === 3" style="color: #F2353C">已到期</span>
        </template>
        <template v-if="activeName === '2'" #read_status="{scope}">
          <span v-if="scope.row.read_status === 1" style="color: #F2353C">未读</span>
          <span v-if="scope.row.read_status === 2" style="color: #18CC72">已读</span>
        </template>
        <template #attachfiles="{scope}">
          <template v-if="scope.row['attachfiles'].length">
            <div v-for="(item, index) in scope.row['attachfiles']" class="appendix">{{item.doc_nam + item.format}}</div>
          </template>
          <div v-else>无附件</div>
          <!-- <div @click="test(scope)"></div> -->
        </template>
      </employeeTable>

    </el-col>

  </el-row>


</template>
<script>
  import screenfull from 'screenfull'
  import qs from 'qs'
  import * as api_common from "@/api/common";
  import auth from '@/utils/auth'
  // import table_mixin from "@c/Table/table_mixin";
  // import { getTabs } from '@/api/common'
  import org from '@/components/public/tree/org'
  import employeeTable from '@/components/public/table/employeeTable'
  import axios from 'axios'

  export default {
    name: 'myShare',
    // mixins: [table_mixin],
    components: {
      employeeTable,
      org
    },
    data() {
      return {
        tableShow: true,
        flatArr: [], // 扁平化树
        searchOption: {},
        highSearchOption: {},
        selectFile: {},
        orgid: 0,
        treeShow: true,
        //主页表格
        table: {
          check: true,
          size: 'mini',
          loading: false,
          total: 0,
          currentPage: 1,
          selectArr: [],
          header: {
            left: [
              {
                type: 'buttonGroup',
                data: [
                  { text: '开始', icon: 'el-icon-video-play', func: 'searchShows' },
                  { text: '完成', icon: 'icon-zhengque', func: 'searchShows' },
                  { text: '验收', icon: 'icon-wancheng', func: 'searchShows' },
                  { text: '返回', icon: 'icon-fanhui', func: 'searchShows' }
                ]
              },
              {
                type: 'selectWith',
                tag: 'create_time_end',
                select: {
                  value: 0,
                  holder: '',
                  options: [
                    { label: '年', value: 0 },
                    { label: '月', value: 1 },
                    { label: '日', value: 2 }
                  ]
                },
                date: {
                  type: ['year', 'month', 'date']
                },
                value: ''
              },
              {
                type: 'inputSearch',
                holder: '请输入文档名称关键词搜索',
                value: '',
                tag: 'dim_doc_name'
              },
              {
                type: 'slot',
                color: 'success',
                slotName: 'but'
              }
            ],
            right: [
              {
                type: 'buttonGroup',
                data: [
                  { icon: 'icon-xingzhuang', func: 'full' },
                  { icon: 'icon-shuaxin', func: 'getTable' },
                  { icon: 'icon-lie', type: 'list' }
                ]
              },
            ]
          },
          main: {
            head: [
              { type: 'index', title: '#', fixed: true },
              { type: 'link', keys: 'doc_nam', title: '文档名称', func: 'seek', width: 320, fixed: true },
              { type: 'text', keys: 'by_name', title: '被分享人' },
              { type: 'text', keys: 'version', title: '版本号' },
              {
                type: 'textRules', keys: 'lev', title: '文件级别', rules: {
                  [1]: '一级文件',
                  [2]: '二级文件',
                  [3]: '三级文件',
                  [4]: '四级文件',
                  [5]: '五级文件'
                }
              },
              { type: 'text', keys: 'doc_num', title: '文件编号' },
              { type: 'text', keys: 'dep_nam', title: '所属部门' },
              { type: 'text', keys: 'size', title: '文件大小' },
              {
                type: 'icon', keys: 'format', title: '文件格式',
                rules: {
                  '.pptx': {
                    icon: 'icon-ppt',
                    color: '#F2353C'
                  },
                  '.ppt': {
                    icon: 'icon-ppt',
                    color: '#F2353C'
                  },
                  '.doc': {
                    icon: 'icon-Word',
                    color: '#1A85E4'
                  },
                  '.docx': {
                    icon: 'icon-Word',
                    color: '#1A85E4'
                  },
                  '.xlsx': {
                    icon: 'icon-excel',
                    color: '#18CC72'
                  },
                  '.xls': {
                    icon: 'icon-excel',
                    color: '#18CC72'
                  },
                  '.pdf': {
                    icon: 'icon-pdf1',
                    color: 'orange'
                  }
                }
              },
              { type: 'text', keys: 'remark', title: '备注' },
              { type: 'text', keys: 'control', title: '受控级别' },
              { type: 'text', keys: 'nam', title: '创建人' },
              {
                type: "slot",
                keys: "attachfiles",
                title: "附件",
                slotName: "attachfiles",
                width: '160px'
              },
              { type: 'text', keys: 'cr_time', title: '创建时间', sort: true, width: 160 },
              { type: 'text', keys: 'push_time', title: '发布时间', sort: true, width: 160 },
              { type: 'text', keys: 'share_time', title: '分享到期日', sort: true, width: 160 },
              { type: 'slot', keys: 'is_share', title: '分享状态', slotName: 'is_share', fixed: "right" },
              {
                type: 'tags', keys: 'status', title: '文档状态', fixed: "right", options: {
                  1: { color: 'warning', tip: '未生效' },
                  2: { color: 'success', tip: '生效中' },
                  3: { color: 'danger', tip: '已作废' },
                  4: { color: 'warning', tip: '未生效' },
                  5: { color: 'info', tip: '失效' }
                }
              }
            ],
            body: null,

          },
          footer: {
            rangeValue: 20,
            holder: '',
            func: 'sizeChange',
            range: [
              { label: 10, value: 10 },
              { label: 20, value: 20 }
            ]
          }
        },
        // 主页树
        // fol_id: 0,
        // treeOption: {
        //   show: true,
        //   showSearch: true,
        //   search: {
        //     text: '',
        //     add: {
        //       func: 'fileChangeShows'
        //     }
        //   },
        //   treeData: {
        //     data: [],
        //     mainIconRules: [],
        //     operate: [
        //       { icon: 'icon-lajitong', func: 'del' },
        //       { icon: 'icon-bianji', func: 'edit' }
        //     ],
        //     treeProps: { children: 'children', label: 'fol_nam' },
        //     nodeKey: 'fol_id',
        //     filterMethod(value, data) {
        //         if (!value) return true;
        //         return data.fol_nam && data.fol_nam.indexOf(value) !== -1;

        //     },
        //     highlightCurrent: true,
        //     checkOnClick: false,
        //     nodeClick: (() => {
        //       let req = this.req
        //       return (val, node, req) => {
        //         console.log(val, node)
        //         this.fol_id = val.fol_id
        //         this.req({fol_id: val.fol_id})
        //         this.selectFile = val
        //       }
        //     })(),
        //     // nodeClick(val,node) {
        //     //   if (val['p1'] !== 0) {
        //     //     this.req({fol_id: val.fol_id})
        //     //   }
        //     //   console.log(val, node)

        //     // },
        //     expandOnClick: false
        //   }
        // },

        addRight: {
          addRightShow: false,
          part: '同部门'
        },
        addDocShow: false,
        // 高级搜索
        searchShow: false,
        highSearch: {
          option: [
            { value: 'lev', label: '文件级别', disabled: false },
            { value: 'doc_num', label: '文件编号', disabled: false },
            { value: 'user_name', label: '创建人', disabled: false },
            { value: 'create_time', label: '创建时间', disabled: false },
            { value: 'push_time', label: '发布时间', disabled: false },
            { value: 'version', label: '版本号', disabled: false }
          ]
        },
        // 修改文档
        editShow: false,
        belongFile: {},

        // 添加权限
        rightShow: false,
        addRightTreeData: [],

        // 标签设置
        labelShow: false,

        // 更新版本
        versionShow: false,
        addDocTreeData: {},

        // 作废
        cancelShow: false,

        // 分享
        shareShow: false,

        // 文件夹变动
        fileShow: false,
        editFileShow: false,
        target: {}
      }

    },
    mounted() {
    },

    computed: {
    },
    // inject: ['el'],
    methods: {

      test(data) {
        console.log(data)
      },
      initTable() {
        this.table.selectArr = []
      },
      handlerCb(func, data, table) {
        console.log(func)
        this[func](data, table)
      },
      // 设置分页
      setPage(val) {
        this.$set(this.table, 'currentPage', val)
      },
      // 返回分页
      returnPage() {
        return this.table.currentPage
      },
      currentChange(val) {
        console.log(val)
        this.setPage(val)
        this.pagereq({ fol_id: this.fol_id, page: val, size: this.table.footer.rangeValue })
      },
      selectChange(val) {
        this.$set(this.table, 'selectArr', val)
        console.log(this.table.selectArr)
      },
      sizeChange(size) {
        this.table.footer.rangeValue = size
        this.req({ size: size })
      },

      changeOrg(id) {
        this.orgid = id
      },
      cons(data, table) {
        console.log(data, table)
      },
      // 针对utf-8转base64
      _utf8_encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }

        }
        return utftext;
      },
      // base64转码
      encode64(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        input = this._utf8_encode(input);
        while (i < input.length) {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;
          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }
          output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
      },
      // 对象转换成连接符字符串
      transObj(data) {
        let newData = ''
        for (var i of Object.entries(data)) {
          newData += encodeURIComponent(i[0]) + '=' + encodeURIComponent(i[1]) + '&'
        }
        newData = newData.slice(0, -1)
        console.log(newData)
        return newData
      },
      returnRight(obj) {
        let arr = ['FILE_READ']
        obj.downloads ? arr = ['FILE_PRINT', ...arr] : ''
        obj.edit ? arr = ['FILE_WRITE', ...arr] : ''
        console.log(arr)
        return arr
      },
      // 查看文档
      async seek(data) {
        let res = await this.$request.get('/doc/get/data/', {
          params: {
            version: data.version,
            doc_id: data.doc_id,
            store_id: data.store_id
          }
        })
        if (res.code !== 0) return this.$message({ type: 'error', message: res.msg })
        if (res.code === 0) {
          let Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
          let docData = {
            version: data.version,
            token: qs.parse(auth.getLogInfo()).token
          }
          let rightArr = this.returnRight(res)
          let bisheng = {
            doc: {
              docId: data.doc_id + '&' + data.version,
              title: data.doc_nam + data.format,
              version: data.version,
              fetchUrl: decodeURIComponent(res.data[0].data),
              callback: res.cb + '?' + this.transObj(docData)
            },
            user: {
              uid: qs.parse(auth.getLogInfo()).sta,
              nickName: qs.parse(auth.getLogInfo()).nam,
              avatar: "https://www.baidu.com/img/flexible/logo/pc/result.png",
              privilege: rightArr
            }
          }
          bisheng = this.encode64(JSON.stringify(bisheng))
          // window.open('http://192.168.0.36/apps/editor/openPreview?data=' + bisheng)
          // window.open('http://192.168.0.36/apps/editor/openEditor?data=' + bisheng)
          let life = await this.$request.get('/doc/get/life/', {
            params: {
              version: data.version,
              doc_id: data.doc_id,
              type: 1
            }
          })
          let lifeData = {
            lifeData: life.data
          }
          let obj = Object.assign({ downloads: res.downloads }, res.data, data, { url: 'http://192.168.0.36/apps/editor/openPreview?data=' + bisheng }, lifeData)
          await auth.setDoc(obj)
          await auth.setOriginDoc(obj)
          this.$router.push('/seek?date=' + new Date().getTime())
        }
      },
      // 请求
      async req(query) {
        let obj = Object.assign({}, this.searchMerge(), { size: this.table.footer.rangeValue }, query)
        this.table.loading = true
        let url = '/doc/myshare/'
        let data = await this.$request.get(url, {
          params: obj
        })
        const footer = this.table.footer
        this.table.footer = false
        this.$nextTick(() => {
          this.table.footer = footer
        })
        this.setPage(1)
        this.table.loading = false
        this.table.pagesize = data.data.page_size
        this.table.total = data.data.total
        this.table.pageindex = data.data.page_index
        // this.table.main.body = data.data.data_list
        this.$set(this.table.main, 'body', data.data.data_list)
        this.initTable()
      },
      async pagereq(query) {
        let obj = Object.assign({}, this.searchMerge(), { size: this.table.footer.rangeValue }, query)
        this.table.loading = true
        let url = '/doc/myshare/'
        let data = await this.$request.get(url, {
          params: obj
        })
        this.table.loading = false
        this.table.pagesize = data.data.page_size
        this.table.total = data.data.total
        this.table.pageindex = data.data.page_index
        // this.table.main.body = data.data.data_list
        this.$set(this.table.main, 'body', data.data.data_list)
        this.initTable()
      },
      async departmentReq() {
        let data = await this.$request.get('/doc/departfolder/')
        this.addRightTreeData = [data.data]
      },

      // 添加文档
      addDocShows() {
        this.addDocShow = true
      },
      closeAddDoc() {
        this.addDocShow = false
      },

      // 高级查询
      searchShows() {
        this.searchShow = true
      },
      closeSearch() {
        this.searchShow = false
      },

      closeEditDoc() {
        this.editShow = false
      },
      // 修改文档
      editDocShows() {
        if (this.table.selectArr.length === 0) return this.$message({ message: '请选择需要修改的文档', type: 'warning' })
        if (this.table.selectArr.length > 1) return this.$message({ message: '仅支持单份文档选择修改', type: 'warning' })
        // this.table.selectArr.length[0].fol_id

        this.editShow = true

      },
      closeEdit() {
        this.editShow = false
      },
      flatten(arr) {
        arr.forEach(item => {
          if (item.children) {
            this.flatArr.push(item)
            return this.flatten(item.children)
          }
          this.flatArr.push(item)
        })
      },

      // 权限设置
      rightShows() {
        if (this.table.selectArr.length === 0) return this.$message({ message: '请选择需要设置权限的文档', type: 'warning' })
        this.rightShow = true
      },
      closeRight() {
        this.rightShow = false
      },
      closeTag(index) {
        this.table.selectArr.splice(index, 1)
      },

      // 发布文档
      publishShows() {
        if (this.table.selectArr.length === 0) return this.$message({ message: '请选择需要发布的文档', type: 'warning' })
        this.publishShow = true
      },
      closePublish() {
        this.publishShow = false
      },

      // 更新版本
      versionShows() {
        if (this.table.selectArr.length === 0) return this.$message({ message: '请选择需要更新的文档', type: 'warning' })
        if (this.table.selectArr.length > 1) return this.$message({ message: '单次操作仅支持对单份文档进行更新呢', type: 'warning' })
        this.flatten(this.addDocTreeData)
        console.log(this.table.selectArr[0])
        let obj = this.flatArr.filter(item => {
          return item.fol_id === this.table.selectArr[0].fol_id
        })
        this.belongFile = obj[0]
        console.log(this.flatArr, obj, this.belongFile)
        this.versionShow = true
      },
      closeVersion() {
        this.versionShow = false
        this.getTable(this.table.currentPage)
      },

      // 下载
      download() {
        if (this.table.selectArr.length === 0) return this.$message({ message: '请选择需要下载的文档', type: 'warning' })
        this.table.selectArr.length === 1 ? this.oneFile() : this.mulFile()
      },
      oneFile() {
        let obj = {
          doc_id: this.table.selectArr[0].doc_id,
          version: this.table.selectArr[0].version,
          doc_nam: this.table.selectArr[0].doc_nam,
          store_id: this.table.selectArr[0].store_id,
          format: this.table.selectArr[0].format
        };
        this.$request.post("/doc/downloads/", obj, { responseType: 'blob' }).then((data) => {
          // if (data.msg !== "成功")
          //   return this.$message({
          //     type: "error",
          //     message: data.msg,
          //   });
          this.downloading(data, this.table.selectArr[0]);
        });
      },
      async mulFile() {
        let arr = [];
        let formData = new FormData();
        this.table.selectArr.forEach((item) => {
          let obj = {
            doc_id: item.doc_id,
            version: item.version,
            doc_nam: item.doc_nam,
            store_id: item.store_id,
            format: item.format
          };
          arr.push(obj);
        });
        const data = await this.$request.post(
          "/doc/downloads/",
          {
            data_list: arr,
          },
          {
            headers: {
              "Content-Type": "application/json",

            }

          }
        );
        if (data.msg !== "成功") return;
        this.downloading(data.data);
      },
      downloading(data, file = false) {
        // console.log(file)
        // return
        let a = document.createElement("a");
        if (file) {
          data = new Blob([data])
          a.href = window.URL.createObjectURL(data);
          a.setAttribute('download', file.doc_nam + '(' + file.version + ')' + file.format);
        } else {
          console.log(data)
          a.href = data[0].data
          a.download = ''
        }

        a.target = "_blank";
        a.click();
      },
      async handleBatchDownload(selectImgList) {
        const self = this;
        const data = selectImgList;
        const zip = new JSZip();
        const cache = {};
        const promises = [];
        await data.forEach((item, key) => {
          const promise = self.getFile(item).then((dta) => {
            // 下载文件, 并存成ArrayBuffer对象
            // 获取文件名
            const file_name = self.nameOptions[key].value + ".jpg";
            zip.file(file_name, dta, { binary: true }); // 逐个添加文件
            cache[file_name] = dta;
          });
          promises.push(promise);
        });
        Promise.all(promises).then(() => {
          zip
            .generateAsync({ type: "blob" })
            .then((content) => {
              // 生成二进制流
              FileSaver.saveAs(content, this.nameOptions[0].value + ".zip"); // 利用file-saver保存文件
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
              this.$notify({
                message: "网络出了点小问题，请稍后再试！",
                type: "error",
              });
            });
        });
      },

      // 作废
      cancelShows() {
        if (this.table.selectArr.length === 0) return this.$message({ message: '请选择需要作废的文档', type: 'warning' })
        if (this.table.selectArr.length > 1) return this.$message({ message: '单次操作仅支持对单份文档进行作废呢', type: 'warning' })
        this.cancelShow = true
      },
      closeCancel() {
        this.cancelShow = false
      },
      cancelReq(data) {
        this.$request.post('/doc/cancellation/', data).then(res => {
          console.log(res)
          if (res.msg !== "成功") return this.$message({ type: 'error', message: res.msg })
          this.closeCancel()
          this.getTable({ page: this.table.currentPage })
        })
      },

      // 分享
      async shareShows() {
        if (this.table.selectArr.length === 0) return this.$message({ message: '请选择需要分享的文档', type: 'warning' })
        // if (this.table.selectArr.length > 1) return this.$message({ message: '单次操作仅支持对单份文档进行分享呢', type: 'warning' })
        let arr = []
        this.table.selectArr.forEach(item => {
          arr.push({
            doc_id: item.doc_id,
            version: item.version
          })
        })
        let res = await this.$request.get('/doc/share/', {
          params: {
            data_list: JSON.stringify(arr)
          }
        })
        if (res.code !== 0) return this.$message({ message: res.msg, type: 'error' })
        this.shareShow = true
      },
      closeShare(act) {
        this.shareShow = false
        if (act) this.getTable({ page: this.table.currentPage })
      },

      // 文件夹变动
      fileChangeShows() {
        console.log(432)
        this.fileShow = true
        console.log(this.fileShow)
      },
      closeFileChange() {
        this.fileShow = false
      },
      edit(data) {
        this.target = data
        console.log(this.target)
        this.editFileShow = true
      },
      closeEdit() {
        this.editFileShow = false
        this.target = []
      },
      del(data) {
        let obj = {
          fol_id: data.fol_id,
          token: auth.getToken()
        }
        this.$alert('删除文件夹将同步删除文件夹内文件，请谨慎操作！', {
          confirmButtonText: '确定',
          callback: () => {
            this.$request.delete('/doc/docufolder/', { params: obj })
            this.init()
          }
        })

      },

      async getTable({ page = 1 } = {}) {
        let obj = Object.assign({}, this.searchMerge(), { size: this.table.footer.rangeValue })
        console.log(page)
        obj.page = page
        if (page === 1) {
          this.setPage(1)
        }
        this.table.loading = true
        try {
          let url = '/doc/myshare/'
          const data = await this.$request.get(url, { params: obj })
          console.log(data)
          this.table.loading = false
          this.table.main.body = data.data.data_list
          this.table.pagesize = data.data.page_size
          this.table.total = data.data.total
          this.table.pageindex = data.data.page_index
        } catch (error) {
          console.log(error)
        }

      },
      async init() {
        this.getTable()
        this.departmentReq()
      },
      async getTree() {
        this.treeShow = false
        const tData = await this.$request.get('/doc/docufolder/')
        this.addDocTreeData = tData.data
        this.$nextTick(() => this.treeShow = true)
      },
      formatTen(num) {
        return num > 9 ? (num + "") : ("0" + num);
      },
      timeDormat(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        return year + "-" + this.formatTen(month) + "-" + this.formatTen(day) + " " + this.formatTen(hour) + ":" + this.formatTen(minute) + ":" + this.formatTen(second)
      },

      full() {
        this.isFullScreen() ? screenfull.exit() : screenfull.request()
      },
      isFullScreen() {
        return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
      },

      // 搜索整合
      formatTen(num) {
        return num > 9 ? (num + "") : ("0" + num);
      },
      timeDormat(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        return year + "-" + this.formatTen(month) + "-" + this.formatTen(day) + " " + this.formatTen(hour) + ":" + this.formatTen(minute) + ":" + this.formatTen(second)
      },
      searchMerge() {
        let obj = {}
        this.table.header.left[1].value !== '' && this.table.header.left[1].value !== null ? (obj.create_time_from = this.table.header.left[1].value[0]) && (obj.create_time_end = this.table.header.left[1].value[1]) : (obj.create_time_from = '') && (obj.create_time_end = '')
        obj.dim_doc_name = this.table.header.left[2].value
        obj.fol_id = 0
        return Object.assign(obj, this.highSearchOption)
      },
      mergeHigh(query, act = true) {
        this.highSearchOption = query
        if (act) this.getTable()
      },
      docSearch(val) {
        this.getTable()
      },
      tabClick() {
        this.setPage(val)
        this.getTable({ page: this.returnPage() })
      },
      async cancelShows() {
        console.log(this.table.selectArr)
        if (this.table.selectArr.length === 0) return this.$message({ message: '请选择需要取消分享的文档', type: 'warning' })
        let data_list = []
        this.table.selectArr.forEach(item => {
          let obj = {}
          obj.doc_id = item.doc_id
          obj.version = item.version
          obj.share_time = item.share_time
          obj.by_uid = item.by_uid
          data_list.push(obj)
        })
        const data = await this.$request.post('/doc/myshare/', { data_list: data_list })
        if (data.code === 0) {
          this.$message({ type: 'success', message: data.msg })
          this.getTable(this.table.currentPage)
        }
        else {
          this.$message({ type: 'error', message: data.msg })
        }
      },
      // 标签设置
      labelShows() {
        this.labelShow = true;
      },
      closeLabel() {
        this.labelShow = false
      },
    },

    async created() {
      this.init()
      console.log(this.addDocTreeData)
      // const { menu } = await getTabs(this.$route.query.menuid)
      // this.menu = menu
    }
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
    text-overflow: ellipsis !important;
    overflow: hidden !important;
  }

  /deep/.flexBetween {
    text-overflow: ellipsis !important;
    overflow: hidden !important;
  }

  .mainwrap {
    width: 100%;
    // padding: 20px;
    height: 100%;
  }

  /deep/ .el-tabs {
    position: absolute;
    top: 20px;
    left: 15px;
    right: 15px;
  }

  .table {
    position: relative;
    padding: 20px 15px;

  }

  .h-full {
  }





  /deep/ .el-table__fixed::before,
  /deep/ .el-table__fixed-right::before {
    display: none;
  }

  .appendix {
    width: 140px;
    word-break: break-all;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>