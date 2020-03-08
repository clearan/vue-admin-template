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
            :data="data"
            style="width: 100%">
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
            :data="data1"
            style="width: 60%">
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
            :data="data2"
            style="width: 60%">
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
            :data="data3"
            style="width: 60%">
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
            :data="data4"
            style="width: 60%">
            <el-table-column
              align="center"
              prop="date"
              label="发任务"
              min-width="35%">
              <template slot-scope="{row}">
                {{row.a}}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="接任务"
              min-width="35%">
              <template slot-scope="{row}">
                {{row.b}}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="发消息"
              min-width="35%">
              <template slot-scope="{row}">
                {{row.a}}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="提现"
              min-width="35%">
              <template slot-scope="{row}">
                {{row.a}}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="登录"
              min-width="35%">
              <template slot-scope="{row}">
                {{row.a}}
              </template>
            </el-table-column>

            <el-table-column
              align="center"
              label="操作"
              min-width="35%">
              <template slot-scope="{row}">
                更多
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
      </el-tabs>











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

                data:[],
                data1:[
                  {a:10,b:10,c:'-'},
                  {a:20,b:20,c:20},
                  {a:30,b:30,c:30},
                ],
                data2:[
                  {a:10,b:10}
                ],
                data3:[
                  {a:10,b:10},
                  {a:50,b:60},
                ],
                data4:[
                  {a:10,b:10},
                  {a:50,b:60},
                ],
                detail:{
                    mch_phone_num:'11111111111',
                    context:'',
                    total:321321,
                    send:323,
                    suc:232323,
                    fail:323232,
                    state:undefined
                },
                id:undefined,
                mch_id:undefined,
            }
        },

        filters:{

            //金额千分化
            formatMoney(money) {
                return formatMoney(money)
            }
        },

        methods:{

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
                    this.detail.total = 0;
                    return;
                }

                let data = {
                  user_id:this.id
                };

                this.$http.get(`${this.url}/user_info`,data).then(resp=>{

                    // if (resp.code === 200) {
                    //     this.mch_id = resp.ret_data.data_list[0].mch_id
                    //     this.detail.mch_phone_num = resp.ret_data.data_list[0].mch_phone_num
                    //     this.detail.context = resp.ret_data.data_list[0].context
                    //     this.detail.state = resp.ret_data.data_list[0].state
                    //
                    //     this.detail.total = resp.ret_data.data_list[0].target_num
                    //     this.detail.send = resp.ret_data.data_list[0].successful+resp.ret_data.data_list[0].failure
                    //     this.detail.suc = resp.ret_data.data_list[0].successful
                    //     this.detail.fail = resp.ret_data.data_list[0].failure
                    // } else {
                    //     this.$message({
                    //         message:resp.msg,
                    //         type:'error',
                    //         center:true
                    //     })
                    // }
                })
            },

            onSubmit() {

                if (this.detail.context.replace(/\s/g,"").length === 0) {
                    this.msgTip('短信内容不能为空')
                    return false
                }

                let data = {
                    self_id: LocalStorage.get('self_id'),
                    idempotent: new Date().getTime(),
                    sess: LocalStorage.get('sess'),
                    id:this.id,
                    context:this.detail.context
                };
                this.$http.post(`${this.url}/mod_mission`,qs.stringify(data)).then((resp)=>{
                    if (resp.ret_code === 0) {
                        this.$message({
                            message:'修改成功',
                            type:'success',
                            center:true
                        })
                        setTimeout(()=>{
                            window.location.reload();
                        },1000)
                    }else{
                        this.msgTip(resp.ret_msg)
                    }
                }).catch((error)=>{
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
        },

        created() {
            this.id = this.$route.query.id
            this.getList()
        }
    }

</script>

<style scoped>
/deep/ .el-form-item{
  margin: 0 20px;
}
</style>



