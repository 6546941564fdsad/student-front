<!-- src/components/UserManagement.vue -->
<template>
  <div class="user-management">
    <a-card :bordered="false">
      <div class="page-header">
        <h2 class="page-title">用户管理</h2>
        <a-button type="primary" @click="showAddModal">
          <template #icon><PlusOutlined /></template>
          新增用户
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="users"
        :pagination="pagination"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.role)">{{ record.role }}</a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-badge :status="record.status === '启用' ? 'success' : 'default'" :text="record.status" />
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="editUser(record)">编辑</a-button>
              <a-button type="link" size="small" @click="resetPassword(record)">重置密码</a-button>
              <a-button type="link" danger size="small" @click="toggleStatus(record)">
                {{ record.status === '启用' ? '禁用' : '启用' }}
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue';
import { userApi } from '@/api/user';

export default {
  name: 'UserManagement',
  components: {
    PlusOutlined
  },
  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        { title: '用户名', dataIndex: 'username', key: 'username', width: 120 },
        { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
        { title: '角色', key: 'role', width: 120 },
        { title: '所属部门', dataIndex: 'department', key: 'department' },
        { title: '手机号', dataIndex: 'phone', key: 'phone', width: 130 },
        { title: '状态', key: 'status', width: 100 },
        { title: '最后登录', dataIndex: 'lastLogin', key: 'lastLogin', width: 160 },
        { title: '操作', key: 'action', width: 220, fixed: 'right' }
      ],
      users: []
    };
  },
  mounted() {
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      try {
        const res = await userApi.getUsers();
        if (res.data.success) {
          this.users = res.data.data;
          this.pagination.total = this.users.length;
        }
      } catch (error) {
        console.error('加载用户失败:', error);
        this.$message.error('加载数据失败');
      }
    },
    getRoleColor(role) {
      const colorMap = {
        '超级管理员': 'red',
        '管理员': 'orange',
        '教师': 'blue',
        '学生': 'green'
      };
      return colorMap[role] || 'default';
    },
    showAddModal() {
      this.$message.info('新增用户功能');
    },
    editUser(user) {
      this.$message.info(`编辑用户：${user.name}`);
    },
    resetPassword(user) {
      this.$confirm({
        title: '确认重置密码',
        content: `确定要重置用户 ${user.name} 的密码吗？`,
        onOk: () => {
          this.$message.success('密码已重置为默认密码');
        }
      });
    },
    toggleStatus(user) {
      const action = user.status === '启用' ? '禁用' : '启用';
      this.$confirm({
        title: `确认${action}`,
        content: `确定要${action}用户 ${user.name} 吗？`,
        onOk: () => {
          user.status = user.status === '启用' ? '禁用' : '启用';
          this.$message.success(`${action}成功`);
        }
      });
    }
  }
};
</script>

<style scoped>
.user-management {
  padding: 0;
}

.page-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}
</style>
