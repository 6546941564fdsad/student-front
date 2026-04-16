<!-- src/components/Dashboard.vue -->
<template>
  <div class="dashboard">
    <!-- 欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h2>欢迎回来，{{ user?.realName || user?.username || '管理员' }}</h2>
        <p class="welcome-desc">今天是 {{ currentDate }}，祝您工作愉快</p>
      </div>
      <div class="welcome-actions">
        <a-button type="primary" size="large" @click="refreshData">
          <template #icon><ReloadOutlined /></template>
          刷新数据
        </a-button>
      </div>
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
            <BellOutlined />
          </div>
          <div class="stat-content">
            <div class="stat-title">待审核事项</div>
            <div class="stat-value">{{ stats.pendingItems }}</div>
            <div class="stat-footer">
              <span class="trend-down">
                <CaretDownOutlined /> 12%
              </span>
              <span class="trend-label">较上周</span>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- 主要内容区域 -->
    <a-row :gutter="[20, 20]" class="content-row">
      <!-- 待办事项 -->
      <a-col :xs="24" :lg="12">
        <a-card class="modern-card" :bordered="false">
          <template #title>
            <div class="card-header">
              <div class="card-title-wrapper">
                <div class="card-icon card-icon-blue">
                  <ClockCircleOutlined />
                </div>
                <span class="card-title">待办事项</span>
              </div>
              <a-badge :count="todoList.length" :offset="[-5, 5]" />
            </div>
          </template>
          
          <a-list :data-source="todoList" item-layout="horizontal" class="todo-list">
            <template #renderItem="{ item }">
              <a-list-item class="todo-item" @click="handleTodo(item)">
                <div class="todo-item-left">
                  <div class="todo-dot" :class="item.status"></div>
                  <div class="todo-content">
                    <div class="todo-title">{{ item.title }}</div>
                    <div class="todo-desc">{{ item.description }}</div>
                  </div>
                </div>
                <div class="todo-item-right">
                  <a-tag :color="getPriorityColor(item.priority)" size="small">
                    {{ item.priorityText }}
                  </a-tag>
                  <a-button type="link" size="small" class="todo-action">
                    处理 <RightOutlined />
                  </a-button>
                </div>
              </a-list-item>
            </template>
          </a-list>
          
          <div class="card-footer">
            <a-button type="link" @click="viewAllTodos">
              查看全部 <RightOutlined />
            </a-button>
          </div>
        </a-card>
      </a-col>

      <!-- 系统公告 -->
      <a-col :xs="24" :lg="12">
        <a-card class="modern-card" :bordered="false">
          <template #title>
            <div class="card-header">
              <div class="card-title-wrapper">
                <div class="card-icon card-icon-orange">
                  <NotificationOutlined />
                </div>
                <span class="card-title">系统公告</span>
              </div>
            </div>
          </template>
          
          <a-list :data-source="announcements" item-layout="horizontal" class="announcement-list">
            <template #renderItem="{ item }">
              <a-list-item class="announcement-item" @click="viewAnnouncement(item)">
                <div class="announcement-item-left">
                  <div class="announcement-date">
                    <div class="date-day">{{ getDay(item.date) }}</div>
                    <div class="date-month">{{ getMonth(item.date) }}</div>
                  </div>
                  <div class="announcement-content">
                    <div class="announcement-title-wrapper">
                      <a-tag :color="item.priority === 'high' ? 'red' : 'blue'" size="small">
                        {{ item.priority === 'high' ? '重要' : '普通' }}
                      </a-tag>
                      <span class="announcement-title">{{ item.title }}</span>
                    </div>
                    <div class="announcement-desc">{{ item.content }}</div>
                  </div>
                </div>
                <div class="announcement-item-right">
                  <RightOutlined class="arrow-icon" />
                </div>
              </a-list-item>
            </template>
          </a-list>
          
          <div class="card-footer">
            <a-button type="link" @click="viewAllAnnouncements">
              查看全部 <RightOutlined />
            </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 快捷操作 -->
    <a-row :gutter="[20, 20]" class="quick-actions-row">
      <a-col :span="24">
        <a-card class="modern-card" :bordered="false">
          <template #title>
            <div class="card-header">
              <div class="card-title-wrapper">
                <div class="card-icon card-icon-purple">
                  <ThunderboltOutlined />
                </div>
                <span class="card-title">快捷操作</span>
              </div>
            </div>
          </template>
          
          <div class="quick-actions-grid">
            <div class="quick-action-item" @click="navigateTo('student-archives')">
              <div class="action-icon action-icon-blue">
                <UserOutlined />
              </div>
              <div class="action-text">学生管理</div>
            </div>
            
            <div class="quick-action-item" @click="navigateTo('grade-entry')">
              <div class="action-icon action-icon-green">
                <BarChartOutlined />
              </div>
              <div class="action-text">成绩录入</div>
            </div>
            
            <div class="quick-action-item" @click="navigateTo('course-scheduling')">
              <div class="action-icon action-icon-orange">
                <ScheduleOutlined />
              </div>
              <div class="action-text">课程排课</div>
            </div>
            
            <div class="quick-action-item" @click="navigateTo('attendance-management')">
              <div class="action-icon action-icon-cyan">
                <ClockCircleOutlined />
              </div>
              <div class="action-text">考勤管理</div>
            </div>
            
            <div class="quick-action-item" @click="navigateTo('exam-arrangement')">
              <div class="action-icon action-icon-purple">
                <FileSearchOutlined />
              </div>
              <div class="action-text">考试安排</div>
            </div>
            
            <div class="quick-action-item" @click="navigateTo('system-log')">
              <div class="action-icon action-icon-red">
                <FileTextOutlined />
              </div>
              <div class="action-text">系统日志</div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { 
  UserOutlined, 
  TeamOutlined, 
  BookOutlined, 
  BellOutlined, 
  BarChartOutlined,
  ScheduleOutlined,
  ClockCircleOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  RightOutlined,
  ReloadOutlined,
  NotificationOutlined,
  ThunderboltOutlined
} from '@ant-design/icons-vue';

import statisticsApi from '../api/statistics';
import todoApi from '../api/todo';
import systemNoticeApi from '../api/systemNotice';
import eventBus from '../utils/eventBus';

export default {
  name: 'Dashboard',
  components: {
    UserOutlined,
    TeamOutlined,
    BookOutlined,
    BellOutlined,
    BarChartOutlined,
    ScheduleOutlined,
    ClockCircleOutlined,
    FileSearchOutlined,
    FileTextOutlined,
    CaretUpOutlined,
    CaretDownOutlined,
    RightOutlined,
    ReloadOutlined,
    NotificationOutlined,
    ThunderboltOutlined
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
        pendingItems: 0
      },
      todoList: [],
      announcements: []
    };
  },
  mounted() {
    this.loadDashboardData();
    // 监听数据变化事件，自动刷新统计数据
    eventBus.on('data-changed', this.handleDataChanged);
  },
  beforeUnmount() {
    // 组件销毁时移除事件监听，防止内存泄漏
    eventBus.off('data-changed', this.handleDataChanged);
  },
  computed: {
    currentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const weekDay = weekDays[now.getDay()];
      return `${year}年${month}月${day}日 ${weekDay}`;
    }
  },
  methods: {
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    getDay(dateStr) {
      return new Date(dateStr).getDate();
    },
    getMonth(dateStr) {
      const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      return months[new Date(dateStr).getMonth()];
    },
    getPriorityColor(priority) {
      const colorMap = {
        'high': 'red',
        'medium': 'orange',
        'low': 'blue'
      };
      return colorMap[priority] || 'default';
    },
    async loadDashboardData() {
      this.loading = true;
      try {
        // 加载统计数据
        const statsRes = await statisticsApi.getOverview();
        if (statsRes.data.success) {
          this.stats = {
            ...statsRes.data.data,
            pendingItems: 0
          };
        }
        
        // 加载待办事项（最多5条）
        const todoRes = await todoApi.getTodos({ page: 0, size: 5 });
        if (todoRes.data.success) {
          this.todoList = todoRes.data.data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description || '',
            status: item.completed ? 'completed' : 'processing',
            priority: item.priority || 'low',
            priorityText: item.priority === 'high' ? '紧急' : item.priority === 'medium' ? '重要' : '普通'
          }));
          this.stats.pendingItems = todoRes.data.data.filter(t => !t.completed).length;
        }
        
        // 加载系统公告（最多4条）
        const noticeRes = await systemNoticeApi.getNotices({ page: 0, size: 4 });
        if (noticeRes.data.success) {
          this.announcements = noticeRes.data.data.map(item => ({
            id: item.id,
            title: item.title,
            content: item.content || '',
            priority: item.priority || 'normal',
            date: item.publishDate || item.createTime
          }));
        }
      } catch (error) {
        console.error('加载仪表盘数据失败:', error);
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
    },
    refreshData() {
      this.loadDashboardData();
    },
    handleTodo(item) {
      this.$message.info(`处理待办事项：${item.title}`);
      if (item.title.includes('成绩审核')) {
        this.$emit('navigate', 'grade-audit');
      } else if (item.title.includes('排课')) {
        this.$emit('navigate', 'course-scheduling');
      } else if (item.title.includes('学籍')) {
        this.$emit('navigate', 'student-status');
      }
    },
    viewAnnouncement(item) {
      this.$message.info(`查看公告：${item.title}`);
    },
    viewAllTodos() {
      this.$message.info('查看全部待办事项');
    },
    viewAllAnnouncements() {
      this.$message.info('查看全部公告');
    },
    navigateTo(key) {
      this.$emit('navigate', key);
    },
    /**
     * 处理数据变化事件
     * @param {Object} data - 包含模块名称和操作类型
     */
    handleDataChanged({ module, action }) {
      console.log(`Dashboard 收到数据变化通知: ${module} - ${action}`);
      
      // 根据变化的模块决定是否需要刷新
      const shouldRefresh = [
        'grade',           // 成绩相关
        'todo',            // 待办事项
        'notice',          // 系统公告
        'student',         // 学生管理
        'teacher',         // 教师管理
        'competition',     // 竞赛
        'project',         // 项目
        'credit',          // 学分认定
        'thesis'           // 毕业设计
      ].includes(module);
      
      if (shouldRefresh) {
        // 延迟500ms刷新，给后端时间处理数据
        setTimeout(() => {
          this.loadDashboardData();
        }, 500);
      }
    }
  }
};
</script>

<style scoped>
.dashboard {
  padding: 0;
}

/* 欢迎区域 */
.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.welcome-content h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
}

.welcome-desc {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.welcome-actions .ant-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.welcome-actions .ant-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 统计卡片 */
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

/* 现代卡片样式 */
.modern-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: 100%;
}

.modern-card :deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
  padding: 20px 24px;
}

.modern-card :deep(.ant-card-body) {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.card-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
}

.card-icon-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-icon-orange {
  background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
}

.card-icon-purple {
  background: linear-gradient(135deg, #9254de 0%, #b37feb 100%);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 待办事项 */
.todo-list {
  padding: 0 24px;
}

.todo-item {
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.todo-item:hover {
  background: #fafafa;
  margin: 0 -24px;
  padding: 16px 24px;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.todo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.todo-dot.processing {
  background: #1890ff;
}

.todo-dot.warning {
  background: #faad14;
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
}

.todo-desc {
  font-size: 12px;
  color: #999;
}

.todo-item-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.todo-action {
  padding: 0;
}

/* 系统公告 */
.announcement-list {
  padding: 0 24px;
}

.announcement-item {
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.announcement-item:hover {
  background: #fafafa;
  margin: 0 -24px;
  padding: 16px 24px;
}

.announcement-item:last-child {
  border-bottom: none;
}

.announcement-item-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.announcement-date {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.date-day {
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
}

.date-month {
  font-size: 10px;
  opacity: 0.9;
  margin-top: 2px;
}

.announcement-content {
  flex: 1;
}

.announcement-title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.announcement-title {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.announcement-desc {
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.announcement-item-right {
  flex-shrink: 0;
}

.arrow-icon {
  color: #999;
  font-size: 16px;
}

/* 卡片底部 */
.card-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

/* 快捷操作 */
.quick-actions-row {
  margin-top: 24px;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 24px;
  padding: 32px 24px;
}

.quick-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 16px;
  border-radius: 12px;
}

.quick-action-item:hover {
  background: #fafafa;
  transform: translateY(-4px);
}

.action-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.action-icon-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.action-icon-green {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.action-icon-orange {
  background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
}

.action-icon-cyan {
  background: linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%);
}

.action-icon-purple {
  background: linear-gradient(135deg, #9254de 0%, #b37feb 100%);
}

.action-icon-red {
  background: linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%);
}

.action-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .quick-actions-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding: 24px 16px;
  }
}
</style>
