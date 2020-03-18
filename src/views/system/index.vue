<template>
  <div style="
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    transition: .3s;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.1);
    min-height: 798px;">
    <div class="app-container" >

      <div class="filter-container">
        <el-button v-if="this.bp && this.bp.includes('system/auth_add')" type="primary" style="margin-bottom: 15px" @click="addAuth" icon="el-icon-plus">
          新增
        </el-button>
      </div>

      <el-table
        border  highlight-current-row style="width: 100%"
        :data="tableData"
        row-key="id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        :header-cell-style="headerStyle"
      >
        <el-table-column
          min-width="20%"
          prop="name"
          label="菜单名称"
        >
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.permission_name"  class="edit-input" size="small" />
            </template>
            <span v-else style="margin-left: 8px">{{row.permission_name }}</span>
          </template>
        </el-table-column>



        <el-table-column
          prop="路由"
          label="路由"
          min-width="20%">
          <template slot-scope="{row}">
            <span>{{ row.permission_code }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="desc"
          label="请求方式"
          align="center"
          min-width="20%">
          <template slot-scope="{row}">
            {{ row.request_param }}
          </template>
        </el-table-column>

        <el-table-column
          prop="type"
          label="类型"
          align="center"
          min-width="20%">
          <template slot-scope="{row}">
            <el-tag v-if="row.type===1" size="medium">菜单</el-tag>
            <el-tag v-else-if="row.type===2" type="success" size="medium">路由</el-tag>
            <el-tag v-else type="warning" size="medium">按钮</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="模板"
          label="模板"
          align="center"
          min-width="20%">
          <template slot-scope="{row}">
           {{ row.permission_path }}
          </template>
        </el-table-column>

        <el-table-column
          prop="desc"
          label="排序"
          align="center"
          min-width="20%">
          <template slot-scope="{row}">
            <span>{{ row.sort }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          min-width="20%"
          align="center"
        >
          <template slot-scope="{row}">
            <el-link
              type="primary"
              size="small"
              @click="handleEdit(row)"
            >
              编辑
            </el-link>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="dialogVisible" title="新增权限" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="auth" label-width="80px" ref="auth" :rules="onePerRules" label-position="left">
          <el-form-item label="父级菜单" prop="value">
            <el-select v-model="auth.value" placeholder="请选择" @change="clearValue">
              <el-option
                v-for="item in f_menu"
                :key="item.id"
                :label="item.permission_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="权限名称" prop="permission_name">
            <el-input v-model="auth.permission_name" placeholder="请输入权限名称"/>
          </el-form-item>

          <el-form-item label="路由" prop="permission_code">
            <el-input v-model="auth.permission_code" placeholder="请输入路由"/>
          </el-form-item>

          <el-form-item label="模板" prop="permission_path">
            <el-col :span="12" >
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="auth.permission_path"
                :fetch-suggestions="querySearch"
                placeholder="请填写URL"
                style="width:600px"
              >
                <i
                  slot="suffix"
                >
                </i>
                <template slot-scope="{ item }">
                  <div class="name">{{ item.value }}<span>&nbsp;&nbsp;&nbsp;</span><span class="addr">{{ item.desc }}</span></div>

                </template>
              </el-autocomplete>
            </el-col>
<!--            <el-input v-model="auth.permission_path" placeholder="请输入前端模板"/>-->
          </el-form-item>

          <el-form-item label="请求方式" prop="req">
            <el-select v-model="auth.req" placeholder="请选择">
              <el-option
                v-for="item in request_param"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="排序" prop="sort">
            <el-input v-model="auth.sort" placeholder="请输入序号"/>
          </el-form-item>

          <el-form-item label="类型" v-if="!auth.value" prop="type">
            <el-radio v-model="auth.type" label="1" >菜单</el-radio>
            <el-radio v-model="auth.type" label="2" >路由</el-radio>
            <el-radio v-model="auth.type" label="3" >按钮</el-radio>
          </el-form-item>
          <el-form-item label="类型" v-else prop="type">
            <el-radio v-model="auth.type" label="1" v-if="f_menu.filter(item=>{ return item.id === auth.value})[0].parent_id===0">菜单</el-radio>
            <el-radio v-model="auth.type" label="2" v-if="f_menu.filter(item=>{ return item.id === auth.value})[0].parent_id===1">路由</el-radio>
            <el-radio v-model="auth.type" label="3" v-if="f_menu.filter(item=>{ return item.id === auth.value})[0].parent_id===1">按钮</el-radio>
          </el-form-item>

          <el-form-item label="状态">
            <el-radio v-model="auth.status" label="1">显示</el-radio>
            <el-radio v-model="auth.status" label="2">隐藏</el-radio>
          </el-form-item>

          <el-form-item>
            <div style="text-align:right;">
              <el-button type="danger" @click="dialogVisible=false">取消</el-button>
              <el-button type="primary" @click="submitAdd">确定</el-button>
            </div>
          </el-form-item>

        </el-form>

      </el-dialog>
      <el-dialog :visible.sync="dialogVisibleEdit" title="编辑权限" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="edit" label-width="80px" ref="edit" :rules="twoPerRules" label-position="left">
          <el-form-item label="父级菜单" prop="value">
            <el-select v-model="edit.value" placeholder="请选择" @change="clearValue2">
              <el-option
                v-for="item in f_menu"
                :key="item.id"
                :label="item.permission_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="权限名称" prop="permission_name">
            <el-input v-model="edit.permission_name" placeholder="请输入权限名称"/>
          </el-form-item>

          <el-form-item label="路由" prop="permission_code">
            <el-input v-model="edit.permission_code" placeholder="请输入路由"/>
          </el-form-item>

          <el-form-item label="模板" prop="permission_path">
            <el-col :span="12" >
              <el-autocomplete
                popper-class="my-autocomplete"
                v-model="edit.permission_path"
                :fetch-suggestions="querySearch"
                placeholder="请填写URL"
                style="width:600px"
              >
                <i
                  slot="suffix"
                >
                </i>
                <template slot-scope="{ item }">
                  <div class="name">{{ item.value }}<span>&nbsp;&nbsp;&nbsp;</span><span class="addr">{{ item.desc }}</span></div>

                </template>
              </el-autocomplete>
            </el-col>
<!--            <el-input v-model="edit.permission_path" placeholder="请输入模板"/>-->
          </el-form-item>

          <el-form-item label="请求方式" prop="req">
            <el-select v-model="edit.req" placeholder="请选择">
              <el-option
                v-for="item in request_param"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="排序" prop="sort">
            <el-input v-model="edit.sort" placeholder="请输入序号" maxLength="16"/>
          </el-form-item>

          <el-form-item label="类型" prop="type" v-if="edit.value">
            <el-radio v-model="edit.type" label="1" v-if="f_menu.filter(item=>{ return item.id === edit.value})[0].parent_id===0">菜单</el-radio>
            <el-radio v-model="edit.type" label="2" v-if="f_menu.filter(item=>{ return item.id === edit.value})[0].parent_id===1">路由</el-radio>
            <el-radio v-model="edit.type" label="3" v-if="f_menu.filter(item=>{ return item.id === edit.value})[0].parent_id===1">按钮</el-radio>
          </el-form-item>


          <el-form-item label="状态">
            <el-radio v-model="edit.status" label="1">显示</el-radio>
            <el-radio v-model="edit.status" label="2">隐藏</el-radio>
          </el-form-item>


          <el-form-item>
            <div style="text-align:right;">
              <el-button type="danger" @click="dialogVisibleEdit=false">取消</el-button>
              <el-button type="primary" @click="submitEdit">确定</el-button>
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
  import {main_url} from '@/utils/url'
  export default {
    name:'List',
    data() {
      var oneValidUrl = (rule, value, callback) => {
        //url必须是配置里面有的
        var res = this.main_url.some((item) => {

          return item.value === value
        })

        if (res) {

          callback();

        } else {

          callback(new Error('url错误'));
        }
      };
      return {
        bp:LocalStorage.get('bp'),
        main_url: main_url,
       // child_url: child_url,
        auth:{
          permission_name:'',
          permission_code:'',
          permission_path:'',
          value:'',
          type:'',
          sort:'',
          status:'1',
          req:''
        },
        request_param : [
          {id:1,name:'GET'},
          {id:2,name:'POST'},
          {id:3,name:'PUT'},
          {id:4,name:'PATCH'},
          {id:5,name:'DELETE'},
          {id:6,name:'OPTIONS'},
        ],
        edit:{
          permission_name:'',
          permission_code:'',
          permission_path:'',
          value:'',
          type:'',
          sort:'',
          status:'',
          req:''
        },
        dialogVisible: false,
        dialogVisibleEdit: false,
        is_show:false,
        tableData: [],
        f_menu:[],
        onePerRules: {
          value: [{ required: true, message: '请选择父级菜单', trigger: 'change' }],
          permission_name: [{ required: true, trigger: 'blur', message:'请输入权限名称'},
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }],
          permission_code: [{ required: true, trigger: 'blur', message:'请输入路由'},
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
          permission_path:[{ required: true,trigger: 'change', validator: oneValidUrl}],
          req: [{ required: true, message: '请选择请求方式', trigger: 'change' }],
          type: [{ required: true, message: '请选择类型', trigger: 'change' }],
          sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        },
        twoPerRules: {
          value: [{ required: true, message: '请选择父级菜单', trigger: 'change' }],
          permission_name: [{ required: true, trigger: 'blur', message:'请输入权限名称'},
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }],
          permission_code: [{ required: true, trigger: 'blur', message:'请输入路由'},
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
          permission_path:[{ required: true,trigger: 'change', validator: oneValidUrl}],
          req: [{ required: true, message: '请选择请求方式', trigger: 'change' }],
          type: [{ required: true, message: '请选择类型', trigger: 'change' }],
          sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        },

      }
    },

    methods: {

      clearValue() {
        this.auth.type = ''
      },

      clearValue2() {
        this.edit.type = ''
      },

      headerStyle({row, column, rowIndex, columnIndex}) {

        if (rowIndex === 0) {
          return `
                      text-align:center
                      `
        }
      },
      querySearch(queryString, cb) {

        var urls = this.main_url;
        var results = queryString ? urls.filter(this.createFilter(queryString)) : urls;
        cb(results);
      },

      createFilter(queryString) {

        return (restaurant) => {

          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },

      handleEdit(row) {

        if (!this.bp.includes('system/auth_edit')) {
          this.msgTip('您没有此权限')
          return
        }

        this.edit.permission_name = row.permission_name;
        this.edit.permission_code = row.permission_code;
        this.edit.permission_path = row.permission_path;
        this.edit.sort = row.sort;
        this.edit.req = row.request_param;
        this.edit.type = String(row.type);
        this.edit.status = row.status ? '1' :'2';
        //父级id
        this.edit.value = row.parent_id;
        this.edit.id = parseInt(row.id.substr(1));
        this.dialogVisibleEdit = true
        this.$nextTick(()=>{
          this.$refs.edit.clearValidate();//等弹窗里的form表单的dom渲染完在执行this.$refs.edit.resetFields()，去除验证
        });
      },

      submitEdit() {
        let data = {
          id:this.edit.id,
          parent_id:this.edit.value,
          permission_name:this.edit.permission_name,
          permission_code:this.edit.permission_code,
          permission_path:this.edit.permission_path,
          request_param:this.edit.req,
          sort:this.edit.sort,
          type:parseInt(this.edit.type),
          status:parseInt(this.edit.status),
        }

        this.$refs.edit.validate(valid => {
          if (valid) {
            this.$http.put(`${this.url}/admin_permission`,qs.stringify(data)).then(resp => {
              if (resp.code === 200) {
                this.$message({
                  message:'更新成功',
                  type:'success',
                  center:true
                });
                setTimeout(() => {
                  window.location.reload()
                },1000)
                // this.dialogVisibleEdit= false
                // this.getList()

              } else {
                this.msgTip(resp.msg)
              }
            }).catch(err => {
              console.log(err);
              this.msgTip('系统繁忙，请稍后重试')
            })
          } else {
            console.log('error submit!!')
          }
        })
      },

      addAuth() {
        this.dialogVisible = true
        this.$nextTick(()=>{
          this.$refs.auth.resetFields();
        });
      },

      submitAdd() {
        console.log(this.auth.value,this.auth.type);
        let data = {
          parent_id:this.auth.value,
          permission_name:this.auth.permission_name,
          permission_code:this.auth.permission_code,
          permission_path:this.auth.permission_path,
          request_param:this.auth.req,
          sort:this.auth.sort,
          type:parseInt(this.auth.type),
          status:parseInt(this.auth.status),
        }

        this.$refs.auth.validate(valid => {
          if (valid) {
            this.$http.post(`${this.url}/admin_permission`,qs.stringify(data)).then(resp => {
              if (resp.code === 200) {
                this.$message({
                  message:'添加成功',
                  type:'success',
                  center:true
                });
                setTimeout(() => {
                  window.location.reload()
                },1000)
                // this.dialogVisible= false
                // this.getList()

              } else {
                this.msgTip(resp.msg)
              }
            }).catch(err => {
              console.log(err);
              this.msgTip('系统繁忙，请稍后重试')
            })
          } else {
            console.log('error submit!!')
          }
        })

      },

      getPostData(row) {

        let data = {
          self_id: LocalStorage.get('self_id'),
          sess: LocalStorage.get('sess'),
          idempotent: new Date().getTime(),
          id: parseInt(row['id'].substr(1)),
          name: row.name,
          desc: row.desc,
          status: row.status ? 1 : 0,
          url:row.url.replace(/\s/g,"").length===0
            ? "javascript:void(0);"
            : row.url.replace(/\s/g,"")
        };

        let post_url='';

        if (row['id'].includes('p')) {

          post_url = 'mod_auth'
        } else {

          data['val'] = row.val;
          post_url = 'mod_auth2'
        }
        return {post_url,data}
      },

      changeStatus(row) {

        let postData = this.getPostData(row);
        this.$http.post(`${this.url}/${postData.post_url}`,qs.stringify(postData.data)).then((resp)=> {

          if (resp.ret_code >= 0) {

            this.$message({
              message:resp.ret_msg,
              type:'success',
              center:true
            })
          } else {

            row.status = !row.status;
            this.msgTip(resp.ret_msg)
          }
        }).catch((error)=>{
          row.status = !row.status;
          if (error !== 'loginErr') {
            console.log(error);
            this.msgTip('系统繁忙，请稍后重试')
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

      getList() {
        this.$http.get(`${this.url}/admin_permission`).then(resp => {
          if (resp.code === 200) {
            let res = resp.data
            this.f_menu = res.filter( item => {
              return item.parent_id < 2
            })
            console.log(this.f_menu)
            let cloneData = JSON.parse(JSON.stringify(res))    // 对源数据深度克隆
            let treeData =  cloneData.filter(father=>{
              let branchArr = cloneData.filter(child=>father.id === child.parent_id)    //返回每一项的子级数组
              branchArr.length>0 ? father.children = branchArr : ''   //如果存在子级，则给父级添加一个children属性，并赋值
              return father.parent_id === 1;      //返回第一层
            });
            //console.log(treeData)
            // var newData = [],obj = {};
            //
            // for (var i=0;i<treeData.length;i++) {
            //
            //   obj = treeData[i];
            //   obj['id'] = 'p'+obj['id'];
            //
            //   if (treeData[i]['auth2_list'] !== undefined) {
            //
            //     obj['children'] = treeData[i]['auth2_list'];
            //     delete obj['auth2_list'];
            //
            //     for (var j=0;j<obj['children'].length;j++) {
            //       obj['children'][j]['id'] = 'c'+obj['children'][j]['id'];
            //       obj['children'][j]['edit'] = false;
            //       obj['children'][j]['status'] = obj['children'][j]['status'] === 1;
            //     }
            //   }
            //
            //   newData.push(obj)
            // }

            this.tableData = treeData.map(item => {
              let obj = JSON.parse(JSON.stringify(item))
              if (obj.children !== undefined) {
                obj.children.forEach(ii=>{
                  ii.id = 'c'+ii.id
                  ii.status = ii.status === 1
                })
              }
              obj.id = 'p'+obj.id
              obj.status = obj.status === 1
              return obj
            })
            //this.tableData = newData;
            //console.log(this.tableData)
          } else {
            this.$message({
              message:resp.msg,
              type:'error',
              center:true
            })
          }
        })
      },

      deleteRow(row) {

        this.$confirm('此操作将彻底删除该权限，是否继续？','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false,
          closeOnPressEscape:false,
        }).then(() => {

          let data = {
            self_id: LocalStorage.get('self_id'),
            sess: LocalStorage.get('sess'),
            idempotent: new Date().getTime(),
            id: parseInt(row['id'].substr(1)),
          };

          let postUrl = row['id'].includes('p') ? 'rmv_auth' : 'rmv_auth2';

          this.$http.post(`${this.url}/${postUrl}`,qs.stringify(data)).then((resp)=> {

            if (resp.ret_code >= 0) {

              if (row.id.includes('c')) {

                for (var i=0;i<this.tableData.length;i++) {

                  if (this.tableData[i]['children'] !== undefined) {
                    const index =  this.tableData[i]['children'].indexOf(row)
                    if (index >= 0) {
                      this.tableData[i]['children'].splice(index,1)
                    }
                  }
                }

              } else {
                const index = this.tableData.indexOf(row)
                this.tableData.splice(index, 1)
              }

              this.$message({
                message:'删除成功',
                type:'success',
                center:true
              })
            } else {

              this.msgTip(resp.ret_msg)
            }
          }).catch((error) => {
            if (error !== 'loginErr') {
              console.log(error);
              this.msgTip('系统繁忙，请稍后重试')
            }
          })

        }).catch(() => {

          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      }
    },


    created() {
      let resp = [
        {
          "created_at": "2020-02-25 20:00:46",
          "created_ip": "10.10.35.250",
          "id": 1,
          "joins": "",
          "parent_id": 0,
          "permission_code": "www",
          "permission_name": "最顶级",
          "sort": 0,
          "status": 1,
          "type": 1,
          "updated_at": "2020-02-25 20:00:46"
        },
        {
          "created_at": "2020-02-26 10:30:17",
          "created_ip": "10.10.35.250",
          "id": 2,
          "joins": "1",
          "parent_id": 1,
          "permission_code": "user",
          "permission_name": "会员管理",
          "sort": 0,
          "status": 2,
          "type": 1,
          "updated_at": "2020-02-26 11:26:09"
        },
        {
          "created_at": "2020-02-26 10:53:57",
          "created_ip": "10.10.35.250",
          "id": 3,
          "joins": "1",
          "parent_id": 1,
          "permission_code": "site",
          "permission_name": "系统配置",
          "sort": 0,
          "status": 1,
          "type": 1,
          "updated_at": "2020-02-26 10:53:57"
        },
        {
          "created_at": "2020-02-26 10:59:54",
          "created_ip": "10.10.35.250",
          "id": 5,
          "joins": "1,3",
          "parent_id": 3,
          "permission_code": "admin_permission",
          "permission_name": "权限管理",
          "sort": 0,
          "status": 1,
          "type": 1,
          "updated_at": "2020-02-26 10:59:54"
        },
        {
          "created_at": "2020-02-26 11:01:26",
          "created_ip": "10.10.35.250",
          "id": 6,
          "joins": "1,3",
          "parent_id": 3,
          "permission_code": "admin_role",
          "permission_name": "角色管理",
          "sort": 0,
          "status": 1,
          "type": 2,
          "updated_at": "2020-02-26 11:01:26"
        },
        {
          "created_at": "2020-02-26 11:13:48",
          "created_ip": "10.10.35.250",
          "id": 8,
          "joins": "1,3",
          "parent_id": 3,
          "permission_code": "site_config",
          "permission_name": "站点配置",
          "sort": 0,
          "status": 1,
          "type": 1,
          "updated_at": "2020-02-26 11:13:48"
        }
      ]
      //去掉顶级的
      //treeData.splice(0,1)

      this.getList()




    }
  }
</script>
<style scoped>
  li {
    line-height: normal;
    padding: 7px;
  }
  .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .addr {
    font-size: 12px;
    color: #b4b4b4;
  }
  .highlighted .addr {
    color: #ddd;
  }
</style>

