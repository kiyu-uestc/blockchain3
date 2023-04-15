// 新建银行组件
const applyForm = {
    data() {
        return {
            form: {
                name: '',
                bankAddress: '',
                addPrivilege: false,
                kycPrivilege: false
            },
            formLabelWidth: '100px'
        }
    },
    // 接受传入的可视化参数
    props: ['dialogFormVisible'],
    template: `
    <div>
      <el-dialog title="添加银行" :visible.sync="dialogFormVisible" :show-close="false" width="35%" :center="true" @close='closeDialog'>
        <el-form :model="form" ref="form" label-position="left" :label-width="formLabelWidth">
          <el-form-item 
          label="银行名" 
          prop="name" 
          :rules="[
            { required: true, message: '请输入银行名' },
          ]" 
        >
          <el-input class="width100" v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
          <el-form-item 
          label="地址" 
          prop="bankAddress" 
          :rules="[
            { required: true, message: '请输入地址' }
          ]" 
        >
            <el-input class="width100" v-model="form.bankAddress" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item 
          label="添加权限" 
          prop="addPrivilege"  
        >
              <el-radio-group v-model="form.addPrivilege">
                <el-radio :label="true">有权限</el-radio>
                <el-radio :label="false">无权限</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item 
          label="KYC权限" 
          prop="kycPrivilege"  
        >
              <el-radio-group v-model="form.kycPrivilege">
                <el-radio :label="true">有权限</el-radio>
                <el-radio :label="false">无权限</el-radio>
              </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer text-right">
          <el-button @click="$emit('popup', false)">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  `,
    methods: {
        // 提交信息
        submitForm(formName) {
            // 参数校验
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 提取缓存的用户信息
                    this.submitApply()
                } else {
                    return false;
                }
            });
        },
        // 提交表单
        submitApply() {
            axios({
                method: 'post',
                url: `/user/addBank`,
                data: {
                    name: this.form.name,
                    bankAddress: this.form.bankAddress,
                    addCustomerPrivilege: this.form.addPrivilege,
                    kycPrivilege: this.form.kycPrivilege
                }
            })
                .then(ret => {
                    if (ret.data.code === 0) {
                        this.$emit('confirmPopup', false)
                    } else {
                        this.$message.error(ret.data.message)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        //关闭弹框的事件
        closeDialog() {
            this.$emit('popup', false)
        }
    }
}

//修改银行表单
const modForm = {
    data() {
        return {
            form: {
                bankAddress: this.row.address,
                addPrivilege: this.row.addCustPrivilege,
                kycPrivilege: this.row.kycPrivilege
            },
            formLabelWidth: '100px'
        }
    },
    // 接受传入的可视化参数
    props: ['dialogFormVisible','row'],
    template: `
    <div>
      <el-dialog title="修改银行信息" :visible.sync="dialogFormVisible" :show-close="false" width="35%" :center="true" @close='closeDialog'>
        <el-form :model="form" ref="form" label-position="left" :label-width="formLabelWidth">
          <el-form-item 
          label="银行名：" 
          prop="name" 
        >
          {{this.row.name}}
        </el-form-item>
          <el-form-item 
          label="地址" 
          prop="bankAddress" 
        >
            {{form.bankAddress}}
          </el-form-item>
          <el-form-item 
          label="添加权限" 
          prop="addPrivilege"  
        >
              <el-radio-group v-model="form.addPrivilege">
                <el-radio :label="true">有权限</el-radio>
                <el-radio :label="false">无权限</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item 
          label="KYC权限" 
          prop="kycPrivilege"  
        >
              <el-radio-group v-model="form.kycPrivilege">
                <el-radio :label="true">有权限</el-radio>
                <el-radio :label="false">无权限</el-radio>
              </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer text-right">
          <el-button @click="$emit('popup', false)">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  `,
    methods: {
        // 提交信息
        submitForm(formName) {
            // 参数校验
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 提取缓存的用户信息
                    this.submitApply()
                } else {
                    return false;
                }
            });
        },
        // 提交表单
        submitApply() {
            axios({
                method: 'post',
                url: `/user/modifyBank`,
                data: {
                    bankAddress: this.row.address,
                    addCustomerPrivilege: this.form.addPrivilege,
                    kycPrivilege: this.form.kycPrivilege
                }
            })
                .then(ret => {
                    if (ret.data.code === 0) {
                        this.$emit('confirmPopup', false)
                    } else {
                        this.$message.error(ret.data.message)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        //关闭弹框的事件
        closeDialog() {
            this.$emit('popup', false)
        }
    }
}

//银行列表
const admin = {
    data() {
        return {
            popup: false,
            popupModForm: false,
            tableData: [
            ],
            loading: true
        }
    },
    // 注册子组件
    components: {
        applyForm,
        modForm
    },
    props: ['user'],
    template: `
    <div>
      <!-- 创建按钮 -->
      <el-button type="primary" @click="popup = true;" v-if="user == 'admin'">新建银行</el-button>

      <!-- 退出按钮 -->
      <el-button type="danger" @click="loginOut" class="button-logout">退出</el-button>

      <!-- 信息列表 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="name"
          label="银行名"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
        >
        </el-table-column>
        <el-table-column
          label="添加权限"
        >
          <template slot-scope="{ row }">
           {{row.addCustPrivilege ? '有权限' : '无权限'}}
          </template>
        </el-table-column>
        <el-table-column
          label="KYC权限"
        >
          <template slot-scope="{ row }">
           {{row.kycPrivilege ? '有权限' : '无权限'}}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
        >
          <template slot-scope="{ row }">
           {{row.status ? '正常' : '禁用'}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
        <template slot-scope="{ row }">
            <el-button
              size="mini"
              type="primary"
              v-if="user == 'admin'"
              @click="popupModForm = true;">修改</el-button>
            <el-button
              size="mini"
              type="info"
              v-if="user == 'admin' && row.status == false"
              @click="removeBank(row)">启用</el-button>
            <el-button
              size="mini"
              type="warning"
              v-if="user == 'admin' && row.status == true"
              @click="removeBank(row)">禁用</el-button> 
            <modForm :dialogFormVisible="popupModForm" :row="row" @popup="handlePopupModForm" @confirmPopup="submitForm" />
        </template>
        </el-table-column>
      </el-table>

      <applyForm :dialogFormVisible="popup" @popup="handlePopup" @confirmPopup="submitForm" />
    </div>
  `,
    mounted() {
        // 挂载时获取当前用户的所有数据
        this.getData();
    },
    methods: {
        // 获取当前用户的所有数据
        getData() {
            axios({
                method: 'post',
                url: `/user/getAllBanks`
            })
                .then(ret => {
                    if (ret.data.code === 0) {
                        const dataStr = ret.data.data;
                        this.tableData = JSON.parse(dataStr)
                    } else {
                        this.$message.error(ret.data.message)
                    }
                    this.loading = false
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 退出登录
        loginOut() {
            sessionStorage.clear()
            this.$emit('logout', false)
        },
        handlePopup(val) {
            this.popup = val
        },
        // 提交关闭弹窗 并刷新数据
        submitForm(val) {
            this.popup = val
            this.popupModForm = val
            this.getData()
        },
        handlePopupModForm(val) {
            this.popupModForm = val
        },
        removeBank(val) {
            this.$confirm('确认删除该银行?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method: 'post',
                    url: `/user/updateBankStatus`,
                    data:{
                        bankAddress:val.address,
                        status:!val.status
                    }
                })
                    .then(ret => {
                        if (ret.data.code === 0) {
                            this.getData();
                        } else {
                            this.$message.error(ret.data.message)
                        }
                        this.loading = false
                    })
                    .catch(err => {
                        console.log(err)
                    })
            });
        },
    }
}

//
// 下面为银行组件
//

// KYC检索弹框
const searchKYCForm = {
    data() {
        return {
            form: {
                hash: ''
            },
            customer:{
                name:'',
                country:'',
                sex:'',
                id:'',
                phone:'',
                addr:''
            },
            formLabelWidth: '100px'
        }
    },
    // 接受传入的可视化参数
    props: ['dialogFormVisible'],
    template: `
    <div>
      <el-dialog title="查询KYC" :visible.sync="dialogFormVisible" :show-close="false" width="35%" :center="true" @close='closeDialog'>
        <el-form :model="form" ref="form" label-position="left" :label-width="formLabelWidth">
          <el-form-item 
              label="客户Hash" 
              prop="hash" 
              :rules="[
                { required: true, message: '请输入客户资料Hash' },
              ]"  
          >
            <el-input class="width100" v-model="form.hash" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="name" label="客户名字">
            {{customer.name}}
          </el-form-item>
          <el-form-item prop="country" label="客户国籍">
            {{customer.country}}
          </el-form-item>
          <el-form-item label="客户性别">
            <template v-if="customer.sex != ''">{{customer.sex == '0'?'男':'女'}}</template>
          </el-form-item>
          <el-form-item label="证件号码">
            {{customer.id}}
          </el-form-item>
          <el-form-item label="联系电话">
            {{customer.phone}}
          </el-form-item>
          <el-form-item label="客户地址">
            {{customer.addr}}
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer text-right">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')">查 询</el-button>
        </div>
      </el-dialog>
    </div>
  `,
    created(){
    },
    methods: {
        // 提交信息
        submitForm(formName) {
            // 参数校验
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 提取缓存的用户信息
                    this.submitApply()
                } else {
                    return false;
                }
            });
        },
        // 提交表单
        submitApply() {
            let callerAddress = JSON.parse(sessionStorage.getItem('userInfo')).address
            axios({
                method: 'post',
                url: `/bank/searchCustomerDataByHash`,
                data: {
                    userAddress: callerAddress,
                    hash: this.form.hash
                }
            })
                .then(ret => {
                    if (ret.data.code === 0) {
                        this.customer = JSON.parse(ret.data.data);
                    } else {
                        this.$message.error(ret.data.message)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        //关闭弹框的事件
        closeDialog() {
            this.$emit('popup', false)
        }
    }
}

//修改客户KYC表单
const modKYCForm = {
    data() {
        return {
            form: {
                uuid:'',
                name: '',
                country: '',
                sex: '',
                id: '',
                phone: '',
                addr:''
            },
            formLabelWidth: '100px'
        }
    },
    // 接受传入的可视化参数
    props: ['dialogFormVisible','row'],
    template: `
    <div>
      <el-dialog title="修改KYC" :visible.sync="dialogFormVisible" :show-close="false" width="35%" :center="true" @close='closeDialog'>
        <el-form :model="form" ref="form" label-position="left" :label-width="formLabelWidth">
          <el-form-item 
              label="客户名字" 
              prop="name" 
              :rules="[
                { required: true, message: '请输入客户名字' },
              ]"  
          >
            <el-input class="width100" v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item 
              label="国籍" 
              prop="country" 
              :rules="[
                { required: true, message: '请输入国籍，例如：中国' },
              ]"  
          >
            <el-input class="width100" v-model="form.country" autocomplete="off" placeholder="例如：中国"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="form.sex">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item 
              label="证件号码" 
              prop="id" 
              :rules="[
                { required: true, message: '请输入身份证或护照号码' },
              ]"  
          >
            <el-input class="width100" v-model="form.id" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item 
              label="手机号码" 
              prop="phone" 
              :rules="[
                { required: true, message: '请输入客户手机号码' },
              ]"  
          >
            <el-input class="width100" v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item 
              label="联系地址" 
              prop="addr" 
              :rules="[
                { required: true, message: '请输入客户联系地址' },
              ]"  
          >
            <el-input class="width100" v-model="form.addr" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer text-right">
          <el-button @click="$emit('popupNewKYCForm', false)">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  `,
    methods: {
        // 提交信息
        submitForm(formName) {
            // 参数校验
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 提取缓存的用户信息
                    this.submitApply()
                } else {
                    return false;
                }
            });
        },
        // 提交表单
        submitApply() {
            const address = JSON.parse(sessionStorage.getItem('userInfo')).address
            axios({
                method: 'post',
                url: `/bank/modifyCustomer`,
                data: {
                    userAddress: address,
                    uuid: this.form.uuid,
                    custName: this.form.name,
                    custCountry: this.form.country,
                    custSex: this.form.sex,
                    custId: this.form.id,
                    custPhone: this.form.phone,
                    addr: this.form.addr
                }
            })
                .then(ret => {
                    if (ret.data.code === 0) {
                        this.$emit('confirmPopup', false)
                    } else {
                        this.$message.error(ret.data.message)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        //关闭弹框的事件
        closeDialog() {
            this.$emit('popup', false)
        },
        editCustomer(val){
            const address = JSON.parse(sessionStorage.getItem('userInfo')).address
            this.form.uuid = val.uuid;
            axios({
                method: 'post',
                url: `/bank/viewCustomerData`,
                data:{
                    userAddress:address,
                    uuid:val.uuid
                }
            })
                .then(ret => {
                    if (ret.data.code === 0) {
                        const dataJson = JSON.parse(ret.data.data);
                        this.form.name = dataJson.name
                        this.form.country = dataJson.country
                        this.form.sex = parseInt(dataJson.sex)
                        this.form.id = dataJson.id
                        this.form.phone = dataJson.phone
                        this.form.addr = dataJson.addr
                    } else {
                        this.$message.error(ret.data.message)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}

//添加客户KYC表单
const newKYCForm = {
    data() {
        return {
            form: {
                name: '',
                country: '',
                sex: 1,
                id: '',
                phone: '',
                addr:''
            },
            formLabelWidth: '100px'
        }
    },
    // 接受传入的可视化参数
    props: ['dialogFormVisible'],
    template: `
    <div>
      <el-dialog title="新建KYC" :visible.sync="dialogFormVisible" :show-close="false" width="35%" :center="true" @close='closeDialog'>
        <el-form :model="form" ref="form" label-position="left" :label-width="formLabelWidth">
          <el-form-item 
              label="客户名字" 
              prop="name" 
              :rules="[
                { required: true, message: '请输入客户名字' },
              ]"  
          >
            <el-input class="width100" v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item 
              label="国籍" 
              prop="country" 
              :rules="[
                { required: true, message: '请输入国籍，例如：中国' },
              ]"  
          >
            <el-input class="width100" v-model="form.country" autocomplete="off" placeholder="例如：中国"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="form.sex">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item 
              label="证件号码" 
              prop="id" 
              :rules="[
                { required: true, message: '请输入身份证或护照号码' },
              ]"  
          >
            <el-input class="width100" v-model="form.id" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item 
              label="手机号码" 
              prop="phone" 
              :rules="[
                { required: true, message: '请输入客户手机号码' },
              ]"  
          >
            <el-input class="width100" v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item 
              label="联系地址" 
              prop="addr" 
              :rules="[
                { required: true, message: '请输入客户联系地址' },
              ]"  
          >
            <el-input class="width100" v-model="form.addr" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer text-right">
          <el-button @click="$emit('popupNewKYCForm', false)">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  `,
    methods: {
        // 提交信息
        submitForm(formName) {
            // 参数校验
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 提取缓存的用户信息
                    this.submitApply()
                } else {
                    return false;
                }
            });
        },
        // 提交
        submitApply() {
            let callerAddress = JSON.parse(sessionStorage.getItem('userInfo')).address
            axios({
                method: 'post',
                url: `/bank/addCustomer`,
                data: {
                    userAddress: callerAddress,
                    custName: this.form.name,
                    custCountry: this.form.country,
                    custSex: this.form.sex,
                    custId: this.form.id,
                    custPhone: this.form.phone,
                    addr: this.form.addr
                }
            })
                .then(ret => {
                    if (ret.data.code === 0) {
                        this.$emit('confirmPopup', false)
                    } else {
                        this.$message.error(ret.data.message)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        //关闭弹框的事件
        closeDialog() {
            this.$emit('popup', false)
        }
    }
}

//KYC修改历史列表
const kYCHistoryTable = {
    data() {
        return {
            history: {
                uuid: '',
                hash: '',
                bankAddr: '',
                createTime: '',
            },
            formLabelWidth: '100px'
        }
    },
    // 接受传入的可视化参数
    props: ['dialogFormVisible'],
    template: `
    <div>
      <el-dialog title="KYC修改历史" :visible.sync="dialogFormVisible" :show-close="false" width="35%" :center="true" @close='closeDialog'>
        <el-table :data="history">
          <el-table-column property="uuid" label="客户UUID"></el-table-column>
          <el-table-column property="hash" label="KYC哈希"></el-table-column>
          <el-table-column property="bankAddr" label="操作银行地址"></el-table-column>
          <el-table-column property="createdTime" label="修改时间" width="200"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  `,
    methods: {
        getHistory(val) {
            let callerAddress = JSON.parse(sessionStorage.getItem('userInfo')).address
            axios({
                method: 'post',
                url: `/history/getAllKycHistories`,
                data: {
                    userAddress: callerAddress,
                    uuid: val.uuid
                }
            })
                .then(ret => {
                    if (ret.data.code === 0) {
                        this.history = JSON.parse(ret.data.data)
                    } else {
                        this.$message.error(ret.data.message)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        //关闭弹框的事件
        closeDialog() {
            this.$emit('popup', false)
        }
    }
}

//客户操作列表页
const bank = {
    data() {
        return {
            editCustomerLoading: false,
            popupNewKYCForm: false,
            popupModKYCForm: false,
            popupSearchKYCForm: false,
            popupHistoryTable: false,
            tableData: [
            ],
            loading: true,
            editData: {
                name: '',
                country: '',
                sex: 1,
                id: '',
                phone: '',
                addr:''
            },
        }
    },
    // 注册子组件
    components: {
        newKYCForm,
        modKYCForm,
        searchKYCForm,
        kYCHistoryTable
    },
    props: ['user'],
    template: `
    <div>
      <!-- 创建按钮 -->
      <el-button type="primary" @click="popupNewKYCForm = true;">新建KYC</el-button>
      <el-button type="info" @click="popupSearchKYCForm = true;">查询KYC</el-button>
      <!-- 退出按钮 -->
      <el-button type="danger" @click="loginOut" class="button-logout">退出</el-button>

      <!-- 信息列表 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="uuid"
          label="UUID"
        >
        </el-table-column>
        <el-table-column
          prop="bankAddr"
          label="所属银行"
        >
        </el-table-column>
        <el-table-column
          prop="hash"
          label="用户Hash"
        >
        </el-table-column>
        <el-table-column
          label="状态"
        >
          <template slot-scope="{ row }">
           {{row.status ? '正常' : '禁用'}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
        <template slot-scope="{ row }">
            <el-button
              size="mini"
              type="info"
              @click="showHistory(row)">修改历史</el-button>
            <el-button
              size="mini"
              type="primary"
              v-if="user == 'bank'"
              @click="editCustomer(row)">修改</el-button>
            <el-button
              size="mini"
              type="warning"
              v-if="user == 'bank' && row.status == true"
              @click="removeCustomer(row)">禁用</el-button>
            <el-button
              size="mini"
              type="info"
              v-if="user == 'bank' && row.status == false"
              @click="removeCustomer(row)">启用</el-button>
            <modKYCForm ref='editCustomerForm' :dialogFormVisible="popupModKYCForm" :row="row" @popup="handlePopupModKYCForm" @confirmPopup="submitForm" />
            <kYCHistoryTable ref='historyTable' :dialogFormVisible="popupHistoryTable" :row="row" @popup="handlePopupHistoryTable" @confirmPopup="submitForm" />
        </template>
        </el-table-column>
      </el-table>
      <newKYCForm :dialogFormVisible="popupNewKYCForm" @popup="handlePopupNewKYCForm" @confirmPopup="submitForm" />
      <searchKYCForm :dialogFormVisible="popupSearchKYCForm" @popup="handlePopupSearchKYCForm" @confirmPopup="submitForm" />
    </div>
  `,
    mounted() {
        // 挂载时获取当前用户的所有数据
        this.getData();
    },
    methods: {
        // 获取数据
        getData() {
            const address = JSON.parse(sessionStorage.getItem('userInfo')).address
            axios({
                method: 'post',
                url: `/bank/getAllCustomers`,
                data:{
                    userAddress:address
                }
            })
                .then(ret => {
                    if (ret.data.code === 0) {
                        const dataStr = ret.data.data;
                        this.tableData = JSON.parse(dataStr)
                    } else {
                        this.$message.error(ret.data.message)
                    }
                    this.loading = false
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 退出登录
        loginOut() {
            sessionStorage.clear()
            this.$emit('logout', false)
        },
        handlePopupNewKYCForm(val) {
            this.popupNewKYCForm = val
        },
        // 提交关闭弹窗 并刷新数据
        submitForm(val) {
            this.popupNewKYCForm = val
            this.popupModKYCForm = val
            this.popupSearchKYCForm = val
            this.popupHistoryTable = val
            this.getData()
        },
        handlePopupModKYCForm(val) {
            this.popupModKYCForm = val
        },
        handlePopupSearchKYCForm(val) {
            this.popupSearchKYCForm = val
        },
        handlePopupHistoryTable(val) {
            this.popupHistoryTable = val
        },
        removeCustomer(val) {
            const address = JSON.parse(sessionStorage.getItem('userInfo')).address
            this.$confirm('确认删除该用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios({
                    method: 'post',
                    url: `/bank/updateCustomerStatus`,
                    data:{
                        userAddress:address,
                        uuid:val.uuid,
                        status:!val.status
                    }
                })
                    .then(ret => {
                        if (ret.data.code === 0) {
                            this.getData();
                        } else {
                            this.$message.error(ret.data.message)
                        }
                        this.loading = false
                    })
                    .catch(err => {
                        console.log(err)
                    })
            });
        },
        editCustomer(val){
            this.$refs["editCustomerForm"].editCustomer(val)
            this.popupModKYCForm = true;
        },
        showHistory(val){
            this.$refs["historyTable"].getHistory(val)
            this.popupHistoryTable = true;
        }
    }
}
