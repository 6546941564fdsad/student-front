<!-- src/components/PermissionManagement.vue -->
<template>
  <div class="permission-management">
    <a-card title="权限管理">
      <a-alert message="权限管理功能" description="管理系统角色和权限分配，支持细粒度权限控制" type="info" show-icon style="margin-bottom: 16px" />
      
      <!-- 角色列表 -->
      <a-card title="角色列表" style="margin-bottom: 16px">
        <a-table :columns="roleColumns" :data-source="roles" row-key="id" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'permissions'">
              <a-space>
                <a-tag v-for="perm in record.permissions" :key="perm" color="blue">{{ perm }}</a-tag>
              </a-space>
            </template>
            <template v-if="column.key === 'action'">
              <a-space size="small">
                <a-button type="primary" size="small" @click="editPermissions(record)">
                  <template #icon><form-outlined /></template>
                  编辑权限
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>
      
      <!-- 权限矩阵 -->
      <a-card title="权限矩阵">
        <a-table :columns="permissionColumns" :data-source="permissionMatrix" row-key="module" :pagination="false" :scroll="{ x: 800 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key !== 'module'">
              <a-checkbox :checked="record[column.key]" disabled />
            </template>
          </template>
        </a-table>
      </a-card>
    </a-card>
    
    <!-- 编辑权限对话框 -->
    <a-modal
      title="编辑权限"
      :open="showModal"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <a-form layout="vertical">
        <a-form-item label="角色名称">
          <a-input v-model:value="currentRole.name" disabled />
        </a-form-item>
        <a-form-item label="权限配置">
          <a-checkbox-group v-model:value="selectedPermissions" style="width: 100%">
            <a-row>
              <a-col :span="8" v-for="perm in allPermissions" :key="perm">
                <a-checkbox :value="perm">{{ perm }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { FormOutlined } from '@ant-design/icons-vue';

export default {
  name: 'PermissionManagement',
  components: { FormOutlined },
  data() {
    return {
      showModal: false,
      currentRole: null,
      selectedPermissions: [],
      allPermissions: ['查看', '新增', '编辑', '删除', '导出', '审核', '管理'],
      roles: [
        { id: 1, name: '管理员', permissions: ['查看', '新增', '编辑', '删除', '导出', '审核', '管理'] },
        { id: 2, name: '教师', permissions: ['查看', '新增', '编辑', '导出'] },
        { id: 3, name: '学生', permissions: ['查看'] }
      ],
      permissionMatrix: [
        { module: '学生管理', '管理员': true, '教师': true, '学生': false },
        { module: '课程管理', '管理员': true, '教师': true, '学生': true },
        { module: '成绩管理', '管理员': true, '教师': true, '学生': true },
        { module: '活动管理', '管理员': true, '教师': true, '学生': true },
        { module: '系统管理', '管理员': true, '教师': false, '学生': false }
      ],
      roleColumns: [
        { title: '角色名称', dataIndex: 'name', key: 'name', width: 150 },
        { title: '权限', key: 'permissions' },
        { title: '操作', key: 'action', width: 150 }
      ],
      permissionColumns: [
        { title: '功能模块', dataIndex: 'module', key: 'module', width: 150, fixed: 'left' },
        { title: '管理员', dataIndex: '管理员', key: '管理员', width: 100 },
        { title: '教师', dataIndex: '教师', key: '教师', width: 100 },
        { title: '学生', dataIndex: '学生', key: '学生', width: 100 }
      ]
    };
  },
  methods: {
    editPermissions(role) {
      this.currentRole = { ...role };
      this.selectedPermissions = [...role.permissions];
      this.showModal = true;
    },
    handleModalOk() {
      const index = this.roles.findIndex(r => r.id === this.currentRole.id);
      if (index !== -1) {
        this.roles[index].permissions = [...this.selectedPermissions];
      }
      this.$message.success('权限配置已更新');
      this.showModal = false;
    },
    handleModalCancel() {
      this.showModal = false;
    }
  }
};
</script>

<style scoped>
.permission-management {
  padding: 20px;
}
</style>
