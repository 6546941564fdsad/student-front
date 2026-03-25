<!-- src/components/StudentForm.vue -->
<template>
  <div class="student-form">
    <a-form :model="form" @submit.prevent="handleSubmit">
      <a-form-item
        label="姓名"
        name="name"
        :rules="[{ required: true, message: '请输入姓名' }]"
      >
        <a-input v-model:value="form.name" placeholder="请输入姓名" />
      </a-form-item>
      
      <a-form-item
        label="年龄"
        name="age"
        :rules="[{ required: true, message: '请输入年龄' }]"
      >
        <a-input-number v-model:value="form.age" placeholder="请输入年龄" />
      </a-form-item>
      
      <a-form-item
        label="性别"
        name="gender"
        :rules="[{ required: true, message: '请选择性别' }]"
      >
        <a-select v-model:value="form.gender" placeholder="请选择性别">
          <a-select-option value="男">男</a-select-option>
          <a-select-option value="女">女</a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item
        label="学号"
        name="studentId"
        :rules="[{ required: true, message: '请输入学号' }]"
      >
        <a-input v-model:value="form.studentId" placeholder="请输入学号" />
      </a-form-item>
      
      <a-form-item
        label="专业"
        name="major"
      >
        <a-input v-model:value="form.major" placeholder="请输入专业" />
      </a-form-item>
      
      <a-form-item
        label="邮箱"
        name="email"
        :rules="[{ type: 'email', message: '请输入正确的邮箱地址' }]"
      >
        <a-input v-model:value="form.email" placeholder="请输入邮箱" />
      </a-form-item>
      
      <a-form-item
        label="电话"
        name="phone"
      >
        <a-input v-model:value="form.phone" placeholder="请输入电话" />
      </a-form-item>
      
      <a-form-item
        label="入学日期"
        name="enrollmentDate"
      >
        <a-date-picker v-model:value="form.enrollmentDate" style="width: 100%" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'StudentForm',
  props: {
    student: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      form: {
        name: '',
        age: null,
        gender: '',
        studentId: '',
        major: '',
        email: '',
        phone: '',
        enrollmentDate: null
      }
    };
  },
  computed: {
    isEdit() {
      return this.student !== null;
    }
  },
  watch: {
    student: {
      handler(newStudent) {
        if (newStudent) {
          this.form = {
            name: newStudent.name || '',
            age: newStudent.age || null,
            gender: newStudent.gender || '',
            studentId: newStudent.studentId || '',
            major: newStudent.major || '',
            email: newStudent.email || '',
            phone: newStudent.phone || '',
            enrollmentDate: newStudent.enrollmentDate ? new Date(newStudent.enrollmentDate) : null
          };
        } else {
          this.resetForm();
        }
      },
      immediate: true
    }
  },
  methods: {
    resetForm() {
      this.form = {
        name: '',
        age: null,
        gender: '',
        studentId: '',
        major: '',
        email: '',
        phone: '',
        enrollmentDate: null
      };
    },
    handleSubmit() {
      // 转换日期格式
      const formData = {
        ...this.form,
        enrollmentDate: this.form.enrollmentDate ? this.form.enrollmentDate.toISOString().split('T')[0] : null
      };
      this.$emit('save', formData);
    }
  }
};
</script>

<style scoped>
.student-form {
  max-width: 600px;
  margin: 0 auto;
}
</style>