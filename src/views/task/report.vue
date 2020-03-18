<template>

  <div style="
    border: 1px solid #ebeef5;
    background-color: #fff;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.1);
    color: #303133;
    transition: .3s;
    min-height: 798px;"
  >
    <div class="app-container">

      <div class="filter-container">

        <timeselect @getTimeResult="get_time_result" @getTime="get_time"/>

        <div style="margin-top:10px">
          <el-input v-model="listQuery.task_id" clearable placeholder="任务ID" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.user_id" clearable placeholder="举报人ID" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.user_name" clearable placeholder="举报人名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />

          <el-input v-model="listQuery.merchant_id" clearable placeholder="卖家ID" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.merchant_name" clearable placeholder="卖家名称" style="width: 120px;" class="filter-item" @keyup.enter.native="handleFilter" />

          <el-select v-model="listQuery.umask" placeholder="状态" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in states" :key="item.status" :label="item.name" :value="item.status" />
          </el-select>

          <el-button  class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="handleFilter" :loading="search_loading">
            搜索
          </el-button>
        </div>

      </div>

      <el-table
        border fit highlight-current-row style="width: 100%;"
        :data="list"
        row-key="Id"
        :default-sort = "{prop: 'CreatedTime', order: 'descending'}"
      >

        <el-table-column
          align="center"
          prop="ID"
          label="ID"
        >
          <template slot-scope="{row}">
            {{ row.id }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="user_id"
          label="用户ID"
        >
          <template slot-scope="{row}">
            {{ row.user_id }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="user_name"
          label="用户名"
        >
          <template slot-scope="{row}">
            {{row.user_name}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="merchant_id"
          label="商户Id"
        >
          <template slot-scope="{row}">
            {{row.merchant_id}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="merchant_name"
          label="商户名字"
        >
          <template slot-scope="{row}">
            {{row.merchant_name}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="reason"
          label="举报原因"
        >
          <template slot-scope="{row}">
            {{row.reason}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="status"
          label="状态"
        >
          <template slot-scope="{row}">
            <el-switch
              disabled
              v-model="row.umask"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="remark"
          label="备注"
        >
          <template slot-scope="{row}">
            {{row.remark}}
          </template>
        </el-table-column>

        <el-table-column
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
  import store from "../../store";
  export default {
    components: { Pagination,Timeselect},
    data() {
      return {
        button:['','','','','','',''],
        search_loading:false,
        list:[],
        listQuery: {
          value1:'',
          value2:'',
          page: 1,
          limit: 10,
          task_id: undefined,
          user_id: undefined,
          merchant_id: undefined,
          user_name: undefined,
          merchant_name:undefined,
          umask:undefined,
        },
        total:0,
      }
    },

    computed:{

      states() {
        return this.$store.state.user.config['task_report'].map(item=>{
          return {status:item.value,name:item.name}
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
      showDetail(row) {
        let date = new Date().getTime();
        LocalStorage.set("phone", row.Phone, date + 3*60*60*1000);
        this.$router.push({path: '/member/dynamic_detail', query: {id: row.Id}})
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
            start_time:this.listQuery.value1?parseInt(this.listQuery.value1/1000):undefined,
            end_time:this.listQuery.value2?parseInt(this.listQuery.value2/1000+24*60*60-1):undefined,
            phone: this.listQuery.phone,
            bank_id: this.listQuery.bank_id,
            bank_number: this.listQuery.bank_number,
            real_name: this.listQuery.real_name,
            status : this.listQuery.status!==''?this.listQuery.status:undefined,
            request_param:'GET'
          }
          this.search_loading = true;
          this.$http.get(`${this.url}/task_report`,data).then((resp)=>{
            this.search_loading = false;
            if (resp.code === 200) {
              if (resp.data) {
                resp.data.forEach(item => {
                  item.status = item.status === 1
                })
                this.list = resp.data;
                this.total = resp.page.TotalSize
              }else {
                this.list = [];
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
      this.getList()
    },

  }
</script>
