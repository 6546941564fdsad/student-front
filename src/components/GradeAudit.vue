<!-- src/components/GradeAudit.vue -->
<template>
  <div class="grade-audit">
    <a-card title="成绩审核">
      <!-- 筛选条件 -->
      <div class="filters">
        <a-space size="middle">
          <a-select placeholder="按课程筛选" style="width: 200px" @change="handleCourseFilter">
            <a-option value="">全部</a-option>
            <a-option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.name }}
            </a-option>
          </a-select>
          <a-select placeholder="按状态筛选" style="width: 150px" @change="handleStatusFilter">
            <a-option value="">全部</a-option>
            <a-option value="待审核">待审核</a-option>
            <a-option value="已审核">已审核</a-option>
            <a-option value="异常">异常</a-option>
          </a-select>
        </a-space>
      </div>
      
      <!-- 成绩审核表格 -->
      <a-table 
        :columns="columns" 
        :data-source="filteredGrades" 
        row-key="id" 
        :loading="loading"
        :scroll="{ x: 1000 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space size="small">
              <a-button type="primary" size="small" @click="auditGrade(record)">
                <template #icon><check-circle-outlined /></template>
                审核
              </a-button>
              <a-button size="small" @click="viewHistory(record)">
                <template #icon><history-outlined /></template>
                历史
              </a-button>
              <a-button danger size="small" v-if="record.status !== '异常'" @click="markAbnormal(record)">
                <template #icon><exclamation-circle-outlined /></template>
                标记异常
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
      
      <!-- 审核弹窗 -->
      <a-modal
        :title="currentGrade ? '审核成绩' : '审核成绩'"
        :open="showAuditModal"
        @ok="handleAuditOk"
        @cancel="showAuditModal = false"
      >
        <a-form :model="auditForm" layout="vertical">
          <a-form-item label="学生">
            <a-input v-model:value="auditForm.studentName" disabled />
          </a-form-item>
          <a-form-item label="课程">
            <a-input v-model:value="auditForm.courseName" disabled />
          </a-form-item>
          <a-form-item label="成绩">
            <a-input-number v-model:value="auditForm.score" :min="0" :max="100" />
          </a-form-item>
          <a-form-item label="审核意见">
            <a-textarea v-model:value="auditForm.comment" rows="3" />
          </a-form-item>
        </a-form>
      </a-modal>
      
      <!-- 历史记录弹窗 -->
      <a-modal
        title="修改历史"
        :open="showHistoryModal"
        @cancel="showHistoryModal = false"
      >
        <a-table :columns="historyColumns" :data-source="gradeHistory" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'operator'">
              <a-tag>{{ record.operator }}</a-tag>
            </template>
          </template>
        </a-table>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import { 
  CheckCircleOutlined, 
  HistoryOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons-vue';

export default {
  name: 'GradeAudit',
  components: {
    CheckCircleOutlined,
    HistoryOutlined,
    ExclamationCircleOutlined
  },
  data() {
    return {
      loading: false,
      courses: [
        { id: 1, name: '数据结构', courseId: 'CS101' },
        { id: 2, name: '操作系统', courseId: 'CS102' },
        { id: 3, name: '软件工程', courseId: 'SE201' }
      ],
      grades: [
        {
          id: 1,
          studentId: 1,
          studentName: '张三',
          courseId: 1,
          courseName: '数据结构',
          score: 85,
          status: '待审核',
          submitTime: '2024-01-15 10:00:00',
          submitter: '张老师'
        },
        {
          id: 2,
          studentId: 2,
          studentName: '李四',
          courseId: 1,
          courseName: '数据结构',
          score: 90,
          status: '已审核',
          submitTime: '2024-01-15 10:05:00',
          submitter: '张老师',
          auditTime: '2024-01-16 09:00:00',
          auditor: '李主任'
        },
        {
          id: 3,
          studentId: 3,
          studentName: '王五',
          courseId: 1,
          courseName: '数据结构',
          score: 60,
          status: '异常',
          submitTime: '2024-01-15 10:10:00',
          submitter: '张老师',
          auditTime: '2024-01-16 09:05:00',
          auditor: '李主任'
        }
      ],
      courseFilter: '',
      statusFilter: '',
      showAuditModal: false,
      showHistoryModal: false,
      currentGrade: null,
      auditForm: {
        studentName: '',
        courseName: '',
        score: 0,
        comment: ''
      },
      gradeHistory: [
        {
          id: 1,
          time: '2024-01-15 10:00:00',
          operator: '张老师',
          action: '录入成绩',
          oldValue: '',
          newValue: '85'
        },
        {
          id: 2,
          time: '2024-01-16 09:00:00',
          operator: '李主任',
          action: '审核通过',
          oldValue: '待审核',
          newValue: '已审核'
        }
      ],
      columns: [
        {
          title: '学生姓名',
          dataIndex: 'studentName',
          key: 'studentName'
        },
        {
          title: '课程',
          dataIndex: 'courseName',
          key: 'courseName'
        },
        {
          title: '成绩',
          dataIndex: 'score',
          key: 'score'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status'
        },
        {
          title: '提交时间',
          dataIndex: 'submitTime',
          key: 'submitTime'
        },
        {
          title: '提交人',
          dataIndex: 'submitter',
          key: 'submitter'
        },
        {
          title: '操作',
          key: 'action'
        }
      ],
      historyColumns: [
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time'
        },
        {
          title: '操作人',
          dataIndex: 'operator',
          key: 'operator'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action'
        },
        {
          title: '旧值',
          dataIndex: 'oldValue',
          key: 'oldValue'
        },
        {
          title: '新值',
          dataIndex: 'newValue',
          key: 'newValue'
        }
      ]
    };
  },
  computed: {
    filteredGrades() {
      return this.grades.filter(grade => {
        const matchesCourse = !this.courseFilter || grade.courseId === parseInt(this.courseFilter);
        const matchesStatus = !this.statusFilter || grade.status === this.statusFilter;
        return matchesCourse && matchesStatus;
      });
    }
  },
  methods: {
    handleCourseFilter(value) {
      this.courseFilter = value;
    },
    handleStatusFilter(value) {
      this.statusFilter = value;
    },
    auditGrade(record) {
      this.currentGrade = record;
      this.auditForm = {
        studentName: record.studentName,
        courseName: record.courseName,
        score: record.score,
        comment: ''
      };
      this.showAuditModal = true;
    },
    handleAuditOk() {
      // 处理审核
      console.log('审核成绩:', this.auditForm);
      if (this.currentGrade) {
        const index = this.grades.findIndex(g => g.id === this.currentGrade.id);
        if (index !== -1) {
          this.grades[index] = {
            ...this.grades[index],
            score: this.auditForm.score,
            status: '已审核',
            auditTime: new Date().toLocaleString(),
            auditor: '当前用户'
          };
        }
      }
      this.showAuditModal = false;
      this.$message.success('审核成功');
    },
    viewHistory(record) {
      // 查看修改历史
      console.log('查看历史:', record);
      this.showHistoryModal = true;
    },
    markAbnormal(record) {
      // 标记异常
      this.$confirm({
        title: '标记异常',
        content: `确定要将 ${record.studentName} 的成绩标记为异常吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const index = this.grades.findIndex(g => g.id === record.id);
          if (index !== -1) {
            this.grades[index] = {
              ...this.grades[index],
              status: '异常'
            };
          }
          this.$message.success('标记异常成功');
        }
      });
    },
    getStatusColor(status) {
      switch (status) {
        case '待审核':
          return 'blue';
        case '已审核':
          return 'green';
        case '异常':
          return 'red';
        default:
          return 'default';
      }
    }
  }
};
</script>

<style scoped>
.grade-audit {
  padding: 20px;
}

.filters {
  margin-bottom: 24px;
}
</style>