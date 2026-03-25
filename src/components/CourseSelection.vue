<!-- src/components/CourseSelection.vue -->
<template>
  <div class="course-selection">
    <a-card title="选课管理">
      <!-- 学生选择 -->
      <div class="student-selector">
        <a-form :model="form" layout="inline">
          <a-form-item label="学生">
            <a-select v-model:value="form.studentId" placeholder="选择学生" style="width: 300px">
              <a-option v-for="student in students" :key="student.id" :value="student.id">
                {{ student.name }} ({{ student.studentId }})
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="fetchStudentCourses">查询选课</a-button>
          </a-form-item>
        </a-form>
      </div>
      
      <!-- 可选课程 -->
      <a-card class="available-courses" v-if="form.studentId">
        <template #title>可选课程</template>
        <a-table :columns="availableColumns" :data-source="availableCourses" row-key="id" :loading="loading">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-button type="primary" size="small" @click="selectCourse(record)">
                <template #icon><plus-outlined /></template>
                选课
              </a-button>
            </template>
          </template>
        </a-table>
      </a-card>
      
      <!-- 已选课程 -->
      <a-card class="selected-courses" v-if="form.studentId">
        <template #title>已选课程</template>
        <a-table :columns="selectedColumns" :data-source="selectedCourses" row-key="id" :loading="loading">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-button danger size="small" @click="dropCourse(record)">
                <template #icon><delete-outlined /></template>
                退课
              </a-button>
            </template>
          </template>
        </a-table>
      </a-card>
      
      <!-- 选课统计 -->
      <a-card class="selection-stats" v-if="form.studentId">
        <template #title>选课统计</template>
        <div class="stats-content">
          <a-statistic title="已选课程数" :value="selectedCourses.length" />
          <a-statistic title="已选学分数" :value="totalCredits" />
        </div>
      </a-card>
    </a-card>
  </div>
</template>

<script>
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';

export default {
  name: 'CourseSelection',
  components: {
    PlusOutlined,
    DeleteOutlined
  },
  data() {
    return {
      loading: false,
      students: [
        { id: 1, name: '张三', studentId: '2023001', major: '计算机科学与技术' },
        { id: 2, name: '李四', studentId: '2023002', major: '软件工程' },
        { id: 3, name: '王五', studentId: '2023003', major: '信息管理与信息系统' }
      ],
      allCourses: [
        {
          id: 1,
          name: '数据结构',
          courseId: 'CS101',
          credit: 4,
          major: '计算机科学与技术'
        },
        {
          id: 2,
          name: '操作系统',
          courseId: 'CS102',
          credit: 4,
          major: '计算机科学与技术'
        },
        {
          id: 3,
          name: '软件工程',
          courseId: 'SE201',
          credit: 3,
          major: '软件工程'
        },
        {
          id: 4,
          name: '信息系统导论',
          courseId: 'IS301',
          credit: 3,
          major: '信息管理与信息系统'
        }
      ],
      studentCourses: [
        { studentId: 1, courseId: 1 },
        { studentId: 1, courseId: 2 },
        { studentId: 2, courseId: 3 }
      ],
      form: {
        studentId: ''
      },
      availableColumns: [
        {
          title: '课程名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '课程号',
          dataIndex: 'courseId',
          key: 'courseId'
        },
        {
          title: '学分',
          dataIndex: 'credit',
          key: 'credit'
        },
        {
          title: '所属专业',
          dataIndex: 'major',
          key: 'major'
        },
        {
          title: '操作',
          key: 'action'
        }
      ],
      selectedColumns: [
        {
          title: '课程名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '课程号',
          dataIndex: 'courseId',
          key: 'courseId'
        },
        {
          title: '学分',
          dataIndex: 'credit',
          key: 'credit'
        },
        {
          title: '操作',
          key: 'action'
        }
      ]
    };
  },
  computed: {
    availableCourses() {
      if (!this.form.studentId) return [];
      const selectedCourseIds = this.studentCourses
        .filter(sc => sc.studentId === this.form.studentId)
        .map(sc => sc.courseId);
      return this.allCourses.filter(course => !selectedCourseIds.includes(course.id));
    },
    selectedCourses() {
      if (!this.form.studentId) return [];
      const selectedCourseIds = this.studentCourses
        .filter(sc => sc.studentId === this.form.studentId)
        .map(sc => sc.courseId);
      return this.allCourses.filter(course => selectedCourseIds.includes(course.id));
    },
    totalCredits() {
      return this.selectedCourses.reduce((sum, course) => sum + course.credit, 0);
    }
  },
  methods: {
    fetchStudentCourses() {
      // 这里可以调用API获取学生选课情况
      console.log('查询学生选课:', this.form.studentId);
    },
    selectCourse(course) {
      this.studentCourses.push({ studentId: this.form.studentId, courseId: course.id });
      this.$message.success(`成功选择课程: ${course.name}`);
    },
    dropCourse(course) {
      this.studentCourses = this.studentCourses.filter(
        sc => !(sc.studentId === this.form.studentId && sc.courseId === course.id)
      );
      this.$message.success(`成功退课: ${course.name}`);
    }
  }
};
</script>

<style scoped>
.course-selection {
  padding: 20px;
}

.student-selector {
  margin-bottom: 24px;
}

.available-courses {
  margin-bottom: 24px;
}

.selected-courses {
  margin-bottom: 24px;
}

.stats-content {
  display: flex;
  gap: 48px;
}
</style>