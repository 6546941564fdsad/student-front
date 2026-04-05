<!-- src/components/Login.vue -->
<template>
  <div class="login-container">
    <!-- 背景层 -->
    <div class="background-layer">
      <video class="background-video" autoplay loop muted playsinline>
        <source src="/video/1.mp4" type="video/mp4">
        您的浏览器不支持视频播放
      </video>
      <div class="overlay"></div>
    </div>
    
    <!-- 登录卡片 -->
    <div class="login-card">
      <div class="login-header">
        <div class="logo">
          <user-outlined style="font-size: 48px; color: #1890ff;" />
        </div>
        <h1>教务系统</h1>
        <p>请登录以访问系统</p>
      </div>
      
      <a-form :model="form" @submit.prevent="handleLogin" class="login-form">
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入用户名' }]"
          class="form-item"
        >
          <a-input 
            v-model="form.username" 
            placeholder="用户名"
            size="large"
          >
            <template #prefix>
              <user-outlined style="color: rgba(0,0,0,.25);" />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码' }]"
          class="form-item"
        >
          <a-input-password 
            v-model="form.password" 
            placeholder="密码"
            size="large"
          >
            <template #prefix>
              <lock-outlined style="color: rgba(0,0,0,.25);" />
            </template>
          </a-input-password>
        </a-form-item>
        
        <a-form-item class="form-item">
          <a-button 
            type="primary" 
            html-type="submit" 
            size="large" 
            class="login-button"
            :loading="loading"
          >
            登录
          </a-button>
        </a-form-item>
        
        <a-alert
          v-if="error"
          type="error"
          message="登录失败"
          description="{{ error }}"
          show-icon
          class="error-message"
        />
        
        <div class="login-footer">
          <p>© 2026 教务系统</p>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import { authApi } from '../api/auth';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

export default {
  name: 'Login',
  components: {
    UserOutlined,
    LockOutlined
  },
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      error: '',
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';
      
      try {
        const response = await authApi.login(this.form);
        if (response.data.success) {
          // 登录成功，保存用户信息到本地存储
          localStorage.setItem('user', JSON.stringify(response.data));
          // 跳转到学生列表页面
          this.$emit('login-success');
        } else {
          this.error = response.data.message;
        }
      } catch (error) {
        console.error('登录失败:', error);
        this.error = '登录失败，请稍后重试';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding-left: 70%;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.3), rgba(0, 0, 0, 0.7));
}

.login-card {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  padding: 50px;
  width: 100%;
  max-width: 420px;
  z-index: 1;
  backdrop-filter: blur(20px);
  animation: slideUp 0.8s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.login-card:hover {
  box-shadow: 0 16px 48px rgba(24, 144, 255, 0.3);
  transform: translateY(-5px);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.login-header h1 {
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1890ff;
  text-shadow: 0 2px 4px rgba(24, 144, 255, 0.3);
  letter-spacing: 1px;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

.login-form {
  width: 100%;
}

.form-item {
  margin-bottom: 24px;
}

.form-item .ant-input {
  height: 52px;
  font-size: 16px;
  border-radius: 26px;
  border: 2px solid rgba(24, 144, 255, 0.2);
  transition: all 0.3s ease;
}

.form-item .ant-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.2);
}

.form-item .ant-input-password {
  height: 52px;
  font-size: 16px;
  border-radius: 26px;
  border: 2px solid rgba(24, 144, 255, 0.2);
  transition: all 0.3s ease;
}

.form-item .ant-input-password:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.2);
}

.login-button {
  width: 100%;
  height: 52px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 26px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
  transition: all 0.3s ease;
}

.login-button:hover {
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.6);
  transform: translateY(-2px);
}

.error-message {
  margin: 24px 0;
  border-radius: 8px;
}

.login-footer {
  text-align: center;
  margin-top: 36px;
  color: #999;
  font-size: 14px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-card {
    margin: 0 20px;
    padding: 30px 20px;
  }
}
</style>