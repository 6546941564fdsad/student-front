<!-- src/components/MyGrades.vue - 学生个人成绩查询 -->
<template>
  <div class="my-grades">
    <a-card :bordered="false" :loading="loading">
      <template #title>
        <div class="card-header">
          <span>我的成绩</span>
          <a-space>
            <a-tag color="blue">平均绩点: {{ gpa.toFixed(2) }}</a-tag>
            <a-tag color="green">已修学分: {{ totalCredits }} 分</a-tag>
          </a-space>
        </div>
      </template>

      <!-- 筛选条件 -->
      <a-form layout="inline" class="filter-form">
        <a-form-item label="学期">
          <a-select v-model:value="filters.semester" placeholder="请选择学期" style="width: 200px" allow-clear>
            <a-select-option value="">全部学期</a-select-option>
            <a-select-option value="2024-2025学年第一学期">2024-2025学年第一学期</a-select-option>
            <a-select-option value="2024-2025学年第二学期">2024-2025学年第二学期</a-select-option>
            <a-select-option value="2023-2024学年第一学期">2023-2024学年第一学期</a-select-option>
            <a-select-option value="2023-2024学年第二学期">2023-2024学年第二学期</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="课程名称">
          <a-input v-model:value="filters.courseName" placeholder="请输入课程名称" style="width: 200px" allow-clear />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">
            <template #icon><SearchOutlined /></template>
            查询
          </a-button>
          <a-button style="margin-left: 8px" @click="handleReset">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
        </a-form-item>
      </a-form>

      <!-- 成绩表格 -->
      <a-table
        :columns="columns"
        :data-source="grades"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'index'">
            {{ record.index }}
          </template>
          <template v-if="column.key === 'totalScore'">
            <span :style="{ color: getScoreColor(record.totalScore), fontWeight: 'bold' }">
              {{ record.totalScore || '-' }}
            </span>
          </template>
          <template v-if="column.key === 'gradePoint'">
            <a-tag :color="getGradePointColor(record.gradePoint)">
              {{ record.gradePoint ? record.gradePoint.toFixed(2) : '-' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ record.status || '未审核' }}
            </a-tag>
          </template>
        </template>
      </a-table>

      <!-- 成绩统计卡片 -->
      <a-row :gutter="16" style="margin-top: 16px;">
        <a-col :span="6">
          <a-card size="small" class="stat-card">
            <a-statistic title="课程总数" :value="statistics.totalCourses" suffix="门" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card size="small" class="stat-card">
            <a-statistic title="最高分" :value="statistics.highestScore" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card size="small" class="stat-card">
            <a-statistic title="最低分" :value="statistics.lowestScore" />
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card size="small" class="stat-card">
            <a-statistic title="平均分" :value="statistics.averageScore" :precision="2" />
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { gradeApi } from '../api/grade';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue';

export default {
  name: 'MyGrades',
  components: { SearchOutlined, ReloadOutlined },
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      grades: [],
      filters: {
        semester: '',
        courseName: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条记录`
      },
      statistics: {
        totalCourses: 0,
        highestScore: 0,
        lowestScore: 0,
        averageScore: 0
      },
      columns: [
        {
          title: '序号',
          key: 'index',
          width: 70,
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
          title: '课程代码',
          dataIndex: 'courseCode',
          key: 'courseCode',
          width: 120
        },
        {
          title: '平时成绩',
          dataIndex: 'usualScore',
          key: 'usualScore',
          width: 100,
          align: 'center'
        },
        {
          title: '期末成绩',
          dataIndex: 'finalScore',
          key: 'finalScore',
          width: 100,
          align: 'center'
        },
        {
          title: '总评成绩',
          key: 'totalScore',
          width: 100,
          align: 'center'
        },
        {
          title: '绩点',
          key: 'gradePoint',
          width: 100,
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
          key: 'status',
          width: 100,
          align: 'center'
        }
      ]
    };
  },
  computed: {
    // 计算平均绩点
    gpa() {
      if (this.grades.length === 0) return 0;
      const validGrades = this.grades.filter(g => g.gradePoint);
      if (validGrades.length === 0) return 0;
      const sum = validGrades.reduce((acc, g) => acc + g.gradePoint, 0);
      return sum / validGrades.length;
    },
    // 计算已修学分
    totalCredits() {
      return this.grades
        .filter(g => g.status === '已审核')
        .reduce((sum, g) => sum + (g.credits || 0), 0);
    }
  },
  mounted() {
    this.loadGrades();
  },
  methods: {
    async loadGrades() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current - 1,
          size: this.pagination.pageSize,
          studentNo: this.user?.studentNo, // 只查询当前学生的成绩
          semester: this.filters.semester || undefined,
          courseName: this.filters.courseName || undefined
        };
        
        const res = await gradeApi.getAll(params.page, params.size, params);
        if (res.data.success) {
          const pageData = res.data.data;
          this.grades = (pageData.content || []).map((item, index) => ({
            ...item,
            index: (this.pagination.current - 1) * this.pagination.pageSize + index + 1
          }));
          this.pagination.total = pageData.totalElements || 0;
          
          // 计算统计数据
          this.calculateStatistics();
        }
      } catch (error) {
        console.error('加载成绩数据失败:', error);
        this.$message.error('加载成绩数据失败');
      } finally {
        this.loading = false;
      }
    },
    
    calculateStatistics() {
      if (this.grades.length === 0) {
        this.statistics = {
          totalCourses: 0,
          highestScore: 0,
          lowestScore: 0,
          averageScore: 0
        };
        return;
      }
      
      const scores = this.grades.map(g => g.totalScore).filter(s => s !== null && s !== undefined);
      
      this.statistics = {
        totalCourses: this.grades.length,
        highestScore: scores.length > 0 ? Math.max(...scores) : 0,
        lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
        averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
      };
    },
    
    handleSearch() {
      this.pagination.current = 1;
      this.loadGrades();
    },
    
    handleReset() {
      this.filters = {
        semester: '',
        courseName: ''
      };
      this.pagination.current = 1;
      this.loadGrades();
    },
    
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadGrades();
    },
    
    getScoreColor(score) {
      if (!score) return '#999';
      if (score >= 90) return '#52c41a';
      if (score >= 80) return '#1890ff';
      if (score >= 70) return '#faad14';
      if (score >= 60) return '#ff7a45';
      return '#ff4d4f';
    },
    
    getGradePointColor(gpa) {
      if (!gpa) return 'default';
      if (gpa >= 4.0) return 'green';
      if (gpa >= 3.0) return 'blue';
      if (gpa >= 2.0) return 'orange';
      if (gpa >= 1.0) return 'warning';
      return 'red';
    },
    
    getStatusColor(status) {
      const colorMap = {
        '已审核': 'green',
        '待审核': 'orange',
        '草稿': 'default'
      };
      return colorMap[status] || 'default';
    }
  }
};
</script>

<style scoped>
.my-grades {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-form {
  margin-bottom: 16px;
}

.stat-card {
  text-align: center;
}

.stat-card :deep(.ant-statistic-title) {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}

.stat-card :deep(.ant-statistic-content) {
  font-size: 20px;
  font-weight: 600;
}
</style>
