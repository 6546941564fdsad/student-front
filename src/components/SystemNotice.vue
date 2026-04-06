<!-- src/components/SystemNotice.vue -->
<template>
  <div class="system-notice">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>系统公告</h2>
      <p class="page-desc">查看和管理系统通知公告</p>
    </div>

    <!-- 筛选和操作栏 -->
    <div class="filter-bar">
      <a-space>
        <a-select v-model:value="filterPriority" placeholder="优先级筛选" style="width: 120px" @change="handleFilterChange">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="high">重要</a-select-option>
          <a-select-option value="normal">普通</a-select-option>
        </a-select>
        <a-range-picker v-model:value="dateRange" @change="handleDateChange" />
      </a-space>
      <a-button type="primary" @click="refreshData">
        <template #icon><ReloadOutlined /></template>
        刷新
      </a-button>
    </div>

    <!-- 公告列表 -->
    <a-card :bordered="false" class="modern-card">
      <a-list :data-source="filteredAnnouncements" item-layout="horizontal" class="announcement-list">
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
                <div class="announcement-meta">
                  <span class="meta-item">
                    <ClockCircleOutlined /> {{ item.publishTime }}
                  </span>
                  <span class="meta-item">
                    <UserOutlined /> {{ item.publisher }}
                  </span>
                </div>
              </div>
            </div>
            <div class="announcement-item-right">
              <RightOutlined class="arrow-icon" />
            </div>
          </a-list-item>
        </template>
      </a-list>

      <!-- 空状态 -->
      <a-empty v-if="filteredAnnouncements.length === 0" description="暂无公告" />
    </a-card>

    <!-- 分页 -->
    <div class="pagination-bar" v-if="filteredAnnouncements.length > 0">
      <a-pagination 
        v-model:current="currentPage" 
        :total="filteredAnnouncements.length"
        :page-size="pageSize"
        show-size-changer
        show-quick-jumper
        :show-total="(total) => `共 ${total} 条`"
      />
    </div>
  </div>
</template>

<script>
import { 
  RightOutlined, 
  ReloadOutlined, 
  ClockCircleOutlined,
  UserOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'SystemNotice',
  components: {
    RightOutlined,
    ReloadOutlined,
    ClockCircleOutlined,
    UserOutlined
  },
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      filterPriority: 'all',
      dateRange: null,
      currentPage: 1,
      pageSize: 10,
      announcements: [
        {
          id: 1,
          title: '关于开展2025年春季学期教学检查的通知',
          content: '根据学校教学工作安排，将于3月10日-3月20日开展春季学期教学检查工作。请各学院做好自查准备，教务处将组织专家进行抽查。检查内容包括教学计划执行情况、课堂教学质量、实践教学环节等。',
          priority: 'high',
          date: '2025-03-01',
          publishTime: '2025-03-01 09:00',
          publisher: '教务处'
        },
        {
          id: 2,
          title: '2024-2025学年第二学期选课通知',
          content: '请各位同学于3月5日前完成本学期课程选择，逾期将无法选课。选课期间如有问题请联系所在学院教务办公室。注意：部分热门课程名额有限，请及时选课。',
          priority: 'high',
          date: '2025-02-28',
          publishTime: '2025-02-28 14:30',
          publisher: '教务处'
        },
        {
          id: 3,
          title: '教务系统维护公告',
          content: '系统将于3月15日 02:00-06:00进行升级维护，届时暂停服务。请各位老师提前安排好相关工作，避免在维护期间进行操作。维护完成后系统将恢复正常使用。',
          priority: 'normal',
          date: '2025-02-25',
          publishTime: '2025-02-25 16:00',
          publisher: '信息中心'
        },
        {
          id: 4,
          title: '关于规范课程考核方式的通知',
          content: '为进一步规范教学管理，现对课程考核方式提出以下要求：1. 平时成绩占比不低于30%；2. 期末考试必须建立试题库；3. 实践类课程需提交过程性评价材料。',
          priority: 'normal',
          date: '2025-02-20',
          publishTime: '2025-02-20 10:15',
          publisher: '教务处'
        },
        {
          id: 5,
          title: '毕业设计（论文）工作安排',
          content: '2025届毕业设计（论文）工作已正式启动，请各位指导教师和学生按照时间节点完成各环节工作。开题报告提交截止日期为3月10日。',
          priority: 'high',
          date: '2025-02-18',
          publishTime: '2025-02-18 09:30',
          publisher: '教务处'
        },
        {
          id: 6,
          title: '教师教学能力提升培训计划',
          content: '学校将于3月份开展教师教学能力提升培训，内容包括现代教育技术应用、课程设计方法、教学评价等。欢迎各位教师报名参加。',
          priority: 'normal',
          date: '2025-02-15',
          publishTime: '2025-02-15 14:00',
          publisher: '教师发展中心'
        }
      ]
    };
  },
  computed: {
    filteredAnnouncements() {
      let result = this.announcements;
      
      // 按优先级筛选
      if (this.filterPriority !== 'all') {
        result = result.filter(item => item.priority === this.filterPriority);
      }
      
      // 按日期范围筛选
      if (this.dateRange && this.dateRange.length === 2) {
        const startDate = this.dateRange[0].format('YYYY-MM-DD');
        const endDate = this.dateRange[1].format('YYYY-MM-DD');
        result = result.filter(item => {
          return item.date >= startDate && item.date <= endDate;
        });
      }
      
      return result;
    }
  },
  methods: {
    getDay(dateStr) {
      return new Date(dateStr).getDate();
    },
    getMonth(dateStr) {
      const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      return months[new Date(dateStr).getMonth()];
    },
    handleFilterChange() {
      // 筛选变化时自动更新
    },
    handleDateChange() {
      // 日期变化时自动更新
    },
    refreshData() {
      this.$message.success('数据已刷新');
    },
    viewAnnouncement(item) {
      this.$modal.info({
        title: item.title,
        content: `
          <div style="line-height: 1.8;">
            <p><strong>发布时间：</strong>${item.publishTime}</p>
            <p><strong>发布部门：</strong>${item.publisher}</p>
            <p><strong>优先级：</strong>${item.priority === 'high' ? '重要' : '普通'}</p>
            <hr/>
            <p>${item.content}</p>
          </div>
        `,
        width: 600,
        okText: '关闭'
      });
    }
  }
};
</script>

<style scoped>
.system-notice {
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

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modern-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

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
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.announcement-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #bbb;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.announcement-item-right {
  flex-shrink: 0;
}

.arrow-icon {
  color: #999;
  font-size: 16px;
}

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
