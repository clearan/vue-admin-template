/* eslint-disable */
<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Login Form</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">Login</el-button>

      <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import qs from 'qs'
import {LocalStorage} from '@/utils/storage'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        // password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  methods: {
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      // let date = new Date().getTime();
      // LocalStorage.set("token", '111', date + 20*60*1000);
      // this.$router.push({ path: this.redirect || '/' })
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          let data={
            account:this.loginForm.username,
            login_password:this.loginForm.password
          }
          this.$http.post(`${this.url}/login`,qs.stringify(data)).then( resp => {
            this.loading = false

            if( resp.code === 200 ) {
              let date = new Date().getTime();
              LocalStorage.set("token", resp.data.token, date + 60*60*1000);
              LocalStorage.set("base", resp.data.base, date+10000*60*60*1000)
              //console.log(LocalStorage.get('token'))
              if (resp.data.permission) {
                //console.log(resp);return
                this.getTree(resp.data.permission,date)
                this.$router.push({ path: this.redirect || '/' ,query: this.otherQuery})
              } else {
                //管理员
                this.$router.push({ path: this.redirect || '/' ,query: this.otherQuery})
                //this.getAllAuths(date);
              }
            } else {
              this.$message({
                message:resp.msg,
                type:'error',
                center:true
              })
            }

          }).catch( err => {
            this.loading = false
            console.log(err)
          })

        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getTree(data,date) {
      let cloneData = JSON.parse(JSON.stringify(data))
      let treeData =  cloneData.filter(father=>{
        let branchArr = cloneData.filter(child=>father.id === child.parent_id && child.type === 2)    //返回每一项的子级数组
        branchArr.length>0 ? father.auth2_list = branchArr : ''   //如果存在子级，则给父级添加一个auth2_list属性，并赋值
        return father.parent_id === 1 && father.status === 1 && father.type === 1;      //返回第一层
      });
      let bp = []
      cloneData.forEach( item => {
        if (item.type === 3) {
          bp.push(item.permission_path)
        }
      })
      LocalStorage.set('permission',treeData,date + 10000*60*60*1000)
      LocalStorage.set('bp',bp,date + 10000*60*60*1000)
    },

    getAllAuths(date) {
      //将结果显示在左侧菜单页。
      //一级菜单：type=1 && status=1
      //二级菜单：type=2 && status=1
      let data = {
        parent_id:1,
        request_param:'GET'
      }
      this.$http.get(`${this.url}/admin_permission`,data).then( resp =>{
        //console.log(resp)
        if (resp.code === 200) {
          if (resp.data) {
            this.getTree(resp.data,date)
            this.$router.push({ path: this.redirect || '/' ,query: this.otherQuery})
            //其实到了处理一般角色的时候 也是存权限到storage
          }
        }else{
          alert('获取信息失败')
        }
      })
    }

  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
