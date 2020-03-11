<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        tableData: [{
          id: 1,
          date: '2016-05-02',
          name: '1',
          address: '上海市普陀区金沙江路 1518 弄',
          status:1
        }, {
          id: 2,
          date: '2016-05-04',
          name: '2',
          address: '上海市普陀区金沙江路 1517 弄',
          status:1
        }, {
          id: 3,
          date: '2016-05-01',
          name: '3',
          address: '上海市普陀区金沙江路 1519 弄',
          status:2,
          children: [{
            id: 31,
            date: '2016-05-02',
            name: '4',
            address: '上海市普陀区金沙江路 1519 弄',
            status:1
          }, {
            id: 32,
            date: '2016-05-03',
            name: '5',
            address: '上海市普陀区金沙江路 1519 弄',
            status:2
            // children: [{
            //   id: 33,
            //   date: '2016-05-04',
            //   name: '6',
            //   address: '上海市普陀区金沙江路 1519 弄'
            // },{
            //   id: 34,
            //   date: '2016-05-05',
            //   name: '7',
            //   address: '上海市普陀区金沙江路 1519 弄'
            // }]
          }]
        }, {
          id: 4,
          date: '2016-05-03',
          name: '8',
          address: '上海市普陀区金沙江路 1516 弄',
          status:1
        }]
      }
    },
    methods: {

    },
    created() {
      let res = this.tableData.map(item=>{
        let obj = JSON.parse(JSON.stringify(item))
        //let obj = item 写成这样的话 原数组也发生了变化
        if (obj.children !== undefined) {
          obj.children.forEach(ii=>{
            ii.id = 'c'+ii.id
            ii.status = ii.status ===1
          })
        }
        obj.id = 'p'+obj.id
        obj.status = obj.status === 1
        return obj
      })
      console.log(res)
      console.log(this.tableData)
    }
  }
</script>
