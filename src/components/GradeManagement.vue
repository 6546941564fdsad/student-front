<!-- src/components/GradeManagement.vue -->
<template>
  <div class="grade-management">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">成绩管理</h2>
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
        <a-form-item label="学号">
          <a-input v-model:value="filters.studentId" placeholder="请输入学号" style="width: 150px" />
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
        <a-button style="margin-left: 8px" @click="handleAudit">
          <template #icon><SafetyCertificateOutlined /></template>
          成绩审核
        </a-button>
        <a-button style="margin-left: 8px" @click="handleAnalysis">
          <template #icon><BarChartOutlined /></template>
          成绩分析
        </a-button>
        <a-button style="margin-left: 8px" @click="handleExport">
          <template #icon><DownloadOutlined /></template>
          导出成绩
        </a-button>
      </div>

      <!-- 成绩列表表格 -->
      <a-table
        :columns="columns"
        :data-source="grades"
        :pagination="pagination"
        :loading="loading"
        size="middle"
        class="grade-table"
        :row-key="record => record.id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'score'">
            <span :style="{ color: getScoreColor(record.score), fontWeight: 'bold' }">
              {{ record.score }}
            </span>
          </template>
          <template v-else-if="column.key === 'grade'">
            <a-tag :color="getGradeColor(record.grade)">
              {{ record.grade }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === '已审核' ? 'green' : 'orange'">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="handleView(record)">查看</a>
              <a-divider type="vertical" />
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除该成绩吗？" @confirm="handleDelete(record)">
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
import { PlusOutlined, DownloadOutlined, SafetyCertificateOutlined, BarChartOutlined } from '@ant-design/icons-vue';
import { gradeApi } from '@/api/grade';

export default {
  name: 'GradeManagement',
  components: {
    PlusOutlined,
    DownloadOutlined,
    SafetyCertificateOutlined,
    BarChartOutlined
  },
  data() {
    return {
      filters: {
        semester: '',
        courseName: '',
        studentName: '',
        studentId: ''
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
          title: '成绩',
          dataIndex: 'score',
          key: 'score',
          width: 80,
          align: 'center'
        },
        {
          title: '等级',
          dataIndex: 'grade',
          key: 'grade',
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
          title: '录入时间',
          dataIndex: 'entryTime',
          key: 'entryTime',
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
      grades: [],
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
    this.loadGrades();
  },
  methods: {
    async loadGrades() {
      try {
        this.loading = true;
        const page = this.pagination.current - 1;
        const size = this.pagination.pageSize;
        const response = await gradeApi.getAll(page, size);
        const data = response.data.data;
        this.grades = data.content || [];
        this.pagination.total = data.totalElements || this.grades.length;
      } catch (error) {
        this.$message.error('加载成绩数据失败：' + (error.response?.data?.message || error.message));
        this.grades = [];
        this.pagination.total = 0;
      } finally {
        this.loading = false;
      }
    },
    getScoreColor(score) {
      if (score >= 90) return '#52c41a';
      if (score >= 80) return '#1890ff';
      if (score >= 70) return '#faad14';
      if (score >= 60) return '#ff7a45';
      return '#ff4d4f';
    },
    getGradeColor(grade) {
      const colorMap = {
        '优秀': 'green',
        '良好': 'blue',
        '中等': 'orange',
        '及格': 'gold',
        '不及格': 'red'
      };
      return colorMap[grade] || 'default';
    },
    async handleSearch() {
      try {
        this.loading = true;
        const response = await gradeApi.getAll();
        let filtered = response.data.data.content || [];
        if (this.filters.studentId) {
          filtered = filtered.filter(g => g.studentId && g.studentId.includes(this.filters.studentId));
        }
        if (this.filters.studentName) {
          filtered = filtered.filter(g => g.studentName && g.studentName.includes(this.filters.studentName));
        }
        if (this.filters.courseName) {
          filtered = filtered.filter(g => g.courseName && g.courseName.includes(this.filters.courseName));
        }
        this.grades = filtered;
        this.pagination.total = filtered.length;
        this.pagination.current = 1;
      } catch (error) {
        this.$message.error('查询失败：' + (error.response?.data?.message || error.message));
      } finally {
        this.loading = false;
      }
    },
    handleReset() {
      this.filters = {
        semester: '',
        courseName: '',
        studentName: '',
        studentId: ''
      };
      this.handleSearch();
    },
    handleBatchEntry() {
      this.$message.info('批量录入成绩功能开发中');
    },
    handleAudit() {
      this.$message.info('成绩审核功能开发中');
    },
    handleAnalysis() {
      this.$message.info('成绩分析功能开发中');
    },
    handleExport() {
      this.$message.success('导出成功');
    },
    handleView(record) {
      this.$message.info(`查看成绩详情：${record.studentName} - ${record.courseName}`);
    },
    handleEdit(record) {
      this.$message.info(`编辑成绩：${record.studentName} - ${record.courseName}`);
    },
    async handleDelete(record) {
      this.$confirm({
        title: '确认删除',
        content: `确定要删除 ${record.studentName} 的 ${record.courseName} 成绩记录吗？`,
        onOk: async () => {
          try {
            await gradeApi.delete(record.id);
            this.$message.success('删除成功');
            this.loadGrades();
          } catch (error) {
            this.$message.error('删除失败：' + (error.response?.data?.message || error.message));
          }
        }
      });
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadGrades();
    }
  }
};
</script>

<style scoped>
.grade-management {
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

.grade-table :deep(.ant-table-thead > tr > th) {
  background: #f0f2f5;
  font-weight: 600;
  color: #333;
}

.grade-table :deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
}
</style>
