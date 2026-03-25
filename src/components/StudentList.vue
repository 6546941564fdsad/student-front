<!-- src/components/StudentList.vue -->
<template>
  <div class="student-list">
    <a-card title="学生列表">
      <!-- 工具栏：搜索、筛选、批量操作、导入导出 -->
      <div class="toolbar">
        <a-space size="middle">
          <!-- 搜索 -->
          <a-input-search 
            placeholder="搜索学生姓名/学号" 
            style="width: 300px" 
            @search="handleSearch"
          />
          <!-- 筛选 -->
          <a-select placeholder="按专业筛选" style="width: 150px" @change="handleMajorFilter">
            <a-option value="">全部</a-option>
            <a-option value="计算机科学与技术">计算机科学与技术</a-option>
            <a-option value="软件工程">软件工程</a-option>
            <a-option value="信息管理与信息系统">信息管理与信息系统</a-option>
          </a-select>
          <a-select placeholder="按性别筛选" style="width: 100px" @change="handleGenderFilter">
            <a-option value="">全部</a-option>
            <a-option value="男">男</a-option>
            <a-option value="女">女</a-option>
          </a-select>
        </a-space>
        
        <a-space size="middle">
          <!-- 批量操作 -->
          <a-dropdown>
            <a-button>
              批量操作
              <template #icon><down-outlined /></template>
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="batchDelete">批量删除</a-menu-item>
                <a-menu-item @click="batchExport">批量导出</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <!-- 导入导出 -->
          <a-upload name="file" :showUploadList="false" @change="handleImport">
            <a-button>
              <template #icon><upload-outlined /></template>
              导入学生
            </a-button>
          </a-upload>
          <a-button @click="handleExport">
            <template #icon><download-outlined /></template>
            导出学生
          </a-button>
          <!-- 添加学生 -->
          <a-button type="primary" @click="showAddForm">
            <template #icon><plus-outlined /></template>
            添加学生
          </a-button>
        </a-space>
      </div>
      
      <a-table 
        :columns="columns" 
        :data-source="filteredStudents" 
        row-key="id" 
        :loading="loading"
        :row-selection="rowSelection"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space size="small">
              <a-button type="primary" size="small" @click="showEditForm(record)">
                <template #icon><form-outlined /></template>
                编辑
              </a-button>
              <a-button danger size="small" @click="deleteStudent(record.id)">
                <template #icon><delete-outlined /></template>
                删除
              </a-button>
              <a-button size="small" @click="viewProfile(record)">
                <template #icon><user-outlined /></template>
                档案
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
    
    <!-- 学生表单抽屉 -->
    <a-drawer
      :width="500"
      :title="currentStudent ? '编辑学生' : '添加学生'"
      placement="right"
      :open="showForm"
      @close="cancelForm"
    >
      <template #extra>
        <a-button style="margin-right: 8px" @click="cancelForm">取消</a-button>
        <a-button type="primary" @click="handleDrawerOk">保存</a-button>
      </template>
      <StudentForm 
        ref="studentFormRef"
        :student="currentStudent" 
        @save="saveStudent"
      />
    </a-drawer>
  </div>
</template>

<script>
import { studentApi } from '../api/student';
import StudentForm from './StudentForm.vue';
import { 
  PlusOutlined, 
  FormOutlined, 
  DeleteOutlined, 
  DownOutlined, 
  UploadOutlined, 
  DownloadOutlined,
  UserOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'StudentList',
  components: {
    StudentForm,
    PlusOutlined,
    FormOutlined,
    DeleteOutlined,
    DownOutlined,
    UploadOutlined,
    DownloadOutlined,
    UserOutlined
  },
  data() {
    return {
      students: [],
      showForm: false,
      currentStudent: null,
      loading: false,
      searchText: '',
      majorFilter: '',
      genderFilter: '',
      selectedRowKeys: [],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id'
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '年龄',
          dataIndex: 'age',
          key: 'age'
        },
        {
          title: '性别',
          dataIndex: 'gender',
          key: 'gender'
        },
        {
          title: '学号',
          dataIndex: 'studentId',
          key: 'studentId'
        },
        {
          title: '专业',
          dataIndex: 'major',
          key: 'major'
        },
        {
          title: '操作',
          key: 'action'
        }
      ]
    };
  },
  computed: {
    filteredStudents() {
      return this.students.filter(student => {
        const matchesSearch = !this.searchText || 
          student.name.includes(this.searchText) || 
          student.studentId.includes(this.searchText);
        const matchesMajor = !this.majorFilter || student.major === this.majorFilter;
        const matchesGender = !this.genderFilter || student.gender === this.genderFilter;
        return matchesSearch && matchesMajor && matchesGender;
      });
    },
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys) => {
          this.selectedRowKeys = selectedRowKeys;
        }
      };
    }
  },
  mounted() {
    this.fetchStudents();
  },
  methods: {
    async fetchStudents() {
      this.loading = true;
      try {
        const response = await studentApi.getStudents();
        this.students = response.data;
      } catch (error) {
        console.error('获取学生列表失败:', error);
        this.$message.error('获取学生列表失败');
      } finally {
        this.loading = false;
      }
    },
    showAddForm() {
      this.currentStudent = null;
      this.showForm = true;
    },
    showEditForm(student) {
      this.currentStudent = student;
      this.showForm = true;
    },
    viewProfile(record) {
      // 跳转到学生档案页面
      console.log('查看学生档案:', record);
      // 这里可以添加路由跳转逻辑
    },
    handleDrawerOk() {
      // 触发 StudentForm 的表单提交
      if (this.$refs.studentFormRef) {
        this.$refs.studentFormRef.handleSubmit();
      }
    },
    async saveStudent(studentData) {
      this.loading = true;
      try {
        if (this.currentStudent) {
          // 编辑学生
          await studentApi.updateStudent(this.currentStudent.id, studentData);
          this.$message.success('编辑学生成功');
        } else {
          // 添加学生
          await studentApi.createStudent(studentData);
          this.$message.success('添加学生成功');
        }
        await this.fetchStudents();
        this.cancelForm();
      } catch (error) {
        console.error('保存学生失败:', error);
        this.$message.error('保存学生失败');
      } finally {
        this.loading = false;
      }
    },
    cancelForm() {
      this.showForm = false;
      this.currentStudent = null;
    },
    async deleteStudent(id) {
      this.$confirm({
        title: '删除确认',
        content: '确定要删除这个学生吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          this.loading = true;
          try {
            await studentApi.deleteStudent(id);
            this.$message.success('删除学生成功');
            await this.fetchStudents();
          } catch (error) {
            console.error('删除学生失败:', error);
            this.$message.error('删除学生失败');
          } finally {
            this.loading = false;
          }
        }
      });
    },
    handleSearch(value) {
      this.searchText = value;
    },
    handleMajorFilter(value) {
      this.majorFilter = value;
    },
    handleGenderFilter(value) {
      this.genderFilter = value;
    },
    batchDelete() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要删除的学生');
        return;
      }
      this.$confirm({
        title: '批量删除确认',
        content: `确定要删除选中的 ${this.selectedRowKeys.length} 个学生吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          this.loading = true;
          try {
            // 这里可以调用批量删除接口
            for (const id of this.selectedRowKeys) {
              await studentApi.deleteStudent(id);
            }
            this.$message.success('批量删除成功');
            await this.fetchStudents();
            this.selectedRowKeys = [];
          } catch (error) {
            console.error('批量删除失败:', error);
            this.$message.error('批量删除失败');
          } finally {
            this.loading = false;
          }
        }
      });
    },
    batchExport() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要导出的学生');
        return;
      }
      // 这里可以调用批量导出接口
      this.$message.success('批量导出功能开发中');
    },
    handleImport(info) {
      // 这里可以处理导入逻辑
      this.$message.success('导入功能开发中');
    },
    handleExport() {
      // 这里可以处理导出逻辑
      this.$message.success('导出功能开发中');
    }
  }
};
</script>

<style scoped>
.student-list {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>