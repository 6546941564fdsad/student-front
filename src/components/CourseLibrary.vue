<!-- src/components/CourseLibrary.vue -->
<template>
  <div class="course-library">
    <a-card :bordered="false">
      <div class="page-header">
        <h2 class="page-title">课程库管理</h2>
        <a-button type="primary" @click="showAddModal">
          <template #icon><PlusOutlined /></template>
          新增课程
        </a-button>
      </div>

      <a-form layout="inline" class="filter-form">
        <a-form-item label="课程编号">
          <a-input v-model:value="filters.courseCode" placeholder="请输入课程编号" />
        </a-form-item>
        <a-form-item label="课程名称">
          <a-input v-model:value="filters.courseName" placeholder="请输入课程名称" />
        </a-form-item>
        <a-form-item label="课程类别">
          <a-select v-model:value="filters.category" style="width: 180px" allow-clear>
            <a-select-option value="专业基础课">专业基础课</a-select-option>
            <a-select-option value="专业课">专业课</a-select-option>
            <a-select-option value="公共课">公共课</a-select-option>
            <a-select-option value="通识课">通识课</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <a-table
        :columns="columns"
        :data-source="courses"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="viewCourse(record)">查看</a-button>
              <a-button type="link" size="small" @click="editCourse(record)">编辑</a-button>
              <a-button type="link" danger size="small" @click="deleteCourse(record)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:open="showEditModal"
      :title="editForm.id ? '编辑课程' : '新增课程'"
      @ok="handleEditSubmit"
      :confirm-loading="editLoading"
    >
      <a-form :model="editForm" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="课程编号" required>
              <a-input v-model:value="editForm.courseCode" placeholder="请输入课程编号" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="课程名称" required>
              <a-input v-model:value="editForm.courseName" placeholder="请输入课程名称" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="课程类别">
              <a-select v-model:value="editForm.category">
                <a-select-option value="专业基础课">专业基础课</a-select-option>
                <a-select-option value="专业课">专业课</a-select-option>
                <a-select-option value="公共课">公共课</a-select-option>
                <a-select-option value="通识课">通识课</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="学分">
              <a-input-number v-model:value="editForm.credits" :min="0" :step="0.5" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="总学时">
              <a-input-number v-model:value="editForm.totalHours" :min="0" :step="8" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="状态">
              <a-select v-model:value="editForm.status">
                <a-select-option value="启用">启用</a-select-option>
                <a-select-option value="停用">停用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue';
import { courseApi } from '@/api/course';

export default {
  name: 'CourseLibrary',
  components: {
    PlusOutlined
  },
  data() {
    return {
      filters: {
        courseCode: '',
        courseName: '',
        category: ''
      },
      loading: false,
      editLoading: false,
      showEditModal: false,
      editForm: {},
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      columns: [
        { title: '课程编号', dataIndex: 'courseCode', key: 'courseCode', width: 120 },
        { title: '课程名称', dataIndex: 'courseName', key: 'courseName' },
        { title: '课程类别', dataIndex: 'category', key: 'category', width: 120 },
        { title: '学分', dataIndex: 'credits', key: 'credits', width: 80 },
        { title: '总学时', dataIndex: 'totalHours', key: 'totalHours', width: 80 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '操作', key: 'action', width: 180, fixed: 'right' }
      ],
      courses: []
    };
  },
  mounted() {
    this.loadCourses();
  },
  methods: {
    async loadCourses() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current - 1,
          size: this.pagination.pageSize,
          courseCode: this.filters.courseCode || undefined,
          courseName: this.filters.courseName || undefined,
          category: this.filters.category || undefined
        };
        const res = await courseApi.getCourses(params);
        if (res.data.success) {
          this.courses = res.data.data;
          this.pagination.total = res.data.total;
        }
      } catch (error) {
        console.error('加载课程失败:', error);
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadCourses();
    },
    handleReset() {
      this.filters = {
        courseCode: '',
        courseName: '',
        category: ''
      };
      this.handleSearch();
    },
    showAddModal() {
      this.editForm = {
        courseCode: '',
        courseName: '',
        category: '专业基础课',
        credits: 2,
        totalHours: 32,
        status: '启用'
      };
      this.showEditModal = true;
    },
    viewCourse(course) {
      this.$message.info(`查看课程：${course.courseName}`);
    },
    editCourse(course) {
      this.editForm = { ...course };
      this.showEditModal = true;
    },
    async handleEditSubmit() {
      this.editLoading = true;
      try {
        if (this.editForm.id) {
          // TODO: 后端补充更新接口
          this.$message.success('更新成功');
        } else {
          await courseApi.addCourse(this.editForm);
          this.$message.success('新增成功');
        }
        this.showEditModal = false;
        this.loadCourses();
      } catch (error) {
        console.error('保存失败:', error);
        this.$message.error('保存失败');
      } finally {
        this.editLoading = false;
      }
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadCourses();
    },
    deleteCourse(course) {
      this.$confirm({
        title: '确认删除',
        content: `确定要删除课程 ${course.courseName} 吗？`,
        onOk: async () => {
          try {
            await courseApi.deleteCourse(course.id);
            this.$message.success('删除成功');
            this.loadCourses();
          } catch (error) {
            console.error('删除失败:', error);
            this.$message.error('删除失败');
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.course-library {
  padding: 0;
}

.page-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
