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
        <h1>教务后台管理系统</h1>
        <p>请登录以访问系统</p>
      </div>
      
      <a-form :model="form" @submit.prevent="handleLogin" class="login-form">
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入用户名' }]"
          class="form-item"
        >
          <a-input 
            v-model:value="form.username" 
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
            v-model:value="form.password" 
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
        
        <div class="register-link">
          <span>还没有账号？</span>
          <a @click="showRegisterModal">立即注册</a>
        </div>
        
        <a-alert
          v-if="error"
          type="error"
          :message="error"
          show-icon
          class="error-message"
        />
        
        <div class="login-footer">
          <p>© 2026 教务后台管理系统</p>
        </div>
      </a-form>
    </div>

    <!-- 注册弹窗 -->
    <a-modal
      v-model:open="registerVisible"
      title="用户注册"
      width="600px"
      :confirm-loading="registerLoading"
      @ok="handleRegister"
    >
      <a-alert
        message="注册须知"
        description="新注册用户需要管理员审核后才能登录。学生请使用学号注册，教师请使用工号注册。"
        type="info"
        show-icon
        style="margin-bottom: 16px;"
      />
      
      <a-form :model="registerForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <!-- 身份选择 -->
        <a-form-item label="注册身份" required>
          <a-radio-group v-model:value="registerForm.role" @change="handleRoleChange">
            <a-radio value="STUDENT">学生</a-radio>
            <a-radio value="TEACHER">教师</a-radio>
          </a-radio-group>
        </a-form-item>

        <!-- 基本信息 -->
        <a-form-item label="用户名" required>
          <a-input v-model:value="registerForm.username" placeholder="请输入用户名（用于登录）" />
        </a-form-item>
        <a-form-item label="密码" required>
          <a-input-password v-model:value="registerForm.password" placeholder="请输入密码（至少6位）" />
        </a-form-item>
        <a-form-item label="确认密码" required>
          <a-input-password v-model:value="registerForm.confirmPassword" placeholder="请再次输入密码" />
        </a-form-item>
        <a-form-item label="真实姓名" required>
          <a-input v-model:value="registerForm.name" placeholder="请输入真实姓名" />
        </a-form-item>

        <!-- 学生专属字段 -->
        <template v-if="registerForm.role === 'STUDENT'">
          <a-form-item label="学号" required>
            <a-input v-model:value="registerForm.studentNo" placeholder="请输入学号" />
          </a-form-item>
          <a-form-item label="所属学院">
            <a-input v-model:value="registerForm.department" placeholder="请输入所属学院" />
          </a-form-item>
          <a-form-item label="专业">
            <a-input v-model:value="registerForm.major" placeholder="请输入专业" />
          </a-form-item>
          <a-form-item label="班级">
            <a-input v-model:value="registerForm.className" placeholder="请输入班级" />
          </a-form-item>
        </template>

        <!-- 教师专属字段 -->
        <template v-if="registerForm.role === 'TEACHER'">
          <a-form-item label="工号" required>
            <a-input v-model:value="registerForm.studentNo" placeholder="请输入工号" />
          </a-form-item>
          <a-form-item label="所属学院">
            <a-input v-model:value="registerForm.department" placeholder="请输入所属学院" />
          </a-form-item>
          <a-form-item label="职称">
            <a-input v-model:value="registerForm.title" placeholder="请输入职称（如：教授、副教授）" />
          </a-form-item>
        </template>

        <!-- 联系信息 -->
        <a-form-item label="邮箱">
          <a-input v-model:value="registerForm.email" type="email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="registerForm.phone" placeholder="请输入手机号" />
        </a-form-item>
      </a-form>

      <template #footer>
        <a-button @click="registerVisible = false">取消</a-button>
        <a-button type="primary" :loading="registerLoading" @click="handleRegister">
          提交注册
        </a-button>
      </template>
      
      <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px; font-size: 13px; color: #666;">
        <div style="font-weight: bold; margin-bottom: 8px;">📋 权限说明：</div>
        <div><strong>学生权限：</strong>查看个人档案、选课、成绩查询、考勤查看、考试安排、实习申请、毕业设计开题、教学评教</div>
        <div style="margin-top: 4px;"><strong>教师权限：</strong>查看学生档案、教学任务、教学评价、成绩录入与分析、考勤管理、毕业设计指导、课程变更申请</div>
      </div>
    </a-modal>
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
      loading: false,
      // 注册相关
      registerVisible: false,
      registerLoading: false,
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        role: 'STUDENT',
        name: '',
        email: '',
        phone: '',
        studentNo: '',
        department: '',
        major: '',
        className: '',
        title: ''
      }
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';
      
      try {
        console.log('尝试登录...', this.form);
        const response = await authApi.login(this.form);
        console.log('登录响应:', response.data);
        
        if (response.data.success) {
          // 登录成功，保存用户信息和 Token
          const { token, user } = response.data;
          console.log('Token:', token);
          console.log('User:', user);
          
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // 触发登录成功事件
          this.$emit('login-success');
        } else {
          this.error = response.data.message || '登录失败';
        }
      } catch (error) {
        console.error('登录失败:', error);
        console.error('错误详情:', error.response?.data);
        
        // 根据状态码显示不同的错误信息
        if (error.response?.status === 403) {
          // 403 表示账号被禁用或待审核
          this.error = error.response?.data?.message || '您的账号暂时无法登录，请联系管理员';
        } else if (error.response?.status === 401) {
          // 401 表示用户名或密码错误
          this.error = error.response?.data?.message || '用户名或密码错误';
        } else {
          this.error = error.response?.data?.message || '登录失败，请检查网络连接或后端服务是否启动';
        }
      } finally {
        this.loading = false;
      }
    },
    // 显示注册弹窗
    showRegisterModal() {
      this.registerVisible = true;
      this.resetRegisterForm();
    },
    // 重置注册表单
    resetRegisterForm() {
      this.registerForm = {
        username: '',
        password: '',
        confirmPassword: '',
        role: 'STUDENT',
        name: '',
        email: '',
        phone: '',
        studentNo: '',
        department: '',
        major: '',
        className: '',
        title: ''
      };
    },
    // 切换身份时清空专属字段
    handleRoleChange() {
      this.registerForm.studentNo = '';
      this.registerForm.department = '';
      this.registerForm.major = '';
      this.registerForm.className = '';
      this.registerForm.title = '';
    },
    // 提交注册
    async handleRegister() {
      // 表单验证
      if (!this.registerForm.username || !this.registerForm.password || !this.registerForm.name) {
        this.$message.warning('请填写必填项');
        return;
      }
      if (this.registerForm.password.length < 6) {
        this.$message.warning('密码长度至少为6位');
        return;
      }
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.$message.warning('两次输入的密码不一致');
        return;
      }
      if (this.registerForm.role === 'STUDENT' && !this.registerForm.studentNo) {
        this.$message.warning('请输入学号');
        return;
      }
      if (this.registerForm.role === 'TEACHER' && !this.registerForm.studentNo) {
        this.$message.warning('请输入工号');
        return;
      }

      this.registerLoading = true;
      try {
        const registerData = {
          username: this.registerForm.username,
          password: this.registerForm.password,
          role: this.registerForm.role,
          name: this.registerForm.name,
          email: this.registerForm.email,
          phone: this.registerForm.phone,
          studentNo: this.registerForm.studentNo,
          department: this.registerForm.department,
          major: this.registerForm.role === 'STUDENT' ? this.registerForm.major : undefined,
          className: this.registerForm.role === 'STUDENT' ? this.registerForm.className : undefined,
          title: this.registerForm.role === 'TEACHER' ? this.registerForm.title : undefined
        };

        const response = await authApi.register(registerData);
        if (response.data.success) {
          this.$message.success('注册成功，请等待管理员审核');
          this.registerVisible = false;
          this.resetRegisterForm();
        } else {
          this.$message.error(response.data.message || '注册失败');
        }
      } catch (error) {
        console.error('注册失败:', error);
        this.$message.error(error.response?.data?.message || '注册失败，请稍后重试');
      } finally {
        this.registerLoading = false;
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
  object-position: 30% center;
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
  background: transparent !important;
}

.logo {
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
  display: inline-block;
  background: transparent !important;
  padding: 0;
}

.logo .anticon {
  display: block;
  font-size: 48px;
  color: #1890ff;
  background: transparent !important;
  border: none !important;
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