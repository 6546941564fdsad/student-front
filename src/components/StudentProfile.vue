<!-- src/components/StudentProfile.vue -->
<template>
  <div class="student-profile">
    <a-card v-if="student" :loading="loading">
      <template #title>
        <div class="profile-header">
          <div class="avatar-section">
            <a-avatar :size="80" :style="{ backgroundColor: '#1890ff' }">
              <template #icon><UserOutlined /></template>
            </a-avatar>
            <div class="student-name">{{ student.name }}</div>
            <a-tag :color="getStatusColor(student.status)">{{ student.status }}</a-tag>
          </div>
          <div class="header-actions">
            <a-button type="primary" @click="editProfile">
              <template #icon><FormOutlined /></template>
              编辑档案
            </a-button>
            <a-button @click="backToList">
              <template #icon><LeftOutlined /></template>
              返回列表
            </a-button>
          </div>
        </div>
      </template>

      <!-- 基本信息 -->
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="basic" tab="基本信息">
          <a-descriptions bordered column="2" size="small">
            <a-descriptions-item label="姓名">{{ student.name }}</a-descriptions-item>
            <a-descriptions-item label="年龄">{{ student.age }}</a-descriptions-item>
            <a-descriptions-item label="性别">{{ student.gender }}</a-descriptions-item>
            <a-descriptions-item label="学号">{{ student.studentId }}</a-descriptions-item>
            <a-descriptions-item label="学院">{{ student.college || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="专业">{{ student.major || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="班级">{{ student.className || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="年级">{{ student.grade || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="邮箱">{{ student.email || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="电话">{{ student.phone || '未设置' }}</a-descriptions-item>
            <a-descriptions-item label="入学日期" span="2">{{ formatDate(student.enrollmentDate) }}</a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>

        <a-tab-pane key="courses" tab="课程信息">
          <a-table 
            :columns="courseColumns" 
            :data-source="studentCourses" 
            row-key="id"
            size="small"
            :pagination="false"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'credit'">
                {{ record.credit }} 学分
              </template>
              <template v-if="column.key === 'score'">
                <a-tag :color="getScoreColor(record.score)">{{ record.score || '-' }}</a-tag>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <a-tab-pane key="rewards" tab="奖惩记录">
          <a-divider orientation="left">奖励记录</a-divider>
          <a-empty v-if="studentRewards.length === 0" description="暂无奖励记录" />
          <a-timeline v-else>
            <a-timeline-item 
              v-for="(reward, index) in studentRewards" 
              :key="index"
              color="green"
            >
              <template #dot><CheckCircleOutlined style="font-size: 16px; color: #52c41a;" /></template>
              <div class="reward-item">
                <div class="reward-title">{{ reward.title }}</div>
                <div class="reward-desc">{{ reward.description }}</div>
                <div class="reward-date">{{ formatDate(reward.date) }}</div>
              </div>
            </a-timeline-item>
          </a-timeline>

          <a-divider orientation="left">惩处记录</a-divider>
          <a-empty v-if="studentPunishments.length === 0" description="暂无惩处记录" />
          <a-timeline v-else>
            <a-timeline-item 
              v-for="(punishment, index) in studentPunishments" 
              :key="index"
              color="red"
            >
              <template #dot><CloseCircleOutlined style="font-size: 16px; color: #ff4d4f;" /></template>
              <div class="punishment-item">
                <div class="punishment-title">{{ punishment.title }}</div>
                <div class="punishment-desc">{{ punishment.description }}</div>
                <div class="punishment-date">{{ formatDate(punishment.date) }}</div>
              </div>
            </a-timeline-item>
          </a-timeline>
        </a-tab-pane>

        <a-tab-pane key="analysis" tab="成绩分析">
          <div class="analysis-cards">
            <a-card size="small" title="平均成绩" class="analysis-card">
              <a-progress 
                :percent="averageScore" 
                :stroke-color="getAverageScoreColor(averageScore)"
              >
                <template #format="percent">
                  <span style="color: #1890ff; font-weight: bold">{{ percent }} 分</span>
                </template>
              </a-progress>
            </a-card>
            <a-card size="small" title="总学分" class="analysis-card">
              <a-statistic :value="totalCredits" :precision="0" suffix="学分">
                <template #formatter="{ value }">
                  <span :style="{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }">{{ value }}</span>
                </template>
              </a-statistic>
            </a-card>
            <a-card size="small" title="课程数量" class="analysis-card">
              <a-statistic :value="studentCourses.length" suffix="门">
                <template #formatter="{ value }">
                  <span :style="{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }">{{ value }}</span>
                </template>
              </a-statistic>
            </a-card>
          </div>
        </a-tab-pane>

        <a-tab-pane key="activities" tab="活动参与">
          <a-empty v-if="studentActivities.length === 0" description="该学生暂未参与任何活动" />
          <a-table v-else :columns="activityColumns" :data-source="studentActivities" row-key="id" size="small">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'type'">
                <a-tag :color="getActivityTypeColor(record.type)">{{ record.type }}</a-tag>
              </template>
              <template v-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
              </template>
              <template v-if="column.key === 'award'">
                <a-tag v-if="record.award" color="gold"><trophy-outlined /> {{ record.award }}</a-tag>
                <span v-else style="color: #999">未获奖</span>
              </template>
              <template v-if="column.key === 'score'">
                <span v-if="record.comprehensiveScore" style="color: #faad14; font-weight: bold">+{{ record.comprehensiveScore }} 分</span>
                <span v-else>-</span>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 编辑档案抽屉 -->
    <a-drawer
      :width="600"
      title="编辑学生档案"
      placement="right"
      :open="showEditForm"
      @close="cancelEdit"
    >
      <template #extra>
        <a-button style="margin-right: 8px" @click="cancelEdit">取消</a-button>
        <a-button type="primary" @click="saveProfile">保存</a-button>
      </template>
      <StudentForm 
        ref="studentFormRef"
        :student="currentStudent" 
        @save="handleFormSave"
      />
    </a-drawer>
  </div>
</template>

<script>
import studentApi from '../api/student';
import StudentForm from './StudentForm.vue';
import { 
  UserOutlined, 
  FormOutlined, 
  LeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'StudentProfile',
  components: {
    StudentForm,
    UserOutlined,
    FormOutlined,
    LeftOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    TrophyOutlined
  },
  props: {
    studentId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      student: null,
      loading: false,
      showEditForm: false,
      currentStudent: null,
      activeTab: 'basic',
      // 课程数据（从后端获取）
      studentCourses: [],
      // 奖励数据（从后端获取）
      studentRewards: [],
      // 惩处数据（从后端获取）
      studentPunishments: [],
      // 活动数据（从后端获取）
      studentActivities: [],
      courseColumns: [
        { title: '课程名称', dataIndex: 'name', key: 'name' },
        { title: '学期', dataIndex: 'semester', key: 'semester', width: 180 },
        { title: '学分', dataIndex: 'credit', key: 'credit', width: 100 },
        { title: '成绩', dataIndex: 'score', key: 'score', width: 100 }
      ],
      activityColumns: [
        { title: '活动名称', dataIndex: 'name', key: 'name', width: 200 },
        { title: '类型', dataIndex: 'type', key: 'type', width: 100 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
        { title: '获奖情况', key: 'award', width: 120 },
        { title: '综测加分', key: 'score', width: 100 },
        { title: '参与日期', dataIndex: 'date', key: 'date', width: 120 }
      ]
    };
  },
  computed: {
    averageScore() {
      if (this.studentCourses.length === 0) return 0;
      const total = this.studentCourses.reduce((sum, course) => sum + (course.score || 0), 0);
      return Math.round(total / this.studentCourses.length);
    },
    totalCredits() {
      return this.studentCourses.reduce((sum, course) => sum + (course.credit || 0), 0);
    }
  },
  mounted() {
    if (this.studentId) {
      this.fetchStudentProfile();
    }
  },
  methods: {
    async fetchStudentProfile() {
      this.loading = true;
      try {
        // 调用 API 获取学生详细信息
        const response = await studentApi.getStudent(this.studentId);
        if (response.data.success) {
          this.student = response.data.data;
          
          // TODO: 加载学生的课程、奖励、活动等信息
          // 这些需要后端提供对应的接口，目前先保持空数组
          this.studentCourses = [];
          this.studentRewards = [];
          this.studentPunishments = [];
          this.studentActivities = [];
        } else {
          this.$message.error('获取学生信息失败');
        }
      } catch (error) {
        console.error('获取学生档案失败:', error);
        this.$message.error('获取学生档案失败');
      } finally {
        this.loading = false;
      }
    },
    editProfile() {
      this.currentStudent = { ...this.student };
      this.showEditForm = true;
    },
    handleFormSave(formData) {
      this.saveProfile(formData);
    },
    async saveProfile(formData) {
      this.loading = true;
      try {
        // 调用 API 更新学生信息
        await studentApi.updateStudent(this.student.id, formData);
        
        // 更新本地数据
        this.student = { ...this.student, ...formData };
        this.$message.success('编辑档案成功');
        this.showEditForm = false;
      } catch (error) {
        console.error('保存档案失败:', error);
        this.$message.error('保存档案失败');
      } finally {
        this.loading = false;
      }
    },
    cancelEdit() {
      this.showEditForm = false;
      this.currentStudent = null;
    },
    backToList() {
      console.log('点击返回列表按钮');
      // 触发事件通知父组件切换回列表
      this.$emit('back-to-list');
      console.log('已触发 back-to-list 事件，父组件:', this.$parent);
      // 同时直接修改父组件的状态
      if (this.$parent && this.$parent.currentComponent) {
        console.log('直接修改父组件状态');
        this.$parent.currentComponent = 'StudentList';
        this.$parent.selectedSideMenu = 'student-list';
        this.$parent.currentStudentId = null;
      }
    },
    goToStudentList() {
      // 此方法已废弃，保留以防兼容性问题
      this.$emit('back-to-list');
    },
    getStatusColor(status) {
      const colorMap = {
        '在校': 'green',
        '休学': 'orange',
        '毕业': 'blue',
        '退学': 'red',
        '正常': 'green'
      };
      return colorMap[status] || 'default';
    },
    getScoreColor(score) {
      if (score >= 90) return 'green';
      if (score >= 80) return 'blue';
      if (score >= 70) return 'orange';
      if (score >= 60) return 'gold';
      return 'red';
    },
    getAverageScoreColor(average) {
      if (average >= 90) return '#52c41a';
      if (average >= 80) return '#1890ff';
      if (average >= 70) return '#faad14';
      if (average >= 60) return '#fa8c16';
      return '#ff4d4f';
    },
    formatDate(date) {
      if (!date) return '未设置';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    getActivityTypeColor(type) {
      const colorMap = {
        '校运会': 'orange',
        '志愿活动': 'green',
        '学术讲座': 'blue',
        '文艺晚会': 'purple',
        '社团活动': 'cyan',
        '竞赛': 'red'
      };
      return colorMap[type] || 'default';
    }
  },
  watch: {
    studentId(newVal) {
      if (newVal) {
        this.fetchStudentProfile();
      }
    }
  }
};
</script>

<style scoped>
.student-profile {
  padding: 0;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.student-name {
  font-size: 24px;
  font-weight: bold;
  color: #262626;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.reward-item,
.punishment-item {
  margin-top: 8px;
}

.reward-title,
.punishment-title {
  font-weight: 500;
  color: #262626;
  margin-bottom: 4px;
}

.reward-desc,
.punishment-desc {
  font-size: 14px;
  color: #595959;
  margin-bottom: 4px;
}

.reward-date,
.punishment-date {
  font-size: 12px;
  color: #8c8c8c;
}

.analysis-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.analysis-card {
  border-radius: 8px;
}

.analysis-card :deep(.ant-card-body) {
  padding: 16px;
}
</style>
