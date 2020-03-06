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

          <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px;" class="filter-item">
            <el-option v-for="item in states" :key="item.status" :label="item.name" :value="item.status" />
          </el-select>

          <el-button  class="filter-item" type="primary" style="margin-left: 20px;" icon="el-icon-search" @click="handleFilter" :loading="search_loading">
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
          prop="task_id"
          label="任务ID"
        >
          <template slot-scope="{row}">
            {{ row.task_id }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="project"
          label="项目名称"
        >
          <template slot-scope="{row}">
            {{row.project}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="amount"
          label="任务佣金"
        >
          <template slot-scope="{row}">
            {{row.amount}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="step"
          label="任务步骤"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="{row}">
            {{row.step}}
          </template>
        </el-table-column>


        <el-table-column
          align="center"
          prop="merchant_name"
          label="卖家账号"
        >
          <template slot-scope="{row}">
            {{row.merchant_name}}
          </template>
        </el-table-column>


        <el-table-column
          align="center"
          prop="user_name"
          label="买家账号"
        >
          <template slot-scope="{row}">
            {{ row.user_name }}
          </template>

        </el-table-column>


        <el-table-column
          align="center"
          prop="admin_account"
          label="操作人账号"
        >
          <template slot-scope="{row}">
            {{row.admin_account}}
          </template>
        </el-table-column>


        <el-table-column
          min-width="90"
          align="center"
          prop="created_at"
          label="提交时间"
        >
          <template slot-scope="{row}">
            {{row.created_at}}
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
          prop=""
          label="操作"
        >
          <template slot-scope="{row}">
            <el-link
              type="primary"
              size="medium"
              @click="user_edit(row)"
            >
              编辑
            </el-link>
          </template>

        </el-table-column>

      </el-table>
      <el-dialog :visible.sync="dialogVisibleEdit" title="更新会员信息" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="edit" label-width="80px" ref="edit" :rules="editRules" label-position="left">

          <el-form-item label="真实姓名" prop="real_name">
            <el-input v-model="edit.real_name" placeholder="请输入真实姓名"/>
          </el-form-item>

          <el-form-item label="用户昵称" prop="nick_name">
            <el-input v-model="edit.nick_name" placeholder="请输入用户昵称"/>
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
        member_list:[],
        listQuery: {
          value1:'',
          value2:'',
          page: 1,
          limit: 10,
          status:undefined
        },
        // states : [
        //   {status:1,name:'进行中'},
        //   {status:2,name:'已提交'},
        //   {status:3,name:'已拒绝'},
        //   {status:4,name:'重新提交'},
        //   {status:5,name:'已结算'},
        // ],
        edit:{
          real_name:'',
          nick_name:'',
          status:''
        },
        editRules: {
          real_name: [{ required: true, trigger: 'blur', validator: validateName}],
          nick_name: [{ required: true, trigger: 'blur', validator: validateName}],
        },
        total:0,
        dialogVisibleEdit: false,
      }
    },

    computed:{

      states() {
        let res= this.$store.state.user.config['task_subscribe_status'].map(item=>{
          let obj = {status:item.value,name:item.name}
          return obj
        })
        return res
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
        this.listQuery.page = 0;
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
            status : this.listQuery.status!==''?this.listQuery.status:undefined,
            page: this.listQuery.page,
            page_size: this.listQuery.limit,
            start_time:this.listQuery.value1?parseInt(this.listQuery.value1/1000):undefined,
            end_time:this.listQuery.value2?parseInt(this.listQuery.value2/1000+24*60*60-1):undefined,
            request_param:'GET'
          }
          this.search_loading = true;
          this.$http.get(`${this.url}/task_subscribe`,data).then((resp)=>{
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
      user_edit(row) {
        console.log(row)
        this.edit.id = row.id;
        this.edit.real_name = row.real_name;
        this.edit.nick_name = row.nick_name;
        this.edit.status = row.status;
        this.dialogVisibleEdit = true
        this.$nextTick(()=>{
          this.$refs.edit.resetFields();//等弹窗里的form表单的dom渲染完在执行this.$refs.edit.resetFields()，去除验证
        });
      },
      submitEdit() {
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
