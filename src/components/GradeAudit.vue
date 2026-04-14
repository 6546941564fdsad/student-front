<!-- src/components/GradeAudit.vue -->
<template>
  <div class="grade-audit">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">成绩审核</h2>
        <p class="page-desc">教务管理员可以审核教师提交的成绩</p>
      </div>

      <!-- 筛选条件 -->
      <a-form layout="inline" class="filter-form">
        <a-form-item label="学期">
          <a-select v-model:value="filters.semester" placeholder="请选择学期" style="width: 180px">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="2024-2025学年第一学期">2024-2025学年第一学期</a-select-option>
            <a-select-option value="2024-2025学年第二学期">2024-2025学年第二学期</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="课程名称">
          <a-input v-model:value="filters.courseName" placeholder="请输入课程名称" style="width: 180px" />
        </a-form-item>
        <a-form-item label="教师姓名">
          <a-input v-model:value="filters.teacherName" placeholder="请输入教师姓名" style="width: 150px" />
        </a-form-item>
        <a-form-item label="审核状态">
          <a-select v-model:value="filters.status" placeholder="请选择状态" style="width: 150px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="pending">待审核</a-select-option>
            <a-select-option value="approved">已通过</a-select-option>
            <a-select-option value="rejected">已驳回</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <a-button type="primary" @click="handleBatchApprove" :disabled="selectedRowKeys.length === 0">
          <template #icon><CheckCircleOutlined /></template>
          批量通过
        </a-button>
        <a-button danger style="margin-left: 8px" @click="handleBatchReject" :disabled="selectedRowKeys.length === 0">
          <template #icon><CloseCircleOutlined /></template>
          批量驳回
        </a-button>
        <a-button style="margin-left: 8px" @click="handleExport">
          <template #icon><DownloadOutlined /></template>
          导出
        </a-button>
      </div>

      <!-- 审核列表表格 -->
      <a-table
        :columns="columns"
        :data-source="auditList"
        :loading="loading"
        :pagination="pagination"
        :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'submitTime'">
            {{ formatDateTime(record.submitTime) }}
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showDetail(record)">详情</a-button>
              <a-button v-if="record.status === 'pending'" type="link" size="small" @click="showApproveModal(record)">
                审核
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 审核模态框 -->
    <a-modal
      v-model:open="approveVisible"
      title="成绩审核"
      width="600px"
      :confirm-loading="submitLoading"
      @ok="handleApprove"
      @cancel="handleCancel"
    >
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="课程名称">
          <span>{{ currentRecord?.courseName }}</span>
        </a-form-item>
        <a-form-item label="教师姓名">
          <span>{{ currentRecord?.teacherName }}</span>
        </a-form-item>
        <a-form-item label="学生人数">
          <span>{{ currentRecord?.studentCount }} 人</span>
        </a-form-item>
        <a-form-item label="平均分">
          <span>{{ currentRecord?.avgGrade }} 分</span>
        </a-form-item>
        <a-form-item label="审核意见" required>
          <a-textarea
            v-model:value="approveOpinion"
            :rows="4"
            placeholder="请输入审核意见（选填）"
          />
        </a-form-item>
        <a-form-item label="审核结果" required>
          <a-radio-group v-model:value="approveResult">
            <a-radio value="approved">通过</a-radio>
            <a-radio value="rejected">驳回</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 详情模态框 -->
    <a-modal
      v-model:open="detailVisible"
      title="成绩详情"
      width="900px"
      :footer="null"
    >
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="课程名称">{{ currentRecord?.courseName }}</a-descriptions-item>
        <a-descriptions-item label="教师姓名">{{ currentRecord?.teacherName }}</a-descriptions-item>
        <a-descriptions-item label="学期">{{ currentRecord?.semester }}</a-descriptions-item>
        <a-descriptions-item label="班级">{{ currentRecord?.className }}</a-descriptions-item>
        <a-descriptions-item label="学生人数">{{ currentRecord?.studentCount }} 人</a-descriptions-item>
        <a-descriptions-item label="平均分">{{ currentRecord?.avgGrade }} 分</a-descriptions-item>
        <a-descriptions-item label="最高分">{{ currentRecord?.maxGrade }} 分</a-descriptions-item>
        <a-descriptions-item label="最低分">{{ currentRecord?.minGrade }} 分</a-descriptions-item>
        <a-descriptions-item label="提交时间" :span="2">{{ formatDateTime(currentRecord?.submitTime) }}</a-descriptions-item>
        <a-descriptions-item label="审核意见" :span="2">{{ currentRecord?.auditOpinion || '-' }}</a-descriptions-item>
      </a-descriptions>

      <a-divider>成绩列表</a-divider>
      <a-table
        :columns="detailColumns"
        :data-source="detailGradeList"
        :pagination="false"
        size="small"
        row-key="id"
      />
    </a-modal>
  </div>
</template>

<script>
import { CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

export default {
  name: 'GradeAudit',
  components: {
    CheckCircleOutlined,
    CloseCircleOutlined,
    DownloadOutlined
  },
  data() {
    return {
      filters: {
        semester: '',
        courseName: '',
        teacherName: '',
        status: ''
      },
      columns: [
        { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
        { title: '课程名称', dataIndex: 'courseName', key: 'courseName', width: 150 },
        { title: '教师姓名', dataIndex: 'teacherName', key: 'teacherName', width: 100 },
        { title: '学期', dataIndex: 'semester', key: 'semester', width: 150 },
        { title: '班级', dataIndex: 'className', key: 'className', width: 120 },
        { title: '学生人数', dataIndex: 'studentCount', key: 'studentCount', width: 100, align: 'center' },
        { title: '平均分', dataIndex: 'avgGrade', key: 'avgGrade', width: 100, align: 'center' },
        { title: '提交时间', key: 'submitTime', width: 160 },
        { title: '审核状态', key: 'status', width: 100, align: 'center' },
        { title: '操作', key: 'action', width: 150, align: 'center', fixed: 'right' }
      ],
      auditList: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
      },
      selectedRowKeys: [],
      approveVisible: false,
      submitLoading: false,
      currentRecord: null,
      approveOpinion: '',
      approveResult: 'approved',
      detailVisible: false,
      detailColumns: [
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo', width: 120 },
        { title: '姓名', dataIndex: 'studentName', key: 'studentName', width: 100 },
        { title: '平时成绩', dataIndex: 'usualGrade', key: 'usualGrade', width: 100 },
        { title: '期末成绩', dataIndex: 'finalGrade', key: 'finalGrade', width: 100 },
        { title: '总评成绩', dataIndex: 'grade', key: 'grade', width: 100 }
      ],
      detailGradeList: []
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
        this.auditList = [
          {
            id: 1,
            index: 1,
            courseName: 'Java程序设计',
            teacherName: '张老师',
            semester: '2024-2025学年第一学期',
            className: '计科2401班',
            studentCount: 45,
            avgGrade: 82.5,
            maxGrade: 95,
            minGrade: 60,
            submitTime: '2025-01-15 10:30:00',
            status: 'pending',
            auditOpinion: ''
          },
          {
            id: 2,
            index: 2,
            courseName: '数据结构',
            teacherName: '李老师',
            semester: '2024-2025学年第一学期',
            className: '计科2402班',
            studentCount: 42,
            avgGrade: 78.3,
            maxGrade: 92,
            minGrade: 55,
            submitTime: '2025-01-14 16:20:00',
            status: 'approved',
            auditOpinion: '成绩分布合理，予以通过'
          }
        ];
        this.pagination.total = this.auditList.length;
        this.loading = false;
      }, 500);
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadData();
    },
    handleReset() {
      this.filters = { semester: '', courseName: '', teacherName: '', status: '' };
      this.selectedRowKeys = [];
      this.pagination.current = 1;
      this.loadData();
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadData();
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    showDetail(record) {
      this.currentRecord = record;
      // TODO: 加载详细成绩列表
      this.detailGradeList = [
        { id: 1, studentNo: '2024001', studentName: '张三', usualGrade: 85, finalGrade: 90, grade: 88.5 },
        { id: 2, studentNo: '2024002', studentName: '李四', usualGrade: 78, finalGrade: 82, grade: 80.5 }
      ];
      this.detailVisible = true;
    },
    showApproveModal(record) {
      this.currentRecord = record;
      this.approveOpinion = '';
      this.approveResult = 'approved';
      this.approveVisible = true;
    },
    async handleApprove() {
      if (!this.approveResult) {
        this.$message.warning('请选择审核结果');
        return;
      }
      this.submitLoading = true;
      // TODO: 调用后端 API 提交审核
      setTimeout(() => {
        const resultText = this.approveResult === 'approved' ? '通过' : '驳回';
        this.$message.success(`审核${resultText}成功！`);
        this.approveVisible = false;
        this.submitLoading = false;
        this.loadData();
      }, 1000);
    },
    handleCancel() {
      this.approveVisible = false;
    },
    async handleBatchApprove() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要审核的记录');
        return;
      }
      // TODO: 调用后端 API 批量通过
      this.$message.success(`批量通过 ${this.selectedRowKeys.length} 条记录`);
      this.selectedRowKeys = [];
      this.loadData();
    },
    async handleBatchReject() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要驳回的记录');
        return;
      }
      // TODO: 调用后端 API 批量驳回
      this.$message.success(`批量驳回 ${this.selectedRowKeys.length} 条记录`);
      this.selectedRowKeys = [];
      this.loadData();
    },
    handleExport() {
      this.$message.info('导出功能开发中...');
    },
    getStatusText(status) {
      const map = {
        'pending': '待审核',
        'approved': '已通过',
        'rejected': '已驳回'
      };
      return map[status] || status;
    },
    getStatusColor(status) {
      const map = {
        'pending': 'orange',
        'approved': 'green',
        'rejected': 'red'
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
}
</style>
