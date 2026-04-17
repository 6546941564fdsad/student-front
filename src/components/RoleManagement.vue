<!-- src/components/RoleManagement.vue -->
<template>
  <div class="role-management">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">角色权限管理</h2>
      </div>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增角色
        </a-button>
      </div>

      <!-- 角色列表表格 -->
      <a-table
        :columns="columns"
        :data-source="roles"
        :pagination="false"
        :loading="loading"
        size="middle"
        class="role-table"
        :row-key="record => record.id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'permissions'">
            <a-space wrap>
              <a-tag v-for="perm in record.permissions" :key="perm" color="blue">
                {{ perm }}
              </a-tag>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-switch 
              v-model:checked="record.status" 
              checked-children="启用" 
              un-checked-children="禁用"
              @change="handleStatusChange(record)"
            />
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a @click="handlePermission(record)">权限配置</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除该角色吗？" @confirm="handleDelete(record)">
                <a style="color: #ff4d4f">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 权限配置对话框 -->
    <a-modal
      v-model:open="permissionModalVisible"
      title="权限配置"
      width="800px"
      @ok="handlePermissionSave"
    >
      <a-tree
        v-model:checkedKeys="checkedKeys"
        checkable
        :tree-data="permissionTree"
        :default-expand-all="true"
      />
    </a-modal>

    <!-- 新增/编辑角色弹窗 -->
    <a-modal
      v-model:open="showEditModal"
      :title="editForm.id ? '编辑角色' : '新增角色'"
      :confirm-loading="editLoading"
      @ok="handleEditSubmit"
    >
      <a-form :model="editForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="角色名称" required>
          <a-input v-model:value="editForm.roleName" placeholder="请输入角色名称" />
        </a-form-item>
        <a-form-item label="角色编码" required>
          <a-input v-model:value="editForm.roleCode" placeholder="请输入角色编码" />
        </a-form-item>
        <a-form-item label="角色描述">
          <a-textarea v-model:value="editForm.description" placeholder="请输入角色描述" :rows="3" />
        </a-form-item>
        <a-form-item label="状态">
          <a-switch v-model:checked="editForm.status" checked-children="启用" un-checked-children="禁用" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue';
import { roleApi } from '@/api/role';

export default {
  name: 'RoleManagement',
  components: {
    PlusOutlined
  },
  data() {
    return {
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '角色名称',
          dataIndex: 'roleName',
          key: 'roleName',
          width: 150
        },
        {
          title: '角色编码',
          dataIndex: 'roleCode',
          key: 'roleCode',
          width: 150
        },
        {
          title: '角色描述',
          dataIndex: 'description',
          key: 'description'
        },
        {
          title: '权限列表',
          dataIndex: 'permissions',
          key: 'permissions',
          width: 300
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          width: 160
        },
        {
          title: '操作',
          key: 'action',
          width: 220,
          align: 'center',
          fixed: 'right'
        }
      ],
      roles: [],
      loading: false,
      permissionModalVisible: false,
      currentRoleId: null,
      checkedKeys: [],
      showEditModal: false,
      editLoading: false,
      editForm: {
        id: null,
        roleName: '',
        roleCode: '',
        description: '',
        status: true
      },
      permissionTree: [
        {
          title: '系统概览',
          key: 'dashboard',
          children: [
            { title: '数据统计', key: 'data-stats' },
            { title: '待办事项', key: 'todo-list' },
            { title: '系统公告', key: 'system-notice' }
          ]
        },
        {
          title: '学生管理',
          key: 'student-mgmt',
          children: [
            { title: '学生档案', key: 'student-archives' },
            { title: '学籍管理', key: 'student-status' },
            { title: '奖惩管理', key: 'student-punishment' },
            { title: '毕业审核', key: 'graduation-audit' }
          ]
        },
        {
          title: '课程管理',
          key: 'course-mgmt',
          children: [
            { title: '课程库管理', key: 'course-library' },
            { title: '培养方案管理', key: 'training-plan' },
            { title: '教学计划', key: 'teaching-plan' },
            { title: '课程排课', key: 'course-scheduling' }
          ]
        },
        {
          title: '系统设置',
          key: 'system-settings',
          children: [
            { title: '用户管理', key: 'user-mgmt' },
            { title: '角色权限', key: 'role-permission' },
            { title: '数据字典', key: 'data-dictionary' },
            { title: '系统日志', key: 'system-log' }
          ]
        }
      ]
    };
  },
  mounted() {
    this.loadRoles();
  },
  methods: {
    async loadRoles() {
      this.loading = true;
      try {
        const res = await roleApi.getRoles();
        if (res.data.success) {
          this.roles = res.data.data.map((item, index) => ({
            ...item,
            index: index + 1,
            permissions: ['全部权限'] // 模拟权限显示，后续可扩展
          }));
        }
      } catch (error) {
        console.error('加载角色失败:', error);
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
    },
    handleAdd() {
      this.editForm = {
        id: null,
        roleName: '',
        roleCode: '',
        description: '',
        status: true
      };
      this.showEditModal = true;
    },
    handleEdit(record) {
      this.editForm = { ...record };
      this.showEditModal = true;
    },
    async handleEditSubmit() {
      this.editLoading = true;
      try {
        if (this.editForm.id) {
          await roleApi.updateRole(this.editForm.id, this.editForm);
          this.$message.success('更新成功');
        } else {
          await roleApi.addRole(this.editForm);
          this.$message.success('新增成功');
        }
        this.showEditModal = false;
        this.loadRoles();
      } catch (error) {
        console.error('保存失败:', error);
        this.$message.error('保存失败');
      } finally {
        this.editLoading = false;
      }
    },
    handlePermission(record) {
      this.currentRoleId = record.id;
      this.permissionModalVisible = true;
      this.checkedKeys = []; // 加载该角色的权限
    },
    async handlePermissionSave() {
      try {
        // TODO: 调用后端接口保存权限配置
        this.$message.success('权限配置保存成功');
        this.permissionModalVisible = false;
      } catch (error) {
        this.$message.error('保存失败');
      }
    },
    async handleStatusChange(record) {
      try {
        await roleApi.updateRole(record.id, record);
        const statusText = record.status ? '启用' : '禁用';
        this.$message.success(`角色 ${record.roleName} 已${statusText}`);
      } catch (error) {
        this.$message.error('状态更新失败');
        // 回滚状态
        record.status = !record.status;
      }
    },
    async handleDelete(record) {
      try {
        await roleApi.deleteRole(record.id);
        this.$message.success(`已删除角色：${record.roleName}`);
        this.loadRoles();
      } catch (error) {
        console.error('删除失败:', error);
        this.$message.error('删除失败');
      }
    },
  }
};
</script>

<style scoped>
.role-management {
  padding: 0;
}

.page-header {
  margin-bottom: 16px;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.action-bar {
  margin-bottom: 16px;
}

.role-table :deep(.ant-table-thead > tr > th) {
  background: #f0f2f5;
  font-weight: 600;
  color: #333;
}

.role-table :deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
}
</style>
