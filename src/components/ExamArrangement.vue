<!-- src/components/ExamArrangement.vue -->
<template>
  <div class="exam-arrangement">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">考试安排</h2>
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
        <a-form-item label="考试类型">
          <a-select v-model:value="filters.examType" placeholder="请选择考试类型" style="width: 150px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="期末考试">期末考试</a-select-option>
            <a-select-option value="期中考试">期中考试</a-select-option>
            <a-select-option value="补考">补考</a-select-option>
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
          新增安排
        </a-button>
        <a-button style="margin-left: 8px" @click="handleAutoArrange">
          <template #icon><ThunderboltOutlined /></template>
          自动排考
        </a-button>
        <a-button style="margin-left: 8px" @click="handleExport">
          <template #icon><DownloadOutlined /></template>
          导出
        </a-button>
      </div>

      <!-- 考试安排表格 -->
      <a-table
        :columns="columns"
        :data-source="exams"
        :pagination="pagination"
        :loading="loading"
        size="middle"
        class="exam-table"
        :row-key="record => record.id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'examType'">
            <a-tag :color="getExamTypeColor(record.examType)">
              {{ record.examType }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="record.status === '已完成' ? 'green' : 'blue'">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="handleView(record)">查看</a>
              <a-divider type="vertical" />
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除该考试安排吗？" @confirm="handleDelete(record)">
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
import { PlusOutlined, DownloadOutlined, ThunderboltOutlined } from '@ant-design/icons-vue';
import { examArrangementApi } from '@/api/examArrangement';

export default {
  name: 'ExamArrangement',
  components: {
    PlusOutlined,
    DownloadOutlined,
    ThunderboltOutlined
  },
  data() {
    return {
      filters: {
        semester: '',
        courseName: '',
        examType: ''
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
          title: '考试类型',
          dataIndex: 'examType',
          key: 'examType',
          width: 120,
          align: 'center'
        },
        {
          title: '考试时间',
          dataIndex: 'examTime',
          key: 'examTime',
          width: 160
        },
        {
          title: '考试地点',
          dataIndex: 'examLocation',
          key: 'examLocation',
          width: 150
        },
        {
          title: '监考教师',
          dataIndex: 'invigilator',
          key: 'invigilator',
          width: 120
        },
        {
          title: '参加考试人数',
          dataIndex: 'participantCount',
          key: 'participantCount',
          width: 120,
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
      exams: [],
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
    this.loadExams();
  },
  methods: {
    async loadExams() {
      this.loading = true;
      try {
        const res = await examArrangementApi.getExams();
        if (res.data.success) {
          let exams = res.data.data || [];
          
          // 前端筛选
          if (this.filters.semester) {
            exams = exams.filter(exam => exam.semester === this.filters.semester);
          }
          if (this.filters.courseName) {
            exams = exams.filter(exam => exam.courseName && exam.courseName.includes(this.filters.courseName));
          }
          if (this.filters.examType) {
            exams = exams.filter(exam => exam.examType === this.filters.examType);
          }
          
          // 分页处理
          const start = (this.pagination.current - 1) * this.pagination.pageSize;
          const end = start + this.pagination.pageSize;
          const paginatedExams = exams.slice(start, end);
          
          this.exams = paginatedExams.map((item, index) => ({
            ...item,
            index: start + index + 1
          }));
          this.pagination.total = exams.length;
        }
      } catch (error) {
        console.error('加载考试安排失败:', error);
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
    },
    getExamTypeColor(examType) {
      const colorMap = {
        '期末考试': 'blue',
        '期中考试': 'orange',
        '补考': 'red'
      };
      return colorMap[examType] || 'default';
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadExams();
    },
    handleReset() {
      this.filters = {
        semester: '',
        courseName: '',
        examType: ''
      };
      this.handleSearch();
    },
    handleAdd() {
      this.$message.info('新增考试安排功能开发中');
    },
    handleAutoArrange() {
      this.$message.info('自动排考功能开发中');
    },
    handleExport() {
      this.$message.success('导出成功');
    },
    handleView(record) {
      this.$message.info(`查看考试安排：${record.courseName}`);
    },
    handleEdit(record) {
      this.$message.info(`编辑考试安排：${record.courseName}`);
    },
    async handleDelete(record) {
      try {
        await examArrangementApi.deleteExam(record.id);
        this.$message.success(`已删除考试安排`);
        this.loadExams();
      } catch (error) {
        console.error('删除失败:', error);
        this.$message.error('删除失败');
      }
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadExams();
    }
  }
};
</script>

<style scoped>
.exam-arrangement {
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

.exam-table :deep(.ant-table-thead > tr > th) {
  background: #f0f2f5;
  font-weight: 600;
  color: #333;
}

.exam-table :deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
}
</style>
