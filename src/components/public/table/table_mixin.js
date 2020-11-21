
export default {
  components: {
    
  },
  watch:{
  },
  data() {
    return {
      // 高级搜索
      highSearchOption: {},
    }
  },
  computed: {
    
  },
  created() {
    
  },
  methods: {
    // 高级搜索触发请求
    mergeHigh(query, act = true) {
      this.highSearchOption = query;
      if (act) this.getTable();
    },
  }
}
