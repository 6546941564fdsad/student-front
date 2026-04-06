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
  </div>
</template>

<script>
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons-vue';

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
    loadTeachers() {
      this.loading = true;
      // 模拟数据
      setTimeout(() => {
        this.teachers = [
          {
            id: 1,
            index: 1,
            name: '张老师',
            employeeId: 'T001',
            gender: '男',
            department: '计算机学院',
            title: '教授',
            phone: '13800138001',
            status: '在职'
          },
          {
            id: 2,
            index: 2,
            name: '李老师',
            employeeId: 'T002',
            gender: '女',
            department: '软件学院',
            title: '副教授',
            phone: '13800138002',
            status: '在职'
          }
        ];
        this.pagination.total = this.teachers.length;
        this.loading = false;
      }, 500);
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
      this.$message.info('新增教师功能开发中');
    },
    handleExport() {
      this.$message.success('导出成功');
    },
    handleView(record) {
      this.$message.info(`查看教师：${record.name}`);
    },
    handleEdit(record) {
      this.$message.info(`编辑教师：${record.name}`);
    },
    handleDelete(record) {
      this.$message.success(`已删除教师：${record.name}`);
      this.loadTeachers();
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
