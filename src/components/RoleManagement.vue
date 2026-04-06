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
  </div>
</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue';

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
        }
      ]
    };
  },
  mounted() {
    this.loadRoles();
  },
  methods: {
    loadRoles() {
      this.loading = true;
      // 模拟数据
      setTimeout(() => {
        this.roles = [
          {
            id: 1,
            index: 1,
            roleName: '超级管理员',
            roleCode: 'SUPER_ADMIN',
            description: '拥有系统所有权限',
            permissions: ['全部权限'],
            status: true,
            createTime: '2024-01-01 10:00:00'
          },
          {
            id: 2,
            index: 2,
            roleName: '教务管理员',
            roleCode: 'ACADEMIC_ADMIN',
            description: '负责教学管理相关功能',
            permissions: ['学生管理', '课程管理', '成绩管理'],
            status: true,
            createTime: '2024-01-01 10:00:00'
          },
          {
            id: 3,
            index: 3,
            roleName: '教师',
            roleCode: 'TEACHER',
            description: '教师角色，可查看和录入成绩',
            permissions: ['成绩录入', '教学任务'],
            status: true,
            createTime: '2024-01-01 10:00:00'
          }
        ];
        this.loading = false;
      }, 500);
    },
    handleAdd() {
      this.$message.info('新增角色功能开发中');
    },
    handleEdit(record) {
      this.$message.info(`编辑角色：${record.roleName}`);
    },
    handlePermission(record) {
      this.currentRoleId = record.id;
      this.permissionModalVisible = true;
      this.checkedKeys = []; // 加载该角色的权限
    },
    handlePermissionSave() {
      this.$message.success('权限配置保存成功');
      this.permissionModalVisible = false;
    },
    handleStatusChange(record) {
      const statusText = record.status ? '启用' : '禁用';
      this.$message.success(`角色 ${record.roleName} 已${statusText}`);
    },
    handleDelete(record) {
      this.$message.success(`已删除角色：${record.roleName}`);
      this.loadRoles();
    }
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
