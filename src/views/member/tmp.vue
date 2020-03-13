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
      <el-tabs v-model="activeName" type="card" >
        <el-tab-pane label="基础信息" name="first">
          <el-table
            border fit highlight-current-row
            :data="basic"
            style="width: 100%;margin: 20px 0">
            <el-table-column
              align="center"
              label="ID"
            >
              <template slot-scope="{row}">
                {{row.user_id}}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="用户名"
            >
              <template slot-scope="{row}">
                {{row.username}}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="直属上级">
              <template slot-scope="{row}">
                {{row.user_parent_id}}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="电话"
            >
              <template slot-scope="{row}">
                {{row.phone}}
              </template>
            </el-table-column>


            <el-table-column
              align="center"
              label="下级个数"
            >
              <template slot-scope="{row}">
                {{row.user_childrer_count}}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="登陆次数"
            >
              <template slot-scope="{row}">
                {{row.login_count}}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="注册时间"
            >
              <template slot-scope="{row}">
                {{row.created_at}}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="任务信息" name="second">
          <el-table
            border fit highlight-current-row
            :data="mission"
            style="width: 60%;margin: 20px 0">
            <el-table-column
              align="center"
              width="100%"
              type="index"
              :index="indexMethod">

            </el-table-column>
            <el-table-column
              align="center"
              label="任务数"
              min-width="10%">
              <template slot-scope="{row}">
                {{row.a}}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="任务量"
              min-width="10%">
              <template slot-scope="{row}">
                {{row.b}}
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              min-width="10%"
              label="接单数">
              <template slot-scope="{row}">
                {{row.c}}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="佣金" name="third">
          <el-table
            border fit highlight-current-row
            :data="money"
            style="width: 60%;margin: 20px 0">
            <el-table-column
              align="center"
              type="index"
              width="100%"
              :index="indexMethod2">
            </el-table-column>
            <el-table-column
              align="center"
              prop="date"
              label="任务"
              min-width="35%">
              <template slot-scope="{row}">
                {{row.a}}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              prop="name"
              label="推广"
              min-width="35%">
              <template slot-scope="{row}">
                {{row.b}}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="钱包" name="fourth">
          <el-table
            border fit highlight-current-row
            :data="bag"
            style="width: 60%;margin: 20px 0">
            <el-table-column
              align="center"
              type="index"
              width="100%"
              :index="indexMethod3">
            </el-table-column>
            <el-table-column
              align="center"
              prop="date"
              label="任务钱包"
              min-width="35%">
              <template slot-scope="{row}">
                {{row.a}}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              prop="name"
              label="主钱包"
              min-width="35%">
              <template slot-scope="{row}">
                {{row.b}}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="解/封禁" name="five">
          <el-table
            border fit highlight-current-row
            :data="conf"
            style="width: 60%;margin: 20px 0">
            <el-table-column
              align="center"
              prop="date"
              label="发任务"
              min-width="35%">
              <template slot-scope="{row}">
                <span v-if="row.a===1">正常</span>
                <span v-else>{{row.a}}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="接任务"
              min-width="35%">
              <template slot-scope="{row}">
                <span v-if="row.b===1">正常</span>
                <span v-else>{{row.b}}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="提现"
              min-width="35%">
              <template slot-scope="{row}">
                <span v-if="row.c===1">正常</span>
                <span v-else>{{row.c}}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="发消息"
              min-width="35%">
              <template slot-scope="{row}">
                <span v-if="row.d===1">正常</span>
                <span v-else>{{row.d}}</span>
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="登录"
              min-width="35%">
              <template slot-scope="{row}">
                {{row.e}}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="操作"
              min-width="35%">
              <template slot-scope="{row}">
                <el-link
                  type="primary"
                  size="small"
                  @click="handleEdit(row)"
                >
                  更多
                </el-link>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
      </el-tabs>

      <el-dialog :visible.sync="dialogVisibleEdit" title="编辑" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form  label-width="90px" ref="edit"  label-position="left" :inline="true">

          <el-form-item label="禁止发任务" >
            <el-select v-model="select.publish_status" placeholder="请选择">
              <el-option
                v-for="item in states"
                :key="item.val"
                :label="item.name"
                :value="item.val"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="禁止接任务">
            <el-select v-model="select.subscribe_status" placeholder="请选择">
              <el-option
                v-for="item in states"
                :key="item.val"
                :label="item.name"
                :value="item.val"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="禁止提现">
            <el-select v-model="select.withdraw_status" placeholder="请选择">
              <el-option
                v-for="item in states"
                :key="item.val"
                :label="item.name"
                :value="item.val"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="禁止发消息">
            <el-select v-model="select.message_status" placeholder="请选择">
              <el-option
                v-for="item in states"
                :key="item.val"
                :label="item.name"
                :value="item.val"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="禁止登录">
            <el-select v-model="select.login_status" placeholder="请选择">
              <el-option
                v-for="item in states"
                :key="item.val"
                :label="item.name"
                :value="item.val"
              >
              </el-option>
            </el-select>
          </el-form-item>

        </el-form>
        <el-form>
          <el-form-item label="备注:">
            <el-input
              v-model="remark"
              :autosize="{ minRows: 2, maxRows: 4}"
              type="textarea"
              maxLength="70"
              style="width: 40%;"
            />
          </el-form-item>

          <el-form-item label="凭据:">
            <el-upload
              class="avatar-uploader"
              action="#"
              :http-request="httpRequest"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

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

  import Pagination from '@/components/Pagination'
  import {LocalStorage} from '@/utils/storage'
  import {formatMoney} from '@/utils/money'
  import qs from 'qs'
  export default {
    components: { Pagination },
    data() {
      return {
        activeName:'first',
        remark:'',
        imageUrl: '',
        image: '',
        basic:[
          {user_id:'',username:'',user_parent_id:'',phone:'',user_childrer_count:'',login_count:'',created_at:''},
        ],
        mission:[
          {a:'',b:'',c:''},
          {a:'',b:'',c:''},
          {a:'',b:'',c:''},
        ],
        money:[
          {a:'',b:''}
        ],
        bag:[
          {a:'',b:''},
          {a:'',b:''},
        ],
        conf:[
          {a:'',b:'',c:'',d:'',e:''},
        ],
        select:{
          publish_status:'',
          subscribe_status:'',
          withdraw_status:'',
          message_status:'',
          login_status:''
        },
        dialogVisibleEdit:false,
        id:undefined,
      }
    },

    computed:{

      states() {
        return this.$store.state.user.config['user_action_status'].map(item=>{
          return {val:item.value,name:item.name}
        })
      },


    },

    filters:{

      //金额千分化
      formatMoney(money) {
        return formatMoney(money)
      }
    },

    methods:{

      beforeAvatarUpload (file) {

        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 1
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 1MB!')
        }
        return isJPG && isLt2M
      },

      httpRequest (data) {
        let _this = this
        let rd = new FileReader() // 创建文件读取对象
        let file = data.file
        this.image = file
        rd.readAsDataURL(file) // 文件读取装换为base64类型
        rd.onloadend = function (e) {
          _this.imageUrl = this.result // this指向当前方法onloadend的作用域
        }
      },


      handleEdit(row){
        if (!LocalStorage.get('bp').includes('member/member_ban')) {
          this.msgTip('您没有此权限')
          return
        }

        this.select.login_status=''
        this.select.message_status=''
        this.select.publish_status=''
        this.select.subscribe_status=''
        this.select.withdraw_status=''
        this.dialogVisibleEdit = true
      },

      submitEdit() {
        let flag = false
        for(let i in this.select) {
          if (this.select[i] === '') {
            flag = true;
            break;
          }
        }

        if (flag) {
          this.msgTip('请进行下拉选择')
          return
        }

        let data = new FormData()
        data.append('user_id',this.id)
        data.append('login_status',this.select.login_status)
        data.append('message_status',this.select.message_status)
        data.append('publish_status',this.select.publish_status)
        data.append('subscribe_status',this.select.subscribe_status)
        data.append('withdraw_status',this.select.withdraw_status)
        data.append('remark',this.remark)
        data.append('image',this.image)

        this.$http.patch(`${this.url}/user`,data).then( resp => {
          if (resp.code === 200) {
            this.$message({
              message:'成功',
              type:'success',
              center:true
            });
            setTimeout(() => {
              window.location.reload()
            },1000)
          }else{
            this.msgTip(resp.msg)
          }
        })
      },

      indexMethod(index){
        switch (index) {
          case 0:
            return '发布';
          case 1:
            return '进行中';
          default:
            return '结束'
        }
      },

      indexMethod2(index){
        if (index ===0) return '佣金'
      },

      indexMethod3(index){
        return index ===1 ?'提现':'收益'
      },

      getList() {

        if (this.id === undefined || this.id === '') {
          this.msgTip('id无效');
          return;
        }

        let data = {
          user_id:this.id
        };

        this.$http.get(`${this.url}/user_info`,data).then(resp=>{

          if (resp.code === 200) {
            if (resp.data.length>0){
              this.basic[0].user_id = resp.data[0].user_id
              this.basic[0].username = resp.data[0].username
              this.basic[0].user_parent_id = resp.data[0].user_parent_id
              this.basic[0].phone = resp.data[0].phone
              this.basic[0].user_childrer_count = resp.data[0].user_childrer_count
              this.basic[0].login_count = resp.data[0].login_count
              this.basic[0].created_at = resp.data[0].created_at

              this.mission[0].a = resp.data[0].task_pub_count
              this.mission[0].b = resp.data[0].task_pub_childrer_count
              this.mission[0].c = '-'
              this.mission[1].a = resp.data[0].task_pub_wait_count
              this.mission[1].b = resp.data[0].task_pub_wait_childrer_count
              this.mission[1].c = resp.data[0].task_sub_wait_count
              this.mission[2].a = resp.data[0].task_pub_end_count
              this.mission[2].b = resp.data[0].task_pub_end_childrer_count
              this.mission[2].c = resp.data[0].task_sub_end_count

              this.money[0].a = resp.data[0].comission_task_sum
              this.money[0].b = resp.data[0].comission_promotion_sum

              this.bag[0].a = resp.data[0].deposit_task_sum
              this.bag[0].b = resp.data[0].deposit_master_sum
              this.bag[1].a = resp.data[0].withdraw_task_sum
              this.bag[1].b = resp.data[0].withdraw_master_sum

              this.conf[0].a =resp.data[0].publish_status === 1 ? '正常' :this.compute_time(resp.data[0].publish_status-resp.time,'a')
              this.conf[0].b =resp.data[0].subscribe_status === 1 ? '正常' :this.compute_time(resp.data[0].subscribe_status-resp.time,'b')
              this.conf[0].c =resp.data[0].withdraw_status === 1 ? '正常' :this.compute_time(resp.data[0].withdraw_status-resp.time,'c')
              this.conf[0].d =resp.data[0].message_status === 1 ? '正常' :this.compute_time(resp.data[0].message_status-resp.time,'d')
              this.conf[0].e =resp.data[0].login_status === 1 ? '正常' :this.compute_time(resp.data[0].login_status-resp.time,'e')
            }else{
              this.basic = []
            }

          } else {
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

      compute_time(rightTime,type) {
        setInterval(() => {
          if (rightTime > 0) {
            rightTime--
            if (rightTime === 1) {
              clearInterval(rightTime)
            }
            let dd = Math.floor(rightTime / 60 / 60 / 24);
            let hh = Math.floor((rightTime / 60 / 60) % 24);
            let mm = Math.floor((rightTime / 60) % 60);
            let ss = Math.floor(rightTime % 60);
            this.conf[0][type] = dd + "天" + hh + "时" + mm + "分" + ss + "秒"
          } else {
            this.conf[0][type] = "正常"
          }
        }, 1000);
      },

    },

    created() {
      this.id = this.$route.query.id
      this.getList()
    }
  }

</script>

<style >
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>



