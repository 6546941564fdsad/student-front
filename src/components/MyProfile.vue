<!-- src/components/MyProfile.vue - 学生个人中心 -->
<template>
  <div class="my-profile">
    <a-card :bordered="false" :loading="loading">
      <template #title>
        <div class="profile-header">
          <a-space align="center">
            <a-avatar :size="64" :style="{ backgroundColor: '#1890ff' }">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <div>
              <h2 style="margin: 0;">{{ user?.name || '学生' }}</h2>
              <a-tag color="blue">{{ user?.role || '学生' }}</a-tag>
            </div>
          </a-space>
          <a-button type="primary" @click="editProfile">
            <template #icon><EditOutlined /></template>
            编辑信息
          </a-button>
        </div>
      </template>

      <a-tabs v-model:activeKey="activeTab">
        <!-- 基本信息 -->
        <a-tab-pane key="basic" tab="基本信息">
          <a-descriptions bordered column="2" size="middle">
            <a-descriptions-item label="姓名">{{ profileData.name || '-' }}</a-descriptions-item>
            <a-descriptions-item label="学号">{{ profileData.studentNo || '-' }}</a-descriptions-item>
            <a-descriptions-item label="邮箱">{{ profileData.email || '-' }}</a-descriptions-item>
            <a-descriptions-item label="手机号">{{ profileData.phone || '-' }}</a-descriptions-item>
            <a-descriptions-item label="学院">{{ profileData.department || '-' }}</a-descriptions-item>
            <a-descriptions-item label="专业">{{ profileData.major || '-' }}</a-descriptions-item>
            <a-descriptions-item label="班级">{{ profileData.className || '-' }}</a-descriptions-item>
            <a-descriptions-item label="注册时间" span="2">{{ profileData.createTime || '-' }}</a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>

        <!-- 修改密码 -->
        <a-tab-pane key="password" tab="修改密码">
          <a-form :model="passwordForm" layout="vertical" style="max-width: 400px;">
            <a-form-item label="旧密码" required>
              <a-input-password v-model:value="passwordForm.oldPassword" placeholder="请输入旧密码" />
            </a-form-item>
            <a-form-item label="新密码" required>
              <a-input-password v-model:value="passwordForm.newPassword" placeholder="请输入新密码" />
            </a-form-item>
            <a-form-item label="确认密码" required>
              <a-input-password v-model:value="passwordForm.confirmPassword" placeholder="请再次输入新密码" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="changePassword" :loading="passwordLoading">
                修改密码
              </a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 编辑个人信息弹窗 -->
    <a-modal
      v-model:open="editVisible"
      title="编辑个人信息"
      @ok="handleEditOk"
      :confirmLoading="editLoading"
    >
      <a-form :model="editForm" layout="vertical">
        <a-form-item label="姓名">
          <a-input v-model:value="editForm.name" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="editForm.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="editForm.phone" placeholder="请输入手机号" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { userApi } from '../api/user';
import { UserOutlined, EditOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

export default {
  name: 'MyProfile',
  components: { UserOutlined, EditOutlined },
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      activeTab: 'basic',
      profileData: {},
      editVisible: false,
      editLoading: false,
      editForm: {},
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordLoading: false
    };
  },
  mounted() {
    this.loadProfile();
  },
  methods: {
    async loadProfile() {
      this.loading = true;
      try {
        const res = await userApi.getUsers();
        if (res.data.success) {
          const currentUser = (res.data.data || []).find(
            u => u.username === this.user?.username
          );
          if (currentUser) {
            this.profileData = currentUser;
            this.editForm = { ...currentUser };
          }
        }
      } catch (error) {
        console.error('加载个人信息失败:', error);
      } finally {
        this.loading = false;
      }
    },
    editProfile() {
      this.editVisible = true;
    },
    async handleEditOk() {
      this.editLoading = true;
      try {
        const res = await userApi.updateUser(this.editForm.id, this.editForm);
        if (res.data.success) {
          message.success('个人信息更新成功');
          this.editVisible = false;
          this.profileData = { ...this.editForm };
        } else {
          message.error(res.data.message || '更新失败');
        }
      } catch (error) {
        message.error('更新失败');
      } finally {
        this.editLoading = false;
      }
    },
    async changePassword() {
      if (!this.passwordForm.oldPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
        message.warning('请填写所有密码字段');
        return;
      }
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        message.warning('两次密码输入不一致');
        return;
      }
      this.passwordLoading = true;
      try {
        message.success('密码修改成功（演示模式）');
        this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
      } catch (error) {
        message.error('修改失败');
      } finally {
        this.passwordLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.my-profile {
  padding: 0;
}
.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
