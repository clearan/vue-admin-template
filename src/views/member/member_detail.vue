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
        <el-date-picker
          v-model="value1"
          type="date"
          value-format="timestamp"
          placeholder="选择开始日期">
        </el-date-picker>

        <span>至</span>

        <el-date-picker
          v-model="value2"
          type="date"
          value-format="timestamp"
          placeholder="选择结束日期">
        </el-date-picker>

        <el-button  class="filter-item" type="primary" style="margin-left: 10px;margin-top: 9px" icon="el-icon-search" @click="getList" :loading="search_loading">
          搜索
        </el-button>
      </div>

      <el-table
        :data="tableData"
        style="width: 100%"
        default-expand-all
        border
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="订阅任务总量">
                <span>{{ props.row.task_subscribe_count }}</span>
              </el-form-item>
              <el-form-item label="订阅任务金额">
                <span>{{ props.row.task_subscribe_money_sum }}</span>
              </el-form-item>
              <el-form-item label="成功任务量">
                <span>{{ props.row.task_subscribe_status_success_count }}</span>
              </el-form-item>
              <el-form-item label="失败任务量">
                <span>{{ props.row.task_subscribe_status_failure_count }}</span>
              </el-form-item>
              <el-form-item label="进行中任务量">
                <span>{{ props.row.task_subscribe_status_wait_count }}</span>
              </el-form-item>
              <el-form-item label="充值次数">
                <span>{{ props.row.user_deposit_count }}</span>
              </el-form-item>
              <el-form-item label="充值金额">
                <span>{{ props.row.user_deposit_money_sum }}</span>
              </el-form-item>
              <el-form-item label="最大充值金额">
                <span>{{ props.row.user_deposit_money_max }}</span>
              </el-form-item>
              <el-form-item label="人工存款总额">
                <span>{{ props.row.user_deposit_manual_money_sum }}</span>
              </el-form-item>
              <el-form-item label="人工存款笔数">
                <span>{{ props.row.user_deposit_manual_money_count }}</span>
              </el-form-item>
              <el-form-item label="人工存款最大额度">
                <span>{{ props.row.user_deposit_manual_money_max }}</span>
              </el-form-item>
              <el-form-item label="取款次数">
                <span>{{ props.row.user_withdraw_count }}</span>
              </el-form-item>
              <el-form-item label="取款金额">
                <span>{{ props.row.user_withdraw_money_sum }}</span>
              </el-form-item>
              <el-form-item label="最大取款金额">
                <span>{{ props.row.user_withdraw_money_max }}</span>
              </el-form-item>
              <el-form-item label="人工扣款金额">
                <span>{{ props.row.user_withdraw_manual_money_sum }}</span>
              </el-form-item>
              <el-form-item label="人工扣款笔数">
                <span>{{ props.row.user_withdraw_manual_money_count }}</span>
              </el-form-item>
              <el-form-item label="人工扣款最大额度">
                <span>{{ props.row.user_withdraw_manual_money_max }}</span>
              </el-form-item>

              <el-form-item label="发布任务限制时间">
                <span>{{ props.row.publish_status }}</span>
              </el-form-item>
              <el-form-item label="接受任务限制时间">
                <span>{{ props.row.subscribe_status }}</span>
              </el-form-item>
              <el-form-item label="提现限制时间">
                <span>{{ props.row.withdraw_status }}</span>
              </el-form-item>
              <el-form-item label="发送消息限制时间">
                <span>{{ props.row.message_status }}</span>
              </el-form-item>
              <el-form-item label="登陆限制时间">
                <span>{{ props.row.login_status }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="发布任务数"
          prop="task_publish_count">
        </el-table-column>
        <el-table-column
          label="发布任务金额"
          prop="task_publish_money_sum">
        </el-table-column>
        <el-table-column
          label="做单人数"
          prop="task_publish_accept_count">
        </el-table-column>
        <el-table-column
          label="已成功人数"
          prop="task_publish_success_accept_count">
        </el-table-column>
        <el-table-column
          label="发布结束任务数"
          prop="task_publish_end_count">
        </el-table-column>
        <el-table-column
          label="发布成功任务数"
          prop="task_publish_success_count">
        </el-table-column>
        <el-table-column
          label="发布子任务数"
          prop="task_publish_children_count">
        </el-table-column>
        <el-table-column
          label="发布子任务失败数"
          prop="task_publish_children_failure_count">
        </el-table-column>
        <el-table-column
          label="发布子任务成功数"
          prop="task_publish_children_success_count">
        </el-table-column>
        <el-table-column
          label="发布子任务进行数"
          prop="task_publish_children_wait_count">
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <el-link
            type="primary"
            size="medium"
            @click="handleEdit()"
          >
            编辑
          </el-link>
        </el-table-column>
      </el-table>

      <el-table
        border fit highlight-current-row style="width: 100%;margin-top: 20px"
        :data="banList"
        row-key="Id">
        <el-table-column
          align="center"
          prop="action_admin_name"
          label="操作人"
        >
          <template slot-scope="{row}">
            {{ row.action_admin_name }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="会员账户"
        >
          <template slot-scope="{row}">
            {{row.phone}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="image"
          label="凭据"
        >
          <template slot-scope="{row}">
            {{ row.image }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="login_status"
          label="登陆状态"
        >
          <template slot-scope="{row}">
            {{row.login_status}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="message_status"
          label="发信息状态"
        >
          <template slot-scope="{row}">
            {{row.message_status}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="publish_status"
          label="发任务状态"
        >
          <template slot-scope="{row}">
            {{row.publish_status}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="subscribe_status"
          label="接任务状态"
        >
          <template slot-scope="{row}">
            {{row.subscribe_status}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="withdraw_status"
          label="取款状态"
        >
          <template slot-scope="{row}">
            {{row.withdraw_status}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="remark"
          label="备注"
        >
          <template slot-scope="{row}">
            {{row.remark}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="created_at"
          label="操作时间"
        >
          <template slot-scope="{row}">
            {{row.created_at|formatDate}}
          </template>
        </el-table-column>

      </el-table>
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
  import {LocalStorage} from '@/utils/storage'
  import {formatDate} from '@/utils/date'
  export default {
    data() {
      return {
        value1:'',
        value2:'',
        search_loading:false,
        tableData: [],
        select:{
          publish_status:'',
          subscribe_status:'',
          withdraw_status:'',
          message_status:'',
          login_status:''
        },
        dialogVisibleEdit:false,
        id:undefined,
        remark:'',
        imageUrl: '',
        image: '',
        banList:[],
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
      //时间戳
      formatDate(time) {
        return formatDate(time);
      },
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
            this.dialogVisibleEdit= false
            this.getList()
          }else{
            this.msgTip(resp.msg)
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
            this.tableData[0][type] = dd + "天" + hh + "时" + mm + "分" + ss + "秒"
          } else {
            this.tableData[0][type] = "正常"
          }
        }, 1000);
      },

      checkTime() {
        if(this.value1 && this.value2 && this.value1 > this.value2) {
          this.msgTip('开始日期不能大于结束日期')
          return false
        }
        return true
      },

      getList() {
        if(this.checkTime()) {
          let data = {
            start_time:this.value1 ? new Date(this.value1).toLocaleDateString() :undefined,
            end_time:this.value2 ? new Date(this.value2).toLocaleDateString() :undefined,
            user_id:this.id
          };

          this.$http.get(`${this.url}/user_info`,data).then(resp => {
            if (resp.code === 200) {
              this.tableData = resp.data
              //this.tableData[0].publish_status = 1584680900
              this.tableData[0].publish_status = this.tableData[0].publish_status === 1 ? '正常' : this.tableData[0].publish_status === -1 ? '永久' :
                this.compute_time(this.tableData[0].publish_status-resp.time,'publish_status')
              this.tableData[0].subscribe_status = this.tableData[0].subscribe_status === 1 ? '正常' : this.tableData[0].subscribe_status === -1 ? '永久' :
                this.compute_time(this.tableData[0].subscribe_status-resp.time,'subscribe_status')
              this.tableData[0].withdraw_status = this.tableData[0].withdraw_status === 1 ? '正常' : this.tableData[0].withdraw_status === -1 ? '永久' :
                this.compute_time(this.tableData[0].withdraw_status-resp.time,'withdraw_status')
              this.tableData[0].message_status = this.tableData[0].message_status === 1 ? '正常' : this.tableData[0].message_status === -1 ? '永久' :
                this.compute_time(this.tableData[0].message_status-resp.time,'message_status')
              this.tableData[0].login_status = this.tableData[0].login_status === 1 ? '正常' : this.tableData[0].login_status === -1 ? '永久' :
                this.compute_time(this.tableData[0].login_status-resp.time,'login_status')
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

      banCompute(val) {
        switch (val) {
          case -1:
            return '永久'
          case 1:
            return '正常'
          default:
            return this.banResult(val)
        }
      },

      banResult(val) {
        let dd = Math.floor(val / 60 / 60 / 24);//天
        let hh = Math.floor((val / 60 / 60) % 24);//时

        if (dd) return dd+'天'
        if (hh) return hh+'小时'
      },

      getBan() {
        let data = {
          user_id:this.id
        };

        this.$http.get(`${this.url}/user_action_logs`,data).then(resp => {
          if (resp.code === 200) {
            if (resp.data) {
              let copyData = JSON.parse(JSON.stringify(resp.data))
              Date.prototype.toLocaleString = function() {
                return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
              };
              copyData.forEach(item => {
                //item.created_at = item.created_at ? new Date(item.created_at).toLocaleString():'-'
                item.created_at = item.created_at ? new Date(item.created_at).getTime():'-'
                item.login_status = this.banCompute(item.login_status)
                item.message_status = this.banCompute(item.message_status)
                item.publish_status = this.banCompute(item.publish_status)
                item.subscribe_status = this.banCompute(item.subscribe_status)
                item.withdraw_status = this.banCompute(item.withdraw_status)
              })
              this.banList = copyData
            } else {
              this.banList = []
            }
          } else {

          }
        })
      }
    },

    created() {
      this.id = this.$route.query.id
      this.getList()
      this.getBan()
    }
  }
</script>

<style>
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

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 125px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 25%;
  }
</style>
