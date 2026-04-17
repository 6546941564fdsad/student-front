<!-- src/components/TeacherManagement.vue -->
<template>
  <div class="teacher-management">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">教师档案</h2>
      </div>

      <!-- 筛选条件 -->
      <a-form layout="inline" class="filter-form">
        <a-form-item label="姓名">
          <a-input v-model:value="filters.name" placeholder="请输入教师姓名" style="width: 150px" />
        </a-form-item>
        <a-form-item label="工号">
          <a-input v-model:value="filters.employeeId" placeholder="请输入工号" style="width: 150px" />
        </a-form-item>
        <a-form-item label="所属学院">
          <a-select v-model:value="filters.department" placeholder="请选择学院" style="width: 180px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="计算机学院">计算机学院</a-select-option>
            <a-select-option value="软件学院">软件学院</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="职称">
          <a-select v-model:value="filters.title" placeholder="请选择职称" style="width: 150px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="教授">教授</a-select-option>
            <a-select-option value="副教授">副教授</a-select-option>
            <a-select-option value="讲师">讲师</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增教师
        </a-button>
        <a-button style="margin-left: 8px" @click="handleExport">
          <template #icon><DownloadOutlined /></template>
          导出
        </a-button>
      </div>

      <!-- 教师列表表格 -->
      <a-table
        :columns="columns"
        :data-source="teachers"
        :pagination="pagination"
        :loading="loading"
        size="middle"
        class="teacher-table"
        :row-key="record => record.id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a @click="handleView(record)">{{ record.name }}</a>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === '在职' ? 'green' : 'red'">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="handleView(record)">查看</a>
              <a-divider type="vertical" />
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除该教师吗？" @confirm="handleDelete(record)">
                <a style="color: #ff4d4f">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:open="showEditModal"
      :title="editForm.id ? '编辑教师' : '新增教师'"
      @ok="handleEditSubmit"
      :confirm-loading="editLoading"
    >
      <a-form :model="editForm" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="姓名" required>
              <a-input v-model:value="editForm.name" placeholder="请输入姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="工号" required>
              <a-input v-model:value="editForm.employeeId" placeholder="请输入工号" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="性别">
              <a-select v-model:value="editForm.gender">
                <a-select-option value="男">男</a-select-option>
                <a-select-option value="女">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属学院">
              <a-input v-model:value="editForm.department" placeholder="请输入所属学院" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="职称">
              <a-select v-model:value="editForm.title">
                <a-select-option value="教授">教授</a-select-option>
                <a-select-option value="副教授">副教授</a-select-option>
                <a-select-option value="讲师">讲师</a-select-option>
                <a-select-option value="助教">助教</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系电话">
              <a-input v-model:value="editForm.phone" placeholder="请输入联系电话" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item label="状态">
          <a-select v-model:value="editForm.status">
            <a-select-option value="在职">在职</a-select-option>
            <a-select-option value="离职">离职</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import teacherApi from '../api/teacher';

export default {
  name: 'TeacherManagement',
  components: {
    PlusOutlined,
    DownloadOutlined
  },
  data() {
    return {
      filters: {
        name: '',
        employeeId: '',
        department: '',
        title: ''
      },
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          width: 120
        },
        {
          title: '工号',
          dataIndex: 'employeeId',
          key: 'employeeId',
          width: 120
        },
        {
          title: '性别',
          dataIndex: 'gender',
          key: 'gender',
          width: 80,
          align: 'center'
        },
        {
          title: '所属学院',
          dataIndex: 'department',
          key: 'department',
          width: 150
        },
        {
          title: '职称',
          dataIndex: 'title',
          key: 'title',
          width: 100
        },
        {
          title: '联系电话',
          dataIndex: 'phone',
          key: 'phone',
          width: 130
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 180,
          align: 'center',
          fixed: 'right'
        }
      ],
      teachers: [],
      loading: false,
      editLoading: false,
      showEditModal: false,
      editForm: {},
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
      }
    };
  },
  mounted() {
    this.loadTeachers();
  },
  methods: {
    async loadTeachers() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current - 1,
          size: this.pagination.pageSize,
          name: this.filters.name || undefined,
          employeeId: this.filters.employeeId || undefined,
          department: this.filters.department || undefined,
          title: this.filters.title || undefined
        };
        const res = await teacherApi.getTeachers(params);
        if (res.data.success) {
          this.teachers = res.data.data.map((item, index) => ({
            ...item,
            index: (this.pagination.current - 1) * this.pagination.pageSize + index + 1
          }));
          this.pagination.total = res.data.total;
        }
      } catch (error) {
        console.error('加载教师数据失败:', error);
        this.$message.error('加载教师数据失败');
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadTeachers();
    },
    handleReset() {
      this.filters = {
        name: '',
        employeeId: '',
        department: '',
        title: ''
      };
      this.handleSearch();
    },
    handleAdd() {
      this.editForm = {
        name: '',
        employeeId: '',
        gender: '男',
        department: '',
        title: '',
        phone: '',
        status: '在职'
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
          await teacherApi.updateTeacher(this.editForm.id, this.editForm);
        } else {
          await teacherApi.addTeacher(this.editForm);
        }
        this.$message.success('保存成功');
        this.showEditModal = false;
        this.loadTeachers();
      } catch (error) {
        console.error('保存失败:', error);
        this.$message.error('保存失败');
      } finally {
        this.editLoading = false;
      }
    },
    async handleDelete(record) {
      try {
        await teacherApi.deleteTeacher(record.id);
        this.$message.success('删除成功');
        this.loadTeachers();
      } catch (error) {
        this.$message.error('删除失败');
      }
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadTeachers();
    }
  }
};
</script>

<style scoped>
.teacher-management {
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

.filter-form {
  margin-bottom: 16px;
}

.action-bar {
  margin-bottom: 16px;
}

.teacher-table :deep(.ant-table-thead > tr > th) {
  background: #f0f2f5;
  font-weight: 600;
  color: #333;
}

.teacher-table :deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
}
</style>
