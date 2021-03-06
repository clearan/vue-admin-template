<template>

  <div style="
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.1);
    transition: .3s;
    min-height: 798px;"
  >
    <div class="app-container">

      <div class="filter-container">

        <timeselect @getTimeResult="get_time_result" @getTime="get_time"/>

        <div style="margin-top:10px">
          <el-input v-model="listQuery.username" clearable placeholder="用户名" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />

          <el-select v-model="listQuery.type" placeholder="账变形式" clearable style="width: 110px" class="filter-item">
            <el-option v-for="item in types" :key="item.type" :label="item.name" :value="item.type" />
          </el-select>
          <el-select v-model="listQuery.operate" placeholder="账变类型" clearable style="width: 110px" class="filter-item">
            <el-option v-for="item in operates" :key="item.operate" :label="item.name" :value="item.operate" />
          </el-select>
          <el-select v-model="listQuery.role" placeholder="账变方案" clearable style="width: 110px" class="filter-item">
            <el-option v-for="item in roles" :key="item.role" :label="item.name" :value="item.role" />
          </el-select>

          <el-button  class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="handleFilter" :loading="search_loading">
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
          align="center"
          prop="id"
          label="ID"
        >
          <template slot-scope="{row}">
            {{ row.id }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="user_id"
          label="用户id"
        >
          <template slot-scope="{row}">
            {{ row.user_id }}
          </template>

        </el-table-column>

        <el-table-column
          align="center"
          prop="username"
          label="用户名"
        >
          <template slot-scope="{row}">
            {{row.username}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="phone"
          label="手机号"
        >
          <template slot-scope="{row}">
            {{row.phone}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="type"
          label="账变形式"
        >
          <template slot-scope="{row}">
            <el-tag :type="row.type===1?'success':'danger'">
              {{
                types.filter(items=> {
                return items.type===row.type
                })[0].name
              }}
            </el-tag>

          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="operate"
          label="账变类型"
        >
          <template slot-scope="{row}">
            <el-tag>
              {{
              operates.filter(items=> {
                return items.operate===row.operate
              })[0].name
              }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="role"
          label="账变方案"
        >
          <template slot-scope="{row}">
            <el-tag>
              {{
              roles.filter(items=> {
              return items.role===row.role
              })[0].name
              }}
            </el-tag>

          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="amount"
          label="交易金额（元）"
        >
          <template slot-scope="{row}">
            {{row.amount}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="before_amount"
          label="变动前金额（元）"
          width="150"
        >
          <template slot-scope="{row}">
            {{row.before_amount}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="after_amount"
          label="变动后金额（元）"
          width="150"
        >
          <template slot-scope="{row}">
            {{row.after_amount}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="desc"
          label="备注"
        >
          <template slot-scope="{row}">
            {{row.desc}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="created_at"
          label="创建时间"
          width="160"
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
          page: 1,
          limit: 10,
          status:undefined
        },
        total:0,
      }
    },

    computed:{
      types() {
        return this.$store.state.user.config['bill_type'].map(item=>{
          return {type:item.value,name:item.name}
        })
      },

      operates() {
        return  this.$store.state.user.config['bill_operate'].map(item=>{
          return {operate:item.value,name:item.name}
        })
      },

      roles() {
        return this.$store.state.user.config['bill_role'].map(item=>{
          return {role:item.value,name:item.name}
        })
      }
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
            username: this.listQuery.username,
            type : this.listQuery.type!==''?this.listQuery.type:undefined,
            operate : this.listQuery.operate!==''?this.listQuery.operate:undefined,
            role : this.listQuery.role!==''?this.listQuery.role:undefined,
            page: this.listQuery.page,
            page_size: this.listQuery.limit,
            start_time:this.listQuery.value1?parseInt(this.listQuery.value1/1000):undefined,
            end_time:this.listQuery.value2?parseInt(this.listQuery.value2/1000+24*60*60-1):undefined,
            request_param:'GET'
          }

          this.search_loading = true;
          this.$http.get(`${this.url}/bill`,data).then((resp)=>{

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



