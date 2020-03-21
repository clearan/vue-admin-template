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

          <el-select v-model="listQuery.style" placeholder="风格" clearable style="width: 100px;" class="filter-item">
            <el-option v-for="item in styles" :key="item.style" :label="item.name" :value="item.style" />
          </el-select>
          <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px;" class="filter-item">
            <el-option v-for="item in states" :key="item.status" :label="item.name" :value="item.status" />
          </el-select>
          <el-select v-model="listQuery.scope" placeholder="投放范围" clearable style="width: 110px;" class="filter-item">
            <el-option v-for="item in scopes" :key="item.scope" :label="item.name" :value="item.scope" />
          </el-select>

          <el-button  class="filter-item" type="primary" style="margin-left: 10px;" icon="el-icon-search" @click="handleFilter" :loading="search_loading">
            搜索
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addNotice">
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

            <el-link type="primary">
              {{ row.id }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="style"
          label="风格"
        >
          <template slot-scope="{row}">
            <span>
<!--              {{-->
<!--                styles.filter((item)=> {-->
<!--                  return  row.type_id === item.id-->
<!--                }).length > 0-->
<!--              ? config_type.filter((item)=> {-->
<!--                  return  row.type_id === item.id-->
<!--                })[0].name-->
<!--              : '-'-->

<!--              }}-->
            </span>
          </template>
        </el-table-column>


        <el-table-column
          align="center"
          prop="name"
          label="创建时间"
        >
          <template slot-scope="{row}">
            {{ row.created_at }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="操作"
        >
          <template slot-scope="{row}">
            <el-link type="primary"  @click="editConf(row)">
              编辑
            </el-link>
          </template>
        </el-table-column>

      </el-table>
      <el-dialog :visible.sync="dialogVisible" :title="title" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="notice" label-width="80px" ref="notice" :rules="Rules" label-position="left">

          <el-form-item label="风格" prop="style">
            <el-select v-model="notice.style" placeholder="请选择">
              <el-option
                v-for="item in styles"
                :key="item.style"
                :label="item.name"
                :value="item.style"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select v-model="notice.status" placeholder="请选择">
              <el-option
                v-for="item in states"
                :key="item.status"
                :label="item.name"
                :value="item.status"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="投放范围" prop="scope">
            <el-select v-model="notice.scope" placeholder="请选择">
              <el-option
                v-for="item in scopes"
                :key="item.scope"
                :label="item.name"
                :value="item.scope"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="发布时间" prop="publish_time">
            <el-date-picker
              v-model="notice.publish_time"
              type="date"
              value-format="timestamp"
              placeholder="选择发布时间">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="结束时间" prop="expiration_time">
            <el-date-picker
              v-model="notice.expiration_time"
              type="date"
              value-format="timestamp"
              placeholder="选择结束时间">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="内容:" prop="content">
            <el-input :rows="4" maxlength="200" placeholder="请填写内容" type="textarea" v-model="notice.content"/>
          </el-form-item>


          <el-form-item>
            <div style="text-align:right;">
              <el-button type="danger" @click="dialogVisible=false">取消</el-button>
              <el-button type="primary" @click="submitNotice">确定</el-button>
            </div>
          </el-form-item>

        </el-form>
      </el-dialog>
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
        bp:LocalStorage.get('bp'),
        search_loading:false,
        button:['','','','','','',''],
        listQuery: {
          value1:'',
          value2:'',
          page: 1,
          limit: 10,
          status: undefined,
          style: undefined,
          scope: undefined,
        },
        notice:{
          status: '',
          style: '',
          scope: '',
          publish_time:'',
          expiration_time:'',
          content:'',
        },
        list:[],
        id:'',
        title:'',
        Rules: {
          status: [{ required: true, message: '请选择状态', trigger: 'change' }],
          style: [{ required: true, message: '请选择风格', trigger: 'change' }],
          scope:[{ required: true, message: '请选择投放范围', trigger: 'change' }],
          publish_time: [{ required: true, message: '请选择发布时间', trigger: 'change' }],
          expiration_time: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
          content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
        },
        dialogVisible:false
      }
    },

    computed:{

      states() {
        return this.$store.state.user.config['site_notice_status'].map(item=>{
          return {status:item.value,name:item.name}
        })
      },

      styles() {
        return this.$store.state.user.config['site_notice_style'].map(item=>{
          return {style:item.value,name:item.name}
        })
      },

      scopes() {
        return this.$store.state.user.config['site_notice_scope'].map(item=>{
          return  {scope:item.value,name:item.name}
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

      confDetail(row) {
        this.$router.push({path: '/conf/configType_detail', query: {id: row.id}})
      },

      editConf(row) {

        if (!this.bp.includes('conf/configType_edit')) {
          this.msgTip('您没有此权限')
          return
        }
        this.title = '编辑配置类型'
        this.id = row.id
        this.name = row.name
        this.status = row.status ? '1' :'2'
        this.dialogVisible = true
      },

      addNotice() {
        this.title = '添加公告'
        this.dialogVisible = true
        this.$nextTick(()=>{
          this.$refs.notice.resetFields();
        });
      },

      submitNotice() {

        let data = {}
        if (this.title === '添加公告') {
          data = {
            content:this.notice.content,
            style:this.notice.style,
            status:this.notice.status,
            scope:this.notice.scope,
            publish_time:this.notice.publish_time,
            expiration_time:this.notice.expiration_time,
            request_param:'POST'
          }
        } else {
          data = {
            id:this.id,
            name:this.name,
            status:parseInt(this.status),
            request_param:'POST'
          }
        }
        console.log(data)
        this.$refs.notice.validate(valid => {
          if (valid) {
            this.$http.post(`${this.url}/site_notice`,qs.stringify(data)).then( resp => {
              if (resp.code === 200) {
                this.$message({
                  message:resp.msg,
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

      },
      getList() {

          let data = {
            request_param:'GET'
          }

          this.$http.get(`${this.url}/site_notice`,data).then(resp=>{

            if (resp.code === 200) {
              if (resp.data) {
                // resp.data.forEach(item => {
                //   item.status = item.status === 1
                // })
                this.list = resp.data;
              }else {
                this.list = [];
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


      msgTip(name) {
        this.$message({
          message:name,
          type:'error',
          center:true
        })
      },
    },

    created() {
      this.getList()
    }
  }

</script>



