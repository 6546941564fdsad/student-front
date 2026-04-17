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
        :loading="loading"
        :row-key="record => record.id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'index'">
            {{ (pagination.current - 1) * pagination.pageSize + record.index }}
          </template>
          <template v-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.role)">{{ getRoleText(record.role) }}</a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-badge :status="getStatusBadge(record.status)" :text="record.status" />
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <template v-if="record.status === '待审核'">
                <a-button type="link" size="small" style="color: #52c41a;" @click="approveUser(record)">通过</a-button>
                <a-button type="link" size="small" style="color: #ff4d4f;" @click="rejectUser(record)">拒绝</a-button>
              </template>
              <a-button type="link" size="small" @click="editUser(record)">编辑</a-button>
              <a-button type="link" size="small" @click="resetPassword(record)">重置密码</a-button>
              <a-button type="link" danger size="small" @click="toggleStatus(record)">
                {{ record.status === '禁用' ? '启用' : '禁用' }}
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑用户弹窗 -->
    <a-modal
      v-model:open="showEditModal"
      :title="editForm.id ? '编辑用户' : '新增用户'"
      :confirm-loading="editLoading"
      @ok="handleEditSubmit"
    >
      <a-form :model="editForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="用户名" required>
          <a-input v-model:value="editForm.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="姓名" required>
          <a-input v-model:value="editForm.name" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="角色" required>
          <a-select v-model:value="editForm.role" placeholder="请选择角色">
            <a-select-option v-for="r in roles" :key="r" :value="r">{{ r }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="所属部门">
          <a-input v-model:value="editForm.department" placeholder="请输入所属部门" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model:value="editForm.phone" placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item label="状态">
          <a-radio-group v-model:value="editForm.status">
            <a-radio value="启用">启用</a-radio>
            <a-radio value="禁用">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
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
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      columns: [],
      users: [],
      showEditModal: false,
      editLoading: false,
      editForm: {
        id: null,
        username: '',
        name: '',
        role: '',
        department: '',
        phone: '',
        status: '正常'
      },
      roles: ['ADMIN', 'TEACHER', 'STUDENT'],
      roleMap: {
        'ADMIN': '管理员',
        'TEACHER': '教师',
        'STUDENT': '学生'
      }
    };
  },
  mounted() {
    // 初始化表格列
    this.columns = [
      { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
      { title: '用户名', dataIndex: 'username', key: 'username', width: 120 },
      { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
      { title: '角色', key: 'role', width: 100 },
      { title: '学号/工号', dataIndex: 'studentNo', key: 'studentNo', width: 120 },
      { title: '所属部门', dataIndex: 'department', key: 'department', width: 150 },
      { title: '手机号', dataIndex: 'phone', key: 'phone', width: 130 },
      { title: '状态', key: 'status', width: 100 },
      { title: '注册时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
      { title: '操作', key: 'action', width: 220, fixed: 'right' }
    ];
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      this.loading = true;
      try {
        const res = await userApi.getUsers();
        if (res.data.success) {
          this.users = (res.data.data || []).map((item, index) => ({
            ...item,
            index: index + 1
          }));
          this.pagination.total = this.users.length;
        }
      } catch (error) {
        console.error('加载用户失败:', error);
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
    },
    getRoleColor(role) {
      const colorMap = {
        'ADMIN': 'orange',
        'TEACHER': 'blue',
        'STUDENT': 'green'
      };
      return colorMap[role] || 'default';
    },
    getRoleText(role) {
      return this.roleMap[role] || role;
    },
    getStatusBadge(status) {
      const badgeMap = {
        '正常': 'success',
        '待审核': 'processing',
        '禁用': 'error'
      };
      return badgeMap[status] || 'default';
    },
    // 通过审核
    approveUser(user) {
      this.$confirm({
        title: '确认通过',
        content: `确定要通过用户 ${user.name || user.username} 的注册申请吗？`,
        onOk: async () => {
          try {
            await userApi.updateUser(user.id, { ...user, status: '正常' });
            this.$message.success('审核通过');
            this.loadUsers();
          } catch (error) {
            this.$message.error('审核失败');
          }
        }
      });
    },
    // 拒绝审核
    rejectUser(user) {
      this.$confirm({
        title: '确认拒绝',
        content: `确定要拒绝用户 ${user.name || user.username} 的注册申请吗？`,
        onOk: async () => {
          try {
            await userApi.updateUser(user.id, { ...user, status: '禁用' });
            this.$message.success('已拒绝');
            this.loadUsers();
          } catch (error) {
            this.$message.error('操作失败');
          }
        }
      });
    },
    showAddModal() {
      this.editForm = {
        id: null,
        username: '',
        name: '',
        role: '',
        department: '',
        phone: '',
        status: '正常'
      };
      this.showEditModal = true;
    },
    editUser(user) {
      this.editForm = { ...user };
      this.showEditModal = true;
    },
    async handleEditSubmit() {
      this.editLoading = true;
      try {
        if (this.editForm.id) {
          await userApi.updateUser(this.editForm.id, this.editForm);
          this.$message.success('更新成功');
        } else {
          await userApi.addUser(this.editForm);
          this.$message.success('新增成功');
        }
        this.showEditModal = false;
        this.loadUsers();
      } catch (error) {
        console.error('保存失败:', error);
        this.$message.error('保存失败');
      } finally {
        this.editLoading = false;
      }
    },
    resetPassword(user) {
      this.$confirm({
        title: '确认重置密码',
        content: `确定要重置用户 ${user.name} 的密码吗？`,
        onOk: async () => {
          try {
            await userApi.resetPassword(user.id);
            this.$message.success('密码已重置为默认密码');
          } catch (error) {
            this.$message.error('重置密码失败');
          }
        }
      });
    },
    toggleStatus(user) {
      const action = user.status === '禁用' ? '启用' : '禁用';
      this.$confirm({
        title: `确认${action}`,
        content: `确定要${action}用户 ${user.name || user.username} 吗？`,
        onOk: async () => {
          try {
            user.status = action === '启用' ? '正常' : '禁用';
            await userApi.updateUser(user.id, user);
            this.$message.success(`${action}成功`);
            this.loadUsers();
          } catch (error) {
            this.$message.error(`${action}失败`);
          }
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
