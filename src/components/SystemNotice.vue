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
import systemNoticeApi from '@/api/systemNotice';

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
      announcements: []
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
  mounted() {
    this.loadNotices();
  },
  methods: {
    async loadNotices() {
      try {
        const params = this.filterPriority !== 'all' ? { priority: this.filterPriority } : {};
        const res = await systemNoticeApi.getNotices(params);
        if (res.data.success) {
          this.announcements = res.data.data.map(item => ({
            ...item,
            date: item.publishTime ? item.publishTime.split(' ')[0] : ''
          }));
        }
      } catch (error) {
        console.error('加载公告失败:', error);
        this.$message.error('加载数据失败');
      }
    },
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
      this.loadNotices();
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
