<template>

  <div style="
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    transition: .3s;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.1);
    min-height: 798px;">

    <div class="app-container">

      <div class="filter-container">

        <timeselect @getTimeResult="get_time_result" @getTime="get_time"/>

        <div style="margin-top:10px">
          <el-input v-model="listQuery.account" clearable placeholder="账号名称" style="width: 250px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px;margin-left: 20px" class="filter-item">
            <el-option v-for="item in states" :key="item.status" :label="item.name" :value="item.status" />
          </el-select>
          <el-select v-model="listQuery.id" placeholder="角色" clearable style="width: 90px;margin-left: 20px" class="filter-item">
            <el-option v-for="item in role_arr" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>

          <el-button  class="filter-item" type="primary" style="margin-left: 20px;" icon="el-icon-search" @click="handleFilter" :loading="search_loading">
            搜索
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addMem" v-if="this.bp && this.bp.includes('system/user_add')">
            新增
          </el-button>
        </div>

      </div>

      <el-table
        border fit highlight-current-row style="width: 100%"
        :data="user_list"
        row-key="id"
        :default-sort = "{prop: 'regist_time', order: 'ascending'}"
      >

        <el-table-column
          min-width="10%"
          align="center"
          sortable
          prop="id"
          label="序号"
        >
          <template slot-scope="{row}">
            {{row.id}}
          </template>
        </el-table-column>

        <el-table-column
          min-width="18%"
          align="center"
          prop="account"
          label="账号"
        >
          <template slot-scope="{row}">
            {{ row.account }}
          </template>
        </el-table-column>

        <el-table-column
          min-width="18%"
          align="center"
          prop="nick_name"
          label="昵称"
        >
          <template slot-scope="{row}">
            {{ row.nick_name }}
          </template>
        </el-table-column>

        <el-table-column
          min-width="18%"
          align="center"
          prop="role_name"
          label="角色名"
        >
          <template slot-scope="{row}">
            {{row.role_name}}
          </template>
        </el-table-column>

        <el-table-column
          min-width="18%"
          align="center"
          prop="created_at"
          label="注册时间"
        >
          <template slot-scope="{row}">

            <span>{{ row.created_at}}</span>

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
          min-width="18%"
          align="center"
          label="操作"
        >
          <template slot-scope="{row}">
            <el-link
              type="primary"
              size="medium"
              @click="getUserDetail(row)"
            >
              详情
            </el-link>
          </template>
        </el-table-column>

      </el-table>

      <el-dialog :visible.sync="dialogVisible" title="新增用户" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form  label-width="80px" ref="auth" label-position="left">
          <el-form-item label="用户名称:">
            <el-input v-model="add.account" placeholder="请输入用户名" maxLength="16" />
          </el-form-item>

          <el-form-item label="角色名:">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in role_arr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="登录密码:">
            <el-input v-model="add.login_password" type="password"/>
          </el-form-item>

          <el-form-item label="状态">
            <el-radio v-model="add.status" label="1">开启</el-radio>
            <el-radio v-model="add.status" label="2">禁用</el-radio>
          </el-form-item>


          <el-form-item>
            <div style="text-align:right;">
              <el-button type="danger" @click="dialogVisible=false">取消</el-button>
              <el-button type="primary" @click="submitAdd">确定</el-button>
            </div>
          </el-form-item>

        </el-form>

      </el-dialog>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    </div>

  </div>

</template>
<script>

    import {LocalStorage} from '@/utils/storage'
    import {formatDate} from '@/utils/date'
    import qs from 'qs'
    import Timeselect from '@/components/Timeselect'
    import Pagination from '@/components/Pagination'


    export default {
        name:'List',
        components: { Pagination,Timeselect },
        data() {
            return {
                bp:LocalStorage.get('bp'),
                pwd:'',
                suc_show:false,
                user_list: [],
                listQuery: {
                    page: 1,
                    limit: 10,
                    account:undefined,
                    id:undefined,
                },
                total:0,
                states : [
                  {status:1,name:'正常'},
                  {status:2,name:'禁用'},
                ],
                mem_name:'',
                add:{
                  account:'',
                  login_password:'',
                  status:'1',
                },
                role_arr:[],
                value:'',
                dialogVisible: false,
                search_loading: false,
            }
        },

        methods: {

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

            addMem() {
                this.suc_show = false
                this.mem_name = '';
                this.value = undefined;
                this.dialogVisible = true
            },

            getUserDetail(row) {
                this.$router.push({path: '/system/user_edit', query: {id:row.id}})
            },

            getList (obj){

                if (obj!==undefined && obj.flag !== undefined) {
                    this.listQuery.page =1
                }

                let data = {
                    status : this.listQuery.status!==''?this.listQuery.status:undefined,
                    page: this.listQuery.page,
                    page_size: this.listQuery.limit,
                    start_time:this.listQuery.value1?parseInt(this.listQuery.value1/1000):undefined,
                    end_time:this.listQuery.value2?parseInt(this.listQuery.value2/1000+24*60*60-1):undefined,
                    account: this.listQuery.account,
                    role_id: this.listQuery.id,
                    request_param:'GET'
                }
                this.search_loading = true;
                this.$http.get(`${this.url}/admin`,data).then((resp) => {

                    this.search_loading = false;
                    if (resp.code === 200) {

                        let res = resp.data
                        if (res) {
                            for (var i=0;i<res.length;i++) {
                                res[i]['status'] = res[i]['status'] === 1
                            }
                            this.user_list = res
                            this.total = resp.page.TotalSize
                        } else {
                            this.user_list = []
                            this.total = 0
                        }

                    } else {
                        this.msgTip(resp.msg,'error')
                    }

                }).catch((error)=>{
                    this.search_loading = false;
                    if (error !== 'loginErr') {
                        console.log(error);
                        this.msgTip('系统繁忙，请稍后重试','error')
                    }
                })
            },

            getRole() {
                let data2 = {
                    status : 1,
                    request_param:'GET'
                };

                this.$http.get(`${this.url}/admin_role`,data2).then((resp)=>{

                    if (resp.code === 200) {

                        if (resp.data) {

                            let res = resp.data,obj={},new_arr=[];

                            for (var i=0;i<res.length;i++) {

                                obj = {id:res[i]['id'],name:res[i]['role_name']};
                                new_arr.push(obj)
                            }

                            this.role_arr = new_arr

                        } else {
                            this.role_arr = []
                        }

                    } else {

                        this.msgTip(resp.msg,'error')
                    }
                }).catch((error)=>{

                    if (error !== 'loginErr') {
                        console.log(error);
                        this.msgTip('系统繁忙，请稍后重试','error')
                    }

                })
            },

            /**
             * 校验用户名
             * 字符最少1个
             * 不允许有特殊字符（包括空格）
             * 不允许中文
             */
            validName(str) {
                if (str.length<6 || str.length>16) return false
                for(var i=0;i<str.length;i++) {
                    if(!/^[a-zA-Z0-9]$/.test(str[i])) {
                        return false
                    }
                }
                return true;
            },

            submitAdd() {

                this.suc_show = false

                if (!this.validName(this.add.account)) {
                    this.msgTip('用户名格式错误','error')
                    return
                }

                if (this.value ===''
                    || this.value === null
                    || this.value === undefined) {

                    this.msgTip('请选择角色','error');
                    return;
                }

                if (this.add.login_password.replace(/\s/g,'') ==='') {
                      this.msgTip('请输入登录密码','error');
                      return;
                }

                let obj  = this.role_arr.filter(item => {
                  return this.value === item.id
                })

                let data = {
                  role_id:obj[0].id,
                  role_name:obj[0].name,
                  account:this.add.account,
                  login_password:this.add.login_password,
                  status:parseInt(this.add.status),
                  request_param:'POST'
                }

                this.$http.post(`${this.url}/admin`,qs.stringify(data)).then((resp)=>{
                    if(resp.code === 200) {
                      this.$message({
                        message:'添加成功',
                        type:'success',
                        center:true
                      });
                      setTimeout(() => {
                        window.location.reload()
                      },1000)
                    }else{
                      this.msgTip(resp.msg,'error')
                    }
                }).catch((error)=>{
                    if (error !== 'loginErr') {
                        console.log(error);
                        this.msgTip('系统繁忙，请稍后重试','error')
                    }
                })
            },

            msgTip(name,val) {

                this.$message({
                    message:name,
                    type:val,
                    center:true
                })
            },

        },

        filters:{
            //时间戳
            formatDate(time) {
                return formatDate(time);
            },
        },

        created() {
            this.getList()
            this.getRole()
        }
    }
</script>

