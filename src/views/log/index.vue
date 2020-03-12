<template>

  <div style="
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    transition: .3s;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.1);
    min-height: 798px;"
  >
    <div class="app-container">

      <div class="filter-container">

        <timeselect @getTimeResult="get_time_result" @getTime="get_time"/>

        <div style="margin-top:10px">

          <el-select v-model="listQuery.module" placeholder="模型" clearable style="width: 110px;" class="filter-item">
            <el-option v-for="item in modules" :key="item.module" :label="item.name" :value="item.module" />
          </el-select>
          <el-select v-model="listQuery.action" placeholder="行为" clearable style="width: 90px;" class="filter-item">
            <el-option v-for="item in actions" :key="item.action" :label="item.name" :value="item.action" />
          </el-select>
          <el-select v-model="listQuery.level" placeholder="等级" clearable style="width: 90px;" class="filter-item">
            <el-option v-for="item in levels" :key="item.level" :label="item.name" :value="item.level" />
          </el-select>
          <el-button  class="filter-item" type="primary"  icon="el-icon-search" @click="handleFilter" :loading="search_loading">
            搜索
          </el-button>
        </div>

      </div>

      <el-table
        border fit highlight-current-row style="width: 100%;"
        :data="member_list"
        row-key="Id"
        :default-sort = "{prop: 'CreatedTime', order: 'descending'}"
      >

        <el-table-column
          min-width="8%"
          align="center"
          prop="id"
          label="ID"
        >
          <template slot-scope="{row}">
            {{ row.id }}
          </template>
        </el-table-column>

        <el-table-column
          min-width="12%"
          align="center"
          prop="module"
          label="模块"
        >
          <template slot-scope="{row}">
            <span size="medium">
              {{
              modules.filter(items=> {
                return items.module===row.module
              })[0].name
              }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          min-width="12%"
          align="center"
          prop="title"
          label="标题"
        >
          <template slot-scope="{row}">
            {{ row.title }}
          </template>

        </el-table-column>

        <el-table-column
          min-width="12%"
          align="center"
          prop="action"
          label="行为"
        >
          <template slot-scope="{row}">
            <span size="medium">
              {{
              actions.filter(items=> {
                return items.action===row.action
              })[0].name
              }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          min-width="15%"
          align="center"
          prop="description"
          label="描述"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{row}">
            {{row.description}}
          </template>
        </el-table-column>

        <el-table-column
          min-width="10%"
          align="center"
          prop="level"
          label="日志等级"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{row}">
<!--            <el-tag v-if="row.level===1"  size="medium">普通</el-tag>-->
<!--            <el-tag v-else-if="row.level===2" type="warning" size="medium">提醒</el-tag>-->
<!--            <el-tag v-else  type="danger" size="medium">警告</el-tag>-->
            <el-tag :type="row.level===1?'':row.level===2?'warning':'danger'">
              {{
              levels.filter(items=> {
                return items.level===row.level
              })[0].name
              }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          min-width="10%"
          align="center"
          prop="action_admin_name"
          label="管理员账户"
        >
          <template slot-scope="{row}">
            {{row.action_admin_name}}
          </template>
        </el-table-column>

        <el-table-column
          min-width="10%"
          align="center"
          prop="action_admin_ip"
          label="操作者ip"
        >
          <template slot-scope="{row}">
            {{row.action_admin_ip}}
          </template>
        </el-table-column>

        <el-table-column
          min-width="13%"
          align="center"
          prop="created_at"
          label="创建时间"
        >
          <template slot-scope="{row}">
            {{row.created_at}}
          </template>
        </el-table-column>

      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>

  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import {LocalStorage} from '@/utils/storage'
  import {formatDate} from '@/utils/date'
  import {formatMoney} from '@/utils/money'
  import qs from 'qs'
  import Timeselect from '@/components/Timeselect'

  export default {
    components: { Pagination,Timeselect},
    data() {

      return {
        button:['','','','','','',''],
        search_loading:false,
        member_list:[],
        listQuery: {
          value1:'',
          value2:'',
          module:'',
          action:'',
          level:'',
          page: 1,
          limit: 10
        },
        total:0
      }
    },

    computed:{

      modules() {
        let res= this.$store.state.user.config['site_admin_log_model'].map(item=>{
          return {module:item.value,name:item.name}
        })
        res.splice(0,1)
        return res
      },
      actions() {
        return this.$store.state.user.config['site_admin_log_action'].map(item=>{
          return {action:item.value,name:item.name}
        })
      },
      levels() {
        return this.$store.state.user.config['site_admin_log_level'].map(item=>{
          return {level:item.value,name:item.name}
        })
      },
    },

    filters:{
      //时间戳
      formatDate(time) {
        return formatDate(time);
      },

      //金额千分化
      formatMoney(money) {
        return formatMoney(money)
      }
    },

    methods:{

      get_time_result(obj) {
        this.listQuery.value1 = obj.value1
        this.listQuery.value2 = obj.value2
        this.handleFilter()
      },

      get_time(obj) {
        this.listQuery.value1 = obj.value1
        this.listQuery.value2 = obj.value2
      },

      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },

      checkTime() {

        if(this.listQuery.value1 && this.listQuery.value2 && this.listQuery.value1 > this.listQuery.value2) {
          this.msgTip('开始日期不能大于结束日期')
          return false
        }
        return true
      },

      getList(obj) {
        if(this.checkTime()) {

          if (obj!==undefined && obj.flag !== undefined) {
            this.listQuery.page =1
          }

          let data = {
            page: this.listQuery.page,
            page_size: this.listQuery.limit,
            module : this.listQuery.module!==''?this.listQuery.module:undefined,
            action : this.listQuery.action!==''?this.listQuery.action:undefined,
            level : this.listQuery.level!==''?this.listQuery.level:undefined,
            start_time:this.listQuery.value1?parseInt(this.listQuery.value1/1000):undefined,
            end_time:this.listQuery.value2?parseInt(this.listQuery.value2/1000+24*60*60-1):undefined,
            request_param:'GET'
          }

          this.search_loading = true;
          this.$http.get(`${this.url}/site_admin_log`,data).then((resp)=>{

            this.search_loading = false;
            if (resp.code === 200) {
              if (resp.data) {
                this.member_list = resp.data;
                this.total = resp.page.TotalSize
              }else {
                this.member_list = [];
                this.total = 0
              }
            }else{
              this.$message({
                message:resp.msg,
                type:'error',
                center:true
              })
            }
          }).catch((error)=>{
            this.search_loading = false;
            if (error !== 'loginErr') {
              console.log(error);
              this.msgTip('系统繁忙，请稍后重试')
            }
          })
        }
      },


      msgTip(name) {
        this.$message({
          message:name,
          type:'error',
          center:true
        })
      },
    },

    created() {
      if(this.$route.params.mem_id) {
        this.listQuery.id = this.$route.params.mem_id
      }
      this.getList()
    }
  }

</script>

<style>
  .el-tooltip__popper{max-width:20%}
</style>



