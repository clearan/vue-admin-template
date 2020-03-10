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
        <el-button   type="primary" icon="el-icon-edit" style="margin-bottom: 15px" @click="editConf" v-if="!flag_btn">
          更新
        </el-button>

        <el-button
          style="margin-bottom: 15px"
          v-if="flag_btn"
          class="cancel-btn"
          size="small"
          icon="el-icon-refresh"
          type="warning"
          @click="cancelBtn"
        >
          取消
        </el-button>
        <el-button
          style="margin-bottom: 15px"
          v-if="flag_btn"
          class="cancel-btn"
          size="small"
          icon="el-icon-circle-check-outline"
          type="success"
          :loading="submit_loading"
          @click="submitBtn"
        >
          确定
        </el-button>
      </div>
      <el-table
        border fit highlight-current-row style="width: 100%;"
        :data="system_list"
        row-key="id"
      >

        <el-table-column
          min-width="25%"
          align="center"
          prop="key"
          label="键(key)"
        >
          <template slot-scope="{row}">
            {{row.option_name}}
          </template>
        </el-table-column>

        <el-table-column
          min-width="25%"
          align="center"
          prop="value"
          label="值(value)"
        >
          <template slot-scope="{row}">
            <template v-if="row.is_edit">
              <el-input v-model="row.value" class="edit-input" size="small"/>
            </template>
            <span v-else >
              {{ row.value }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          min-width="10%"
          align="center"
          prop="units"
          label="单位"
        >
          <template slot-scope="{row}">
            {{ row.units }}
          </template>
        </el-table-column>

        <el-table-column
          min-width="25%"
          align="center"
          prop="option_describe"
          label="描述"
        >
          <template slot-scope="{row}">
            {{ row.option_describe }}
          </template>
        </el-table-column>

      </el-table>

    </div>
  </div>
</template>
<script>

  import {LocalStorage} from '@/utils/storage'
  import qs from 'qs'

  export default {
      data() {
          return {
              flag_btn:false,
              submit_loading:false,
              system_list:[],
              system:{
                  id:'',
                  uid:'',
                  key:'',
                  value:'',
                  desc:''
              },

          }
      },

      methods:{

          editConf() {
            this.flag_btn = true
            this.system_list.forEach(item => {
              item.is_edit = true
            })
          },

          cancelBtn() {
            this.flag_btn = false
            this.system_list.forEach(item => {
              item.is_edit = false
              item.value = item.originalValue
            })
          },

          msgTip(name) {
            this.$message({
                message:name,
                type:'error',
                center:true
            })
          },

          submitBtn(  ) {
            let copyArr = JSON.parse(JSON.stringify(this.system_list))
            copyArr.forEach(item => {
              delete item.created_at
              delete item.updated_at
              delete item.is_edit
              delete item.originalValue
            })
            let data = {
              type_id : this.$route.query.id,
              options:JSON.stringify(copyArr)
            }
            this.submit_loading = true
            this.$http.patch(`${this.url}/site_configs`,qs.stringify(data)).then( resp => {
              this.submit_loading = false
              if (resp.code === 200) {
                this.flag_btn = false
                this.$message({
                  message:resp.msg,
                  type:'success',
                  center:true
                });
                this.getList()
              } else {
                this.msgTip(resp.msg)
              }
            })
          },

          getList() {

              let data = {
                  type_id: this.$route.query.id,
                  request_param:'GET'
              }

              this.$http.get(`${this.url}/site_type_config`,data).then( resp => {

                  if (resp.code === 200) {
                      if (resp.data) {
                        this.system_list = resp.data.map(item => {
                          return {...item,is_edit:false,originalValue:item.value}
                        })
                      }else {
                          this.system_list = [];
                      }
                  } else {
                      this.msgTip(resp.msg)
                  }
              })
          }
      },
      created() {
          this.getList()
      }
  }

</script>
