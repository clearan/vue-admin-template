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
          width="160"
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
          prop="reverify_ts"
          label="复审时间"
        >
<!--          <template slot-scope="{row}">-->
<!--            <span v-if="row.reverify_ts">{{row.reverify_ts}}</span>-->
<!--            <span v-else>-</span>-->
<!--          </template>-->
          <template slot-scope="{row}" >
            <span v-if="row.copy_report_ts>0 && row.status ===5">
              <van-count-down :time="row.copy_report_ts">
              <template v-slot="timeData">
                <span class="item">{{ timeData.days }}天</span>
                <span class="item">{{ timeData.hours }}时</span>
                <span class="item">{{ timeData.minutes }}分</span>
                <span class="item">{{ timeData.seconds }}秒</span>
              </template>
            </van-count-down>
            </span>
            <span v-else>-</span>
          </template>

        </el-table-column>

        <el-table-column
          align="center"
          prop="status"
          label="状态"
        >
          <template slot-scope="{row}">
            <el-tag>
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
        >
          <template slot-scope="{row}">
            <div v-if="row.status === 5">
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

          <el-form-item label="备注">
            <el-input v-model="edit.remark"/>
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
  import Timeselect  from '@/components/Timeselect'

  export default {
    components: { Pagination,Timeselect},
    data() {
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
          remark:'',
          status:''
        },
        checkRule:{
          status: [{ required: true, message: '请确定审核结果', trigger: 'change' }],
        },
        total:0,
        dialogVisibleEdit: false,
      }
    },

    computed:{

      states() {
        return this.$store.state.user.config['task_subscribe_status'].map(item=>{
          return  {status:item.value,name:item.name}
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
        this.listQuery.page = 0;
        this.getList()
      },

      checkTime() {
        if(this.listQuery.value1 && this.listQuery.value2 && this.listQuery.value1 > this.listQuery.value2) {
          this.msgTip('开始日期不能大于结束日期')
          return false
        }
        return true
      },

      compute_time(val,time,status) {
        if (status !== 5) {
          return '-'
        } else {
          //console.log(val,time,status)
          setInterval(() => {
            let rightTime = val-time
            if (rightTime > 0) {
              rightTime--
              if (rightTime === 1) {
                clearInterval(rightTime)
              }
              let dd = Math.floor(rightTime / 60 / 60 / 24);
              let hh = Math.floor((rightTime / 60 / 60) % 24);
              let mm = Math.floor((rightTime / 60) % 60);
              let ss = Math.floor(rightTime % 60);
              // console.log(dd + "天" + hh + "时" + mm + "分" + ss + "秒")
              return dd + "天" + hh + "时" + mm + "分" + ss + "秒"
            } else {
              return "-"
            }
          }, 1000);
        }
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
                this.list = resp.data.map(item => {
                  // return {...item,storage_name:this.base.account,report_ts:this.compute_time(item.reverify_ts,resp.time,item.status)}
                  //return {...item,storage_name:this.base.account,reverify_ts:1584698900,report_ts:(1584698900-resp.time)*1000}
                  return {...item,storage_name:this.base.account,copy_report_ts:(item.report_ts-resp.time)*1000}
                })
                console.log(this.list)
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
          this.$refs.edit.resetFields();
        });
      },
      submitEdit() {
        this.$refs.edit.validate(valid => {
          if (valid) {
            let data = {
              id:this.edit.id,
              status:parseInt(this.edit.status),
              remark:this.edit.remark,
              request_param:'PUT'
            }
            this.$http.put(`${this.url}/task_subscribe`,qs.stringify(data)).then(resp => {
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
        this.$http.patch(`${this.url}/task_subscribe`,qs.stringify(data)).then(resp => {
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
