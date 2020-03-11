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

      <el-steps
        :active="active"
        :space="500"
        finish-status="success"
        align-center
        style="margin-top: 30px"
      >
        <el-step title="添加角色"></el-step>
        <el-step title="配置权限"></el-step>
        <el-step title="配置成功"></el-step>
      </el-steps>

      <el-form ref="onePerForm" :model="onePerForm" :rules="onePerRules"  v-if="active===1">

        <div style="display: flex;flex-direction: column;align-items: center;margin-top: 50px">

          <el-form-item   style="width: 600px" prop="Oname">
            <el-input  maxlength="10"  placeholder="请填写角色名称" v-model="onePerForm.Oname"/>
          </el-form-item>


          <el-form-item   style="width: 600px;margin-top: 20px" prop="Odesc">
            <el-input  maxlength="20" :rows="4" placeholder="请填写描述信息" type="textarea" v-model="onePerForm.Odesc"/>
          </el-form-item>

          <el-form-item style="width: 600px;margin-top: 20px">
            <el-button type="primary"  style="width: 100%" @click="toConfig" >下一步</el-button>
          </el-form-item>
        </div>

      </el-form>

      <el-form   v-if="active===2">
        <div style="display: flex;flex-direction: column;align-items:center;margin-top: 50px">
          <el-form-item>
            <el-tree
              ref="tree"
              :data="permit_tree"
              :props="defaultProps"
              show-checkbox
              node-key="id"
              class="permission-tree"
              default-expand-all
            />
          </el-form-item>
          <el-form-item >
            <el-button type="primary"   @click="configSubmit">下一步</el-button>
          </el-form-item>
        </div>

      </el-form>

      <el-form v-if="active===3">
        <div style="display: flex;flex-direction: column;align-items: center;margin-top: 50px">
          <el-alert style="width:50%;height: 200px"
                    :closable="closable"
                    center
                    title="您已成功配置角色"
                    type="success"
                    show-icon>
          </el-alert>
          <el-button type="success"   @click="toList" style="width: 10%;margin-top: 30px">完成</el-button>
        </div>
      </el-form>
    </div>
  </div>

</template>
<script>

    import qs from 'qs'
    export default {
        name:'Add',
        data() {

            return {
                closable:false,
                active: 1,
                onePerForm: {
                    Oname:'',
                    Odesc:'',
                },

                permit_tree:[],
                defaultProps: {
                    children: 'auth2_list',
                    label: 'permission_name'
                },
                onePerRules: {
                    Oname: [{ required: true, trigger: 'blur', message:'请输入角色名称'},
                      { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }]
                },
                role_id: '',
            };
        },

        methods: {

            toConfig() {
                var _this = this
                var data = {
                  role_name: _this.onePerForm.Oname,
                  remark:  _this.onePerForm.Odesc,
                  status:1,
                  request_param:'POST',
                }
                _this.$refs.onePerForm.validate(valid => {
                    if(valid) {
                        _this.$http.post(`${this.url}/admin_role`,qs.stringify(data)).then((resp)=>{
                            if(resp.code === 200) {
                                //返回的role_id
                                this.role_id = resp.data
                                this.active++;
                            }else {
                                _this.$message({
                                    message:resp.msg,
                                    type:'error',
                                    center:true
                                })
                            }
                        }).catch((error)=>{
                            if (error !== 'loginErr') {
                                console.log(error);
                                _this.$message({
                                    message:'系统繁忙，请稍后重试',
                                    type:'error',
                                    center:true
                                })
                            }
                        })
                    }else {
                        console.log('error submit!!')
                    }
                })
            },

            configSubmit() {
                if(this.permit_tree.length === 0) {
                    this.$message({
                        message:'请先配置权限',
                        type:'error',
                        center:true
                    })
                }else{
                    const checkedKeys = this.$refs.tree.getCheckedKeys()
                    const half = this.$refs.tree.getHalfCheckedKeys()
                    const allChecked = checkedKeys.concat(half)
                    if(allChecked.length === 0) {
                        this.$message({
                            message:'请勾选权限',
                            type:'error',
                            center:true
                        })
                    }else{
                        console.log(allChecked);
                        let json = allChecked.map( item => {
                          let newItem = {'id':parseInt(item.substr(1))}
                          return newItem
                        })

                        let data = {
                          permission_ids: JSON.stringify(json),
                          status: 1,
                          role_id: this.role_id,
                          request_param:'PUT',
                        };
                        console.log(this.role_id)
                        // if(newData.length > 0) {
                        //     data['auth_list'] = JSON.stringify(newData)
                        // }

                        this.$http.put(`${this.url}/admin_role_permission`,qs.stringify(data)).then((resp)=>{

                            if(resp.code === 200) {
                                this.active++;
                            }else {
                                this.$message({
                                    message:resp.msg,
                                    type:'error',
                                    center:true
                                })
                            }
                        }).catch((error)=>{
                            if (error !== 'loginErr') {
                                console.log(error);
                                this.$message({
                                    message:'系统繁忙，请稍后重试',
                                    type:'error',
                                    center:true
                                })
                            }
                        })
                    }


                }
            },

            toList() {
                setTimeout(()=>{
                    this.$router.push('role_list')
                },1000)
            },

            getAuthTree() {

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
                    this.permit_tree = newData;
                  } else {
                    this.permit_tree = [];
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
            this.getAuthTree()
        }
    }
</script>


<style scoped>
  /deep/ .el-steps{
    justify-content: center;
  }
  /deep/.el-alert__icon.is-big {
    font-size: 55px;
    width: 22px;
  }
  /deep/.el-alert__content {
    display: table-cell;
    padding: 0 51px;
  }
  /deep/.el-alert__icon {
    font-size: 50px;
    width: 16px;
  }
</style>

