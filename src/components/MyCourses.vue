<!-- src/components/MyCourses.vue - 学生选课中心 -->
<template>
  <div class="my-courses">
    <a-card :bordered="false" :loading="loading">
      <template #title>
        <div class="card-header">
          <span>选课中心</span>
          <a-space>
            <a-tag color="blue">已选课程: {{ selectedCount }} 门</a-tag>
            <a-tag color="green">总学分: {{ totalCredits }} 分</a-tag>
          </a-space>
        </div>
      </template>

      <!-- 筛选条件 -->
      <a-form layout="inline" class="filter-form">
        <a-form-item label="学期">
          <a-select v-model:value="filters.semester" placeholder="请选择学期" style="width: 200px">
            <a-select-option value="2024-2025学年第二学期">2024-2025学年第二学期</a-select-option>
            <a-select-option value="2024-2025学年第一学期">2024-2025学年第一学期</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="课程名称">
          <a-input v-model:value="filters.courseName" placeholder="请输入课程名称" style="width: 200px" allow-clear />
        </a-form-item>
        <a-form-item label="课程类型">
          <a-select v-model:value="filters.courseType" placeholder="请选择类型" style="width: 150px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="必修课">必修课</a-select-option>
            <a-select-option value="选修课">选修课</a-select-option>
            <a-select-option value="公选课">公选课</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">
            <template #icon><SearchOutlined /></template>
            查询
          </a-button>
          <a-button style="margin-left: 8px" @click="handleReset">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
        </a-form-item>
      </a-form>

      <!-- Tabs 切换 -->
      <a-tabs v-model:activeKey="activeTab">
        <!-- 可选课程 -->
        <a-tab-pane key="available" tab="可选课程">
          <a-table
            :columns="availableColumns"
            :data-source="availableCourses"
            :pagination="availablePagination"
            :loading="loading"
            row-key="id"
            @change="handleAvailableTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'index'">
                {{ record.index }}
              </template>
              <template v-if="column.key === 'capacity'">
                {{ record.currentStudents }}/{{ record.capacity }}
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button 
                    type="primary" 
                    size="small" 
                    @click="handleSelectCourse(record)"
                    :disabled="record.isSelected || record.currentStudents >= record.capacity"
                  >
                    {{ record.isSelected ? '已选' : '选课' }}
                  </a-button>
                  <a-button size="small" @click="viewCourseDetail(record)">
                    详情
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <!-- 已选课程 -->
        <a-tab-pane key="selected" tab="已选课程">
          <a-table
            :columns="selectedColumns"
            :data-source="selectedCourses"
            :pagination="selectedPagination"
            :loading="loading"
            row-key="id"
            @change="handleSelectedTableChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'index'">
                {{ record.index }}
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-popconfirm
                    title="确定要退选这门课程吗？"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="handleDropCourse(record)"
                  >
                    <a-button type="danger" size="small" :disabled="!canDropCourse">
                      退选
                    </a-button>
                  </a-popconfirm>
                  <a-button size="small" @click="viewCourseDetail(record)">
                    详情
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 课程详情弹窗 -->
    <a-modal
      v-model:open="detailVisible"
      title="课程详情"
      :footer="null"
      width="600px"
    >
      <a-descriptions bordered column="1" v-if="currentCourse">
        <a-descriptions-item label="课程名称">{{ currentCourse.courseName }}</a-descriptions-item>
        <a-descriptions-item label="课程代码">{{ currentCourse.courseCode }}</a-descriptions-item>
        <a-descriptions-item label="课程类型">{{ currentCourse.courseType }}</a-descriptions-item>
        <a-descriptions-item label="学分">{{ currentCourse.credits }} 分</a-descriptions-item>
        <a-descriptions-item label="任课教师">{{ currentCourse.teacher }}</a-descriptions-item>
        <a-descriptions-item label="上课时间">{{ currentCourse.classTime }}</a-descriptions-item>
        <a-descriptions-item label="上课地点">{{ currentCourse.location }}</a-descriptions-item>
        <a-descriptions-item label="容量">{{ currentCourse.currentStudents }}/{{ currentCourse.capacity }}</a-descriptions-item>
        <a-descriptions-item label="课程简介">{{ currentCourse.description || '暂无' }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { courseSelectionApi } from '../api/courseSelection';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

export default {
  name: 'MyCourses',
  components: { SearchOutlined, ReloadOutlined },
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      activeTab: 'available',
      availableCourses: [],
      selectedCourses: [],
      filters: {
        semester: '2024-2025学年第二学期',
        courseName: '',
        courseType: ''
      },
      availablePagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条记录`
      },
      selectedPagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条记录`
      },
      detailVisible: false,
      currentCourse: null,
      canDropCourse: true, // 是否允许退课（可根据选课时间控制）
      
      availableColumns: [
        {
          title: '序号',
          key: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '课程名称',
          dataIndex: 'courseName',
          key: 'courseName',
          width: 200
        },
        {
          title: '课程代码',
          dataIndex: 'courseCode',
          key: 'courseCode',
          width: 120
        },
        {
          title: '课程类型',
          dataIndex: 'courseType',
          key: 'courseType',
          width: 100
        },
        {
          title: '学分',
          dataIndex: 'credits',
          key: 'credits',
          width: 80,
          align: 'center'
        },
        {
          title: '任课教师',
          dataIndex: 'teacher',
          key: 'teacher',
          width: 120
        },
        {
          title: '上课时间',
          dataIndex: 'classTime',
          key: 'classTime',
          width: 150
        },
        {
          title: '容量',
          key: 'capacity',
          width: 100,
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          fixed: 'right'
        }
      ],
      
      selectedColumns: [
        {
          title: '序号',
          key: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '课程名称',
          dataIndex: 'courseName',
          key: 'courseName',
          width: 200
        },
        {
          title: '课程代码',
          dataIndex: 'courseCode',
          key: 'courseCode',
          width: 120
        },
        {
          title: '学分',
          dataIndex: 'credits',
          key: 'credits',
          width: 80,
          align: 'center'
        },
        {
          title: '任课教师',
          dataIndex: 'teacher',
          key: 'teacher',
          width: 120
        },
        {
          title: '上课时间',
          dataIndex: 'classTime',
          key: 'classTime',
          width: 150
        },
        {
          title: '上课地点',
          dataIndex: 'location',
          key: 'location',
          width: 120
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          fixed: 'right'
        }
      ]
    };
  },
  computed: {
    selectedCount() {
      return this.selectedCourses.length;
    },
    totalCredits() {
      return this.selectedCourses.reduce((sum, course) => sum + (course.credits || 0), 0);
    }
  },
  mounted() {
    this.loadAvailableCourses();
    this.loadSelectedCourses();
  },
  methods: {
    async loadAvailableCourses() {
      this.loading = true;
      try {
        const params = {
          page: this.availablePagination.current - 1,
          size: this.availablePagination.pageSize,
          semester: this.filters.semester,
          courseName: this.filters.courseName || undefined,
          courseType: this.filters.courseType || undefined,
          studentNo: this.user?.studentNo
        };
        
        const res = await courseSelectionApi.getAvailableCourses(params);
        if (res.data.success) {
          const pageData = res.data.data;
          this.availableCourses = (pageData.content || []).map((item, index) => ({
            ...item,
            index: (this.availablePagination.current - 1) * this.availablePagination.pageSize + index + 1
          }));
          this.availablePagination.total = pageData.totalElements || 0;
        }
      } catch (error) {
        console.error('加载可选课程失败:', error);
        message.error('加载可选课程失败');
      } finally {
        this.loading = false;
      }
    },
    
    async loadSelectedCourses() {
      this.loading = true;
      try {
        const params = {
          page: this.selectedPagination.current - 1,
          size: this.selectedPagination.pageSize,
          studentNo: this.user?.studentNo,
          semester: this.filters.semester
        };
        
        const res = await courseSelectionApi.getSelectedCourses(params);
        if (res.data.success) {
          const pageData = res.data.data;
          this.selectedCourses = (pageData.content || []).map((item, index) => ({
            ...item,
            index: (this.selectedPagination.current - 1) * this.selectedPagination.pageSize + index + 1
          }));
          this.selectedPagination.total = pageData.totalElements || 0;
        }
      } catch (error) {
        console.error('加载已选课程失败:', error);
        message.error('加载已选课程失败');
      } finally {
        this.loading = false;
      }
    },
    
    async handleSelectCourse(course) {
      try {
        const res = await courseSelectionApi.selectCourse({
          studentNo: this.user?.studentNo,
          courseId: course.id,
          semester: this.filters.semester
        });
        
        if (res.data.success) {
          message.success('选课成功');
          this.loadAvailableCourses();
          this.loadSelectedCourses();
        } else {
          message.error(res.data.message || '选课失败');
        }
      } catch (error) {
        console.error('选课失败:', error);
        message.error('选课失败：' + (error.response?.data?.message || error.message));
      }
    },
    
    async handleDropCourse(course) {
      try {
        const res = await courseSelectionApi.dropCourse(course.id);
        if (res.data.success) {
          message.success('退选成功');
          this.loadAvailableCourses();
          this.loadSelectedCourses();
        } else {
          message.error(res.data.message || '退选失败');
        }
      } catch (error) {
        console.error('退选失败:', error);
        message.error('退选失败：' + (error.response?.data?.message || error.message));
      }
    },
    
    viewCourseDetail(course) {
      this.currentCourse = course;
      this.detailVisible = true;
    },
    
    handleSearch() {
      this.availablePagination.current = 1;
      this.loadAvailableCourses();
    },
    
    handleReset() {
      this.filters = {
        semester: '2024-2025学年第二学期',
        courseName: '',
        courseType: ''
      };
      this.availablePagination.current = 1;
      this.loadAvailableCourses();
    },
    
    handleAvailableTableChange(pagination) {
      this.availablePagination.current = pagination.current;
      this.availablePagination.pageSize = pagination.pageSize;
      this.loadAvailableCourses();
    },
    
    handleSelectedTableChange(pagination) {
      this.selectedPagination.current = pagination.current;
      this.selectedPagination.pageSize = pagination.pageSize;
      this.loadSelectedCourses();
    }
  }
};
</script>

<style scoped>
.my-courses {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-form {
  margin-bottom: 16px;
}
</style>
