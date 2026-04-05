<!-- src/components/UserManagement.vue -->
<template>
  <div class="user-management">
    <a-card title="用户管理">
      <!-- 工具栏 -->
      <div class="toolbar">
        <a-space>
          <a-input-search 
            placeholder="搜索用户名/姓名" 
            style="width: 300px" 
            @search="handleSearch"
          />
          <a-select placeholder="用户角色" style="width: 150px" @change="handleRoleFilter">
            <a-option value="">全部</a-option>
            <a-option value="管理员">管理员</a-option>
            <a-option value="教师">教师</a-option>
            <a-option value="学生">学生</a-option>
          </a-select>
        </a-space>
        <a-button type="primary" @click="showAddModal">
          <template #icon><plus-outlined /></template>
          新增用户
        </a-button>
      </div>
      
      <!-- 用户列表 -->
      <a-table :columns="columns" :data-source="filteredUsers" row-key="id" :loading="loading">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.role)">{{ record.role }}</a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === '启用' ? 'green' : 'red'">{{ record.status }}</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space size="small">
              <a-button type="primary" size="small" @click="editUser(record)">
                <template #icon><form-outlined /></template>
                编辑
              </a-button>
              <a-button danger size="small" @click="deleteUser(record.id)">
                <template #icon><delete-outlined /></template>
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
    
    <!-- 新增/编辑用户对话框 -->
    <a-modal
      :title="currentUser ? '编辑用户' : '新增用户'"
      :open="showModal"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <a-form :model="userForm" layout="vertical">
        <a-form-item label="用户名">
          <a-input v-model:value="userForm.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-model:value="userForm.name" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="角色">
          <a-select v-model:value="userForm.role" placeholder="请选择角色">
            <a-option value="管理员">管理员</a-option>
            <a-option value="教师">教师</a-option>
            <a-option value="学生">学生</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model:value="userForm.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="userForm.status" placeholder="请选择状态">
            <a-option value="启用">启用</a-option>
            <a-option value="禁用">禁用</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons-vue';

export default {
  name: 'UserManagement',
  components: { PlusOutlined, FormOutlined, DeleteOutlined },
  data() {
    return {
      loading: false,
      showModal: false,
      currentUser: null,
      searchText: '',
      roleFilter: '',
      users: [
        { id: 1, username: 'admin', name: '系统管理员', role: '管理员', email: 'admin@example.com', status: '启用' },
        { id: 2, username: 'teacher01', name: '张老师', role: '教师', email: 'teacher01@example.com', status: '启用' },
        { id: 3, username: 'student01', name: '张三', role: '学生', email: 'student01@example.com', status: '启用' }
      ],
      userForm: {
        username: '',
        name: '',
        role: '',
        email: '',
        status: '启用'
      },
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '用户名', dataIndex: 'username', key: 'username', width: 150 },
        { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
        { title: '角色', dataIndex: 'role', key: 'role', width: 120 },
        { title: '邮箱', dataIndex: 'email', key: 'email', width: 200 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '操作', key: 'action', width: 200 }
      ]
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        const matchesSearch = !this.searchText || 
          user.username.includes(this.searchText) || 
          user.name.includes(this.searchText);
        const matchesRole = !this.roleFilter || user.role === this.roleFilter;
        return matchesSearch && matchesRole;
      });
    }
  },
  methods: {
    handleSearch(value) {
      this.searchText = value;
    },
    handleRoleFilter(value) {
      this.roleFilter = value;
    },
    showAddModal() {
      this.currentUser = null;
      this.userForm = {
        username: '',
        name: '',
        role: '',
        email: '',
        status: '启用'
      };
      this.showModal = true;
    },
    editUser(user) {
      this.currentUser = user;
      this.userForm = { ...user };
      this.showModal = true;
    },
    handleModalOk() {
      if (!this.userForm.username || !this.userForm.name || !this.userForm.role) {
        this.$message.error('请填写完整信息');
        return;
      }
      
      if (this.currentUser) {
        // 编辑用户
        const index = this.users.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) {
          this.users[index] = { ...this.users[index], ...this.userForm };
        }
        this.$message.success('编辑用户成功');
      } else {
        // 新增用户
        const newUser = {
          ...this.userForm,
          id: this.users.length + 1
        };
        this.users.push(newUser);
        this.$message.success('新增用户成功');
      }
      
      this.showModal = false;
    },
    handleModalCancel() {
      this.showModal = false;
    },
    deleteUser(id) {
      this.$confirm({
        title: '删除确认',
        content: '确定要删除该用户吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.users = this.users.filter(u => u.id !== id);
          this.$message.success('删除用户成功');
        }
      });
    },
    getRoleColor(role) {
      switch (role) {
        case '管理员': return 'red';
        case '教师': return 'blue';
        case '学生': return 'green';
        default: return 'default';
      }
    }
  }
};
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
</style>
