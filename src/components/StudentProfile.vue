<!-- src/components/StudentProfile.vue -->
<template>
  <div class="student-profile">
    <a-card title="学生档案">
      <a-descriptions bordered column="2" v-if="student">
        <a-descriptions-item label="姓名">{{ student.name }}</a-descriptions-item>
        <a-descriptions-item label="年龄">{{ student.age }}</a-descriptions-item>
        <a-descriptions-item label="性别">{{ student.gender }}</a-descriptions-item>
        <a-descriptions-item label="学号">{{ student.studentId }}</a-descriptions-item>
        <a-descriptions-item label="专业">{{ student.major }}</a-descriptions-item>
        <a-descriptions-item label="班级">{{ student.class || '未设置' }}</a-descriptions-item>
        <a-descriptions-item label="状态">{{ student.status || '正常' }}</a-descriptions-item>
        <a-descriptions-item label="联系方式">{{ student.contact || '未设置' }}</a-descriptions-item>
        <a-descriptions-item label="入学时间" span="2">{{ student.enrollmentDate || '未设置' }}</a-descriptions-item>
      </a-descriptions>
      
      <div class="actions" v-if="student">
        <a-button type="primary" @click="editProfile">
          <template #icon><form-outlined /></template>
          编辑档案
        </a-button>
        <a-button @click="backToList">
          <template #icon><left-outlined /></template>
          返回列表
        </a-button>
      </div>
    </a-card>
    
    <!-- 编辑档案抽屉 -->
    <a-drawer
      :width="500"
      title="编辑学生档案"
      placement="right"
      :open="showEditForm"
      @close="cancelEdit"
    >
      <template #extra>
        <a-button style="margin-right: 8px" @click="cancelEdit">取消</a-button>
        <a-button type="primary" @click="saveProfile">保存</a-button>
      </template>
      <a-form :model="editForm" layout="vertical">
        <a-form-item label="姓名">
          <a-input v-model:value="editForm.name" />
        </a-form-item>
        <a-form-item label="年龄">
          <a-input-number v-model:value="editForm.age" :min="0" :max="100" />
        </a-form-item>
        <a-form-item label="性别">
          <a-select v-model:value="editForm.gender">
            <a-option value="男">男</a-option>
            <a-option value="女">女</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="学号">
          <a-input v-model:value="editForm.studentId" />
        </a-form-item>
        <a-form-item label="专业">
          <a-input v-model:value="editForm.major" />
        </a-form-item>
        <a-form-item label="班级">
          <a-input v-model:value="editForm.class" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="editForm.status">
            <a-option value="正常">正常</a-option>
            <a-option value="休学">休学</a-option>
            <a-option value="退学">退学</a-option>
            <a-option value="毕业">毕业</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="联系方式">
          <a-input v-model:value="editForm.contact" />
        </a-form-item>
        <a-form-item label="入学时间">
          <a-date-picker v-model:value="editForm.enrollmentDate" style="width: 100%" />
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
import { studentApi } from '../api/student';
import { FormOutlined, LeftOutlined } from '@ant-design/icons-vue';

export default {
  name: 'StudentProfile',
  components: {
    FormOutlined,
    LeftOutlined
  },
  props: {
    studentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      student: null,
      loading: false,
      showEditForm: false,
      editForm: {}
    };
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
        const response = await studentApi.getStudentById(this.studentId);
        this.student = response.data;
        this.editForm = { ...this.student };
      } catch (error) {
        console.error('获取学生档案失败:', error);
        this.$message.error('获取学生档案失败');
      } finally {
        this.loading = false;
      }
    },
    editProfile() {
      this.editForm = { ...this.student };
      this.showEditForm = true;
    },
    async saveProfile() {
      this.loading = true;
      try {
        await studentApi.updateStudent(this.student.id, this.editForm);
        this.$message.success('编辑档案成功');
        await this.fetchStudentProfile();
        this.cancelEdit();
      } catch (error) {
        console.error('保存档案失败:', error);
        this.$message.error('保存档案失败');
      } finally {
        this.loading = false;
      }
    },
    cancelEdit() {
      this.showEditForm = false;
    },
    backToList() {
      // 跳转到学生列表页面
      console.log('返回学生列表');
      // 这里可以添加路由跳转逻辑
    }
  }
};
</script>

<style scoped>
.student-profile {
  padding: 20px;
}

.actions {
  margin-top: 24px;
  display: flex;
  gap: 16px;
}
</style>