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
          <el-input v-model="listQuery.real_name" clearable placeholder="持卡人" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />

          <el-input v-model="listQuery.bank_number" clearable placeholder="银行卡号" style="width: 220px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select filterable  v-model="listQuery.bank_id" placeholder="银行卡" clearable style="width: 170px" class="filter-item">
            <el-option v-for="item in banks" :key="item.bank_id" :label="item.name" :value="item.bank_id" />
          </el-select>
          <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in states" :key="item.status" :label="item.name" :value="item.status" />
          </el-select>

          <el-button  class="filter-item" type="primary" style="margin-left: 20px;" icon="el-icon-search" @click="handleFilter" :loading="search_loading">
            搜索
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addBank">
            新增
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
          prop="bank_name"
          label="银行卡名称"
        >
          <template slot-scope="{row}">
            {{ row.bank_name }}
          </template>

        </el-table-column>

        <el-table-column
          align="center"
          prop="bank_code"
          label="卡号"
        >
          <template slot-scope="{row}">
            {{row.bank_number}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="bank_cardholder"
          label="持卡人"
        >
          <template slot-scope="{row}">
            {{row.bank_cardholder}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="bank_address"
          label="开户地址"
        >
          <template slot-scope="{row}">
            {{row.bank_address}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="sort"
          label="排序"
        >
          <template slot-scope="{row}">
            {{row.sort}}
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
          prop="created_at"
          label="创建时间"
          width="160"
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
              @click="edit_bank(row)"
            >
              编辑
            </el-link>
            <el-link
              type="primary"
              size="medium"
              @click="del_bank(row)"
            >
              删除
            </el-link>
          </template>
        </el-table-column>

      </el-table>
      <el-dialog :visible.sync="dialogVisible" :title="title" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="handleBank" label-width="80px" ref="handleBank" :rules="checkRule" label-position="left">

          <el-form-item label="银行卡名" prop="bank_id">
            <el-select v-model="handleBank.bank_id" placeholder="请选择">
              <el-option
                v-for="item in banks"
                :key="item.bank_id"
                :label="item.name"
                :value="item.bank_id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="卡号" prop="bank_number">
            <el-input v-model="handleBank.bank_number" placeholder="请填写卡号"/>
          </el-form-item>

          <el-form-item label="持卡人" prop="bank_cardholder">
            <el-input v-model="handleBank.bank_cardholder" placeholder="请填写持卡人"/>
          </el-form-item>

          <el-form-item label="卡户地址" prop="bank_address">
            <el-input v-model="handleBank.bank_address" placeholder="请填写卡户地址"/>
          </el-form-item>

          <el-form-item label="排序">
            <el-input v-model="handleBank.sort" placeholder="请填写排序"/>
          </el-form-item>

          <el-form-item label="备注">
            <el-input v-model="handleBank.remark" placeholder="请填写备注"/>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-radio v-model="handleBank.status" label="1">启用</el-radio>
            <el-radio v-model="handleBank.status" label="2">禁用</el-radio>
          </el-form-item>

          <el-form-item>
            <div style="text-align:right;">
              <el-button type="danger" @click="dialogVisible=false">取消</el-button>
              <el-button type="primary" @click="handleSubmit">确定</el-button>
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
  import qs from 'qs'
  import Timeselect from '@/components/Timeselect'

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
          username: undefined,
          phone: undefined,
          admin_account: undefined,
          status:undefined
        },
        handleBank:{
          id:'',
          bank_id:'',
          bank_number:'',
          bank_cardholder:'',
          bank_address:'',
          sort:'',
          remark:'',
          status:'1',
        },
        id:'',
        checkRule:{
          bank_id: [{ required: true, message: '请选择银行', trigger: 'change' }],
          bank_number: [{ required: true, trigger: 'blur', message:'请输入银行卡号'},
            { min: 2, max: 20, message: '长度在 2-20个字符', trigger: 'blur' }],
          bank_cardholder: [{ required: true, trigger: 'blur', message:'请输入持卡人'},
            { min: 2, max: 20, message: '长度在 2-20个字符', trigger: 'blur' }],
          status: [{ required: true, trigger: 'change', message:'请选择状态'}],
        },
        total:0,
        title:'',
        dialogVisible: false,
      }
    },

    computed:{

      states() {
        return this.$store.state.user.config['admin_bank_status'].map(item=>{
          return {status:item.value,name:item.name}
        })
      },

      banks() {
        return this.$store.state.user.bank.map(item=>{
          return {bank_id:item.id,name:item.bank_name}
        })
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

      addBank() {
        this.title = '添加银行卡'
        this.dialogVisible = true
        this.$nextTick(()=>{
          this.$refs.handleBank.resetFields();
        });
      },

      edit_bank(row) {
        this.title = '编辑银行卡'
        this.id = row.id
        this.handleBank.bank_id = row.bank_id
        this.handleBank.bank_number = row.bank_number
        this.handleBank.bank_cardholder = row.bank_cardholder
        this.handleBank.bank_address = row.bank_address
        this.handleBank.sort = row.sort
        this.handleBank.remark = row.remark
        this.handleBank.status = row.status ? '1' : '2'
        this.dialogVisible = true
        this.$nextTick(()=>{
          this.$refs.handleBank.clearValidate();
        });
      },

      handleSubmit() {
        if (this.title === '添加银行卡') {
          let data = {
            bank_id : this.handleBank.bank_id,
            bank_number : this.handleBank.bank_number,
            bank_cardholder : this.handleBank.bank_cardholder,
            bank_address : this.handleBank.bank_address,
            sort : this.handleBank.sort,
            remark : this.handleBank.remark,
            status : this.handleBank.status,
            request_param:'POST',
          }
          this.$refs.handleBank.validate(valid => {
            if (valid) {
              this.$http.post(`${this.url}/admin_bank`,qs.stringify(data)).then( resp => {
                if (resp.code === 200) {
                  this.$message({
                    message:'添加成功',
                    type:'success',
                    center:true
                  });
                  this.dialogVisible = false
                  this.getList()
                } else {
                  this.msgTip(resp.msg)
                }
              })
            } else {
              console.log('error submit!!')
            }
          })
        } else {
          let data = {
            id : this.id,
            bank_number : this.handleBank.bank_number,
            bank_cardholder : this.handleBank.bank_cardholder,
            bank_address : this.handleBank.bank_address,
            sort : this.handleBank.sort,
            remark : this.handleBank.remark,
            status : parseInt(this.handleBank.status),
            request_param:'PUT',
          }
          this.$refs.handleBank.validate(valid => {
            if (valid) {
              this.$http.put(`${this.url}/admin_bank`,qs.stringify(data)).then( resp => {
                if (resp.code === 200) {
                  this.$message({
                    message:'编辑成功',
                    type:'success',
                    center:true
                  });
                  this.dialogVisible = false
                  this.getList()
                } else {
                  this.msgTip(resp.msg)
                }
              })
            } else {
              console.log('error submit!!')
            }
          })
        }
      },

      del_bank(row) {
        this.$confirm('此操作将彻底删除该银行卡，是否继续？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false,
          closeOnPressEscape:false,
        }).then(() => {

          let data = {
            id: row.id,
            request_param:'DELETE'
          };

          this.$http.del(`${this.url}/admin_bank`,data).then((resp) => {

            if (resp.code === 200) {
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
              this.$message({
                message:'删除成功',
                type:'success',
                center:true
              })
            } else {
              this.msgTip(resp.msg)
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
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
            admin_account: this.listQuery.admin_account,
            request_param:'GET'
          }

          this.search_loading = true;
          this.$http.get(`${this.url}/admin_bank`,data).then((resp)=>{

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
      this.$store.dispatch('user/getBankList')
      this.getList()
    }
  }

</script>



