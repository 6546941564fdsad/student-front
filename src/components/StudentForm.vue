<!-- src/components/StudentForm.vue -->
<template>
  <div class="student-form">
    <a-form ref="formRef" :model="form" @submit.prevent="handleSubmit">
      <a-form-item
        label="姓名"
        name="name"
        :rules="[{ required: true, message: '请输入姓名' }]"
      >
        <a-input :value="form.name" @input="form.name = $event.target.value" placeholder="请输入姓名" />
      </a-form-item>
      
      <a-form-item
        label="年龄"
        name="age"
        :rules="[{ required: true, message: '请输入年龄' }]"
      >
        <a-input-number :value="form.age" @change="form.age = $event" placeholder="请输入年龄" />
      </a-form-item>
      
      <a-form-item
        label="性别"
        name="gender"
        :rules="[{ required: true, message: '请选择性别' }]"
      >
        <a-select :value="form.gender" @change="form.gender = $event" placeholder="请选择性别">
          <a-select-option value="男">男</a-select-option>
          <a-select-option value="女">女</a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item
        label="学号"
        name="studentId"
        :rules="[{ required: true, message: '请输入学号' }]"
      >
        <a-input :value="form.studentId" @input="form.studentId = $event.target.value" placeholder="请输入学号" />
      </a-form-item>
      
      <a-form-item
        label="学院"
        name="college"
      >
        <a-input :value="form.college" @input="form.college = $event.target.value" placeholder="请输入学院" />
      </a-form-item>
      
      <a-form-item
        label="专业"
        name="major"
      >
        <a-input :value="form.major" @input="form.major = $event.target.value" placeholder="请输入专业" />
      </a-form-item>
      
      <a-form-item
        label="班级"
        name="className"
      >
        <a-input :value="form.className" @input="form.className = $event.target.value" placeholder="请输入班级" />
      </a-form-item>
      
      <a-form-item
        label="年级"
        name="grade"
      >
        <a-input :value="form.grade" @input="form.grade = $event.target.value" placeholder="请输入年级" />
      </a-form-item>
      
      <a-form-item
        label="状态"
        name="status"
      >
        <a-select :value="form.status" @change="form.status = $event" placeholder="请选择状态">
          <a-select-option value="在校">在校</a-select-option>
          <a-select-option value="休学">休学</a-select-option>
          <a-select-option value="毕业">毕业</a-select-option>
          <a-select-option value="退学">退学</a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item
        label="邮箱"
        name="email"
        :rules="[{ type: 'email', message: '请输入正确的邮箱地址' }]"
      >
        <a-input :value="form.email" @input="form.email = $event.target.value" placeholder="请输入邮箱" />
      </a-form-item>
      
      <a-form-item
        label="电话"
        name="phone"
      >
        <a-input :value="form.phone" @input="form.phone = $event.target.value" placeholder="请输入电话" />
      </a-form-item>
      
      <a-form-item
        label="入学日期"
        name="enrollmentDate"
      >
        <a-date-picker :value="form.enrollmentDate" @change="form.enrollmentDate = $event" style="width: 100%" />
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
        college: '',
        className: '',
        grade: '',
        status: '',
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
  mounted() {
    console.log('组件挂载，学生信息:', this.student);
    this.$nextTick(() => {
      this.initForm();
    });
  },
  watch: {
    student: {
      handler(newStudent) {
        console.log('收到学生信息:', newStudent);
        this.$nextTick(() => {
          this.initForm();
        });
      },
      immediate: true
    }
  },
  methods: {
    initForm() {
      if (this.student) {
        // 先将Proxy对象转换为普通对象，确保数据正确
        const studentData = JSON.parse(JSON.stringify(this.student));
        console.log('转换后的学生数据:', studentData);
        
        // 直接修改 form 对象的属性
        this.form.name = studentData.name || '';
        this.form.age = studentData.age || null;
        this.form.gender = studentData.gender || '';
        this.form.studentId = studentData.studentId || (studentData.id ? studentData.id.toString() : '');
        this.form.major = studentData.major || '';
        this.form.college = studentData.college || '';
        this.form.className = studentData.className || '';
        this.form.grade = studentData.grade || '';
        this.form.status = studentData.status || '';
        this.form.email = studentData.email || '';
        this.form.phone = studentData.phone || '';
        this.form.enrollmentDate = studentData.enrollmentDate ? new Date(studentData.enrollmentDate) : null;
        
        console.log('表单数据:', this.form);
        console.log('表单name:', this.form.name);
        console.log('表单age:', this.form.age);
        console.log('表单gender:', this.form.gender);
      } else {
        this.resetForm();
      }
    },
    resetForm() {
      // 直接重置 form 对象
      this.form = {
        name: '',
        age: null,
        gender: '',
        studentId: '',
        major: '',
        college: '',
        className: '',
        grade: '',
        status: '',
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