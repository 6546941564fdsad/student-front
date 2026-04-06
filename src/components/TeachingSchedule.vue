<!-- src/components/TeachingSchedule.vue -->
<template>
  <div class="teaching-schedule">
    <a-card title="教学安排">
      <a-tabs v-model:activeKey="activeTab">
        <!-- 排课管理 -->
        <a-tab-pane key="scheduling" tab="排课管理">
          <div class="toolbar" style="margin-bottom: 16px">
            <a-space>
              <a-select v-model:value="semester" style="width: 150px" placeholder="选择学期">
                <a-select-option value="2025-2026-1">2025-2026 第一学期</a-select-option>
                <a-select-option value="2025-2026-2">2025-2026 第二学期</a-select-option>
              </a-select>
              <a-button type="primary" @click="autoSchedule">
                <template #icon><thunderbolt-outlined /></template>
                自动排课
              </a-button>
              <a-button @click="showAddModal">
                <template #icon><plus-outlined /></template>
                手动排课
              </a-button>
              <a-button @click="handleExport">
                <template #icon><download-outlined /></template>
                导出课表
              </a-button>
            </a-space>
          </div>
          
          <!-- 排课结果表格 -->
          <a-table :columns="scheduleColumns" :data-source="schedules" row-key="id" :pagination="{ pageSize: 10 }">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'time'">
                {{ record.weekDay }} {{ record.timeSlot }}
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="editSchedule(record)">编辑</a-button>
                  <a-button type="link" size="small" danger @click="deleteSchedule(record.id)">删除</a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        
        <!-- 课表查看 -->
        <a-tab-pane key="view" tab="课表查看">
          <div style="margin-bottom: 16px">
            <a-select v-model:value="viewClass" style="width: 200px" placeholder="选择班级">
              <a-select-option value="计科2301班">计科2301班</a-select-option>
              <a-select-option value="计科2302班">计科2302班</a-select-option>
            </a-select>
          </div>
          
          <!-- 周课表视图 -->
          <a-table :columns="weekColumns" :data-source="weekSchedule" :pagination="false" bordered size="small">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key !== 'time'">
                <div v-if="record[column.key]" class="course-cell">
                  <div class="course-name">{{ record[column.key].name }}</div>
                  <div class="course-info">{{ record[column.key].teacher }}</div>
                  <div class="course-info">{{ record[column.key].room }}</div>
                </div>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    
    <!-- 排课对话框 -->
    <a-modal
      title="手动排课"
      :open="showModal"
      @ok="handleScheduleOk"
      @cancel="handleScheduleCancel"
    >
      <a-form :model="scheduleForm" layout="vertical">
        <a-form-item label="课程">
          <a-select v-model:value="scheduleForm.course" placeholder="选择课程">
            <a-select-option value="高等数学">高等数学</a-select-option>
            <a-select-option value="大学英语">大学英语</a-select-option>
            <a-select-option value="数据结构">数据结构</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="教师">
          <a-select v-model:value="scheduleForm.teacher" placeholder="选择教师">
            <a-select-option value="张教授">张教授</a-select-option>
            <a-select-option value="李教授">李教授</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="星期">
          <a-select v-model:value="scheduleForm.weekDay" placeholder="选择星期">
            <a-select-option value="星期一">星期一</a-select-option>
            <a-select-option value="星期二">星期二</a-select-option>
            <a-select-option value="星期三">星期三</a-select-option>
            <a-select-option value="星期四">星期四</a-select-option>
            <a-select-option value="星期五">星期五</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="时间段">
          <a-select v-model:value="scheduleForm.timeSlot" placeholder="选择时间段">
            <a-select-option value="第1-2节">第1-2节 (8:00-9:40)</a-select-option>
            <a-select-option value="第3-4节">第3-4节 (10:00-11:40)</a-select-option>
            <a-select-option value="第5-6节">第5-6节 (14:00-15:40)</a-select-option>
            <a-select-option value="第7-8节">第7-8节 (16:00-17:40)</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="教室">
          <a-input v-model:value="scheduleForm.room" placeholder="输入教室" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { ThunderboltOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons-vue';

export default {
  name: 'TeachingSchedule',
  components: { ThunderboltOutlined, PlusOutlined, DownloadOutlined },
  data() {
    return {
      activeTab: 'scheduling',
      semester: '2025-2026-1',
      viewClass: '计科2301班',
      showModal: false,
      scheduleForm: {
        course: '',
        teacher: '',
        weekDay: '',
        timeSlot: '',
        room: ''
      },
      schedules: [
        { id: 1, course: '高等数学', teacher: '张教授', weekDay: '星期一', timeSlot: '第1-2节', room: 'A101', className: '计科2301班' },
        { id: 2, course: '大学英语', teacher: '李教授', weekDay: '星期二', timeSlot: '第3-4节', room: 'B205', className: '计科2301班' },
        { id: 3, course: '数据结构', teacher: '王教授', weekDay: '星期三', timeSlot: '第5-6节', room: 'C303', className: '计科2301班' }
      ],
      weekSchedule: [
        { time: '第1-2节', 'mon': { name: '高等数学', teacher: '张教授', room: 'A101' }, 'tue': null, 'wed': { name: '数据结构', teacher: '王教授', room: 'C303' }, 'thu': null, 'fri': null },
        { time: '第3-4节', 'mon': null, 'tue': { name: '大学英语', teacher: '李教授', room: 'B205' }, 'wed': null, 'thu': { name: '操作系统', teacher: '赵教授', room: 'D402' }, 'fri': null },
        { time: '第5-6节', 'mon': null, 'tue': null, 'wed': null, 'thu': null, 'fri': { name: '计算机网络', teacher: '刘教授', room: 'E501' } },
        { time: '第7-8节', 'mon': { name: '程序设计', teacher: '陈教授', room: 'F601' }, 'tue': null, 'wed': null, 'thu': null, 'fri': null }
      ],
      scheduleColumns: [
        { title: '课程', dataIndex: 'course', key: 'course', width: 150 },
        { title: '教师', dataIndex: 'teacher', key: 'teacher', width: 120 },
        { title: '时间', key: 'time', width: 180 },
        { title: '教室', dataIndex: 'room', key: 'room', width: 100 },
        { title: '班级', dataIndex: 'className', key: 'className', width: 120 },
        { title: '操作', key: 'action', width: 150 }
      ],
      weekColumns: [
        { title: '时间', dataIndex: 'time', key: 'time', width: 100 },
        { title: '星期一', key: 'mon', width: 150 },
        { title: '星期二', key: 'tue', width: 150 },
        { title: '星期三', key: 'wed', width: 150 },
        { title: '星期四', key: 'thu', width: 150 },
        { title: '星期五', key: 'fri', width: 150 }
      ]
    };
  },
  methods: {
    autoSchedule() {
      this.$message.success('自动排课完成');
    },
    showAddModal() {
      this.showModal = true;
    },
    handleScheduleOk() {
      this.$message.success('排课成功');
      this.showModal = false;
    },
    handleScheduleCancel() {
      this.showModal = false;
    },
    editSchedule(record) {
      this.$message.info('编辑功能');
    },
    deleteSchedule(id) {
      this.$message.success('删除成功');
    },
    handleExport() {
      this.$message.success('课表导出成功');
    }
  }
};
</script>

<style scoped>
.teaching-schedule {
  padding: 20px;
}

.course-cell {
  padding: 8px;
  background: #e6f7ff;
  border-radius: 4px;
}

.course-name {
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 4px;
}

.course-info {
  font-size: 12px;
  color: #666;
}
</style>
