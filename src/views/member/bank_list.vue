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
          <el-input v-model="listQuery.phone" clearable placeholder="电话" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.real_name" clearable placeholder="持卡人" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />

          <el-input v-model="listQuery.bank_number" clearable placeholder="银行卡号" style="width: 220px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select filterable  v-model="listQuery.bank_id" placeholder="银行卡" clearable style="width: 170px" class="filter-item">
            <el-option v-for="item in banks" :key="item.bank_id" :label="item.name" :value="item.bank_id" />
          </el-select>
          <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px" class="filter-item">
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
          prop="username"
          label="用户名"
        >
          <template slot-scope="{row}">
            {{row.username}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="real_name"
          label="持卡人"
        >
          <template slot-scope="{row}">
            {{row.real_name}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="bank_name"
          label="银行"
        >
          <template slot-scope="{row}">
            {{row.bank_name}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="bank_number"
          label="银行卡号"
        >
          <template slot-scope="{row}">
            {{row.bank_number}}
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
              v-model="row.status"
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


        <el-table-column
          align="center"
          prop=""
          label="操作"
        >
          <template slot-scope="{row}">
            <el-link
              type="primary"
              size="medium"
              @click="bank_edit(row)"
            >
              编辑
            </el-link>
          </template>

        </el-table-column>

      </el-table>
      <el-dialog :visible.sync="dialogVisibleEdit" title="更新银行卡信息" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="edit" label-width="80px" ref="edit" label-position="left">

          <el-form-item label="持卡人" >
            <el-input v-model="edit.real_name" placeholder="请输入持卡人" readonly/>
          </el-form-item>

          <el-form-item label="备注">
            <el-input v-model="edit.remark" placeholder="请输入备注"/>
          </el-form-item>

          <el-form-item label="状态">
            <el-radio v-model="edit.status" label="1">正常</el-radio>
            <el-radio v-model="edit.status" label="2">禁用</el-radio>
          </el-form-item>

          <el-form-item>
            <div style="text-align:right;">
              <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
              <el-button type="primary" @click="submitEdit">确定</el-button>
            </div>
          </el-form-item>

        </el-form>

      </el-dialog>
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
      var validateName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('名称不能为空'));
        } else if (value.includes(';') || value.includes('|')) {
          callback(new Error('名称不能有特殊字符'));
        } else {
          callback();
        }
      };
      return {
        button:['','','','','','',''],
        search_loading:false,
        list:[],
        listQuery: {
          value1:'',
          value2:'',
          page: 1,
          limit: 10,
          real_name: undefined,
          phone: undefined,
          bank_id: undefined,
          bank_number: undefined,
          status:undefined
        },
        // states : [
        //   {status:1,name:'正常'},
        //   {status:2,name:'禁用'},
        // ],
        edit:{
          real_name:'',
          remark:'',
          status:''
        },

        total:0,
        dialogVisibleEdit: false,
      }
    },

    computed:{

      states() {
        let res= this.$store.state.user.config['user_bank_status'].map(item=>{
          let obj = {status:item.value,name:item.name}
          return obj
        })
        return res
      },

      banks() {
        return this.$store.state.user.bank.map(item=>{
          return {bank_id:item.id,name:item.bank_name}
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
          this.$http.get(`${this.url}/user_bank`,data).then((resp)=>{
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
      bank_edit(row) {
        this.edit.id = row.id;
        this.edit.real_name = row.real_name;
        this.edit.remark = row.remark;
        this.edit.status = row.status ? '1':'2';
        this.dialogVisibleEdit = true
        this.$nextTick(()=>{
          this.$refs.edit.clearValidate();
        });
      },
      submitEdit() {
        let data = {
          id:this.edit.id,
          real_name:this.edit.real_name,
          remark:this.edit.remark,
          status:parseInt(this.edit.status),
          request_param:'PUT'
        }
        this.$refs.edit.validate(valid => {
          if (valid) {
            this.$http.put(`${this.url}/user_bank`,qs.stringify(data)).then( resp => {
              if (resp.code === 200) {
                this.dialogVisibleEdit = false
                this.getList();
                this.$message({
                  message:'更新成功',
                  type:'success',
                  center:true
                })
              } else {
                this.msgTip(resp.msg)
              }
            })
          } else {
            console.log('submit error')
          }
        })
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
      this.$store.dispatch('user/getBankList')
      this.getList()
    },

  }
</script>
