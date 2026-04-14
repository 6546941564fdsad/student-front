<!-- src/components/GradeExport.vue -->
<template>
  <div class="grade-export">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">成绩导出</h2>
        <p class="page-desc">支持多种格式导出学生成绩数据</p>
      </div>

      <!-- 筛选条件 -->
      <a-form layout="inline" class="filter-form">
        <a-form-item label="学期">
          <a-select v-model:value="filters.semester" placeholder="请选择学期" style="width: 180px">
            <a-select-option value="">全部学期</a-select-option>
            <a-select-option value="2024-2025学年第一学期">2024-2025学年第一学期</a-select-option>
            <a-select-option value="2024-2025学年第二学期">2024-2025学年第二学期</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="课程">
          <a-select v-model:value="filters.courseId" placeholder="请选择课程" style="width: 200px">
            <a-select-option value="">全部课程</a-select-option>
            <a-select-option value="1">Java程序设计</a-select-option>
            <a-select-option value="2">数据结构</a-select-option>
            <a-select-option value="3">数据库原理</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="班级">
          <a-select v-model:value="filters.classId" placeholder="请选择班级" style="width: 150px">
            <a-select-option value="">全部班级</a-select-option>
            <a-select-option value="1">计科2401班</a-select-option>
            <a-select-option value="2">计科2402班</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="审核状态">
          <a-select v-model:value="filters.status" placeholder="请选择状态" style="width: 150px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="audited">已审核</a-select-option>
            <a-select-option value="pending">待审核</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 导出设置 -->
      <a-card title="导出设置" style="margin-bottom: 16px">
        <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-item label="导出格式">
            <a-radio-group v-model:value="exportFormat">
              <a-radio value="excel">Excel (.xlsx)</a-radio>
              <a-radio value="csv">CSV (.csv)</a-radio>
              <a-radio value="pdf">PDF (.pdf)</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="包含字段">
            <a-checkbox-group v-model:value="selectedFields">
              <a-checkbox value="studentNo">学号</a-checkbox>
              <a-checkbox value="studentName">姓名</a-checkbox>
              <a-checkbox value="className">班级</a-checkbox>
              <a-checkbox value="courseName">课程名称</a-checkbox>
              <a-checkbox value="usualGrade">平时成绩</a-checkbox>
              <a-checkbox value="finalGrade">期末成绩</a-checkbox>
              <a-checkbox value="grade">总评成绩</a-checkbox>
              <a-checkbox value="rank">排名</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item label="文件名">
            <a-input v-model:value="fileName" placeholder="请输入文件名（不含扩展名）" style="width: 300px" />
          </a-form-item>
        </a-form>
      </a-card>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <a-button type="primary" size="large" @click="handleExport" :loading="exporting">
          <template #icon><DownloadOutlined /></template>
          开始导出
        </a-button>
        <a-button size="large" style="margin-left: 8px" @click="handlePreview">
          <template #icon><EyeOutlined /></template>
          预览数据
        </a-button>
      </div>

      <!-- 数据预览表格 -->
      <a-table
        :columns="columns"
        :data-source="exportList"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 导出历史 -->
    <a-card title="导出历史" style="margin-top: 16px">
      <a-timeline>
        <a-timeline-item v-for="item in exportHistory" :key="item.id" color="green">
          <template #dot>
            <FileExcelOutlined style="font-size: 16px; color: #52c41a" />
          </template>
          <p style="margin: 0">
            <strong>{{ item.fileName }}</strong> - {{ item.format.toUpperCase() }}
          </p>
          <p style="margin: 4px 0 0 0; color: #8c8c8c; font-size: 12px">
            {{ formatDateTime(item.exportTime) }} | {{ item.recordCount }} 条记录
          </p>
        </a-timeline-item>
      </a-timeline>
    </a-card>
  </div>
</template>

<script>
import { DownloadOutlined, EyeOutlined, FileExcelOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

export default {
  name: 'GradeExport',
  components: {
    DownloadOutlined,
    EyeOutlined,
    FileExcelOutlined
  },
  data() {
    return {
      filters: {
        semester: '',
        courseId: undefined,
        classId: undefined,
        status: ''
      },
      exportFormat: 'excel',
      selectedFields: ['studentNo', 'studentName', 'className', 'courseName', 'usualGrade', 'finalGrade', 'grade'],
      fileName: '',
      columns: [
        { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo', width: 120 },
        { title: '姓名', dataIndex: 'studentName', key: 'studentName', width: 100 },
        { title: '班级', dataIndex: 'className', key: 'className', width: 120 },
        { title: '课程名称', dataIndex: 'courseName', key: 'courseName', width: 150 },
        { title: '平时成绩', dataIndex: 'usualGrade', key: 'usualGrade', width: 100 },
        { title: '期末成绩', dataIndex: 'finalGrade', key: 'finalGrade', width: 100 },
        { title: '总评成绩', dataIndex: 'grade', key: 'grade', width: 100 },
        { title: '排名', dataIndex: 'rank', key: 'rank', width: 80, align: 'center' },
        { title: '审核状态', key: 'status', width: 100, align: 'center' }
      ],
      exportList: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
      },
      exporting: false,
      exportHistory: [
        {
          id: 1,
          fileName: '2024-2025学年第一学期_计科2401班_成绩',
          format: 'excel',
          exportTime: '2025-01-15 14:30:00',
          recordCount: 45
        },
        {
          id: 2,
          fileName: '2024-2025学年第一学期_全部课程_成绩',
          format: 'csv',
          exportTime: '2025-01-14 10:20:00',
          recordCount: 120
        }
      ]
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      // TODO: 调用后端 API
      setTimeout(() => {
        this.exportList = [
          {
            id: 1,
            index: 1,
            studentNo: '2024001',
            studentName: '张三',
            className: '计科2401班',
            courseName: 'Java程序设计',
            usualGrade: 85,
            finalGrade: 90,
            grade: 88.5,
            rank: 1,
            status: 'audited'
          },
          {
            id: 2,
            index: 2,
            studentNo: '2024002',
            studentName: '李四',
            className: '计科2401班',
            courseName: 'Java程序设计',
            usualGrade: 78,
            finalGrade: 82,
            grade: 80.5,
            rank: 15,
            status: 'audited'
          }
        ];
        this.pagination.total = this.exportList.length;
        this.loading = false;
      }, 500);
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadData();
    },
    handleReset() {
      this.filters = { semester: '', courseId: undefined, classId: undefined, status: '' };
      this.selectedFields = ['studentNo', 'studentName', 'className', 'courseName', 'usualGrade', 'finalGrade', 'grade'];
      this.fileName = '';
      this.pagination.current = 1;
      this.loadData();
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadData();
    },
    async handleExport() {
      if (this.selectedFields.length === 0) {
        this.$message.warning('请至少选择一个导出字段');
        return;
      }

      this.exporting = true;
      
      // 生成默认文件名
      const defaultFileName = this.fileName || `成绩导出_${dayjs().format('YYYYMMDD_HHmmss')}`;
      
      // TODO: 调用后端 API 导出文件
      setTimeout(() => {
        this.$message.success(`导出成功！文件：${defaultFileName}.${this.exportFormat}`);
        this.exporting = false;
        
        // 添加到导出历史
        this.exportHistory.unshift({
          id: Date.now(),
          fileName: defaultFileName,
          format: this.exportFormat,
          exportTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          recordCount: this.exportList.length
        });
      }, 2000);
    },
    handlePreview() {
      this.$message.info('预览功能 - 显示前100条数据');
    },
    getStatusText(status) {
      const map = {
        'audited': '已审核',
        'pending': '待审核'
      };
      return map[status] || status;
    },
    getStatusColor(status) {
      const map = {
        'audited': 'green',
        'pending': 'orange'
      };
      return map[status] || 'default';
    },
    formatDateTime(dateTime) {
      if (!dateTime) return '-';
      return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
    }
  }
};
</script>

<style scoped>
.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.page-desc {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

.filter-form {
  margin-bottom: 16px;
}

.action-bar {
  margin-bottom: 16px;
  text-align: center;
}
</style>
