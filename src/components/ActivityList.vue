<template>
  <div class="activity-list">
    <a-card title="活动列表">
      <!-- 工具栏 -->
      <div class="toolbar">
        <div class="filter-section">
          <a-space size="large" wrap>
            <a-input-search 
              placeholder="搜索活动名称" 
              style="width: 320px" 
              @search="handleSearch"
            />
            <a-select 
              placeholder="选择学院" 
              style="width: 150px" 
              @change="handleCollegeFilter"
              allow-clear
            >
              <a-select-option value="大数据学院">大数据学院</a-select-option>
              <a-select-option value="电气学院">电气学院</a-select-option>
              <a-select-option value="机械学院">机械学院</a-select-option>
              <a-select-option value="经管学院">经管学院</a-select-option>
            </a-select>
            <a-select 
              placeholder="活动类型" 
              style="width: 120px" 
              @change="handleTypeFilter"
              allow-clear
            >
              <a-select-option value="校运会">校运会</a-select-option>
              <a-select-option value="志愿活动">志愿活动</a-select-option>
              <a-select-option value="学术讲座">学术讲座</a-select-option>
              <a-select-option value="文艺晚会">文艺晚会</a-select-option>
              <a-select-option value="社团活动">社团活动</a-select-option>
              <a-select-option value="竞赛">竞赛</a-select-option>
            </a-select>
            <a-select 
              placeholder="活动状态" 
              style="width: 100px" 
              @change="handleStatusFilter"
              allow-clear
            >
              <a-select-option value="未开始">未开始</a-select-option>
              <a-select-option value="进行中">进行中</a-select-option>
              <a-select-option value="已结束">已结束</a-select-option>
            </a-select>
          </a-space>
        </div>
        <div class="action-section">
          <a-space>
            <a-button @click="resetFilters"><reload-outlined />重置</a-button>
            <a-button type="primary" @click="showPublishForm"><plus-outlined />发布活动</a-button>
          </a-space>
        </div>
      </div>
      
      <!-- 表格 -->
      <a-table 
        :columns="columns" 
        :data-source="filteredActivities" 
        row-key="id" 
        :loading="loading"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <a-tag :color="getTypeColor(record.type)">{{ record.type }}</a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
          </template>
          <template v-if="column.key === 'registrationCount'">
            {{ record.registrationCount }} / {{ record.maxParticipants }}
          </template>
          <template v-if="column.key === 'action'">
            <a-space size="small">
              <a-button type="primary" size="small" @click="viewDetail(record)"><eye-outlined />详情</a-button>
              <a-button size="small" @click="editActivity(record)"><form-outlined />编辑</a-button>
              <a-popconfirm title="确定操作？" @confirm="toggleStatus(record)">
                <a-button size="small">{{ record.status === '未开始' ? '发布' : '结束' }}</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
    
    <!-- 发布/编辑抽屉 -->
    <a-drawer
      :width="720"
      :title="isEdit ? '编辑活动' : '发布活动'"
      placement="right"
      :open="showDrawer"
      @close="closeDrawer"
    >
      <template #extra>
        <a-button style="margin-right: 8px" @click="closeDrawer">取消</a-button>
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </template>
      
      <a-form ref="formRef" :model="form" layout="vertical">
        <a-divider orientation="left">基本信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="活动名称" name="name" :rules="[{ required: true, message: '请输入活动名称' }]">
              <a-input v-model:value="form.name" placeholder="如：2024 年秋季校运会" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="活动类型" name="type" :rules="[{ required: true, message: '请选择活动类型' }]">
              <a-select v-model:value="form.type" placeholder="请选择">
                <a-select-option value="校运会">校运会</a-select-option>
                <a-select-option value="志愿活动">志愿活动</a-select-option>
                <a-select-option value="学术讲座">学术讲座</a-select-option>
                <a-select-option value="文艺晚会">文艺晚会</a-select-option>
                <a-select-option value="社团活动">社团活动</a-select-option>
                <a-select-option value="竞赛">竞赛</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="主办方" name="organizer" :rules="[{ required: true, message: '请输入主办方' }]">
              <a-input v-model:value="form.organizer" placeholder="如：大数据学院团委" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属学院" name="college" :rules="[{ required: true, message: '请选择学院' }]">
              <a-select v-model:value="form.college" placeholder="请选择">
                <a-select-option value="大数据学院">大数据学院</a-select-option>
                <a-select-option value="电气学院">电气学院</a-select-option>
                <a-select-option value="机械学院">机械学院</a-select-option>
                <a-select-option value="经管学院">经管学院</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="活动时间" name="activityTime" :rules="[{ required: true, message: '请选择活动时间' }]">
              <a-date-picker 
                v-model:value="form.activityTime" 
                show-time
                placeholder="选择活动时间"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="活动地点" name="location" :rules="[{ required: true, message: '请输入活动地点' }]">
              <a-input v-model:value="form.location" placeholder="如：学校操场" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="人数上限" name="maxParticipants" :rules="[{ required: true, message: '请输入人数上限' }]">
              <a-input-number v-model:value="form.maxParticipants" :min="1" :max="10000" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="报名开始时间" name="registrationStartTime">
              <a-date-picker 
                v-model:value="form.registrationStartTime" 
                show-time
                placeholder="可选"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="报名截止" name="registrationEndTime">
              <a-date-picker 
                v-model:value="form.registrationEndTime" 
                show-time
                placeholder="可选"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item label="参与对象" name="targetAudience">
          <a-select v-model:value="form.targetAudience" placeholder="请选择">
            <a-select-option value="全校">全校</a-select-option>
            <a-select-option value="全院">全院</a-select-option>
            <a-select-option value="指定班级">指定班级</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="活动描述" name="description">
          <a-textarea v-model:value="form.description" :rows="3" placeholder="活动详细介绍" />
        </a-form-item>
        
        <a-divider orientation="left">奖励设置</a-divider>
        
        <a-form-item label="奖励类型">
          <a-checkbox-group v-model:value="form.awardSettings">
            <a-checkbox value="计入综测">计入综测</a-checkbox>
            <a-checkbox value="可获奖项">可获奖项</a-checkbox>
            <a-checkbox value="同步到档案">同步到档案</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        
        <a-row :gutter="16" v-if="form.awardSettings.includes('计入综测')">
          <a-col :span="12">
            <a-form-item label="综测加分">
              <a-input-number v-model:value="form.comprehensiveScore" :min="0" :max="100" addon-after="分" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="16" v-if="form.awardSettings.includes('可获奖项')">
          <a-col :span="12">
            <a-form-item label="奖项等级">
              <a-select v-model:value="form.awardLevel" placeholder="请选择">
                <a-select-option value="一等奖">一等奖</a-select-option>
                <a-select-option value="二等奖">二等奖</a-select-option>
                <a-select-option value="三等奖">三等奖</a-select-option>
                <a-select-option value="优秀奖">优秀奖</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
import { PlusOutlined, FormOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons-vue';

export default {
  name: 'ActivityList',
  components: { PlusOutlined, FormOutlined, EyeOutlined, ReloadOutlined },
  data() {
    return {
      loading: false,
      isEdit: false,
      showDrawer: false,
      searchText: '',
      collegeFilter: '',
      typeFilter: '',
      statusFilter: '',
      form: {
        id: null,
        name: '',
        type: '',
        organizer: '',
        college: '',
        activityTime: null,
        location: '',
        maxParticipants: null,
        registrationStartTime: null,
        registrationEndTime: null,
        targetAudience: '全校',
        description: '',
        awardSettings: [],
        comprehensiveScore: null,
        awardLevel: ''
      },
      activities: [
        {
          id: 1,
          name: '2024 年秋季校运会',
          type: '校运会',
          organizer: '体育学院',
          college: '体育学院',
          activityTime: '2024-10-20 08:00:00',
          location: '学校操场',
          maxParticipants: 500,
          registrationCount: 320,
          status: '进行中',
          targetAudience: '全校',
          description: '一年一度的校运会',
          awardSettings: ['计入综测', '可获奖项', '同步到档案'],
          comprehensiveScore: 5,
          awardLevel: '一等奖'
        },
        {
          id: 2,
          name: '计算机学术讲座',
          type: '学术讲座',
          organizer: '大数据学院',
          college: '大数据学院',
          activityTime: '2024-11-15 14:00:00',
          location: '报告厅 301',
          maxParticipants: 200,
          registrationCount: 156,
          status: '未开始',
          targetAudience: '全院',
          description: 'AI 前沿技术分享',
          awardSettings: ['计入综测'],
          comprehensiveScore: 2
        }
      ],
      columns: [
        { title: '活动名称', dataIndex: 'name', key: 'name', width: 180, fixed: 'left' },
        { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
        { title: '主办方', dataIndex: 'organizer', key: 'organizer', width: 120 },
        { title: '学院', dataIndex: 'college', key: 'college', width: 100 },
        { title: '时间', dataIndex: 'activityTime', key: 'activityTime', width: 160 },
        { title: '地点', dataIndex: 'location', key: 'location', width: 100 },
        { title: '报名人数', key: 'registrationCount', width: 100 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
        { title: '操作', key: 'action', width: 200, fixed: 'right' }
      ]
    };
  },
  computed: {
    filteredActivities() {
      return this.activities.filter(a => {
        const s = !this.searchText || a.name.includes(this.searchText);
        const c = !this.collegeFilter || a.college === this.collegeFilter;
        const t = !this.typeFilter || a.type === this.typeFilter;
        const st = !this.statusFilter || a.status === this.statusFilter;
        return s && c && t && st;
      });
    }
  },
  methods: {
    handleSearch(v) { this.searchText = v; },
    handleCollegeFilter(v) { this.collegeFilter = v || ''; },
    handleTypeFilter(v) { this.typeFilter = v || ''; },
    handleStatusFilter(v) { this.statusFilter = v || ''; },
    resetFilters() {
      this.searchText = ''; this.collegeFilter = ''; this.typeFilter = ''; this.statusFilter = '';
      this.$message.success('筛选已重置');
    },
    showPublishForm() {
      this.isEdit = false;
      this.form = {
        id: null, name: '', type: '', organizer: '', college: '',
        activityTime: null, location: '', maxParticipants: null,
        registrationStartTime: null, registrationEndTime: null,
        targetAudience: '全校', description: '',
        awardSettings: [], comprehensiveScore: null, awardLevel: ''
      };
      this.showDrawer = true;
    },
    editActivity(record) {
      this.isEdit = true;
      this.form = {
        ...record,
        activityTime: record.activityTime ? new Date(record.activityTime) : null,
        registrationStartTime: record.registrationStartTime ? new Date(record.registrationStartTime) : null,
        registrationEndTime: record.registrationEndTime ? new Date(record.registrationEndTime) : null
      };
      this.showDrawer = true;
    },
    closeDrawer() {
      this.showDrawer = false;
    },
    handleSubmit() {
      if (this.isEdit) {
        const index = this.activities.findIndex(a => a.id === this.form.id);
        if (index !== -1) {
          this.activities[index] = { ...this.form };
          this.$message.success('编辑成功');
        }
      } else {
        const newActivity = {
          ...this.form,
          id: Date.now(),
          status: '未开始',
          registrationCount: 0
        };
        this.activities.push(newActivity);
        this.$message.success('发布成功');
      }
      this.closeDrawer();
    },
    viewDetail(record) { this.$message.info(`查看：${record.name}`); },
    toggleStatus(record) {
      record.status = record.status === '未开始' ? '进行中' : '已结束';
      this.$message.success('状态已更新');
    },
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
.toolbar { display: flex; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 16px; }
</style>
