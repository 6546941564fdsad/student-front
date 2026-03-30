<template>
  <div class="activity-statistics">
    <a-card title="活动统计">
      <!-- 筛选栏 -->
      <div style="margin-bottom: 20px">
        <a-space size="large">
          <a-select placeholder="选择学院" style="width: 200px" @change="handleCollegeChange">
            <a-select-option value="all">全部学院</a-select-option>
            <a-select-option value="大数据学院">大数据学院</a-select-option>
            <a-select-option value="电气学院">电气学院</a-select-option>
            <a-select-option value="机械学院">机械学院</a-select-option>
          </a-select>
          <a-select placeholder="活动类型" style="width: 150px" @change="handleTypeChange">
            <a-select-option value="all">全部类型</a-select-option>
            <a-select-option value="校运会">校运会</a-select-option>
            <a-select-option value="志愿活动">志愿活动</a-select-option>
            <a-select-option value="学术讲座">学术讲座</a-select-option>
          </a-select>
        </a-space>
      </div>
      
      <!-- 统计卡片 -->
      <a-row :gutter="16">
        <a-col :span="6">
          <a-statistic title="活动总数" :value="totalActivities" value-style="color: #1890ff">
            <template #suffix><form-outlined /></template>
          </a-statistic>
        </a-col>
        <a-col :span="6">
          <a-statistic title="进行中活动" :value="ongoingActivities" value-style="color: #52c41a">
            <template #suffix><clock-circle-outlined /></template>
          </a-statistic>
        </a-col>
        <a-col :span="6">
          <a-statistic title="参与总人数" :value="totalParticipants" value-style="color: #faad14">
            <template #suffix><user-outlined /></template>
          </a-statistic>
        </a-col>
        <a-col :span="6">
          <a-statistic title="获奖总人数" :value="totalAwardees" value-style="color: #f5222d">
            <template #suffix><trophy-outlined /></template>
          </a-statistic>
        </a-col>
      </a-row>
      
      <a-divider />
      
      <!-- 图表区域 -->
      <a-row :gutter="16">
        <a-col :span="12">
          <a-card title="各学院活动数量" :bordered="false">
            <a-empty v-if="!collegeData.length" description="暂无数据" />
            <div v-else style="height: 300px; display: flex; align-items: flex-end; justify-content: space-around;">
              <div v-for="item in collegeData" :key="item.name" style="text-align: center;">
                <div :style="{
                  width: '40px',
                  height: (item.value * 3) + 'px',
                  background: '#1890ff',
                  margin: '0 auto',
                  borderRadius: '4px 4px 0 0'
                }"></div>
                <div style="margin-top: 8px; font-size: 12px;">{{ item.name }}</div>
                <div style="font-weight: bold;">{{ item.value }}</div>
              </div>
            </div>
          </a-card>
        </a-col>
        
        <a-col :span="12">
          <a-card title="活动类型分布" :bordered="false">
            <a-empty v-if="!typeData.length" description="暂无数据" />
            <div v-else style="height: 300px; display: flex; align-items: center; justify-content: center;">
              <a-space direction="vertical" size="large">
                <div v-for="item in typeData" :key="item.name" style="display: flex; align-items: center; gap: 10px;">
                  <a-tag :color="getTypeColor(item.name)" style="width: 80px;">{{ item.name }}</a-tag>
                  <a-progress 
                    :percent="(item.value / totalActivities * 100).toFixed(1)" 
                    :stroke-color="getTypeColor(item.name)"
                    style="width: 200px;"
                  >
                    <template #format="percent">{{ item.value }}个 ({{ percent }})</template>
                  </a-progress>
                </div>
              </a-space>
            </div>
          </a-card>
        </a-col>
      </a-row>
      
      <a-divider />
      
      <!-- 活动列表 -->
      <a-table :columns="columns" :data-source="activities" row-key="id" :pagination="{ pageSize: 5 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <a-tag :color="getTypeColor(record.type)">{{ record.type }}</a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { FormOutlined, ClockCircleOutlined, UserOutlined, TrophyOutlined } from '@ant-design/icons-vue';

export default {
  name: 'ActivityStatistics',
  components: { FormOutlined, ClockCircleOutlined, UserOutlined, TrophyOutlined },
  data() {
    return {
      collegeFilter: 'all',
      typeFilter: 'all',
      activities: [
        { id: 1, name: '2024 年秋季校运会', type: '校运会', college: '体育学院', status: '进行中', registrationCount: 320, awardCount: 50 },
        { id: 2, name: '计算机学术讲座', type: '学术讲座', college: '大数据学院', status: '未开始', registrationCount: 156, awardCount: 0 },
        { id: 3, name: '志愿者服务活动', type: '志愿活动', college: '经管学院', status: '已结束', registrationCount: 200, awardCount: 30 }
      ],
      columns: [
        { title: '活动名称', dataIndex: 'name', key: 'name', width: 200 },
        { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
        { title: '学院', dataIndex: 'college', key: 'college', width: 120 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
        { title: '参与人数', dataIndex: 'registrationCount', key: 'registrationCount', width: 100 },
        { title: '获奖人数', dataIndex: 'awardCount', key: 'awardCount', width: 100 }
      ]
    };
  },
  computed: {
    totalActivities() { return this.activities.length; },
    ongoingActivities() { return this.activities.filter(a => a.status === '进行中').length; },
    totalParticipants() { return this.activities.reduce((sum, a) => sum + a.registrationCount, 0); },
    totalAwardees() { return this.activities.reduce((sum, a) => sum + a.awardCount, 0); },
    collegeData() {
      const map = {};
      this.activities.forEach(a => {
        map[a.college] = (map[a.college] || 0) + 1;
      });
      return Object.entries(map).map(([name, value]) => ({ name, value }));
    },
    typeData() {
      const map = {};
      this.activities.forEach(a => {
        map[a.type] = (map[a.type] || 0) + 1;
      });
      return Object.entries(map).map(([name, value]) => ({ name, value }));
    }
  },
  methods: {
    handleCollegeChange(v) { this.collegeFilter = v; },
    handleTypeChange(v) { this.typeFilter = v; },
    getTypeColor(t) {
      return { '校运会': 'orange', '志愿活动': 'green', '学术讲座': 'blue', '文艺晚会': 'purple', '社团活动': 'cyan', '竞赛': 'red' }[t] || 'default';
    },
    getStatusColor(s) {
      return { '未开始': 'default', '进行中': 'processing', '已结束': 'success' }[s] || 'default';
    }
  }
};
</script>

<style scoped>
.activity-statistics { padding: 20px; }
</style>
