<!-- src/components/CourseList.vue -->
<template>
  <div class="course-list">
    <a-card title="课程列表">
      <!-- 工具栏：搜索、筛选、批量操作、导入导出 -->
      <div class="toolbar">
        <a-space size="middle">
          <!-- 搜索 -->
          <a-input-search 
            placeholder="搜索课程名称/课程号" 
            style="width: 300px" 
            @search="handleSearch"
          />
          <!-- 筛选 -->
          <a-select placeholder="按学期筛选" style="width: 150px" @change="handleSemesterFilter">
            <a-option value="">全部</a-option>
            <a-option value="2023-2024-1">2023-2024-1</a-option>
            <a-option value="2023-2024-2">2023-2024-2</a-option>
            <a-option value="2024-2025-1">2024-2025-1</a-option>
          </a-select>
          <a-select placeholder="按专业筛选" style="width: 150px" @change="handleMajorFilter">
            <a-option value="">全部</a-option>
            <a-option value="计算机科学与技术">计算机科学与技术</a-option>
            <a-option value="软件工程">软件工程</a-option>
            <a-option value="信息管理与信息系统">信息管理与信息系统</a-option>
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
              导入课程
            </a-button>
          </a-upload>
          <a-button @click="handleExport">
            <template #icon><download-outlined /></template>
            导出课程
          </a-button>
          <!-- 添加课程 -->
          <a-button type="primary" @click="showAddForm">
            <template #icon><plus-outlined /></template>
            添加课程
          </a-button>
        </a-space>
      </div>
      
      <a-table 
        :columns="columns" 
        :data-source="filteredCourses" 
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
              <a-button danger size="small" @click="deleteCourse(record.id)">
                <template #icon><delete-outlined /></template>
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
    
    <!-- 课程表单抽屉 -->
    <a-drawer
      :width="500"
      :title="currentCourse ? '编辑课程' : '添加课程'"
      placement="right"
      :open="showForm"
      @close="cancelForm"
    >
      <template #extra>
        <a-button style="margin-right: 8px" @click="cancelForm">取消</a-button>
        <a-button type="primary" @click="handleDrawerOk">保存</a-button>
      </template>
      <a-form :model="courseForm" layout="vertical">
        <a-form-item label="课程名称">
          <a-input v-model:value="courseForm.name" />
        </a-form-item>
        <a-form-item label="课程号">
          <a-input v-model:value="courseForm.courseId" />
        </a-form-item>
        <a-form-item label="学期">
          <a-select v-model:value="courseForm.semester">
            <a-option value="2023-2024-1">2023-2024-1</a-option>
            <a-option value="2023-2024-2">2023-2024-2</a-option>
            <a-option value="2024-2025-1">2024-2025-1</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="专业">
          <a-select v-model:value="courseForm.major">
            <a-option value="计算机科学与技术">计算机科学与技术</a-option>
            <a-option value="软件工程">软件工程</a-option>
            <a-option value="信息管理与信息系统">信息管理与信息系统</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="学分">
          <a-input-number v-model:value="courseForm.credit" :min="0" :max="10" :step="0.5" />
        </a-form-item>
        <a-form-item label="课时">
          <a-input-number v-model:value="courseForm.hours" :min="0" :max="200" />
        </a-form-item>
        <a-form-item label="课程描述">
          <a-textarea v-model:value="courseForm.description" rows="4" />
        </a-form-item>
      </a-form>
    </a-drawer>
  </div>
</template>

<script>
import { 
  PlusOutlined, 
  FormOutlined, 
  DeleteOutlined, 
  DownOutlined, 
  UploadOutlined, 
  DownloadOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'CourseList',
  components: {
    PlusOutlined,
    FormOutlined,
    DeleteOutlined,
    DownOutlined,
    UploadOutlined,
    DownloadOutlined
  },
  data() {
    return {
      courses: [],
      showForm: false,
      currentCourse: null,
      loading: false,
      searchText: '',
      semesterFilter: '',
      majorFilter: '',
      selectedRowKeys: [],
      courseForm: {
        name: '',
        courseId: '',
        semester: '',
        major: '',
        credit: 0,
        hours: 0,
        description: ''
      },
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id'
        },
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
          title: '学期',
          dataIndex: 'semester',
          key: 'semester'
        },
        {
          title: '专业',
          dataIndex: 'major',
          key: 'major'
        },
        {
          title: '学分',
          dataIndex: 'credit',
          key: 'credit'
        },
        {
          title: '课时',
          dataIndex: 'hours',
          key: 'hours'
        },
        {
          title: '操作',
          key: 'action'
        }
      ]
    };
  },
  computed: {
    filteredCourses() {
      return this.courses.filter(course => {
        const matchesSearch = !this.searchText || 
          course.name.includes(this.searchText) || 
          course.courseId.includes(this.searchText);
        const matchesSemester = !this.semesterFilter || course.semester === this.semesterFilter;
        const matchesMajor = !this.majorFilter || course.major === this.majorFilter;
        return matchesSearch && matchesSemester && matchesMajor;
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
    this.fetchCourses();
  },
  methods: {
    async fetchCourses() {
      this.loading = true;
      try {
        // 这里可以调用课程API获取课程列表
        // 模拟数据
        this.courses = [
          {
            id: 1,
            name: '数据结构',
            courseId: 'CS101',
            semester: '2023-2024-1',
            major: '计算机科学与技术',
            credit: 4,
            hours: 64
          },
          {
            id: 2,
            name: '操作系统',
            courseId: 'CS102',
            semester: '2023-2024-2',
            major: '计算机科学与技术',
            credit: 4,
            hours: 64
          },
          {
            id: 3,
            name: '软件工程',
            courseId: 'SE201',
            semester: '2023-2024-1',
            major: '软件工程',
            credit: 3,
            hours: 48
          }
        ];
      } catch (error) {
        console.error('获取课程列表失败:', error);
        this.$message.error('获取课程列表失败');
      } finally {
        this.loading = false;
      }
    },
    showAddForm() {
      this.currentCourse = null;
      this.courseForm = {
        name: '',
        courseId: '',
        semester: '',
        major: '',
        credit: 0,
        hours: 0,
        description: ''
      };
      this.showForm = true;
    },
    showEditForm(course) {
      this.currentCourse = course;
      this.courseForm = { ...course };
      this.showForm = true;
    },
    handleDrawerOk() {
      this.saveCourse();
    },
    async saveCourse() {
      this.loading = true;
      try {
        if (this.currentCourse) {
          // 编辑课程
          const index = this.courses.findIndex(c => c.id === this.currentCourse.id);
          if (index !== -1) {
            this.courses[index] = { ...this.courseForm };
          }
          this.$message.success('编辑课程成功');
        } else {
          // 添加课程
          const newCourse = {
            ...this.courseForm,
            id: this.courses.length + 1
          };
          this.courses.push(newCourse);
          this.$message.success('添加课程成功');
        }
        this.cancelForm();
      } catch (error) {
        console.error('保存课程失败:', error);
        this.$message.error('保存课程失败');
      } finally {
        this.loading = false;
      }
    },
    cancelForm() {
      this.showForm = false;
      this.currentCourse = null;
    },
    async deleteCourse(id) {
      this.$confirm({
        title: '删除确认',
        content: '确定要删除这门课程吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          this.loading = true;
          try {
            this.courses = this.courses.filter(c => c.id !== id);
            this.$message.success('删除课程成功');
          } catch (error) {
            console.error('删除课程失败:', error);
            this.$message.error('删除课程失败');
          } finally {
            this.loading = false;
          }
        }
      });
    },
    handleSearch(value) {
      this.searchText = value;
    },
    handleSemesterFilter(value) {
      this.semesterFilter = value;
    },
    handleMajorFilter(value) {
      this.majorFilter = value;
    },
    batchDelete() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要删除的课程');
        return;
      }
      this.$confirm({
        title: '批量删除确认',
        content: `确定要删除选中的 ${this.selectedRowKeys.length} 门课程吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          this.loading = true;
          try {
            this.courses = this.courses.filter(c => !this.selectedRowKeys.includes(c.id));
            this.$message.success('批量删除成功');
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
        this.$message.warning('请选择要导出的课程');
        return;
      }
      this.$message.success('批量导出功能开发中');
    },
    handleImport(info) {
      this.$message.success('导入功能开发中');
    },
    handleExport() {
      this.$message.success('导出功能开发中');
    }
  }
};
</script>

<style scoped>
.course-list {
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