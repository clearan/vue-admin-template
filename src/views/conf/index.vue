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
        <el-button   type="primary" icon="el-icon-plus" style="margin-bottom: 15px" @click="addConf" v-if="this.bp.includes('conf/configType_add')">
          新增
        </el-button>
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
        >
          <template slot-scope="{row}">
            {{ row.id }}
          </template>
        </el-table-column>


        <el-table-column
          align="center"
          prop="name"
          label="name"
        >
          <template slot-scope="{row}">

            <el-link type="primary" @click="editConf(row)">
              {{ row.name }}
            </el-link>
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
            <el-link type="primary" @click="confDetail(row)">
              详情
            </el-link>
          </template>
        </el-table-column>

      </el-table>
      <el-dialog :visible.sync="dialogVisible" :title="title" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form  label-width="80px" label-position="left">
          <el-form-item label="名称:" >
            <el-input v-model="name" placeholder="请输入名称" maxLength="16" />
          </el-form-item>


          <el-form-item label="状态">
            <el-radio v-model="status" label="1">开启</el-radio>
            <el-radio v-model="status" label="2">禁用</el-radio>
          </el-form-item>


          <el-form-item>
            <div style="text-align:right;">
              <el-button type="danger" @click="dialogVisible=false">取消</el-button>
              <el-button type="primary" @click="submitConfig">确定</el-button>
            </div>
          </el-form-item>

        </el-form>
      </el-dialog>
    </div>

  </div>
</template>

<script>

  import {LocalStorage} from '@/utils/storage'
  import qs from 'qs'

  export default {
    data() {

      return {
        bp:LocalStorage.get('bp'),
        list:[],
        id:'',
        title:'',
        name:'',
        status:'',
        dialogVisible:false
      }
    },

    methods:{

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

      addConf() {
        this.title = '添加配置类型'
        this.name = ''
        this.status = '1'
        this.dialogVisible = true
      },

      submitConfig() {
        if (this.name.length < 2) {
          this.msgTip('名称格式错误')
          return
        }

        let data = {}
        if (this.title === '添加配置类型') {
          data = {
            name:this.name,
            status:parseInt(this.status),
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

        this.$http.post(`${this.url}/site_configs_type`,qs.stringify(data)).then( resp => {
          if (resp.code === 200) {
            this.$message({
              message:resp.msg,
              type:'success',
              center:true
            });
            setTimeout(() => {
              window.location.reload()
            },1000)
          } else {
            this.msgTip(resp.msg)
          }
        })
      },
      getList() {

          let data = {
            request_param:'GET'
          }

          this.$http.get(`${this.url}/site_configs_type`,data).then((resp)=>{

            if (resp.code === 200) {
              if (resp.data) {
                resp.data.forEach(item => {
                  item.status = item.status === 1
                })
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



