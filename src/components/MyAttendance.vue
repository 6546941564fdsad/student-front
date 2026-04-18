<!-- src/components/MyAttendance.vue - 学生个人考勤记录 -->
<template>
  <div class="my-attendance">
    <a-card :bordered="false" :loading="loading">
      <template #title>
        <div class="card-header">
          <span>我的考勤</span>
          <a-space>
            <a-tag color="green">出勤率: {{ attendanceRate }}%</a-tag>
            <a-tag color="blue">总课时: {{ totalClasses }} 节</a-tag>
          </a-space>
        </div>
      </template>

      <!-- 筛选条件 -->
      <a-form layout="inline" class="filter-form">
        <a-form-item label="学期">
          <a-select v-model:value="filters.semester" placeholder="请选择学期" style="width: 200px" allow-clear>
            <a-select-option value="">全部学期</a-select-option>
            <a-select-option value="2024-2025学年第一学期">2024-2025学年第一学期</a-select-option>
            <a-select-option value="2024-2025学年第二学期">2024-2025学年第二学期</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="课程名称">
          <a-input v-model:value="filters.courseName" placeholder="请输入课程名称" style="width: 200px" allow-clear />
        </a-form-item>
        <a-form-item label="考勤状态">
          <a-select v-model:value="filters.status" placeholder="请选择状态" style="width: 150px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="出勤">出勤</a-select-option>
            <a-select-option value="迟到">迟到</a-select-option>
            <a-select-option value="缺勤">缺勤</a-select-option>
            <a-select-option value="请假">请假</a-select-option>
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

      <!-- 考勤表格 -->
      <a-table
        :columns="columns"
        :data-source="attendanceRecords"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'index'">
            {{ record.index }}
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-if="column.key === 'date'">
            {{ formatDate(record.date) }}
          </template>
        </template>
      </a-table>

      <!-- 考勤统计 -->
      <a-row :gutter="16" style="margin-top: 16px;">
        <a-col :span="6">
          <a-card size="small" class="stat-card">
            <a-statistic title="出勤次数" :value="statistics.present" suffix="次">
              <template #prefix><CheckCircleOutlined style="color: #52c41a" /></template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card size="small" class="stat-card">
            <a-statistic title="迟到次数" :value="statistics.late" suffix="次">
              <template #prefix><ClockCircleOutlined style="color: #faad14" /></template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card size="small" class="stat-card">
            <a-statistic title="缺勤次数" :value="statistics.absent" suffix="次">
              <template #prefix><CloseCircleOutlined style="color: #ff4d4f" /></template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card size="small" class="stat-card">
            <a-statistic title="请假次数" :value="statistics.leave" suffix="次">
              <template #prefix><FileTextOutlined style="color: #1890ff" /></template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { attendanceApi } from '../api/attendance';
import { SearchOutlined, ReloadOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, FileTextOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

export default {
  name: 'MyAttendance',
  components: { 
    SearchOutlined, 
    ReloadOutlined, 
    CheckCircleOutlined, 
    ClockCircleOutlined, 
    CloseCircleOutlined, 
    FileTextOutlined 
  },
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      attendanceRecords: [],
      filters: {
        semester: '',
        courseName: '',
        status: ''
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条记录`
      },
      statistics: {
        present: 0,
        late: 0,
        absent: 0,
        leave: 0
      },
      columns: [
        {
          title: '序号',
          key: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: '日期',
          key: 'date',
          width: 120,
          align: 'center'
        },
        {
          title: '学期',
          dataIndex: 'semester',
          key: 'semester',
          width: 180
        },
        {
          title: '课程名称',
          dataIndex: 'courseName',
          key: 'courseName',
          width: 200
        },
        {
          title: '上课时间',
          dataIndex: 'classTime',
          key: 'classTime',
          width: 150
        },
        {
          title: '任课教师',
          dataIndex: 'teacher',
          key: 'teacher',
          width: 120
        },
        {
          title: '考勤状态',
          key: 'status',
          width: 100,
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          ellipsis: true
        }
      ]
    };
  },
  computed: {
    // 计算出勤率
    attendanceRate() {
      if (this.totalClasses === 0) return 0;
      const rate = (this.statistics.present / this.totalClasses) * 100;
      return rate.toFixed(1);
    },
    // 计算总课时
    totalClasses() {
      return this.statistics.present + this.statistics.late + this.statistics.absent + this.statistics.leave;
    }
  },
  mounted() {
    this.loadAttendance();
  },
  methods: {
    async loadAttendance() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current - 1,
          size: this.pagination.pageSize,
          studentNo: this.user?.studentNo, // 只查询当前学生的考勤
          semester: this.filters.semester || undefined,
          courseName: this.filters.courseName || undefined,
          status: this.filters.status || undefined
        };
        
        const res = await attendanceApi.getAll(params.page, params.size, params);
        if (res.data.success) {
          const pageData = res.data.data;
          this.attendanceRecords = (pageData.content || []).map((item, index) => ({
            ...item,
            index: (this.pagination.current - 1) * this.pagination.pageSize + index + 1
          }));
          this.pagination.total = pageData.totalElements || 0;
          
          // 计算统计数据
          this.calculateStatistics();
        }
      } catch (error) {
        console.error('加载考勤数据失败:', error);
        this.$message.error('加载考勤数据失败');
      } finally {
        this.loading = false;
      }
    },
    
    calculateStatistics() {
      const stats = {
        present: 0,
        late: 0,
        absent: 0,
        leave: 0
      };
      
      this.attendanceRecords.forEach(record => {
        switch (record.status) {
          case '出勤':
            stats.present++;
            break;
          case '迟到':
            stats.late++;
            break;
          case '缺勤':
            stats.absent++;
            break;
          case '请假':
            stats.leave++;
            break;
        }
      });
      
      this.statistics = stats;
    },
    
    handleSearch() {
      this.pagination.current = 1;
      this.loadAttendance();
    },
    
    handleReset() {
      this.filters = {
        semester: '',
        courseName: '',
        status: ''
      };
      this.pagination.current = 1;
      this.loadAttendance();
    },
    
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadAttendance();
    },
    
    formatDate(date) {
      if (!date) return '-';
      return dayjs(date).format('YYYY-MM-DD');
    },
    
    getStatusColor(status) {
      const colorMap = {
        '出勤': 'green',
        '迟到': 'orange',
        '缺勤': 'red',
        '请假': 'blue'
      };
      return colorMap[status] || 'default';
    }
  }
};
</script>

<style scoped>
.my-attendance {
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

.stat-card {
  text-align: center;
}

.stat-card :deep(.ant-statistic-title) {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}

.stat-card :deep(.ant-statistic-content) {
  font-size: 20px;
  font-weight: 600;
}
</style>
