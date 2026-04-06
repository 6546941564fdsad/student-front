<!-- src/components/AttendanceManagement.vue -->
<template>
  <div class="attendance-management">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">考勤管理</h2>
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
        <a-form-item label="考勤状态">
          <a-select v-model:value="filters.status" placeholder="请选择状态" style="width: 150px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="出勤">出勤</a-select-option>
            <a-select-option value="迟到">迟到</a-select-option>
            <a-select-option value="缺勤">缺勤</a-select-option>
            <a-select-option value="请假">请假</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <a-button type="primary" @click="handleBatchEntry">
          <template #icon><PlusOutlined /></template>
          批量录入
        </a-button>
        <a-button style="margin-left: 8px" @click="handleExport">
          <template #icon><DownloadOutlined /></template>
          导出
        </a-button>
        <a-button style="margin-left: 8px" @click="handleStatistics">
          <template #icon><BarChartOutlined /></template>
          考勤统计
        </a-button>
      </div>

      <!-- 考勤列表表格 -->
      <a-table
        :columns="columns"
        :data-source="attendances"
        :pagination="pagination"
        :loading="loading"
        size="middle"
        class="attendance-table"
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
              <a-popconfirm title="确定要删除该考勤记录吗？" @confirm="handleDelete(record)">
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
import { PlusOutlined, DownloadOutlined, BarChartOutlined } from '@ant-design/icons-vue';

export default {
  name: 'AttendanceManagement',
  components: {
    PlusOutlined,
    DownloadOutlined,
    BarChartOutlined
  },
  data() {
    return {
      filters: {
        semester: '',
        courseName: '',
        studentName: '',
        status: ''
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
          title: '上课时间',
          dataIndex: 'classTime',
          key: 'classTime',
          width: 160
        },
        {
          title: '考勤状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          align: 'center'
        },
        {
          title: '记录时间',
          dataIndex: 'recordTime',
          key: 'recordTime',
          width: 160
        },
        {
          title: '操作',
          key: 'action',
          width: 180,
          align: 'center',
          fixed: 'right'
        }
      ],
      attendances: [],
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
    this.loadAttendances();
  },
  methods: {
    loadAttendances() {
      this.loading = true;
      // 模拟数据
      setTimeout(() => {
        this.attendances = [
          {
            id: 1,
            index: 1,
            semester: '2024-2025学年第一学期',
            studentId: '2021001',
            studentName: '张三',
            courseName: 'Java程序设计',
            classTime: '2024-11-15 08:00',
            status: '出勤',
            recordTime: '2024-11-15 08:05:00'
          },
          {
            id: 2,
            index: 2,
            semester: '2024-2025学年第一学期',
            studentId: '2021002',
            studentName: '李四',
            courseName: '数据结构',
            classTime: '2024-11-15 10:00',
            status: '迟到',
            recordTime: '2024-11-15 10:15:00'
          }
        ];
        this.pagination.total = this.attendances.length;
        this.loading = false;
      }, 500);
    },
    getStatusColor(status) {
      const colorMap = {
        '出勤': 'green',
        '迟到': 'orange',
        '缺勤': 'red',
        '请假': 'blue'
      };
      return colorMap[status] || 'default';
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadAttendances();
    },
    handleReset() {
      this.filters = {
        semester: '',
        courseName: '',
        studentName: '',
        status: ''
      };
      this.handleSearch();
    },
    handleBatchEntry() {
      this.$message.info('批量录入考勤功能开发中');
    },
    handleExport() {
      this.$message.success('导出成功');
    },
    handleStatistics() {
      this.$message.info('考勤统计功能开发中');
    },
    handleView(record) {
      this.$message.info(`查看考勤详情：${record.studentName} - ${record.courseName}`);
    },
    handleEdit(record) {
      this.$message.info(`编辑考勤记录：${record.studentName} - ${record.courseName}`);
    },
    handleDelete(record) {
      this.$message.success(`已删除考勤记录`);
      this.loadAttendances();
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadAttendances();
    }
  }
};
</script>

<style scoped>
.attendance-management {
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

.attendance-table :deep(.ant-table-thead > tr > th) {
  background: #f0f2f5;
  font-weight: 600;
  color: #333;
}

.attendance-table :deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
}
</style>
