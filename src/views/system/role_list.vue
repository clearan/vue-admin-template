<template>
  <div style="
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.1);
    transition: .3s;
    min-height: 798px;">
    <div class="app-container">

      <div class="filter-container">

        <timeselect @getTimeResult="get_time_result" @getTime="get_time"/>

        <div style="margin-top:10px">
          <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px;" class="filter-item">
            <el-option v-for="item in states" :key="item.status" :label="item.name" :value="item.status"/>
          </el-select>

          <el-button class="filter-item" type="primary" style="margin-left: 20px;" icon="el-icon-search"
                     @click="handleFilter" :loading="search_loading">
            搜索
          </el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="addRole">
            新增
          </el-button>
        </div>

      </div>

      <el-table
        border fit highlight-current-row style="width: 100%"
        :data="role_list"
        row-key="id"
        :default-sort="{prop: 'id', order: 'descending'}"
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
          min-width="23%"
          prop="role_name"
          label="角色名称"
          align="center"
        >
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.role_name" class="edit-input" size="small"/>
            </template>
            <el-link v-else type="primary" @click="handleAuth(row)">
              {{ row.role_name }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column
          min-width="23%"
          prop="remark"
          label="描述"
          align="center"
        >
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.remark" class="edit-input" size="small"/>
            </template>
            <span v-else>{{ row.remark }}</span>
          </template>
        </el-table-column>


        <el-table-column
          min-width="23%"
          prop="status"
          label="状态"
          align="center"
        >
          <template slot-scope="{row}">
            <!--编辑状态下不可改变状态-->
            <el-switch
              :disabled=row.edit
              v-model="row.status"
              @change="changeState(row)"
            >
            </el-switch>
          </template>

        </el-table-column>

        <el-table-column
          min-width="23%"
          label="操作"
          align="center"
        >
          <template slot-scope="{row}">

            <el-button
              v-if="row.edit"
              type="success"
              size="small"
              @click="confirmEdit(row)">
              Ok
            </el-button>
            <el-link
              v-else
              type="primary"
              size="small"
              @click="startEdit(row)"
            >
              编辑
            </el-link>
<!--            <el-button-->
<!--              type="danger"-->
<!--              size="small"-->
<!--              @click="deleteRow(row)"-->
<!--            >-->
<!--              删除-->
<!--            </el-button>-->

          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      <el-dialog :visible.sync="dialogVisible" title="编辑权限" :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <el-form :model="role" label-width="80px" label-position="left">
          <el-form-item label="角色名称">
            <el-input v-model="role.role_name" placeholder="Role Name" readonly/>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="role.remark"
              :autosize="{ minRows: 2, maxRows: 4}"
              type="textarea"
              placeholder="Role Description"
              readonly
            />
          </el-form-item>
          <el-form-item label="权限">
            <el-tree
              default-expand-all
              ref="tree"
              :check-strictly="checkStrictly"
              :data="auths"
              :props="defaultProps"
              show-checkbox
              node-key="id"
              class="permission-tree"
            />
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button type="danger" @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="confirmRole" v-if="this.bp.includes('system/role_auth')">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {LocalStorage} from '@/utils/storage'
  import qs from 'qs'
  import Timeselect from '@/components/Timeselect'
  import Pagination from '@/components/Pagination'
  export default {
    name: 'List',
    components: {Pagination, Timeselect},
    data() {
      return {
        bp:LocalStorage.get('bp'),
        button:['','','','','','',''],
        search_loading:false,
        listQuery: {
          value1: '',
          value2: '',
          page: 1,
          limit: 10,
          id: undefined,
          status: undefined
        },
        total:0,
        states : [
          {status:1,name:'正常'},
          {status:2,name:'禁用'},
        ],
        role: {
          id: '',
          role_name: '',
          remark: ''
        },
        auths: [],
        checkStrictly: false,
        dialogVisible: false,
        defaultProps: {
          children: 'auth2_list',
          label: 'permission_name'
        },
        role_list: []
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

      generateArr(auths) {

        let data = [];
        auths.forEach(item => {

          data.push(item);
          if (item.auth2_list) {
            const temp = this.generateArr(item.auth2_list);
            if (temp.length > 0) {
              data = [...data, ...temp]
            }
          }
        });

        return data
      },

      handleAuth(row) {
        if (!this.bp.includes('system/role_auth_maps')) {
          this.msgTip('您没有此权限')
          return
        }

        this.role.id = row.id;
        this.role.role_name = row.role_name;
        this.role.remark = row.remark;
        this.dialogVisible = true;
        this.checkStrictly = true;

        let data = {
          id: row.id,
          request_param:'GET',
          t:new Date().getTime()
        };

        this.$http.get(`${this.url}/admin_role_maps`, data).then(resp => {
          //console.log(resp);return
          if (resp.code === 200) {
            if (resp.data) {
              let cloneData = JSON.parse(JSON.stringify(resp.data))    // 对源数据深度克隆
              let treeData =  cloneData.filter(father=>{
                let branchArr = cloneData.filter(child=>father.id === child.parent_id)    //返回每一项的子级数组
                branchArr.length>0 ? father.auth2_list = branchArr : ''   //如果存在子级，则给父级添加一个children属性，并赋值
                return father.parent_id === 1;      //返回第一层
              });
              //console.log(treeData)
              this.$nextTick(() => {

                var new_data = [], obj = {};

                for (var j = 0; j < treeData.length; j++) {

                  obj = treeData[j];
                  obj['id'] = 'p' + obj['id'];

                  if (treeData[j]['auth2_list'] !== undefined) {

                    for (var k = 0; k < obj['auth2_list'].length; k++) {
                      obj['auth2_list'][k]['id'] = 'c' + obj['auth2_list'][k]['id']
                    }
                  }
                  new_data.push(obj)
                }

                this.$refs.tree.setCheckedNodes(this.generateArr(new_data));
                this.checkStrictly = false
              })
            }else{
              this.$refs.tree.setCheckedNodes([])
              this.checkStrictly = false
            }
          } else {
            this.msgTip(resp.msg)
          }
        }).catch((error) => {
          if (error !== 'loginErr') {
            console.log(error);
            this.msgTip('系统繁忙，请稍后重试')
          }
        })
      },

      confirmRole() {

        const checkedKeys = this.$refs.tree.getCheckedKeys();
        const half = this.$refs.tree.getHalfCheckedKeys();
        const allChecked = checkedKeys.concat(half);

        if (this.auths.length === 0) {
          this.msgTip('请先配置权限')
        } else if (allChecked.length === 0) {
          this.msgTip('请勾选权限')
        } else {
          let json = allChecked.map( item => {
            return {'id':parseInt(item.substr(1))}
          })
            //console.log(json);return
          let data = {
            permission_ids: JSON.stringify(json),
            status: 1,
            role_id: this.role.id,
            request_param:'PUT',
          };

          this.$http.put(`${this.url}/admin_role_permission`, qs.stringify(data)).then((resp) => {
            if (resp.code === 200) {
              this.$message({
                message: '配置成功',
                type: 'success',
                center: true
              });
              this.dialogVisible = false
            } else {
              this.msgTip(resp.msg)
            }
          })
        }
      },

      addRole() {
        this.$router.push({path: '/system/role_add'})
      },


      startEdit(row) {
        if (!this.bp.includes('system/role_edit')) {
          this.msgTip('您没有此权限')
          return
        }
        row.edit = true
      },

      changeState(row) {
        if (!this.bp.includes('system/role_edit')) {
          row.status = !row.status
          this.msgTip('您没有此权限')
          return
        }

        let data = {
          id: row.id,
          role_name: row.role_name,
          status: row.status ? 1 : 2,
          remark:row.remark,
          request_param:'POST'
        };

        this.$http.put(`${this.url}/admin_role`, qs.stringify(data)).then( resp => {
          if (resp.code === 200) {
            this.$message({
              message: resp.msg,
              type: 'success',
              center: true
            })
          } else {
            row.status = !row.status
            this.msgTip(resp.msg)
          }
        })
      },

      msgTip(name) {
        this.$message({
          message: name,
          type: 'error',
          center: true
        })
      },

      checkRule(row) {

        if (row.role_name.replace(/\s/g, "").length === 0) {
          this.msgTip('角色名称不能为空');
          return false;
        }

        // if (row.role_name.includes(';') || row.role_name.includes('|')) {
        //   this.msgTip('角色名称不能包含特殊字符');
        //   return false;
        // }

        // if (row.role_desc.replace(/\s/g, "").length === 0) {
        //   this.msgTip('角色描述不能为空');
        //   return false;
        // }

        // if (row.role_desc.includes(';') || row.role_desc.includes('|')) {
        //   this.msgTip('角色描述不能包含特殊字符');
        //   return false;
        // }

        return true;
      },

      confirmEdit(row) {
        if (this.checkRule(row)) {
          let data = {
            id: row.id,
            role_name: row.role_name,
            status: row.status ? 1 : 2,
            remark:row.remark,
            request_param:'PUT'
          };

          this.$http.put(`${this.url}/admin_role`, qs.stringify(data)).then((resp) => {
            if (resp.code === 200) {
              row.edit = false
              this.$message({
                message: resp.msg,
                type: 'success',
                center: true
              })
            } else {
              row.edit = true;
              this.msgTip(resp.msg)
            }
          })
        }
      },

      deleteRow(row) {

        this.$confirm('此操作将彻底删除该角色，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
          closeOnPressEscape: false,
        }).then(() => {

          let data = {
            self_id: LocalStorage.get('self_id'),
            sess: LocalStorage.get('sess'),
            idempotent: new Date().getTime(),
            id: row.role_id,
          };

          this.$http.post(`${this.url}/rmv_role`, qs.stringify(data)).then((resp) => {

            if (resp.ret_code >= 0) {
              const index = this.role_list.indexOf(row)
              this.role_list.splice(index, 1)
              this.$message({
                message: '删除成功',
                type: 'success',
                center: true
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
      },

      //获取角色列表
      getList(obj) {

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
        };
       // console.log(data);return

        this.$http.get(`${this.url}/admin_role`, data).then((resp) => {
          //console.log(resp);return
          if (resp.code === 200) {
            if (resp.data) {
              var arr = resp.data, newData = [], obj = {};
              for (var i = 0; i < arr.length; i++) {

                obj = arr[i]
                obj['edit'] = false;
                obj['status'] = obj['status'] === 1;
                newData.push(obj)
              }
              this.role_list = newData;
              this.total = resp.page.TotalSize
            } else {
              this.role_list = [];
              this.total = 0
            }
          } else {
            this.msgTip(resp.msg)
          }

        }).catch((error) => {
          if (error !== 'loginErr') {
            console.log(error);
            this.msgTip('系统繁忙，请稍后重试')
          }
        })
      },

      getAuths() {

        this.$http.get(`${this.url}/admin_permission`).then(resp => {
          if (resp.code === 200) {
            if (resp.data) {
              let cloneData = JSON.parse(JSON.stringify(resp.data))    // 对源数据深度克隆
              let treeData =  cloneData.filter(father=>{
                let branchArr = cloneData.filter(child=>father.id === child.parent_id)    //返回每一项的子级数组
                branchArr.length>0 ? father.auth2_list = branchArr : ''   //如果存在子级，则给父级添加一个children属性，并赋值
                return father.parent_id === 1;      //返回第一层
              });
              let newData = [],obj = {};
              for(var i=0;i<treeData.length;i++) {
                obj = treeData[i]
                obj['id'] = 'p'+obj['id'];
                if(treeData[i]['auth2_list'] !== undefined) {
                  for(var j=0;j<obj['auth2_list'].length;j++) {
                    obj['auth2_list'][j]['id'] = 'c'+obj['auth2_list'][j]['id'];
                  }
                }
                newData.push(obj)
              }
              this.auths = newData;
             // console.log(resp.data);
            } else {
              this.auths = [];
            }
          } else {
            this.$message({
              message:resp.msg,
              type:'error',
              center:true
            })
          }
        })
      }
    },

    created() {
      this.getList()
      if (JSON.stringify(this.$store.state.user.per).includes('system/index')) {
        this.getAuths()
        console.log('有权限')
      }else{
        console.log('没权限')
      }

    }
  }
</script>
