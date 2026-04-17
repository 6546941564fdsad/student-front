<!-- src/components/CourseScheduling.vue -->
<template>
  <div class="course-scheduling">
    <a-card title="排课管理">
      <!-- 排课表单 -->
      <a-form :model="schedulingForm" layout="vertical" class="scheduling-form">
        <a-row :gutter="[16, 16]">
          <a-col :span="8">
            <a-form-item label="课程">
              <a-select v-model:value="schedulingForm.courseId" placeholder="选择课程">
                <a-option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.name }} ({{ course.courseId }})
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="教师">
              <a-select v-model:value="schedulingForm.teacherId" placeholder="选择教师">
                <a-option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                  {{ teacher.name }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="班级">
              <a-select v-model:value="schedulingForm.classId" placeholder="选择班级">
                <a-option v-for="classItem in classes" :key="classItem.id" :value="classItem.id">
                  {{ classItem.name }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="星期">
              <a-select v-model:value="schedulingForm.weekday" placeholder="选择星期">
                <a-option value="1">周一</a-option>
                <a-option value="2">周二</a-option>
                <a-option value="3">周三</a-option>
                <a-option value="4">周四</a-option>
                <a-option value="5">周五</a-option>
                <a-option value="6">周六</a-option>
                <a-option value="7">周日</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="节次">
              <a-select v-model:value="schedulingForm.period" placeholder="选择节次">
                <a-option value="1-2">1-2节</a-option>
                <a-option value="3-4">3-4节</a-option>
                <a-option value="5-6">5-6节</a-option>
                <a-option value="7-8">7-8节</a-option>
                <a-option value="9-10">9-10节</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="教室">
              <a-select v-model:value="schedulingForm.classroomId" placeholder="选择教室">
                <a-option v-for="classroom in classrooms" :key="classroom.id" :value="classroom.id">
                  {{ classroom.name }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <div class="form-actions">
          <a-button type="primary" @click="saveScheduling">
            <template #icon><plus-outlined /></template>
            保存排课
          </a-button>
        </div>
      </a-form>
      
      <!-- 排课列表 -->
      <a-table :columns="columns" :data-source="schedulings" row-key="id" :loading="loading">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space size="small">
              <a-button type="primary" size="small" @click="editScheduling(record)">
                <template #icon><form-outlined /></template>
                编辑
              </a-button>
              <a-button danger size="small" @click="deleteScheduling(record.id)">
                <template #icon><delete-outlined /></template>
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import courseSchedulingApi from '@/api/courseScheduling';

export default {
  name: 'CourseScheduling',
  components: {
    PlusOutlined,
    FormOutlined,
    DeleteOutlined
  },
  data() {
    return {
      loading: false,
      courses: [],
      teachers: [],
      classes: [],
      classrooms: [],
      schedulings: [],
      schedulingForm: {
        courseId: '',
        teacherId: '',
        classId: '',
        weekday: '',
        period: '',
        classroomId: ''
      },
      currentScheduling: null,
      columns: [
        {
          title: '课程',
          dataIndex: 'courseName',
          key: 'courseName'
        },
        {
          title: '教师',
          dataIndex: 'teacherName',
          key: 'teacherName'
        },
        {
          title: '班级',
          dataIndex: 'className',
          key: 'className'
        },
        {
          title: '时间',
          key: 'time',
          render: (_, record) => `${this.getWeekdayText(record.weekday)} ${record.period}节`
        },
        {
          title: '教室',
          dataIndex: 'classroomName',
          key: 'classroomName'
        },
        {
          title: '操作',
          key: 'action'
        }
      ]
    };
  },
  mounted() {
    this.loadDicts();
    this.loadSchedules();
  },
  methods: {
    async loadDicts() {
      // 模拟字典数据，实际应从后端获取
      this.courses = [
        { id: 1, name: '数据结构', courseId: 'CS101' },
        { id: 2, name: '操作系统', courseId: 'CS102' }
      ];
      this.teachers = [
        { id: 1, name: '张老师' },
        { id: 2, name: '李老师' }
      ];
      this.classes = [
        { id: 1, name: '计科1班' },
        { id: 2, name: '计科2班' }
      ];
      this.classrooms = [
        { id: 1, name: 'A101' },
        { id: 2, name: 'A102' }
      ];
    },
    async loadSchedules() {
      this.loading = true;
      try {
        const res = await courseSchedulingApi.getSchedules();
        if (res.data.success) {
          this.schedulings = res.data.data;
        }
      } catch (error) {
        console.error('加载排课失败:', error);
      } finally {
        this.loading = false;
      }
    },
    async saveScheduling() {
      this.loading = true;
      try {
        const course = this.courses.find(c => c.id === this.schedulingForm.courseId);
        const teacher = this.teachers.find(t => t.id === this.schedulingForm.teacherId);
        const classItem = this.classes.find(c => c.id === this.schedulingForm.classId);
        const classroom = this.classrooms.find(c => c.id === this.schedulingForm.classroomId);
        
        if (!course || !teacher || !classItem || !classroom) {
          this.$message.error('请填写完整信息');
          return;
        }
        
        if (this.currentScheduling) {
          // 编辑排课
          await courseSchedulingApi.updateSchedule(this.currentScheduling.id, {
            ...this.schedulingForm,
            courseName: course.name,
            teacherName: teacher.name,
            className: classItem.name,
            classroomName: classroom.name
          });
          this.$message.success('编辑排课成功');
        } else {
          // 添加排课
          await courseSchedulingApi.addSchedule({
            ...this.schedulingForm,
            courseName: course.name,
            teacherName: teacher.name,
            className: classItem.name,
            classroomName: classroom.name
          });
          this.$message.success('添加排课成功');
        }
        
        this.resetForm();
        this.loadSchedules();
      } catch (error) {
        console.error('保存排课失败:', error);
        this.$message.error('保存排课失败');
      } finally {
        this.loading = false;
      }
    },
    editScheduling(record) {
      this.currentScheduling = record;
      this.schedulingForm = {
        courseId: record.courseId,
        teacherId: record.teacherId,
        classId: record.classId,
        weekday: record.weekday,
        period: record.period,
        classroomId: record.classroomId
      };
    },
    deleteScheduling(id) {
      this.$confirm({
        title: '删除确认',
        content: '确定要删除这条排课记录吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            await courseSchedulingApi.deleteSchedule(id);
            this.$message.success('删除排课成功');
            this.loadSchedules();
          } catch (error) {
            this.$message.error('删除失败');
          }
        }
      });
    },
    resetForm() {
      this.currentScheduling = null;
      this.schedulingForm = {
        courseId: '',
        teacherId: '',
        classId: '',
        weekday: '',
        period: '',
        classroomId: ''
      };
    },
    getWeekdayText(weekday) {
      const weekdays = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      return weekdays[parseInt(weekday)] || '';
    }
  }
};
</script>

<style scoped>
.course-scheduling {
  padding: 20px;
}

.scheduling-form {
  margin-bottom: 24px;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 8px;
}

.form-actions {
  margin-top: 16px;
  text-align: right;
}
</style>