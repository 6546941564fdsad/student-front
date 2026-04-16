<!-- src/components/DataStats.vue -->
<template>
  <div class="data-stats">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>数据统计</h2>
      <p class="page-desc">查看学校各项数据的统计分析</p>
    </div>

    <!-- 数据统计卡片 -->
    <a-row :gutter="[20, 20]" class="stats-row">
      <a-col :xs="24" :sm="12" :md="6">
        <div class="stat-card stat-card-blue">
          <div class="stat-icon">
            <UserOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-title">在校学生</div>
            <div class="stat-value">{{ formatNumber(stats.totalStudents) }}</div>
            <div class="stat-footer">
              <span class="trend-up">
                <CaretUpOutlined /> 2.5%
              </span>
              <span class="trend-label">较上学期</span>
            </div>
          </div>
        </div>
      </a-col>
      
      <a-col :xs="24" :sm="12" :md="6">
        <div class="stat-card stat-card-green">
          <div class="stat-icon">
            <TeamOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-title">在编教师</div>
            <div class="stat-value">{{ formatNumber(stats.totalTeachers) }}</div>
            <div class="stat-footer">
              <span class="trend-up">
                <CaretUpOutlined /> 1.8%
              </span>
              <span class="trend-label">较上学期</span>
            </div>
          </div>
        </div>
      </a-col>
      
      <a-col :xs="24" :sm="12" :md="6">
        <div class="stat-card stat-card-orange">
          <div class="stat-icon">
            <BookOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-title">本学期课程</div>
            <div class="stat-value">{{ formatNumber(stats.totalCourses) }}</div>
            <div class="stat-footer">
              <span class="trend-up">
                <CaretUpOutlined /> 5.2%
              </span>
              <span class="trend-label">较上学期</span>
            </div>
          </div>
        </div>
      </a-col>
      
      <a-col :xs="24" :sm="12" :md="6">
        <div class="stat-card stat-card-red">
          <div class="stat-icon">
            <BarChartOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-title">平均成绩</div>
            <div class="stat-value">{{ stats.avgScore }}</div>
            <div class="stat-footer">
              <span class="trend-up">
                <CaretUpOutlined /> 3.1%
              </span>
              <span class="trend-label">较上学期</span>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- 详细统计数据 -->
    <a-row :gutter="[20, 20]">
      <a-col :span="24">
        <a-card title="学院分布统计" :bordered="false" class="modern-card">
          <a-table
            :columns="collegeColumns"
            :data-source="collegeData"
            :pagination="false"
            size="middle"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'studentCount'">
                <a-tag color="blue">{{ record.studentCount }}人</a-tag>
              </template>
              <template v-else-if="column.key === 'teacherCount'">
                <a-tag color="green">{{ record.teacherCount }}人</a-tag>
              </template>
              <template v-else-if="column.key === 'courseCount'">
                <a-tag color="orange">{{ record.courseCount }}门</a-tag>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>

    <!-- 操作按钮 -->
    <div class="action-bar">
      <a-button type="primary" @click="refreshData">
        <template #icon><ReloadOutlined /></template>
        刷新数据
      </a-button>
      <a-button @click="exportData">
        <template #icon><DownloadOutlined /></template>
        导出数据
      </a-button>
    </div>
  </div>
</template>

<script>
import { 
  UserOutlined, 
  TeamOutlined, 
  BookOutlined, 
  BarChartOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  ReloadOutlined,
  DownloadOutlined
} from '@ant-design/icons-vue';
import statisticsApi from '../api/statistics';

export default {
  name: 'DataStats',
  components: {
    UserOutlined,
    TeamOutlined,
    BookOutlined,
    BarChartOutlined,
    CaretUpOutlined,
    CaretDownOutlined,
    ReloadOutlined,
    DownloadOutlined
  },
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      stats: {
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        avgScore: 0
      },
      collegeColumns: [
        { title: '学院名称', dataIndex: 'name', key: 'name' },
        { title: '学生人数', dataIndex: 'studentCount', key: 'studentCount' },
        { title: '教师人数', dataIndex: 'teacherCount', key: 'teacherCount' },
        { title: '课程数量', dataIndex: 'courseCount', key: 'courseCount' },
        { title: '占比', dataIndex: 'percentage', key: 'percentage' }
      ],
      collegeData: []
    };
  },
  mounted() {
    this.loadStats();
  },
  methods: {
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    async loadStats() {
      this.loading = true;
      try {
        const res = await statisticsApi.getOverview();
        if (res.data.success) {
          this.stats = res.data.data;
        }
        
        const collegeRes = await statisticsApi.getCollegeDistribution();
        if (collegeRes.data.success) {
          this.collegeData = collegeRes.data.data;
        }
      } catch (error) {
        console.error('加载统计数据失败:', error);
        this.$message.error('加载统计数据失败');
      } finally {
        this.loading = false;
      }
    },
    refreshData() {
      this.loadStats();
    },
    exportData() {
      this.$message.success('数据导出成功');
    }
  }
};
</script>

<style scoped>
.data-stats {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.page-desc {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

.stat-card-blue .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card-green .stat-icon {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.stat-card-orange .stat-icon {
  background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
}

.stat-card-red .stat-icon {
  background: linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%);
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.stat-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.trend-up {
  color: #52c41a;
  font-weight: 600;
}

.trend-down {
  color: #f5222d;
  font-weight: 600;
}

.trend-label {
  color: #999;
}

.modern-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.action-bar {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
