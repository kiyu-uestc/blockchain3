// 头部组件
const Header = {
    // 接受传入的登录状态、用户信息
    props: ['login', 'user'],
    template: `
    <div class="header">
      <img src="./images/logo.png" />
      <h3>区块链金融KYC共享平台</h3>
      <span v-if="login" class="user-name">{{ user }}</span>
    </div>
    `
}