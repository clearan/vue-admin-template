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
          <el-input v-model="listQuery.username" clearable placeholder="username" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.phone" clearable placeholder="电话" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.real_name" clearable placeholder="真实姓名" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.reg_ip" clearable placeholder="注册ip" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px;" class="filter-item">
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
          prop="id"
          label="会员编号"
        >
          <template slot-scope="{row}">
            {{ row.id }}
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
          prop="nick_name"
          label="昵称"
        >
          <template slot-scope="{row}">
            {{row.nick_name}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="real_name"
          label="真实姓名"
        >
          <template slot-scope="{row}">
            {{row.real_name}}
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
          min-width="100"
          align="center"
          prop="created_at"
          label="注册时间"
        >
          <template slot-scope="{row}">
            {{row.created_at}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="balance"
          label="发布余额"
        >
          <template slot-scope="{row}">
            {{row.balance}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="commission"
          label="佣金"
        >
          <template slot-scope="{row}">
            {{row.commission}}
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
          prop="last_login_ip"
          label="最后登录ip"
        >
          <template slot-scope="{row}">
            {{row.last_login_ip}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="login_count"
          label="登录次数"
        >
          <template slot-scope="{row}">
            {{row.login_count}}
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
              @click="handel_money(row,1)"
            >
              加款
            </el-link>
            <el-link
              type="primary"
              size="medium"
              @click="handel_money(row,2)"
            >
              扣款
            </el-link>
            <el-link
              type="primary"
              size="medium"
              @click="user_detail(row)"
            >
              详情
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
      <el-dialog :visible.sync="dialogVisibleMoney" :title="money.title" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form label-width="80px" :model="money" ref="edit" label-position="left">

          <el-form-item label="真实姓名">
            <el-input v-model="money.real_name" readonly/>
          </el-form-item>

          <el-form-item label="用户名">
            <el-input v-model="money.username" readonly/>
          </el-form-item>

          <el-form-item label="钱包类型">
            <el-select v-model="money.type" placeholder="请选择">
              <el-option
                v-for="item in types"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="调整金额" >
            <el-input v-model="money.money" maxlength="15"/>
          </el-form-item>

          <el-form-item>
            <div style="text-align:right;">
              <el-button type="danger" @click="dialogVisibleMoney=false">取消</el-button>
              <el-button type="primary" @click="submitMoney">确定</el-button>
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
        list:[],
        money:{
          user_id:'',
          real_name:'',
          username:'',
          money:'',
          type:'',
          title:'',
          url:'',
        },
        listQuery: {
          value1:'',
          value2:'',
          page: 1,
          limit: 10,
          username: undefined,
          phone: undefined,
          real_name: undefined,
          reg_ip: undefined,
          status:undefined
        },
        // states : [
        //   {status:1,name:'正常'},
        //   {status:2,name:'禁用'},
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
        dialogVisibleMoney: false,
      }
    },

    computed:{

      states() {
        let res= this.$store.state.user.config['user_status'].map(item=>{
          let obj = {status:item.value,name:item.name}
          return obj
        })
        return res
      },

      types() {
        let res= this.$store.state.user.config['user_wallet_type'].map(item=>{
          let obj = {type:item.value,name:item.name}
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

    watch :{
      'money.money':function (newvalue,oldvalue) {

        var newvalue_=(newvalue.indexOf('.00')>0)?newvalue.replace('.00' ,''):newvalue; //禁止ie8,9自动添加.00的小数点

        if ((isNaN(parseFloat(newvalue_.replace(/,/ig,''))))){ //如果当前输入的不是数字就停止执行
          this.money.money='';  //防止不是数字是input出现NaN提示
          return false;
        }

        if ( /\./i.test(newvalue_) ){ //判断处理含有.的情况下
          if (/\.\d{3}$/.test(newvalue_) || /\.\d*\./.test(newvalue_)){
            this.money.money=oldvalue; //限制只能输入2位小数点
          } else{
            this.money.money=newvalue_.replace(/[^\d\.\,]/ig,'') //开始输入小数点之后，只能输入数字
          }
        } else{
          this.money.money=((parseFloat(newvalue_.replace(/,/ig,'')).toLocaleString()).toString()).replace('.00' ,'');
        }
      }
    },

    methods:{

      handel_money(row,val) {
        this.money.user_id = row.id
        this.money.title = val === 1 ? '加款' : '扣款'
        this.money.url = val === 1 ? 'user_deposit' : 'user_withdraw'
        this.money.real_name = row.real_name
        this.money.username = row.username
        this.money.type = ''
        this.money.money = ''
        this.dialogVisibleMoney = true
      },

      submitMoney() {
        if(this.money.type === '') {
          this.msgTip('请选择钱包类型')
          return
        }

        let balance = ''
        if (this.money.money.includes('.')) {
          let tmp = this.money.money.replace(/[,]/g,'')
          if (tmp.split('.')[1].length === 0) {
            balance = tmp.replace(/[.]/g,'')*100
          }

          if (tmp.split('.')[1].length === 1) {
            balance = tmp.replace(/[.]/g,'')*10
          }

          if (tmp.split('.')[1].length === 2) {
            balance = tmp.replace(/[.]/g,'')
          }

        } else{
          balance = this.money.money.replace(/[,]|[.]/g,'')*100
        }

        if (balance == 0) {
          this.msgTip('调整金额不能为空')
          return
        }

        let data = {
          user_id: this.money.user_id,
          wallet: String(this.money.type),
          money: parseFloat(this.money.money.replace(/[,]/g,'')),
        }

        this.$http.patch(`${this.url}/${this.money.url}`,qs.stringify(data)).then(resp => {

          if (resp.code === 200) {
            this.getList()
            this.$message({
              message:'成功',
              type:'success',
              center:true
            });
          }else{
            this.msgTip(resp.msg)
          }
        })

      },

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

      user_detail(row) {
        this.$router.push({path: '/member/member_detail',query: {id: row.id}})
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
            username: this.listQuery.username,
            phone: this.listQuery.phone,
            real_name: this.listQuery.real_name,
            reg_ip: this.listQuery.reg_ip,
            request_param:'GET'
          }

          this.search_loading = true;
          this.$http.get(`${this.url}/user`,data).then((resp)=>{

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

      user_edit(row) {
        this.edit.id = row.id;
        this.edit.real_name = row.real_name;
        this.edit.nick_name = row.nick_name;
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
          nick_name:this.edit.nick_name,
          status:parseInt(this.edit.status),
          request_param:'PUT'
        }
        this.$refs.edit.validate(valid => {
          if (valid) {
            this.$http.put(`${this.url}/user`,qs.stringify(data)).then( resp => {
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
      this.getList()
    }
  }

</script>



