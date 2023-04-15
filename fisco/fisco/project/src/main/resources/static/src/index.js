const vue = new Vue({
  // 注册 Header、Login 子组件
  components: {
    Header,
    Login,
  },
  // 实例绑定的元素
  el: '#app',
  data: {
    showComponent: admin, // 当前展示的动态组件
    login: false, // 登录状态
    user: '', // 当前用户
  },
  template: `
    <el-container>

      <!-- 头部导航组件 -->
      <el-header class="header"><Header :user="user" :login="login" @logout="(val) => {this.login = val,sessionStorage.clear()}" /></el-header>

      <!-- 主要内容组件 -->
      <el-container>
        <el-main>

          <!-- 登录组件 -->
          <Login v-if="!login" @login="(val) => {this.login = true; this.showComponent = val.component; this.user = val.user;}" />

          <!-- 动态组件，根据 showComponent 动态渲染当前用户 -->
          <component v-else :is="showComponent"
            :user="this.user"
            @logout="(val) => {this.login = val;}">
          </component>
        </el-main>
      </el-container>
    </el-container>
    `,
  methods: {

  }
})