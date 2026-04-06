<!-- src/components/StudentArchives.vue -->
<template>
  <div class="student-archives">
    <a-card :bordered="false">
      <div class="page-header">
        <h2 class="page-title">学生档案管理</h2>
      </div>

      <a-form layout="inline" class="filter-form">
        <a-form-item label="学号">
          <a-input v-model:value="filters.studentNo" placeholder="请输入学号" />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-model:value="filters.name" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="学院">
          <a-select v-model:value="filters.college" style="width: 200px" allow-clear>
            <a-select-option value="315">大数据与计算机学院</a-select-option>
            <a-select-option value="316">人工智能学院</a-select-option>
            <a-select-option value="317">软件学院</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="专业">
          <a-select v-model:value="filters.major" style="width: 200px" allow-clear>
            <a-select-option value="0300">计算机科学与技术</a-select-option>
            <a-select-option value="0301">软件工程</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <a-table
        :columns="columns"
        :data-source="students"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="viewStudent(record)">查看</a-button>
              <a-button type="link" size="small" @click="editStudent(record)">编辑</a-button>
              <a-button type="link" danger size="small" @click="deleteStudent(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      title="学生详情"
      :open="showDetail"
      @cancel="showDetail = false"
      :footer="null"
      width="800px"
    >
      <a-descriptions bordered :column="2" v-if="currentStudent">
        <a-descriptions-item label="学号">{{ currentStudent.studentNo }}</a-descriptions-item>
        <a-descriptions-item label="姓名">{{ currentStudent.name }}</a-descriptions-item>
        <a-descriptions-item label="性别">{{ currentStudent.gender }}</a-descriptions-item>
        <a-descriptions-item label="出生日期">{{ currentStudent.birthDate }}</a-descriptions-item>
        <a-descriptions-item label="学院">{{ currentStudent.college }}</a-descriptions-item>
        <a-descriptions-item label="专业">{{ currentStudent.major }}</a-descriptions-item>
        <a-descriptions-item label="班级">{{ currentStudent.className }}</a-descriptions-item>
        <a-descriptions-item label="入学年份">{{ currentStudent.enrollYear }}</a-descriptions-item>
        <a-descriptions-item label="联系电话" :span="2">{{ currentStudent.phone }}</a-descriptions-item>
        <a-descriptions-item label="邮箱" :span="2">{{ currentStudent.email }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'StudentArchives',
  data() {
    return {
      filters: {
        studentNo: '',
        name: '',
        college: '',
        major: ''
      },
      loading: false,
      showDetail: false,
      currentStudent: null,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true
      },
      columns: [
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo', width: 120 },
        { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
        { title: '性别', dataIndex: 'gender', key: 'gender', width: 80 },
        { title: '学院', dataIndex: 'college', key: 'college' },
        { title: '专业', dataIndex: 'major', key: 'major' },
        { title: '班级', dataIndex: 'className', key: 'className' },
        { title: '入学年份', dataIndex: 'enrollYear', key: 'enrollYear', width: 100 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '操作', key: 'action', width: 180, fixed: 'right' }
      ],
      students: []
    };
  },
  mounted() {
    this.loadStudents();
  },
  methods: {
    loadStudents() {
      this.loading = true;
      // 模拟数据
      setTimeout(() => {
        this.students = [
          {
            id: 1,
            studentNo: '2024001001',
            name: '张三',
            gender: '男',
            college: '大数据与计算机学院',
            major: '计算机科学与技术',
            className: '计科2401班',
            enrollYear: '2024',
            status: '在读',
            birthDate: '2005-03-15',
            phone: '13800138000',
            email: 'zhangsan@example.com'
          },
          {
            id: 2,
            studentNo: '2024001002',
            name: '李四',
            gender: '女',
            college: '大数据与计算机学院',
            major: '软件工程',
            className: '软工2401班',
            enrollYear: '2024',
            status: '在读',
            birthDate: '2005-07-22',
            phone: '13900139000',
            email: 'lisi@example.com'
          }
        ];
        this.pagination.total = this.students.length;
        this.loading = false;
      }, 500);
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadStudents();
    },
    handleReset() {
      this.filters = {
        studentNo: '',
        name: '',
        college: '',
        major: ''
      };
      this.handleSearch();
    },
    handleTableChange(pagination) {
      this.pagination = pagination;
      this.loadStudents();
    },
    viewStudent(student) {
      this.currentStudent = student;
      this.showDetail = true;
    },
    editStudent(student) {
      this.$message.info(`编辑学生：${student.name}`);
    },
    deleteStudent(student) {
      this.$confirm({
        title: '确认删除',
        content: `确定要删除学生 ${student.name} 吗？`,
        onOk: () => {
          this.$message.success('删除成功');
        }
      });
    }
  }
};
</script>

<style scoped>
.student-archives {
  padding: 0;
}

.page-header {
  margin-bottom: 16px;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.filter-form {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}
</style>
