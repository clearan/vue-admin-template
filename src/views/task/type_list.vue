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
          <el-input v-model="listQuery.title" clearable placeholder="标题" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px;" class="filter-item">
            <el-option v-for="item in states" :key="item.status" :label="item.name" :value="item.status" />
          </el-select>

          <el-button  class="filter-item" type="primary" style="margin-left: 20px;" icon="el-icon-search" @click="handleFilter" :loading="search_loading">
            搜索
          </el-button>

          <el-button  v-if="this.bp && this.bp.includes('task/type_add')" class="filter-item" type="primary" icon="el-icon-plus" @click="addType">
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
          min-width="10%"
          align="center"
          prop="id"
          label="id"
        >
          <template slot-scope="{row}">
            {{ row.id }}
          </template>
        </el-table-column>

        <el-table-column
          min-width="10%"
          align="center"
          prop="title"
          label="任务标题"
        >
          <template slot-scope="{row}">
            {{ row.title }}
          </template>

        </el-table-column>

        <el-table-column
          min-width="10%"
          align="center"
          prop="describe"
          label="任务描述"
        >
          <template slot-scope="{row}">
            {{row.describe}}
          </template>
        </el-table-column>

        <el-table-column
          min-width="18%"
          align="center"
          prop="user_state"
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
          min-width="13%"
          align="center"
          prop="created_at"
          label="提交时间"
        >
          <template slot-scope="{row}">
            {{row.created_at}}
          </template>
        </el-table-column>

        <el-table-column
          min-width="18%"
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
      <el-dialog :visible.sync="dialogVisibleAdd" title="创建任务类型" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="add" label-width="80px" ref="add" :rules="addRules" label-position="left">

          <el-form-item label="标题" prop="title">
            <el-input v-model="add.title" placeholder="请输入标题"/>
          </el-form-item>

          <el-form-item label="描述" prop="describe">
            <el-input v-model="add.describe" placeholder="请输入描述"/>
          </el-form-item>

          <el-form-item label="排序">
            <el-input v-model="add.sort" placeholder="请输入序号"/>
          </el-form-item>

          <el-form-item label="状态">
            <el-radio v-model="add.status" label="1">正常</el-radio>
            <el-radio v-model="add.status" label="2">禁用</el-radio>
          </el-form-item>

          <el-form-item>
            <div style="text-align:right;">
              <el-button type="danger" @click="dialogVisibleAdd=false">取消</el-button>
              <el-button type="primary" @click="submitAdd">确定</el-button>
            </div>
          </el-form-item>

        </el-form>

      </el-dialog>
      <el-dialog :visible.sync="dialogVisibleEdit" title="更新任务类型" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="edit" label-width="80px" ref="edit" :rules="editRules" label-position="left">

          <el-form-item label="标题" prop="title">
            <el-input v-model="edit.title" placeholder="请输入标题"/>
          </el-form-item>

          <el-form-item label="描述" prop="describe">
            <el-input v-model="edit.describe" placeholder="请输入描述"/>
          </el-form-item>

          <el-form-item label="排序">
            <el-input v-model="edit.sort" placeholder="请输入序号"/>
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
          callback(new Error('不能为空'));
        } else if (value.includes(';') || value.includes('|')) {
          callback(new Error('不能有特殊字符'));
        } else {
          callback();
        }
      };
      return {
        bp:LocalStorage.get('bp'),
        button:['','','','','','',''],
        search_loading:false,
        list:[],
        listQuery: {
          value1:'',
          value2:'',
          page: 1,
          limit: 10,
          title: '',
          status:undefined
        },
        // states : [
        //   {status:1,name:'正常'},
        //   {status:2,name:'禁用'},
        // ],
        add:{
          title:'',
          describe:'',
          sort:'',
          status:'1',
        },
        edit:{
          title:'',
          describe:'',
          sort:'',
          status:'',
        },
        addRules: {
          title: [{ required: true, trigger: 'blur', validator: validateName}],
          describe: [{ required: true, trigger: 'blur', validator: validateName}],
        },
        editRules: {
          title: [{ required: true, trigger: 'blur', validator: validateName}],
          describe: [{ required: true, trigger: 'blur', validator: validateName}],
        },
        total:0,
        dialogVisibleAdd:false,
        dialogVisibleEdit: false,
      }
    },

    computed:{

      states() {
        let res= this.$store.state.user.config['task_status'].map(item=>{
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
      addType() {
        this.dialogVisibleAdd = true
        this.$nextTick(()=>{
          this.$refs.add.resetFields();
        });
        this.add.title = ''
        this.add.describe = ''
        this.add.sort = ''
        this.add.status = '1'
      },
      submitAdd() {
        let data = {
          title:this.add.title,
          describe:this.add.describe,
          sort:this.add.sort,
          status:parseInt(this.add.status),
          request_param:'POST'
        }
        this.$refs.add.validate(valid => {
          if (valid) {
            this.$http.post(`${this.url}/task`,qs.stringify(data)).then( resp => {
              if (resp.code === 200) {
                this.dialogVisibleAdd= false
                this.getList();
                this.$message({
                  message:'创建成功',
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
          this.$http.get(`${this.url}/task`,data).then((resp)=>{
            this.search_loading = false;
            if (resp.code === 200) {
              if (resp.data) {
                resp.data.forEach(item=>{
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
        this.edit.title = row.title;
        this.edit.describe = row.describe;
        this.edit.sort = row.sort;
        this.edit.status = row.status ? '1': '2';
        this.dialogVisibleEdit = true
        this.$nextTick(()=>{
          this.$refs.edit.clearValidate();//等弹窗里的form表单的dom渲染完在执行this.$refs.edit.resetFields()，去除验证
        });
      },
      submitEdit() {
        let data = {
          id:this.edit.id,
          title:this.edit.title,
          describe:this.edit.describe,
          sort:this.edit.sort,
          status:parseInt(this.edit.status),
          request_param:'PUT'
        }
        this.$refs.edit.validate(valid => {
          if (valid) {
            this.$http.put(`${this.url}/task`,qs.stringify(data)).then( resp => {
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
