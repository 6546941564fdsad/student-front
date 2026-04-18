<!-- src/components/ThesisManagement.vue -->
<template>
  <div class="thesis-management">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">毕业设计(论文)管理</h2>
      </div>

      <!-- 筛选条件 -->
      <a-form layout="inline" class="filter-form">
        <a-form-item label="学年">
          <a-select v-model:value="filters.academicYear" placeholder="请选择学年" style="width: 180px">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="2024-2025">2024-2025</a-select-option>
            <a-select-option value="2023-2024">2023-2024</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="学生姓名">
          <a-input v-model:value="filters.studentName" placeholder="请输入学生姓名" style="width: 150px" />
        </a-form-item>
        <a-form-item label="指导教师">
          <a-input v-model:value="filters.teacher" placeholder="请输入指导教师" style="width: 150px" />
        </a-form-item>
        <a-form-item label="进度状态">
          <a-select v-model:value="filters.status" placeholder="请选择状态" style="width: 150px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="开题阶段">开题阶段</a-select-option>
            <a-select-option value="中期检查">中期检查</a-select-option>
            <a-select-option value="答辩阶段">答辩阶段</a-select-option>
            <a-select-option value="已完成">已完成</a-select-option>
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
          新增课题
        </a-button>
        <a-button style="margin-left: 8px" @click="handleOpenReview">
          <template #icon><FileSearchOutlined /></template>
          开题审核
        </a-button>
        <a-button style="margin-left: 8px" @click="handleMidtermCheck">
          <template #icon><CalendarOutlined /></template>
          中期检查
        </a-button>
        <a-button style="margin-left: 8px" @click="handleDefense">
          <template #icon><ReadOutlined /></template>
          答辩管理
        </a-button>
        <a-button style="margin-left: 8px" @click="handleExport">
          <template #icon><DownloadOutlined /></template>
          导出
        </a-button>
      </div>

      <!-- 毕业设计列表表格 -->
      <a-table
        :columns="columns"
        :data-source="theses"
        :pagination="pagination"
        :loading="loading"
        size="middle"
        class="thesis-table"
        :row-key="record => record.id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'score'">
            <span :style="{ color: getScoreColor(record.score), fontWeight: 'bold' }">
              {{ record.score || '-' }}
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="handleView(record)">查看</a>
              <a-divider type="vertical" />
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除该毕业设计记录吗？" @confirm="handleDelete(record)">
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
import { PlusOutlined, DownloadOutlined, FileSearchOutlined, CalendarOutlined, ReadOutlined } from '@ant-design/icons-vue';
import projectApi from '../api/project';

export default {
  name: 'ThesisManagement',
  components: {
    PlusOutlined,
    DownloadOutlined,
    FileSearchOutlined,
    CalendarOutlined,
    ReadOutlined
  },
  data() {
    return {
      filters: {
        academicYear: '',
        studentName: '',
        teacher: '',
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
          title: '学年',
          dataIndex: 'academicYear',
          key: 'academicYear',
          width: 120
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
          title: '论文题目',
          dataIndex: 'title',
          key: 'title',
          width: 250
        },
        {
          title: '指导教师',
          dataIndex: 'teacher',
          key: 'teacher',
          width: 120
        },
        {
          title: '进度状态',
          dataIndex: 'status',
          key: 'status',
          width: 120,
          align: 'center'
        },
        {
          title: '成绩',
          dataIndex: 'score',
          key: 'score',
          width: 80,
          align: 'center'
        },
        {
          title: '提交时间',
          dataIndex: 'submitTime',
          key: 'submitTime',
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
      theses: [],
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
    this.loadTheses();
  },
  methods: {
    async loadTheses() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current - 1,
          size: this.pagination.pageSize,
          academicYear: this.filters.academicYear || undefined,
          studentName: this.filters.studentName || undefined,
          teacher: this.filters.teacher || undefined,
          status: this.filters.status || undefined
        };
        const res = await projectApi.getAll(params.page, params.size);
        if (res.data.success) {
          // 后端返回的数据结构: { success: true, data: { content: [...], totalElements: ..., ... } }
          const pageData = res.data.data;
          this.theses = (pageData.content || []).map((item, index) => ({
            ...item,
            index: (this.pagination.current - 1) * this.pagination.pageSize + index + 1
          }));
          this.pagination.total = pageData.totalElements || 0;
        }
      } catch (error) {
        console.error('加载毕业设计数据失败:', error);
        this.$message.error('加载毕业设计数据失败');
      } finally {
        this.loading = false;
      }
    },
    getStatusColor(status) {
      const colorMap = {
        '开题阶段': 'blue',
        '中期检查': 'orange',
        '答辩阶段': 'purple',
        '已完成': 'green'
      };
      return colorMap[status] || 'default';
    },
    getScoreColor(score) {
      if (!score) return '#999';
      if (score >= 90) return '#52c41a';
      if (score >= 80) return '#1890ff';
      if (score >= 70) return '#faad14';
      if (score >= 60) return '#ff7a45';
      return '#ff4d4f';
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadTheses();
    },
    handleReset() {
      this.filters = {
        academicYear: '',
        studentName: '',
        teacher: '',
        status: ''
      };
      this.handleSearch();
    },
    handleAdd() {
      this.$message.info('新增课题功能开发中');
    },
    handleOpenReview() {
      this.$message.info('开题审核功能开发中');
    },
    handleMidtermCheck() {
      this.$message.info('中期检查功能开发中');
    },
    handleDefense() {
      this.$message.info('答辩管理功能开发中');
    },
    handleExport() {
      this.$message.success('导出成功');
    },
    handleView(record) {
      this.$message.info(`查看毕业设计详情：${record.title}`);
    },
    handleEdit(record) {
      this.$message.info(`编辑毕业设计：${record.title}`);
    },
    handleDelete(record) {
      this.$message.success(`已删除毕业设计记录`);
      this.loadTheses();
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadTheses();
    }
  }
};
</script>

<style scoped>
.thesis-management {
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

.thesis-table :deep(.ant-table-thead > tr > th) {
  background: #f0f2f5;
  font-weight: 600;
  color: #333;
}

.thesis-table :deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
}
</style>
