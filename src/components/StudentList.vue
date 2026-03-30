<!-- src/components/StudentList.vue -->
<template>
  <div class="student-list">
    <a-card title="学生列表">
      <!-- 工具栏：搜索、筛选、批量操作、导入导出 -->
      <div class="toolbar">
        <div class="filter-section">
          <a-space size="large" wrap>
            <!-- 搜索 -->
            <a-input-search 
              placeholder="搜索学生姓名/学号" 
              style="width: 320px" 
              @search="handleSearch"
            />
            
            <!-- 组织架构筛选 -->
            <a-cascader 
              placeholder="选择学院-专业-班级" 
              style="width: 320px"
              :options="organizationOptions"
              @change="handleOrganizationFilter"
              :field-names="{ label: 'name', value: 'id', children: 'children' }"
              expand-trigger="hover"
            />
          </a-space>
        </div>
        
        <div class="filter-section" style="margin-top: 16px">
          <a-space size="large" wrap>
            <!-- 基础筛选 -->
            <a-select placeholder="按性别筛选" style="width: 120px" @change="handleGenderFilter">
              <a-select-option value="全部">全部</a-select-option>
              <a-select-option value="男">男</a-select-option>
              <a-select-option value="女">女</a-select-option>
            </a-select>
            
            <a-select placeholder="按年级筛选" style="width: 120px" @change="handleGradeFilter">
              <a-select-option value="全部">全部</a-select-option>
              <a-select-option value="2024">2024级</a-select-option>
              <a-select-option value="2023">2023级</a-select-option>
              <a-select-option value="2022">2022级</a-select-option>
              <a-select-option value="2021">2021级</a-select-option>
            </a-select>
            
            <!-- 状态筛选 -->
            <a-select placeholder="按状态筛选" style="width: 120px" @change="handleStatusFilter">
              <a-select-option value="全部">全部</a-select-option>
              <a-select-option value="在校">在校</a-select-option>
              <a-select-option value="休学">休学</a-select-option>
              <a-select-option value="毕业">毕业</a-select-option>
              <a-select-option value="退学">退学</a-select-option>
            </a-select>
          </a-space>
        </div>
        
        <div class="action-section">
          <a-space size="large">
            <!-- 重置筛选 -->
            <a-button @click="resetFilters">
              <template #icon><reload-outlined /></template>
              重置筛选
            </a-button>
            
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
              <a-button color="blue" size="small" @click="viewProfile(record)">
                <template #icon><user-outlined /></template>
                档案
              </a-button>
              <a-button type="primary" size="small" @click="showEditForm(record)">
                <template #icon><form-outlined /></template>
                编辑
              </a-button>
              <a-popconfirm
                title="确定要删除这个学生吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirmDeleteStudent(record.id)"
              >
                <a-button danger size="small">
                  <template #icon><delete-outlined /></template>
                  删除
                </a-button>
              </a-popconfirm>
              <a-tooltip title="查看该学生奖惩 / 欠费记录">
                <a-button size="small" @click="viewPunishments(record)">
                  <template #icon><alert-outlined /></template>
                  惩处记录
                </a-button>
              </a-tooltip>
              <a-tooltip title="查看该学生参与的活动及获奖情况">
                <a-button size="small" @click="viewActivities(record)">
                  <template #icon><calendar-outlined /></template>
                  活动记录
                </a-button>
              </a-tooltip>
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
  UserOutlined,
  ReloadOutlined,
  AlertOutlined,
  CalendarOutlined
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
    UserOutlined,
    ReloadOutlined,
    AlertOutlined,
    CalendarOutlined
  },
  data() {
    return {
      students: [],
      showForm: false,
      currentStudent: null,
      loading: false,
      searchText: '',
      // 筛选条件
      collegeFilter: '',
      majorFilter: '',
      classFilter: '',
      genderFilter: '',
      gradeFilter: '',
      statusFilter: '',
      selectedRowKeys: [],
      // 组织架构数据
      organizationOptions: [
        {
          id: 'college_1',
          name: '大数据学院',
          children: [
            {
              id: 'major_1',
              name: '计算机科学与技术',
              children: [
                { id: 'class_1', name: '计科2024级1班' },
                { id: 'class_2', name: '计科2024级2班' },
                { id: 'class_3', name: '计科2023级1班' },
                { id: 'class_4', name: '计科2023级2班' }
              ]
            },
            {
              id: 'major_2',
              name: '软件工程',
              children: [
                { id: 'class_5', name: '软件2024级1班' },
                { id: 'class_6', name: '软件2024级2班' }
              ]
            }
          ]
        },
        {
          id: 'college_2',
          name: '电气学院',
          children: [
            {
              id: 'major_3',
              name: '电器与信息工程',
              children: [
                { id: 'class_7', name: '电气2024级1班' },
                { id: 'class_8', name: '电气2024级2班' },
                { id: 'class_9', name: '电气2023级1班' }
              ]
            }
          ]
        }
      ],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 80
        },
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
          width: 100
        },
        {
          title: '年龄',
          dataIndex: 'age',
          key: 'age',
          width: 80
        },
        {
          title: '性别',
          dataIndex: 'gender',
          key: 'gender',
          width: 80
        },
        {
          title: '学号',
          dataIndex: 'id',
          key: 'id',
          width: 120
        },
        {
          title: '学院',
          dataIndex: 'college',
          key: 'college',
          width: 120
        },
        {
          title: '专业',
          dataIndex: 'major',
          key: 'major',
          width: 150
        },
        {
          title: '班级',
          dataIndex: 'className',
          key: 'className',
          width: 120
        },
        {
          title: '年级',
          dataIndex: 'grade',
          key: 'grade',
          width: 80
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 80
        },
        {
          title: '操作',
          key: 'action',
          width: 200
        }
      ]
    };
  },
  computed: {
    filteredStudents() {
      return this.students.filter(student => {
        // 搜索条件
        const matchesSearch = !this.searchText || 
          student.name.includes(this.searchText) || 
          (student.id && student.id.toString().includes(this.searchText));
        
        // 组织架构条件
        const matchesCollege = !this.collegeFilter || student.college === this.collegeFilter;
        const matchesMajor = !this.majorFilter || student.major === this.majorFilter;
        const matchesClass = !this.classFilter || student.className === this.classFilter;
        
        // 基础条件
        const matchesGender = !this.genderFilter || student.gender === this.genderFilter;
        const matchesGrade = !this.gradeFilter || student.grade === this.gradeFilter;
        
        // 状态条件
        const matchesStatus = !this.statusFilter || student.status === this.statusFilter;
        
        return matchesSearch && matchesCollege && matchesMajor && matchesClass && 
               matchesGender && matchesGrade && matchesStatus;
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
      console.log('编辑学生信息:', student);
      // 先设置currentStudent
      this.currentStudent = JSON.parse(JSON.stringify(student));
      console.log('设置currentStudent:', this.currentStudent);
      // 使用 nextTick 确保数据更新后再打开抽屉
      this.$nextTick(() => {
        this.showForm = true;
        console.log('打开抽屉，currentStudent:', this.currentStudent);
      });
    },
    viewProfile(record) {
      // 切换到学生档案页面
      console.log('查看学生档案:', record);
      // 触发事件，通知 App.vue 切换到档案页面并传递学生 ID
      this.$emit('view-profile', record);
    },
    viewPunishments(record) {
      // 跳转到学生惩处记录
      console.log('查看学生惩处记录:', record);
      // 这里可以添加路由跳转逻辑，传递学生信息
      // 例如：this.$router.push({ path: '/punishment-list', query: { studentId: record.id } });
      this.$message.info(`查看 ${record.name} 的惩处记录`);
    },
    viewActivities(record) {
      // 查看学生活动记录 - 通过档案页面的活动标签页展示
      console.log('查看学生活动记录:', record);
      this.$emit('view-profile', record);
      this.$message.info(`查看 ${record.name} 的活动参与记录`);
    },
    handleDrawerOk() {
      // 触发 StudentForm 的表单提交和验证
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
    confirmDeleteStudent(id) {
      // 执行删除操作（已经过二次确认）
      this.deleteStudent(id);
    },
    async deleteStudent(id) {
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
    },
    handleSearch(value) {
      this.searchText = value;
    },
    // 组织架构筛选
    handleOrganizationFilter(value) {
      if (value && value.length > 0) {
        const [collegeId, majorId, classId] = value;
        
        // 根据ID查找对应的名称
        const college = this.findOrganizationById(collegeId);
        const major = college ? this.findOrganizationById(majorId, college.children) : null;
        const classItem = major ? this.findOrganizationById(classId, major.children) : null;
        
        this.collegeFilter = college ? college.name : '';
        this.majorFilter = major ? major.name : '';
        this.classFilter = classItem ? classItem.name : '';
      } else {
        this.collegeFilter = '';
        this.majorFilter = '';
        this.classFilter = '';
      }
    },
    
    // 基础筛选
    handleGenderFilter(value) {
      this.genderFilter = value === '全部' ? '' : value;
    },
    handleGradeFilter(value) {
      this.gradeFilter = value === '全部' ? '' : value;
    },
    
    // 状态筛选
    handleStatusFilter(value) {
      this.statusFilter = value === '全部' ? '' : value;
    },
    
    // 重置所有筛选条件
    resetFilters() {
      this.searchText = '';
      this.collegeFilter = '';
      this.majorFilter = '';
      this.classFilter = '';
      this.genderFilter = '';
      this.gradeFilter = '';
      this.statusFilter = '';
      this.$message.success('筛选条件已重置');
    },
    
    // 根据ID查找组织架构项
    findOrganizationById(id, list = null) {
      const searchList = list || this.organizationOptions;
      for (const item of searchList) {
        if (item.id === id) return item;
        if (item.children) {
          const found = this.findOrganizationById(id, item.children);
          if (found) return found;
        }
      }
      return null;
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