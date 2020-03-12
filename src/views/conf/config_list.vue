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

        <div style="margin-top:10px">
          <el-input v-model="listQuery.option_code" clearable placeholder="选项code" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.option_name" clearable placeholder="配置名" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="listQuery.type_id" placeholder="配置类型" clearable style="width: 120px;margin-left: 20px" class="filter-item">
            <el-option v-for="item in type_list" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>

          <el-button  class="filter-item" type="primary" style="margin-left: 20px;" icon="el-icon-search" @click="handleFilter" :loading="search_loading">
            搜索
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addConf" v-if="this.bp && this.bp.includes('conf/config_add')">
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
          align="center"
          prop="option_name"
          label="选项名称"
        >
          <template slot-scope="{row}">
            <el-link type="primary" @click="editConf(row)">
              {{ row.option_name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="option_code"
          label="选项code"
        >
          <template slot-scope="{row}">
            {{ row.option_code }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="option_describe"
          label="选项描述"
        >
          <template slot-scope="{row}">
            {{row.option_describe}}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="type_id"
          label="配置类型"
        >
          <template slot-scope="{row}">
            <span>
              {{
                config_type.filter((item)=> {
                  return  row.type_id === item.id
                }).length > 0
              ? config_type.filter((item)=> {
                  return  row.type_id === item.id
                })[0].name
              : '-'

              }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="from_id"
          label="表单类型"
        >
          <template slot-scope="{row}">
            <span>{{
              from_types.filter(items=> {
                 return items.value === row.from_id
              })[0].name
              }}
            </span>
          </template>
        </el-table-column>

<!--        <el-table-column-->
<!--          align="center"-->
<!--          prop="bussiness_type_id"-->
<!--          label="业务类型"-->
<!--        >-->
<!--          <template slot-scope="{row}">-->
<!--            <span>{{row.bussiness_type_id}}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->

        <el-table-column
          align="center"
          prop="units"
          label="单位"
        >
          <template slot-scope="{row}">
            <span>{{ row.units}}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="value_type"
          label="值类型"
        >
          <template slot-scope="{row}">
            <span>{{
              value_types.filter(items=> {
                return items.value===row.value_type
              })[0].name
              }}
            </span>

          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="value"
          label="值"
        >
          <template slot-scope="{row}">
            <span>{{ row.value}}</span>
          </template>
        </el-table-column>

      </el-table>

      <el-dialog :visible.sync="dialogVisible" :title="title" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form  :model="conf" label-width="100px" ref="conf" :rules="Rules" label-position="left">
          <el-form-item label="配置名称:" prop="option_name">
            <el-input v-model="conf.option_name" placeholder="请输入配置名称" maxLength="20" />
          </el-form-item>

          <el-form-item label="配置code:" prop="option_code">
            <el-input v-model="conf.option_code" placeholder="请输入配置名code" maxLength="30" />
          </el-form-item>

          <el-form-item label="描述:" >
            <el-input v-model="conf.option_describe" placeholder="请输入描述" maxLength="50" />
          </el-form-item>

          <el-form-item label="配置类型:" prop="type_id">
            <el-select v-model="conf.type_id" placeholder="请选择">
              <el-option
                v-for="item in type_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="表单类型:" prop="from_id">
            <el-select v-model="conf.from_id" placeholder="请选择">
              <el-option
                v-for="item in from_types"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="类型:" prop="value_type">
            <el-select v-model="conf.value_type" placeholder="请选择">
              <el-option
                v-for="item in value_types"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="单位:">
            <el-input v-model="conf.units" />
          </el-form-item>

          <el-form-item label="值:" prop="value">
            <el-input v-model="conf.value" />
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

    import {LocalStorage} from '@/utils/storage'
    import qs from 'qs'
    import Timeselect from '@/components/Timeselect'
    import Pagination from '@/components/Pagination'


    export default {
        name:'List',
        components: { Pagination,Timeselect },
        data() {
            return {
                bp:LocalStorage.get('bp'),
                type_list :[],
                user_list: [],
                listQuery: {
                    page: 1,
                    limit: 10,
                    option_code:undefined,
                    option_name:undefined,
                    type_id:undefined,
                },
                total:0,
                dialogVisible: false,
                search_loading: false,
                conf:{
                  option_name:'',
                  option_code:'',
                  option_describe:'',
                  type_id:'',
                  from_id:'',
                  value_type:'',
                  units:'',
                  value:'',
                },
                title:'',
                id:'',
                Rules: {
                  option_name: [{ required: true, message: '请输入配置名称', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
                  option_code: [{ required: true, message: '请输入配置code', trigger: 'blur' },
                    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }],
                  // units:[{ required: true, message: '请填写单位', trigger: 'blur' }],
                  value:[{ required: true, message: '请填写值', trigger: 'blur' }],
                  type_id: [{ required: true, message: '请选择配置类型', trigger: 'change' }],
                  from_id: [{ required: true, message: '请选择表单类型', trigger: 'change' }],
                  value_type: [{ required: true, message: '请选择类型', trigger: 'change' }],
                },
            }
        },

        computed:{

          value_types() {
            let res= this.$store.state.user.config['site_configs_value_type'].map(item=>{
              let obj = {value:item.value,name:item.name}
              return obj
            })
            return res
          },

          from_types() {
            let res= this.$store.state.user.config['site_configs_from_type'].map(item=>{
              let obj = {value:item.value,name:item.name}
              return obj
            })
            return res
          },

          config_type() {
            return this.type_list
          }
        },

        methods: {

            handleSubmit() {

              if (this.title === '添加配置') {

                let data = {
                  option_name:this.conf.option_name,
                  option_code:this.conf.option_code,
                  option_describe:this.conf.option_describe,
                  type_id:this.conf.type_id,
                  from_id:this.conf.from_id,
                  value_type:this.conf.value_type,
                  units:this.conf.units,
                  value:this.conf.value,
                  request_param:'POST'
                }
                this.$refs.conf.validate(valid => {
                  if (valid) {
                    this.$http.post(`${this.url}/site_configs`,qs.stringify(data)).then((resp)=>{

                      if (resp.code === 200) {
                        this.$message({
                          message:'添加成功',
                          type:'success',
                          center:true
                        });
                        setTimeout(() => {
                          window.location.reload()
                        },1000)
                      }else{
                        this.$message({
                          message:resp.msg,
                          type:'error',
                          center:true
                        })
                      }
                    })
                  } else {
                    console.log('error submit!!')
                  }
                })

              } else {
                let data = {
                  id:this.id,
                  option_name:this.conf.option_name,
                  option_code:this.conf.option_code,
                  option_describe:this.conf.option_describe,
                  type_id:this.conf.type_id,
                  from_id:this.conf.from_id,
                  value_type:this.conf.value_type,
                  units:this.conf.units,
                  value:this.conf.value,
                  request_param:'PUT'
                }
                this.$refs.conf.validate(valid => {
                  if (valid) {
                    this.$http.put(`${this.url}/site_configs`,qs.stringify(data)).then((resp)=>{

                      if (resp.code === 200) {
                        this.$message({
                          message:'编辑成功',
                          type:'success',
                          center:true
                        });
                        this.dialogVisible = false
                        this.getList()
                      }else{
                        this.$message({
                          message:resp.msg,
                          type:'error',
                          center:true
                        })
                      }
                    })
                  } else {
                    console.log('error submit!!')
                  }
                })
              }

            },

            handleFilter() {
              this.listQuery.page = 1;
              this.getList()
            },

            editConf(row) {
              if (!this.bp.includes('conf/config_edit')) {
                this.msgTip('您暂无权限','error')
                return
              }
              this.id = row.id
              this.title = '编辑配置'
              this.conf.option_name = row.option_name
              this.conf.option_code = row.option_code
              this.conf.option_describe = row.option_describe
              this.conf.units = row.units
              this.conf.type_id = row.type_id
              this.conf.from_id = row.from_id
              this.conf.value_type = row.value_type
              this.conf.value = row.value
              this.dialogVisible = true
              this.$nextTick(()=>{
                this.$refs.conf.clearValidate();
              });
            },

            addConf() {
              this.title = '添加配置'
              this.conf.option_name = ''
              this.conf.option_code = ''
              this.conf.option_describe = ''
              this.conf.units = ''
              this.conf.type_id = ''
              this.conf.from_id = ''
              this.conf.value_type = ''
              this.conf.value = ''
              this.dialogVisible = true
              this.$nextTick(()=>{
                this.$refs.conf.clearValidate();
              });
            },

            getList (obj){

                if (obj!==undefined && obj.flag !== undefined) {
                    this.listQuery.page =1
                }

                let data = {
                    page: this.listQuery.page,
                    page_size: this.listQuery.limit,
                    option_name: this.listQuery.option_name,
                    option_code: this.listQuery.option_code,
                    type_id: this.listQuery.type_id,
                    request_param:'GET'
                }
                this.search_loading = true;
                this.$http.get(`${this.url}/site_configs`,data).then((resp) => {

                    this.search_loading = false;
                    if (resp.code === 200) {

                        let res = resp.data
                        if (res) {
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

            getType() {
              let data = {
                request_param:'GET'
              }

              this.$http.get(`${this.url}/site_configs_type`,data).then((resp)=>{

                if (resp.code === 200) {
                  if (resp.data) {
                    let arr = [],obj={}
                    resp.data.forEach( item => {
                    obj = {id:item.id,name:item.name}
                    arr.push(obj)
                   })
                    this.type_list  = arr
                  }else {
                    this.type_list = [];
                  }
                }else{
                  this.$message({
                    message:resp.msg,
                    type:'error',
                    center:true
                  })
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

        created() {
            this.getType()
            this.getList()
        },


    }
</script>

