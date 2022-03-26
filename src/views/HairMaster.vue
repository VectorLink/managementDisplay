<template>
  <div class="home">
    <Menu></Menu>
    <el-button type="primary" icon="el-icon-search" size="small" @click="editHairMasterTitle='添加发型师'; editHairMasterVisible=true">
      添加发型师
    </el-button>
    <el-table
        :data="hairMaster"
        border
        style="width: 50%">
      <el-table-column
          prop="hairMasterId"
          label="发型师编号">
      </el-table-column>
      <el-table-column
          prop="hairMasterName"
          label="发型师名称">
      </el-table-column>
      <el-table-column
          prop="hairMasterCode"
          label="发型师登录名">
      </el-table-column>
      <el-table-column
          prop="type"
          label="类型" :formatter="typeFormatter">
      </el-table-column>
      <el-table-column
          prop="status"
          label="状态" :formatter="statusFormatter">
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="创建时间">
      </el-table-column>
      <el-table-column
          label="操作">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="small" @click="editHairMaster(scope.row);editHairMasterTitle='修改发型师信息'">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="HairMasterParam.page.current"
        :page-sizes="[1, 10, 20, 50]"
        :page-size="HairMasterParam.page.size"
        layout="sizes, prev, pager, next"
        :total="HairMasterParam.page.total">
    </el-pagination>
    <el-dialog :title="editHairMasterTitle" :visible.sync="editHairMasterVisible">
      <el-form :model="hairMasterModel">
        <el-form-item label="发型师编号">
          <el-input v-model="hairMasterModel.hairMasterId" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="发型师名称">
          <el-input v-model="hairMasterModel.hairMasterName"></el-input>
        </el-form-item>
        <el-form-item label="发型师登录名">
          <el-input v-model="hairMasterModel.hairMasterCode"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio v-model="hairMasterModel.type" :label="0">管理员</el-radio>
          <el-radio v-model="hairMasterModel.type" :label="1">发型师</el-radio>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="hairMasterModel.status" :label="0">禁用</el-radio>
          <el-radio v-model="hairMasterModel.status" :label="1">启用</el-radio>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="hairMasterModel.password" ></el-input>
        </el-form-item>
        <el-button type="primary" plain @click="updateHairMaster">确认</el-button>
        <el-button type="primary" plain @click="editHairMasterVisible =false">取消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import Menu from '@/components/Menu.vue'

export default {
  name: 'HomeView',
  components: {
    Menu: Menu
  },
  data() {
    return {
      hairMaster: [],
      HairMasterParam: {
        hairMasterCode: null,
        hairMasterName: null,
        page: {
          current: 1,
          total: 10,
          size: 20,
          pages: 0
        }
      },
      editHairMasterVisible:false,
      hairMasterModel:{
        hairMasterId:null,
        hairMasterName:null,
        hairMasterCode:null,
        type:null,
        status:null,
        password:null
      },
      editHairMasterTitle:"修改发型师信息"
    }
  },
  methods: {
    listMasters() {
      this.$axios.post("/listHairMaster", this.HairMasterParam).then(res => {
        if (res.data.code == 0) {
          this.hairMaster = res.data.data.data
          this.HairMasterParam.page=res.data.data.page
        }
      })
    },
    typeFormatter(row, column) {
      return row[column.property] == 0 ? "管理员" : "发型师";
    },
    statusFormatter(row, column) {
      return row[column.property] == 0 ? "禁用" : "启用";
    },
    editHairMaster(val) {
      this.hairMasterModel.hairMasterName=val.hairMasterName
      this.hairMasterModel.hairMasterCode=val.hairMasterCode
      this.hairMasterModel.hairMasterId=val.hairMasterId
      this.hairMasterModel.status=val.status
      this.hairMasterModel.type=val.type
      this.editHairMasterVisible=true
    },
    updateHairMaster(){
      this.$axios.post("/saveOrderUpdateMaster",this.hairMasterModel).then(resp=>{
        const h = this.$createElement;
        if (resp.data.code==0){
          this.$message({
            message: h('p', null, [
              h('span', null, '操作成功 ')
            ])
          });
          this.editHairMasterVisible = false;
          this.listMasters();
        }
      })
    },
    handleSizeChange(val) {
      this.HairMasterParam.page.size = val
      this.listMasters(val)
    },
    handleCurrentChange(val) {
      this.HairMasterParam.page.current = val
      this.listMasters(val)
    }
  },
  created() {
    this.listMasters()
  }
}
</script>
