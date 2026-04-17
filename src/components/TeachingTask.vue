<!-- src/components/TeachingTask.vue -->
<template>
  <div class="teaching-task">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">教学任务</h2>
      </div>

      <!-- 筛选条件 -->
      <a-form layout="inline" class="filter-form">
        <a-form-item label="学期">
          <a-select v-model:value="filters.semester" placeholder="请选择学期" style="width: 180px">
            <a-select-option value="2024-2025学年第一学期">2024-2025学年第一学期</a-select-option>
            <a-select-option value="2024-2025学年第二学期">2024-2025学年第二学期</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="教师">
          <a-input v-model:value="filters.teacher" placeholder="请输入教师姓名" style="width: 150px" />
        </a-form-item>
        <a-form-item label="课程名称">
          <a-input v-model:value="filters.courseName" placeholder="请输入课程名称" style="width: 180px" />
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
          分配任务
        </a-button>
        <a-button style="margin-left: 8px" @click="handleExport">
          <template #icon><DownloadOutlined /></template>
          导出
        </a-button>
      </div>

      <!-- 教学任务表格 -->
      <a-table
        :columns="columns"
        :data-source="tasks"
        :pagination="pagination"
        :loading="loading"
        size="middle"
        class="task-table"
        :row-key="record => record.id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="handleView(record)">查看</a>
              <a-divider type="vertical" />
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除该任务吗？" @confirm="handleDelete(record)">
                <a style="color: #ff4d4f">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:open="showEditModal"
      title="编辑教学任务"
      @ok="handleEditSubmit"
      :confirm-loading="editLoading"
    >
      <a-form :model="editForm" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="学期">
              <a-input v-model:value="editForm.semester" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="课程名称">
              <a-input v-model:value="editForm.courseName" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="授课教师">
              <a-input v-model:value="editForm.teacher" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="班级">
              <a-input v-model:value="editForm.className" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="学时">
              <a-input-number v-model:value="editForm.hours" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="学分">
              <a-input-number v-model:value="editForm.credits" :step="0.5" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="状态">
              <a-select v-model:value="editForm.status">
                <a-select-option value="未开始">未开始</a-select-option>
                <a-select-option value="进行中">进行中</a-select-option>
                <a-select-option value="已完成">已完成</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { teachingTaskApi } from '@/api/teachingTask';

export default {
  name: 'TeachingTask',
  components: {
    PlusOutlined,
    DownloadOutlined
  },
  data() {
    return {
      filters: {
        semester: '',
        teacher: '',
        courseName: ''
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
          title: '学期',
          dataIndex: 'semester',
          key: 'semester',
          width: 180
        },
        {
          title: '课程名称',
          dataIndex: 'courseName',
          key: 'courseName',
          width: 200
        },
        {
          title: '授课教师',
          dataIndex: 'teacher',
          key: 'teacher',
          width: 120
        },
        {
          title: '班级',
          dataIndex: 'className',
          key: 'className',
          width: 150
        },
        {
          title: '学时',
          dataIndex: 'hours',
          key: 'hours',
          width: 80,
          align: 'center'
        },
        {
          title: '学分',
          dataIndex: 'credits',
          key: 'credits',
          width: 80,
          align: 'center'
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
      tasks: [],
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
    this.loadTasks();
  },
  methods: {
    async loadTasks() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current - 1,
          size: this.pagination.pageSize,
          semester: this.filters.semester || undefined,
          courseName: this.filters.courseName || undefined
        };
        const res = await teachingTaskApi.getTasks(params);
        if (res.data.success) {
          this.tasks = res.data.data.map((item, index) => ({
            ...item,
            index: (this.pagination.current - 1) * this.pagination.pageSize + index + 1
          }));
          this.pagination.total = res.data.total;
        }
      } catch (error) {
        console.error('加载教学任务失败:', error);
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
    },
    getStatusColor(status) {
      const colorMap = {
        '未开始': 'default',
        '进行中': 'blue',
        '已完成': 'green',
        '已取消': 'red'
      };
      return colorMap[status] || 'default';
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadTasks();
    },
    handleReset() {
      this.filters = {
        semester: '',
        teacher: '',
        courseName: ''
      };
      this.handleSearch();
    },
    handleAdd() {
      this.editForm = {
        semester: '2024-2025学年第一学期',
        courseName: '',
        teacher: '',
        className: '',
        hours: 32,
        credits: 2,
        status: '未开始'
      };
      this.showEditModal = true;
    },
    handleExport() {
      this.$message.success('导出成功');
    },
    handleView(record) {
      this.$message.info(`查看教学任务：${record.courseName}`);
    },
    handleEdit(record) {
      this.editForm = { ...record };
      this.showEditModal = true;
    },
    async handleEditSubmit() {
      this.editLoading = true;
      try {
        await teachingTaskApi.updateTask(this.editForm.id, this.editForm);
        this.$message.success('更新成功');
        this.showEditModal = false;
        this.loadTasks();
      } catch (error) {
        console.error('更新失败:', error);
        this.$message.error('更新失败');
      } finally {
        this.editLoading = false;
      }
    },
    async handleDelete(record) {
      try {
        await teachingTaskApi.deleteTask(record.id);
        this.$message.success(`已删除教学任务：${record.courseName}`);
        this.loadTasks();
      } catch (error) {
        console.error('删除失败:', error);
        this.$message.error('删除失败');
      }
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadTasks();
    }
  }
};
</script>

<style scoped>
.teaching-task {
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

.task-table :deep(.ant-table-thead > tr > th) {
  background: #f0f2f5;
  font-weight: 600;
  color: #333;
}

.task-table :deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
}
</style>
