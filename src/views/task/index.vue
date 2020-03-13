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
        :data="list"
        row-key="Id"
        :default-sort = "{prop: 'CreatedTime', order: 'descending'}"
      >

        <el-table-column
          align="center"
          prop="id"
          label="id"
          width="120"
        >
          <template slot-scope="{row}">
            {{ row.id }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="user_id"
          label="用户ID"
          width="120"
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
          prop="project"
          label="项目名称"
        >
          <template slot-scope="{row}">
            {{row.project}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="task_type"
          label="任务类型ID"
        >
          <template slot-scope="{row}">
            {{row.task_type}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="title"
          label="任务标题"
          width="150"
        >
          <template slot-scope="{row}">
            {{row.title}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="title"
          label="任务描述"
          width="120"
        >
          <template slot-scope="{row}">
            {{row.title}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="title"
          label="任务链接"
        >
          <template slot-scope="{row}">
            {{row.link}}
          </template>
        </el-table-column>


        <el-table-column
          align="center"
          prop="amount"
          label="任务金额"
        >
          <template slot-scope="{row}">
            {{row.amount}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="amount"
          label="任务数量"
        >
          <template slot-scope="{row}">
            {{row.count}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="accept"
          label="做单人数"
        >
          <template slot-scope="{row}">
            {{row.accept}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="commit"
          label="待审核人数"
          width="120"
        >
          <template slot-scope="{row}">
            {{row.commit}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="success"
          label="已通过人数"
        >
          <template slot-scope="{row}">
            {{row.success}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="created_at"
          label="提交时间"
          width="150"
        >
          <template slot-scope="{row}">
            {{row.created_at}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="status"
          label="状态"
        >
          <template slot-scope="{row}">
            <el-tag :type="row.status===1?'':row.status===2?'info':row.status===3?'success':row.status===4?'danger':''">
              {{
              states.filter(items=> {
                return items.status===row.status
              })[0].name
              }}

            </el-tag>

          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="admin_account"
          label="操作人账号"
        >
          <template slot-scope="{row}">
            <span v-if="row.admin_account">{{row.admin_account}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop=""
          label="操作"
          fixed="right"
        >
          <template slot-scope="{row}">
            <div v-if="row.status === 2">
              <div v-if="row.admin_account && row.admin_account !== row.storage_name">
                <el-tag type="warning">已锁定</el-tag>
              </div>
              <div v-else>
                <div v-if="row.admin_account && row.admin_account === row.storage_name">
                  <el-link
                    type="primary"
                    size="medium"
                    @click="user_edit(row)"
                  >
                    审核
                  </el-link>
                  <el-link
                    type="primary"
                    size="medium"
                    @click="lock(row)"
                  >
                    解锁
                  </el-link>
                </div>
                <div v-else>
                  <el-link
                    type="primary"
                    size="medium"
                    @click="lock(row)"
                  >
                    锁定
                  </el-link>
                </div>
              </div>
            </div>

            <div v-else>-</div>
          </template>

        </el-table-column>

      </el-table>
      <el-dialog :visible.sync="dialogVisibleEdit" title="审核发布任务" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="edit" label-width="80px" ref="edit" :rules="checkRule" label-position="left">

          <el-form-item label="费率" prop="rate">
            <el-input v-model="edit.rate"/>
          </el-form-item>

          <el-form-item label="备注">
            <el-input v-model="edit.refuse_remark"/>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-radio v-model="edit.status" label="3">通过</el-radio>
            <el-radio v-model="edit.status" label="4">驳回</el-radio>
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
        base:LocalStorage.get('base'),
        button:['','','','','','',''],
        search_loading:false,
        list:[],
        listQuery: {
          value1:'',
          value2:'',
          page: 1,
          limit: 10,
          status:undefined
        },
        edit:{
          id:'',
          status:'',
          rate:'',
          refuse_remark:''
        },
        checkRule:{
          rate: [{ required: true, message: '请填写费率', trigger: 'blur' }],
          status: [{ required: true, message: '请确定审核结果', trigger: 'change' }],
        },
        total:0,
        dialogVisibleEdit: false,
      }
    },

    computed:{

      states() {
        return this.$store.state.user.config['task_publish_status'].map(item=>{
          return {status:item.value,name:item.name}
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
            status : this.listQuery.status!==''?this.listQuery.status:undefined,
            page: this.listQuery.page,
            page_size: this.listQuery.limit,
            start_time:this.listQuery.value1?parseInt(this.listQuery.value1/1000):undefined,
            end_time:this.listQuery.value2?parseInt(this.listQuery.value2/1000+24*60*60-1):undefined,
            request_param:'GET'
          }

          this.search_loading = true;
          this.$http.get(`${this.url}/task_publish`,data).then((resp)=>{

            this.search_loading = false;
            if (resp.code === 200) {
              if (resp.data) {
                this.list = resp.data.map(item => {
                  return {...item,storage_name:this.base.account}
                })
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

      user_edit(row) {
        this.edit.id = row.id;
        this.dialogVisibleEdit = true
        this.$nextTick(()=>{
          this.$refs.edit.clearValidate();
        });
      },

      submitEdit() {
        this.$refs.edit.validate(valid => {
          if (valid) {
            let data = {
              id:this.edit.id,
              rate:parseFloat(this.edit.rate),
              status:parseInt(this.edit.status),
              refuse_remark:this.edit.refuse_remark,
              request_param:'PUT'
            }
            this.$http.put(`${this.url}/task_publish`,qs.stringify(data)).then(resp => {
              if (resp.code === 200) {
                this.dialogVisibleEdit = false
                this.$message({
                  message:'审核完成',
                  type:'success',
                  center:true
                });
                this.getList()
              } else {
                this.msgTip(resp.msg)
              }
            })
          } else {
            console.log('error submit!!')
          }
        })
      },

      lock(row) {
        let data = {
          id:row.id,
          request_param:'PATCH'
        }
        this.$http.patch(`${this.url}/task_publish`,qs.stringify(data)).then(resp => {
          if (resp.code === 200) {
            this.getList()
          } else {
            this.msgTip(resp.msg)
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
      this.getList()
    }
  }

</script>



