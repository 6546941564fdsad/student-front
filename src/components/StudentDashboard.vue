<!-- src/components/StudentDashboard.vue - 学生专属仪表盘 -->
<template>
  <div class="student-dashboard">
    <!-- 欢迎卡片 -->
    <a-card :bordered="false" class="welcome-card">
      <a-row :gutter="16" align="middle">
        <a-col :span="18">
          <a-space direction="vertical" :size="8">
            <h2 style="margin: 0;">欢迎回来，{{ user?.name || '同学' }}！</h2>
            <p style="margin: 0; color: rgba(0, 0, 0, 0.45);">
              {{ user?.studentNo || '学号未设置' }} | {{ user?.major || '专业未设置' }} | {{ user?.className || '班级未设置' }}
            </p>
          </a-space>
        </a-col>
        <a-col :span="6" style="text-align: right;">
          <a-tag color="blue" style="font-size: 14px;">{{ getCurrentSemester() }}</a-tag>
        </a-col>
      </a-row>
    </a-card>

    <!-- 统计卡片 -->
    <a-row :gutter="16" class="stats-row">
      <a-col :xs="24" :sm="12" :md="6">
        <a-card :bordered="false" class="stat-card">
          <a-statistic
            title="已修学分"
            :value="stats.completedCredits"
            :precision="1"
            suffix="分"
            :value-style="{ color: '#3f8600' }"
          >
            <template #prefix><BookOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card :bordered="false" class="stat-card">
          <a-statistic
            title="平均绩点"
            :value="stats.gpa"
            :precision="2"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix><TrophyOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card :bordered="false" class="stat-card">
          <a-statistic
            title="本学期课程"
            :value="stats.currentCourses"
            suffix="门"
            :value-style="{ color: '#cf1322' }"
          >
            <template #prefix><ScheduleOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card :bordered="false" class="stat-card">
          <a-statistic
            title="待办事项"
            :value="stats.pendingTasks"
            :value-style="{ color: '#faad14' }"
          >
            <template #prefix><BellOutlined /></template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 快捷入口 -->
    <a-card :bordered="false" title="快捷入口" class="quick-access-card">
      <a-row :gutter="16">
        <a-col :xs="12" :sm="8" :md="6" v-for="item in quickAccessItems" :key="item.key">
          <div class="quick-item" @click="handleQuickAccess(item.key)">
            <div class="quick-icon" :style="{ backgroundColor: item.color }">
              <component :is="item.icon" />
            </div>
            <div class="quick-label">{{ item.label }}</div>
          </div>
        </a-col>
      </a-row>
    </a-card>

    <!-- 最近动态 -->
    <a-row :gutter="16">
      <a-col :xs="24" :md="12">
        <a-card :bordered="false" title="最新公告" class="notice-card">
          <a-list :data-source="notices" :loading="loading">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <a @click="viewNotice(item)">{{ item.title }}</a>
                  </template>
                  <template #description>
                    <span style="color: rgba(0, 0, 0, 0.45);">{{ item.date }}</span>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-card :bordered="false" title="近期考试" class="exam-card">
          <a-timeline>
            <a-timeline-item v-for="exam in upcomingExams" :key="exam.id" color="blue">
              <div>
                <strong>{{ exam.courseName }}</strong>
                <div style="color: rgba(0, 0, 0, 0.45); font-size: 12px;">
                  {{ exam.examDate }} {{ exam.examTime }} | {{ exam.location }}
                </div>
              </div>
            </a-timeline-item>
            <a-timeline-item v-if="upcomingExams.length === 0">
              暂无即将到来的考试
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { 
  BookOutlined, 
  TrophyOutlined, 
  ScheduleOutlined, 
  BellOutlined,
  UserOutlined,
  BarChartOutlined,
  CalendarOutlined,
  FileTextOutlined,
  StarOutlined,
  SolutionOutlined,
  AlertOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'StudentDashboard',
  components: {
    BookOutlined,
    TrophyOutlined,
    ScheduleOutlined,
    BellOutlined,
    UserOutlined,
    BarChartOutlined,
    CalendarOutlined,
    FileTextOutlined,
    StarOutlined,
    SolutionOutlined,
    AlertOutlined
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
        completedCredits: 0,
        gpa: 0,
        currentCourses: 0,
        pendingTasks: 0
      },
      quickAccessItems: [
        { key: 'my-grades', label: '我的成绩', icon: 'BarChartOutlined', color: '#1890ff' },
        { key: 'my-courses', label: '选课中心', icon: 'BookOutlined', color: '#52c41a' },
        { key: 'my-exams', label: '考试安排', icon: 'CalendarOutlined', color: '#722ed1' },
        { key: 'my-thesis', label: '毕业设计', icon: 'FileTextOutlined', color: '#fa8c16' },
        { key: 'my-evaluation', label: '教学评价', icon: 'StarOutlined', color: '#eb2f96' },
        { key: 'my-internship', label: '实习申请', icon: 'SolutionOutlined', color: '#13c2c2' },
        { key: 'my-attendance', label: '我的考勤', icon: 'UserOutlined', color: '#f5222d' },
        { key: 'my-warning', label: '学业预警', icon: 'AlertOutlined', color: '#faad14' }
      ],
      notices: [
        { id: 1, title: '关于2025年春季学期选课的通知', date: '2025-01-15' },
        { id: 2, title: '期末考试安排已公布', date: '2025-01-10' },
        { id: 3, title: '毕业设计开题报告提交截止日期提醒', date: '2025-01-05' }
      ],
      upcomingExams: [
        { id: 1, courseName: '高等数学', examDate: '2025-01-20', examTime: '09:00-11:00', location: '教学楼A101' },
        { id: 2, courseName: '大学英语', examDate: '2025-01-22', examTime: '14:00-16:00', location: '教学楼B203' }
      ]
    };
  },
  mounted() {
    this.loadStats();
  },
  methods: {
    getCurrentSemester() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      if (month >= 2 && month <= 7) {
        return `${year-1}-${year}学年第二学期`;
      } else {
        return `${year}-${year+1}学年第一学期`;
      }
    },
    async loadStats() {
      this.loading = true;
      // TODO: 从后端加载真实数据
      // 模拟数据
      setTimeout(() => {
        this.stats = {
          completedCredits: 45.5,
          gpa: 3.65,
          currentCourses: 6,
          pendingTasks: 3
        };
        this.loading = false;
      }, 500);
    },
    handleQuickAccess(key) {
      // 触发菜单切换事件
      this.$emit('menu-change', key);
    },
    viewNotice(notice) {
      // TODO: 查看公告详情
      console.log('查看公告:', notice);
    }
  }
};
</script>

<style scoped>
.student-dashboard {
  padding: 0;
}

.welcome-card {
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.welcome-card h2 {
  color: white !important;
}

.welcome-card p {
  color: rgba(255, 255, 255, 0.85) !important;
}

.stats-row {
  margin-bottom: 16px;
}

.stat-card {
  text-align: center;
  transition: all 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.quick-access-card {
  margin-bottom: 16px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
  margin-bottom: 8px;
}

.quick-item:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
}

.quick-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  margin-bottom: 8px;
}

.quick-label {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  text-align: center;
}

.notice-card,
.exam-card {
  height: 100%;
}
</style>
