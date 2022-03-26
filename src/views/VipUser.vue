<template>
  <div>
    <Menu></Menu>

    <el-row>
      <el-input
          placeholder="会员名称"
          v-model="vipUserQueryParam.userName"
          clearable
          @change="page">
      </el-input>
      <el-input
          placeholder="电话号码"
          v-model="vipUserQueryParam.telephone"
          clearable
          @change="page">
      </el-input>
    </el-row>
    <el-row>
      <el-button type="primary" icon="el-icon-search" size="small" @click="dialogTitle='添加会员';addUserVisible=true">
        添加会员
      </el-button>
    </el-row>
    <div>
      <el-dialog :title="this.dialogTitle" :visible.sync="addUserVisible">
        <el-form :model="userModel">
          <el-form-item label="会员编号">
            <el-input v-model="userModel.userId" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="会员姓名">
            <el-input v-model="userModel.userName"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="userModel.sex" label="0">男</el-radio>
            <el-radio v-model="userModel.sex" label="1">女</el-radio>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="userModel.telephone"></el-input>
          </el-form-item>
          <el-form-item label="发型师名称">
            <el-select v-model="userModel.hairMasterId" placeholder="请选择发型师">
              <el-option
                  v-for="item in hairMaster"
                  :key="item.hairMasterId"
                  :label="item.hairMasterName"
                  :value="item.hairMasterId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" plain @click="addVipUser">确认</el-button>
          <el-button type="primary" plain @click="addUserVisible =false">取消</el-button>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog :title="this.accountTitle" :visible.sync="consumerVisible">
        <el-form :model="showAccountModel" ref="chargeAmountRef">
          <el-form-item label="会员名">
            <el-input v-model="showAccountModel.userName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="会员电话">
            <el-input v-model="showAccountModel.telephone"></el-input>
          </el-form-item>
          <el-form-item label="账户余额">
            <el-input v-model="showAccountModel.account" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="消费金额">
            <el-input v-model="chargeAccountParam.alterAmount"></el-input>
          </el-form-item>
          <el-button type="primary" plain @click="consumerAccountPost">确认消费</el-button>
          <el-button type="primary" plain @click="consumerVisible =false">取消</el-button>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog :title="this.accountTitle" :visible.sync="chargeVisible">
        <el-form :model="this.showAccountModel" :rules="passwordRules" ref="chargeAmountRef">
          <el-form-item label="会员名">
            <el-input v-model="showAccountModel.userName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="会员电话">
            <el-input v-model="showAccountModel.telephone" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="账户余额">
            <el-input v-model="showAccountModel.account" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="充值金额">
            <el-input v-model="chargeAccountParam.alterAmount"></el-input>
          </el-form-item>
          <el-button type="primary" plain @click="chargeAccountPost('chargeAmountRef')">确认充值</el-button>
          <el-button type="primary" plain @click="chargeVisible =false">取消</el-button>
        </el-form>
      </el-dialog>
    </div>
    <div>
      <el-dialog :title="this.historyTitle" :visible.sync="historyVisible" @close="UserConsumerParam.userId=null">
        <el-table :data="this.historyModel">
          <el-table-column label="操作时间" property="consumerTime"></el-table-column>
          <el-table-column label="类型" property="consumerType"></el-table-column>
          <el-table-column label="操作前账户余额" property="preAccountAmount"></el-table-column>
          <el-table-column label="变更金额" property="consumerAmount"></el-table-column>
          <el-table-column label="操作后账户余额" property="afterAccountAmount"></el-table-column>
          <el-table-column label="操作人" property="hairMasterName"></el-table-column>
        </el-table>
        <div class="block">
          <span class="demonstration">调整每页显示条数</span>
          <el-pagination
              @size-change="handleHistorySizeChange"
              @current-change="handleHistoryCurrentChange"
              :current-page.sync="UserConsumerParam.page.current"
              :page-sizes="[1, 10, 20, 50]"
              :page-size="UserConsumerParam.page.size"
              layout="sizes, prev, pager, next"
              :total="UserConsumerParam.page.total">
          </el-pagination>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-table
          :data="tableData"
          border
          style="width: 50%">
        <el-table-column
            prop="vipUserName"
            label="会员名称">
        </el-table-column>
        <el-table-column
            prop="sex"
            label="性别" :formatter="sexFormatter">
        </el-table-column>
        <el-table-column
            prop="telephone"
            label="电话号码">
        </el-table-column>
        <el-table-column
            prop="hairMasterName"
            label="发型师">
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间">
        </el-table-column>
        <el-table-column
            prop="accountAmount"
            label="账户余额（元）">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="checkHistory(scope.row)">查看消费历史</el-button>
            <el-button type="text" size="small" @click="consumerAccount(scope.row)">理发消费</el-button>
            <el-button type="text" size="small" @click="chargeAccount(scope.row)">账户充值</el-button>
            <el-button type="text" icon="el-icon-edit" size="small" @click="editVipUser(scope.row)">修改会员</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <span class="demonstration">调整每页显示条数</span>
      <el-pagination
          @size-change="handleUserSizeChange"
          @current-change="handleUserCurrentChange"
          :current-page.sync="vipUserQueryParam.page.current"
          :page-sizes="[1, 10, 20, 50]"
          :page-size="vipUserQueryParam.page.size"
          layout="sizes, prev, pager, next"
          :total="vipUserQueryParam.page.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import Menu from "@/components/Menu";

export default {
  name: "vipUser",
  components: {Menu},
  data() {
    return {
      tableData: [],
      vipUserQueryParam: {
        userName: null,
        telephone: null,
        page: {
          current: 1,
          total: 10,
          size: 20,
          pages: 0
        }
      },
      UserConsumerParam: {
        userId: null,
        page: {
          current: 1,
          total: 10,
          size: 20,
          pages: 0
        }
      },
      pageSize: [10, 20, 30, 40, 50, 100],
      userModel: {
        userId: null,
        userName: null,
        sex: null,
        telephone: null,
        hairMasterId: null
      },
      hairMaster: [],
      addUserVisible: false,
      dialogTitle: "添加会员",
      accountTitle: "理发消费",
      historyTitle: "会员消费历史记录",
      consumerVisible: false,
      chargeVisible: false,
      historyVisible: false,
      chargeAccountParam: {
        consumerType: 0,
        alterAmount: 0.00,
        userId: null
      },
      showAccountModel: {
        userId: null,
        userName: null,
        telephone: null,
        account: null,
        hairMasterId: null,
        hairMaster: null
      },
      historyModel: [],
      passwordRules: {
        alterAmount: [
          {required: true, message: '请输入大于0金额', trigger: 'blur',type:"number"}
        ]
      }
    }
  },
  methods: {
    page() {
      const _this = this
      _this.$axios.post("/vipUser/listUser", this.vipUserQueryParam).then(res => {
        _this.tableData = res.data.data.data
        _this.vipUserQueryParam.page = res.data.data.page
      })
    },
    handleUserSizeChange(val) {
      this.vipUserQueryParam.page.size = val
      this.page(val)

    },
    handleUserCurrentChange(val) {
      this.vipUserQueryParam.page.current = val
      this.page(val)
    },
    handleHistorySizeChange(val) {
      this.UserConsumerParam.page.size = val
      this.checkHistory(val)
    },
    handleHistoryCurrentChange(val) {
      this.UserConsumerParam.page.current = val
      this.checkHistory(val)
    },
    checkHistory(val) {
      this.historyVisible = true
      if (this.UserConsumerParam.userId == null) {
        this.UserConsumerParam.userId = val.vipUserId
      }
      this.$axios.post("/vipUser/listUserConsumer", this.UserConsumerParam).then(res => {
        if (res.data.code == 0) {
          this.historyModel = res.data.data.data
          this.UserConsumerParam.page = res.data.data.page
        }
      })
    },
    addVipUser() {
      this.$axios.post("/vipUser/addUser", this.userModel).then(res => {
        const h = this.$createElement;
        if (res.data.code === 0) {
          this.$message({
            message: h('p', null, [
              h('span', null, '操作成功 ')
            ])
          });
          this.addUserVisible = false;
          this.page();
          this.userModel = {}
        }
      })
    },
    editVipUser(val) {
      this.dialogTitle = "修改会员"
      this.addUserVisible = true
      this.userModel.userName = val.vipUserName
      this.userModel.userId = val.vipUserId
      this.userModel.sex = val.sex
      this.userModel.telephone = val.telephone
      this.userModel.hairMasterId = val.hairMasterId
    },
    sexFormatter(row, column) {
      return row[column.property] == 0 ? "男" : "女";
    },
    chargeAccount(val) {
      this.chargeVisible = true
      this.showAccountModel.userName = val.vipUserName
      this.chargeAccountParam.userId = val.vipUserId
      this.showAccountModel.telephone = val.telephone
      this.showAccountModel.hairMasterId = val.hairMasterId
      this.showAccountModel.account = val.accountAmount
      this.showAccountModel.hairMaster = val.hairMasterName
      this.accountTitle = "账户充值"
    },
    chargeAccountPost(chargeAmountRef) {
      this.$refs[chargeAmountRef].validate((v)=>{
        console.log(v)
      })
      this.chargeAccountParam.consumerType = 1
      this.$axios.post("/vipUser/changeAccount", this.chargeAccountParam).then(res => {
        const h = this.$createElement;
        if (res.data.code === 0) {
          this.$message({
            message: h('p', null, [
              h('span', null, '操作成功 ')
            ])
          });
          this.chargeVisible = false;
          this.page();
          this.showAccountModel = {}
          this.chargeAccountParam = {}
        }
      })
    },
    consumerAccount(val) {
      this.consumerVisible = true
      this.showAccountModel.userName = val.vipUserName
      this.chargeAccountParam.userId = val.vipUserId
      this.showAccountModel.telephone = val.telephone
      this.showAccountModel.hairMasterId = val.hairMasterId
      this.showAccountModel.account = val.accountAmount
      this.showAccountModel.hairMaster = val.hairMasterName
      this.accountTitle = "理发消费"
    },
    consumerAccountPost() {
      this.chargeAccountParam.consumerType = 0
      this.$axios.post("/vipUser/changeAccount", this.chargeAccountParam).then(res => {
        const h = this.$createElement;
        if (res.data.code === 0) {
          this.$message({
            message: h('p', null, [
              h('span', null, '操作成功 ')
            ])
          });
          this.consumerVisible = false;
          this.page();
          this.showAccountModel = {}
          this.chargeAccountParam = {}
        }
      })
    }
  },
  created() {
    const _this = this
    _this.$axios.post("/vipUser/listUser", this.vipUserQueryParam).then(res => {
      _this.tableData = res.data.data.data
      _this.vipUserQueryParam.page = res.data.data.page
    })
    _this.$axios.post("/getHairMaster", "{}").then(res => {
      this.hairMaster = res.data.data
    })
  }
}
</script>

<style>
.el-header {
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.el-table {
  margin: 0 auto;
  width: 8rem;
  padding: 1rem;
}

.el-input {
  max-width: 200px;
}
</style>
