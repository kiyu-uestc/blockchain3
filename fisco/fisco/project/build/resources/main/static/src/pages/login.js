// 登录组件
const Login = {
  data() {
    return {
      // 用户身份
      users: [
        {
          name: '管理员',
          userName: 'admin',
          component: admin,
        },
        {
          name: '银行',
          userName: 'bank',
          component: bank,
        }
      ],
      labelWidth:'100px',
      form:{
        currentUser: null, // 当前用户
        address: '', // 角色地址
        loginItem: '', // 登录用户信息
      }
    }
  },
  template: `
    <div class="login">
      <!-- 角色选择 -->
      <h3 v-if="form.currentUser === null">请选择您的角色</h3>
      <el-row :gutter="80" class="flex-center" v-if="form.currentUser === null">
        <el-col :span="6" v-for="(item, index) in users" :key="index" class="cursor-pointer">
          <div @click="handleClick(item)">{{ item.name }}</div>
        </el-col>
      </el-row>

      <!-- 登录 -->
      <div v-else class="is-login">
        <p>角色登录</p>
        <el-form  :model="form" ref="form" label-position="right" :label-width="labelWidth">
          <el-form-item 
            label="角色：" 
          >
            <span class="role">{{form.loginItem.name}}</span>
          </el-form-item>
          <el-form-item 
            label="地址：" 
            prop="address" 
            :rules="[
              { required: true, message: '请输入角色地址' }
            ]" 
          >
            <el-input v-model.trim="form.address" ></el-input>
          </el-form-item>
        </el-form>

        <!-- 直接登录按钮 -->
        <div slot="footer" class="dialog-footer text-right padding-right40 margin-top30">
          <el-button type="default" @click="resetForm('form')">取消</el-button>
          <el-button type="primary" @click="submitForm('form')">登录</el-button>
        </div>
      </div>
    </div>
  `,
  methods: {
    // 点击登录提交表单
    submitForm(formName){
      // 参数校验
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.login()
        } 
      });
    },
    // 取消登录
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = this.$options.data().form
    },
    // 选取角色进行登录
    handleClick(item){
      this.form.loginItem = item;
      this.form.currentUser = item.userName;
    },
    // 登录
    login(){
        axios({
          method: 'post',
          url: `/user/login`,
          data:{
            loginType:this.form.currentUser,
            address:this.form.address
          }
        })
        .then(ret => {
          if(ret.data.code === 0){
            // 将登录数据进行缓存 并进行跳转
            const userInfo = JSON.stringify({loginType:this.form.currentUser,address:this.form.address})
            sessionStorage.setItem('userInfo', userInfo)
            this.$emit('login', { 
              component: this.form.loginItem.component,
              user: this.form.currentUser, 
            });
          }else{
            this.$message.error(ret.data.message)
          }
        }) 
        .catch(err => {
          console.log(err)
        })
    }
  }
}
