<!-- src/components/CourseSelectionManagement.vue -->
<template>
  <div class="course-selection-mgmt">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">选课管理</h2>
      </div>

      <!-- 筛选条件 -->
      <a-form layout="inline" class="filter-form">
        <a-form-item label="学期">
          <a-select v-model:value="filters.semester" placeholder="请选择学期" style="width: 180px">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="2024-2025学年第一学期">2024-2025学年第一学期</a-select-option>
            <a-select-option value="2024-2025学年第二学期">2024-2025学年第二学期</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="课程名称">
          <a-input v-model:value="filters.courseName" placeholder="请输入课程名称" style="width: 180px" />
        </a-form-item>
        <a-form-item label="学生姓名">
          <a-input v-model:value="filters.studentName" placeholder="请输入学生姓名" style="width: 150px" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <a-button type="primary" @click="handleOpenSelection">
          <template #icon><PlayCircleOutlined /></template>
          开放选课
        </a-button>
        <a-button style="margin-left: 8px" @click="handleCloseSelection">
          <template #icon><StopOutlined /></template>
          关闭选课
        </a-button>
        <a-button style="margin-left: 8px" @click="handleAdjust">
          <template #icon><SwapOutlined /></template>
          调整选课
        </a-button>
        <a-button style="margin-left: 8px" @click="handleExport">
          <template #icon><DownloadOutlined /></template>
          导出
        </a-button>
      </div>

      <!-- 选课列表表格 -->
      <a-table
        :columns="columns"
        :data-source="selections"
        :pagination="pagination"
        :loading="loading"
        size="middle"
        class="selection-table"
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
              <a @click="handleCancel(record)">退课</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除该选课记录吗？" @confirm="handleDelete(record)">
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
import { PlayCircleOutlined, StopOutlined, SwapOutlined, DownloadOutlined } from '@ant-design/icons-vue';

export default {
  name: 'CourseSelectionManagement',
  components: {
    PlayCircleOutlined,
    StopOutlined,
    SwapOutlined,
    DownloadOutlined
  },
  data() {
    return {
      filters: {
        semester: '',
        courseName: '',
        studentName: ''
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
          title: '学号',
          dataIndex: 'studentId',
          key: 'studentId',
          width: 130
        },
        {
          title: '学生姓名',
          dataIndex: 'studentName',
          key: 'studentName',
          width: 100
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
          title: '学分',
          dataIndex: 'credits',
          key: 'credits',
          width: 80,
          align: 'center'
        },
        {
          title: '选课时间',
          dataIndex: 'selectionTime',
          key: 'selectionTime',
          width: 160
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
      selections: [],
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
    this.loadSelections();
  },
  methods: {
    loadSelections() {
      this.loading = true;
      // 模拟数据
      setTimeout(() => {
        this.selections = [
          {
            id: 1,
            index: 1,
            semester: '2024-2025学年第一学期',
            studentId: '2021001',
            studentName: '张三',
            courseName: 'Java程序设计',
            teacher: '张老师',
            credits: 4.0,
            selectionTime: '2024-09-01 10:30:00',
            status: '已确认'
          },
          {
            id: 2,
            index: 2,
            semester: '2024-2025学年第一学期',
            studentId: '2021002',
            studentName: '李四',
            courseName: '数据结构',
            teacher: '李老师',
            credits: 3.0,
            selectionTime: '2024-09-01 11:20:00',
            status: '待审核'
          }
        ];
        this.pagination.total = this.selections.length;
        this.loading = false;
      }, 500);
    },
    getStatusColor(status) {
      const colorMap = {
        '已确认': 'green',
        '待审核': 'orange',
        '已退课': 'red',
        '已取消': 'default'
      };
      return colorMap[status] || 'default';
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadSelections();
    },
    handleReset() {
      this.filters = {
        semester: '',
        courseName: '',
        studentName: ''
      };
      this.handleSearch();
    },
    handleOpenSelection() {
      this.$message.info('开放选课功能开发中');
    },
    handleCloseSelection() {
      this.$message.info('关闭选课功能开发中');
    },
    handleAdjust() {
      this.$message.info('调整选课功能开发中');
    },
    handleExport() {
      this.$message.success('导出成功');
    },
    handleView(record) {
      this.$message.info(`查看选课详情：${record.studentName} - ${record.courseName}`);
    },
    handleCancel(record) {
      this.$message.info(`退课处理：${record.studentName} - ${record.courseName}`);
    },
    handleDelete(record) {
      this.$message.success(`已删除选课记录`);
      this.loadSelections();
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadSelections();
    }
  }
};
</script>

<style scoped>
.course-selection-mgmt {
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

.selection-table :deep(.ant-table-thead > tr > th) {
  background: #f0f2f5;
  font-weight: 600;
  color: #333;
}

.selection-table :deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
}
</style>
