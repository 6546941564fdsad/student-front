<!-- src/components/GradeEntry.vue -->
<template>
  <div class="grade-entry">
    <a-card title="成绩录入">
      <!-- 权限提示 -->
      <a-alert 
        :message="`当前角色：${userRole}`" 
        type="info" 
        show-icon 
        style="margin-bottom: 24px"
      />
      
      <!-- 课程选择 -->
      <a-form :model="form" layout="inline" class="course-selector">
        <a-form-item label="课程">
          <a-select v-model:value="form.courseId" placeholder="选择课程" style="width: 300px">
            <a-option v-for="course in courses" :key="course.id" :value="course.id">
              {{ course.name }} ({{ course.courseId }})
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="fetchCourseStudents">查询学生</a-button>
        </a-form-item>
      </a-form>
      
      <!-- 成绩录入表格 -->
      <a-table 
        :columns="columns" 
        :data-source="students" 
        row-key="id" 
        :loading="loading"
        :scroll="{ x: 800 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'score'">
            <a-input-number 
              v-model:value="record.score" 
              :min="0" 
              :max="100" 
              style="width: 100px" 
            />
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="primary" size="small" @click="saveSingleGrade(record)">
              <template #icon><form-outlined /></template>
              保存
            </a-button>
          </template>
        </template>
      </a-table>
      
      <!-- 批量操作 -->
      <div class="batch-actions" v-if="students.length > 0">
        <a-space size="middle">
          <a-upload name="file" :showUploadList="false" @change="handleImport">
            <a-button>
              <template #icon><upload-outlined /></template>
              导入成绩
            </a-button>
          </a-upload>
          <a-button @click="batchSave">
            <template #icon><save-outlined /></template>
            批量保存
          </a-button>
          <a-button @click="exportTemplate">
            <template #icon><download-outlined /></template>
            导出模板
          </a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script>
import { 
  FormOutlined, 
  UploadOutlined, 
  DownloadOutlined, 
  SaveOutlined 
} from '@ant-design/icons-vue';

export default {
  name: 'GradeEntry',
  components: {
    FormOutlined,
    UploadOutlined,
    DownloadOutlined,
    SaveOutlined
  },
  data() {
    return {
      loading: false,
      userRole: '管理员', // 这里可以根据实际登录用户角色动态设置
      courses: [
        { id: 1, name: '数据结构', courseId: 'CS101' },
        { id: 2, name: '操作系统', courseId: 'CS102' },
        { id: 3, name: '软件工程', courseId: 'SE201' }
      ],
      students: [
        {
          id: 1,
          name: '张三',
          studentId: '2023001',
          score: 85
        },
        {
          id: 2,
          name: '李四',
          studentId: '2023002',
          score: 90
        },
        {
          id: 3,
          name: '王五',
          studentId: '2023003',
          score: 75
        }
      ],
      form: {
        courseId: ''
      },
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          width: 80
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          width: 120
        },
        {
          title: '学号',
          dataIndex: 'studentId',
          key: 'studentId',
          width: 150
        },
        {
          title: '成绩',
          dataIndex: 'score',
          key: 'score',
          width: 120
        },
        {
          title: '操作',
          key: 'action',
          width: 100
        }
      ]
    };
  },
  methods: {
    fetchCourseStudents() {
      // 这里可以调用API获取课程学生列表
      console.log('查询课程学生:', this.form.courseId);
    },
    saveSingleGrade(record) {
      // 保存单个学生成绩
      console.log('保存成绩:', record);
      this.$message.success(`保存 ${record.name} 的成绩成功`);
    },
    batchSave() {
      // 批量保存成绩
      console.log('批量保存成绩:', this.students);
      this.$message.success('批量保存成绩成功');
    },
    handleImport(info) {
      // 导入成绩
      console.log('导入成绩:', info);
      this.$message.success('导入成绩成功');
    },
    exportTemplate() {
      // 导出模板
      console.log('导出模板');
      this.$message.success('导出模板成功');
    }
  }
};
</script>

<style scoped>
.grade-entry {
  padding: 20px;
}

.course-selector {
  margin-bottom: 24px;
}

.batch-actions {
  margin-top: 24px;
  text-align: right;
}
</style>