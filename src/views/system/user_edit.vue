<template>
  <div style="
    border: 1px solid #ebeef5;
    background-color: #fff;
    color: #303133;
    transition: .3s;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,0.1);
    min-height: 798px;">

    <div class="app-container">

      <el-form label-width="120px" style="width:40%">
        <el-form-item label="账号名称" >
          <el-input  v-model="user.account" readonly />
        </el-form-item>

        <el-form-item label="昵称" >
          <el-input  v-model="user.nick_name" />
        </el-form-item>

        <el-form-item label="登陆密码" >
          <el-input  v-model="user.login_password" type="password"/>
        </el-form-item>

        <el-form-item label="角色名称">

          <el-select v-model="role.role_id" placeholder="请选择">
            <el-option
              v-for="item in role_arr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio v-model="user.status" label="1">开启</el-radio>
          <el-radio v-model="user.status" label="2">禁用</el-radio>
        </el-form-item>

        <el-form-item label="注册时间">
          <el-input  v-model="user.created_at" readonly/>
        </el-form-item>

        <el-form-item>
          <el-button  type="primary" @click="resetSubmit">更新账号</el-button>
        </el-form-item>

      </el-form>

    </div>

  </div>

</template>

<script>

    import {formatDate} from '@/utils/date'
    import {LocalStorage} from '@/utils/storage'
    import qs from 'qs'
    import QRCode from 'qrcode'

    export default {
        name:'List',
        data() {
            return {
                user:{
                    account:'',
                    nick_name:'',
                    created_at:'',
                    login_password:'',
                    status:''
                },
                role:{
                    role_id:''
                },
                role_arr:[]
            }
        },

        methods: {

            resetSubmit() {

              if (this.user.login_password ==='') {
                this.$message({
                  message:'密码不能为空',
                  type: 'error',
                  center: true
                })
                return
              }

              if (this.role.role_id === undefined || this.role.role_id === '') {
                this.$message({
                  message:'请选择角色',
                  type: 'error',
                  center: true
                })
                return;
              }

              let obj  = this.role_arr.filter(item => {
                return this.role.role_id === item.id
              })

              let data = {
                  id:parseInt(this.$route.query.id),
                  role_id:obj[0].id,
                  role_name:obj[0].name,
                  nick_name:this.user.nick_name,
                  login_password:this.user.login_password,
                  status:parseInt(this.user.status),
                  request_param:'PUT'
              }

              var _this = this;
              _this.$http.put(`${this.url}/admin`,qs.stringify(data)).then((resp)=>{
                  console.log(resp)
                  if (resp.code === 200) {
                      _this.$message({
                        message:'更新成功',
                        type:'success',
                        center:true
                      });
                      setTimeout(() => {
                        window.location.reload()
                      },1000)
                  } else {
                      _this.$message({
                          message:resp.msg,
                          type: 'error',
                          center: true
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
            }
        },


        created() {

            let data = {
              id: this.$route.query.id,
              request_param:'GET'
            }

            var _this = this
            _this.$http.get(`${_this.url}/admin`,data).then(resp=>{

                if(resp.code === 200) {
                    _this.user.account = resp.data ? resp.data[0].account : ''
                    _this.user.nick_name = resp.data ? resp.data[0].nick_name : ''
                    _this.user.created_at = resp.data ? resp.data[0].created_at : ''
                    _this.user.login_password = resp.data ? resp.data[0].login_password : ''
                    _this.user.status = resp.data ? String(resp.data[0].status) : ''
                    _this.role.role_id = resp.data ? resp.data[0].role_id : ''
                }else {
                    _this.$message({
                        message:resp.ret_msg,
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
        }
    }
</script>
