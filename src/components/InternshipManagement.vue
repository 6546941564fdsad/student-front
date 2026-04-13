<template>
  <div class="internship-management">
    <a-card>
      <!-- 统计卡片 -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title><ClockCircleOutlined style="color: #faad14" /><span style="margin-left: 8px">待审批</span></template>
            <p style="font-size: 32px; font-weight: bold; color: #faad14; margin: 0">{{ statistics.pendingCount || 0 }}</p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title><CheckCircleOutlined style="color: #52c41a" /><span style="margin-left: 8px">已批准</span></template>
            <p style="font-size: 32px; font-weight: bold; color: #52c41a; margin: 0">{{ statistics.approvedCount || 0 }}</p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title><PlayCircleOutlined style="color: #1890ff" /><span style="margin-left: 8px">进行中</span></template>
            <p style="font-size: 32px; font-weight: bold; color: #1890ff; margin: 0">{{ statistics.inProgressCount || 0 }}</p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title><TrophyOutlined style="color: #722ed1" /><span style="margin-left: 8px">已完成</span></template>
            <p style="font-size: 32px; font-weight: bold; color: #722ed1; margin: 0">{{ statistics.completedCount || 0 }}</p>
          </a-card>
        </a-col>
      </a-row>

      <!-- 筛选和操作 -->
      <a-row :gutter="16" style="margin-bottom: 16px">
        <a-col :span="6">
          <a-select v-model:value="filterStatus" placeholder="实习状态" allow-clear style="width: 100%" @change="handleFilter">
            <a-select-option value="PENDING">待审批</a-select-option>
            <a-select-option value="APPROVED">已批准</a-select-option>
            <a-select-option value="IN_PROGRESS">进行中</a-select-option>
            <a-select-option value="COMPLETED">已完成</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="18" style="text-align: right">
          <a-button type="primary" @click="handleFilter"><SearchOutlined /> 查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset"><ReloadOutlined /> 重置</a-button>
          <a-button type="primary" style="margin-left: 8px" @click="showAddModal"><PlusOutlined /> 提交申请</a-button>
        </a-col>
      </a-row>

      <!-- 列表表格 -->
      <a-table :columns="columns" :data-source="internshipList" :loading="loading" :pagination="pagination" row-key="id" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag>
          </template>
          <template v-if="column.key === 'grade'">
            <span v-if="record.grade">{{ record.grade }} 分</span>
            <span v-else>-</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showDetail(record)">详情</a-button>
              <a-button v-if="record.status === 'PENDING'" type="link" size="small" @click="showApproveModal(record)">审批</a-button>
              <a-button v-if="record.status === 'APPROVED' || record.status === 'IN_PROGRESS'" type="link" size="small" @click="showReportModal(record)">提交报告</a-button>
              <a-button v-if="record.status === 'IN_PROGRESS'" type="link" size="small" @click="showGradeModal(record)">评定成绩</a-button>
              <a-popconfirm title="确定删除？" @confirm="handleDelete(record.id)">
                <a-button type="link" danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 添加申请模态框 -->
    <a-modal v-model:open="modalVisible" title="提交实习申请" width="700px" :confirm-loading="submitLoading" @ok="handleSubmit" @cancel="handleCancel">
      <a-form ref="formRef" :model="form" :rules="formRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="学生ID" name="studentId"><a-input-number v-model:value="form.studentId" :min="1" style="width: 100%" /></a-form-item>
        <a-form-item label="学生姓名" name="studentName"><a-input v-model:value="form.studentName" /></a-form-item>
        <a-form-item label="学号" name="studentNo"><a-input v-model:value="form.studentNo" /></a-form-item>
        <a-form-item label="实习单位" name="company"><a-input v-model:value="form.company" /></a-form-item>
        <a-form-item label="实习岗位" name="position"><a-input v-model:value="form.position" /></a-form-item>
        <a-form-item label="实习导师" name="mentor"><a-input v-model:value="form.mentor" /></a-form-item>
        <a-form-item label="导师电话" name="mentorPhone"><a-input v-model:value="form.mentorPhone" /></a-form-item>
        <a-form-item label="开始日期" name="startDate"><a-date-picker v-model:value="form.startDate" style="width: 100%" /></a-form-item>
        <a-form-item label="结束日期" name="endDate"><a-date-picker v-model:value="form.endDate" style="width: 100%" /></a-form-item>
      </a-form>
    </a-modal>

    <!-- 审批模态框 -->
    <a-modal v-model:open="approveVisible" title="审批实习申请" @ok="handleApprove">
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="审批意见"><a-textarea v-model:value="approveOpinion" :rows="4" /></a-form-item>
        <a-form-item label="审批结果">
          <a-radio-group v-model:value="approveStatus">
            <a-radio value="APPROVED">批准</a-radio>
            <a-radio value="REJECTED">拒绝</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 提交报告模态框 -->
    <a-modal v-model:open="reportVisible" title="提交实习报告" @ok="handleSubmitReport">
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="报告标题"><a-input v-model:value="reportTitle" /></a-form-item>
      </a-form>
    </a-modal>

    <!-- 评定成绩模态框 -->
    <a-modal v-model:open="gradeVisible" title="评定实习成绩" @ok="handleUpdateGrade">
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="实习成绩"><a-input-number v-model:value="gradeScore" :min="0" :max="100" style="width: 100%" /></a-form-item>
        <a-form-item label="教师评语"><a-textarea v-model:value="teacherComment" :rows="3" /></a-form-item>
        <a-form-item label="企业评语"><a-textarea v-model:value="companyComment" :rows="3" /></a-form-item>
      </a-form>
    </a-modal>

    <!-- 详情模态框 -->
    <a-modal v-model:open="detailVisible" title="实习详情" width="700px" :footer="null">
      <a-descriptions bordered :column="2" v-if="currentInternship">
        <a-descriptions-item label="学生姓名">{{ currentInternship.studentName }}</a-descriptions-item>
        <a-descriptions-item label="学号">{{ currentInternship.studentNo }}</a-descriptions-item>
        <a-descriptions-item label="实习单位" :span="2">{{ currentInternship.company }}</a-descriptions-item>
        <a-descriptions-item label="实习岗位">{{ currentInternship.position }}</a-descriptions-item>
        <a-descriptions-item label="实习导师">{{ currentInternship.mentor || '-' }}</a-descriptions-item>
        <a-descriptions-item label="开始日期">{{ currentInternship.startDate }}</a-descriptions-item>
        <a-descriptions-item label="结束日期">{{ currentInternship.endDate }}</a-descriptions-item>
        <a-descriptions-item label="状态"><a-tag :color="getStatusColor(currentInternship.status)">{{ getStatusText(currentInternship.status) }}</a-tag></a-descriptions-item>
        <a-descriptions-item label="成绩" v-if="currentInternship.grade">{{ currentInternship.grade }} 分</a-descriptions-item>
        <a-descriptions-item label="教师评语" :span="2" v-if="currentInternship.teacherComment">{{ currentInternship.teacherComment }}</a-descriptions-item>
        <a-descriptions-item label="企业评语" :span="2" v-if="currentInternship.companyComment">{{ currentInternship.companyComment }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { internshipApi } from '../api/internship';
import { ClockCircleOutlined, CheckCircleOutlined, PlayCircleOutlined, TrophyOutlined, SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

export default {
  name: 'InternshipManagement',
  components: { ClockCircleOutlined, CheckCircleOutlined, PlayCircleOutlined, TrophyOutlined, SearchOutlined, ReloadOutlined, PlusOutlined },
  props: { user: { type: Object, default: () => ({}) } },
  data() {
    return {
      loading: false, submitLoading: false,
      internshipList: [], statistics: {},
      modalVisible: false, approveVisible: false, reportVisible: false, gradeVisible: false, detailVisible: false,
      currentInternship: null, formRef: null, filterStatus: undefined,
      pagination: { current: 1, pageSize: 10, total: 0, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` },
      form: { studentId: undefined, studentName: '', studentNo: '', company: '', position: '', mentor: '', mentorPhone: '', startDate: null, endDate: null, status: 'PENDING' },
      formRules: {
        studentId: [{ required: true, message: '请输入学生ID', trigger: 'blur' }],
        studentName: [{ required: true, message: '请输入学生姓名', trigger: 'blur' }],
        studentNo: [{ required: true, message: '请输入学号', trigger: 'blur' }, { pattern: /^\d{8,12}$/, message: '学号格式不正确', trigger: 'blur' }],
        company: [{ required: true, message: '请输入实习单位', trigger: 'blur' }],
        position: [{ required: true, message: '请输入实习岗位', trigger: 'blur' }],
        startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
        endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }]
      },
      approveOpinion: '', approveStatus: 'APPROVED', approveId: null,
      reportTitle: '', reportId: null,
      gradeScore: 0, teacherComment: '', companyComment: '', gradeId: null,
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '学生姓名', dataIndex: 'studentName', key: 'studentName', width: 100 },
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo', width: 120 },
        { title: '实习单位', dataIndex: 'company', key: 'company', width: 150 },
        { title: '实习岗位', dataIndex: 'position', key: 'position', width: 120 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '成绩', dataIndex: 'grade', key: 'grade', width: 80 },
        { title: '操作', key: 'action', fixed: 'right', width: 280 }
      ]
    };
  },
  mounted() { this.loadData(); this.loadStatistics(); },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const params = { page: this.pagination.current - 1, size: this.pagination.pageSize };
        const response = this.filterStatus ? await internshipApi.getByStatus(this.filterStatus, params.page, params.size) : await internshipApi.getAll(params.page, params.size);
        this.internshipList = response.data.content;
        this.pagination.total = response.data.totalElements;
      } catch (error) { this.$message.error('加载数据失败'); }
      finally { this.loading = false; }
    },
    async loadStatistics() {
      try { const response = await internshipApi.getStatistics(); this.statistics = response.data; }
      catch (error) { console.error('加载统计数据失败:', error); }
    },
    handleFilter() { this.pagination.current = 1; this.loadData(); },
    handleReset() { this.filterStatus = undefined; this.pagination.current = 1; this.loadData(); },
    handleTableChange(pagination) { this.pagination.current = pagination.current; this.pagination.pageSize = pagination.pageSize; this.loadData(); },
    showAddModal() { this.modalVisible = true; this.resetForm(); },
    showDetail(record) { this.currentInternship = record; this.detailVisible = true; },
    showApproveModal(record) { this.approveId = record.id; this.approveVisible = true; this.approveOpinion = ''; this.approveStatus = 'APPROVED'; },
    showReportModal(record) { this.reportId = record.id; this.reportVisible = true; this.reportTitle = ''; },
    showGradeModal(record) { this.gradeId = record.id; this.gradeVisible = true; this.gradeScore = 0; this.teacherComment = ''; this.companyComment = ''; },
    resetForm() {
      this.form = { studentId: undefined, studentName: '', studentNo: '', company: '', position: '', mentor: '', mentorPhone: '', startDate: null, endDate: null, status: 'PENDING' };
      if (this.$refs.formRef) this.$refs.formRef.clearValidate();
    },
    async handleSubmit() {
      try { await this.$refs.formRef.validate(); }
      catch (error) { this.$message.warning('请检查表单'); return; }
      this.submitLoading = true;
      try {
        const formData = { ...this.form, startDate: this.form.startDate ? dayjs(this.form.startDate).format('YYYY-MM-DD') : null, endDate: this.form.endDate ? dayjs(this.form.endDate).format('YYYY-MM-DD') : null };
        await internshipApi.add(formData);
        this.$message.success('申请提交成功！');
        this.modalVisible = false;
        this.loadData(); this.loadStatistics();
      } catch (error) { this.$message.error(error.response?.data?.message || '提交失败'); }
      finally { this.submitLoading = false; }
    },
    handleCancel() { this.modalVisible = false; this.resetForm(); },
    async handleApprove() {
      try {
        await internshipApi.approve(this.approveId, { approvalOpinion: this.approveOpinion, status: this.approveStatus });
        this.$message.success('审批成功！');
        this.approveVisible = false;
        this.loadData(); this.loadStatistics();
      } catch (error) { this.$message.error('审批失败'); }
    },
    async handleSubmitReport() {
      try {
        await internshipApi.submitReport(this.reportId, this.reportTitle);
        this.$message.success('报告提交成功！');
        this.reportVisible = false;
        this.loadData();
      } catch (error) { this.$message.error('提交失败'); }
    },
    async handleUpdateGrade() {
      try {
        await internshipApi.updateGrade(this.gradeId, { grade: this.gradeScore, teacherComment: this.teacherComment, companyComment: this.companyComment });
        this.$message.success('成绩评定成功！');
        this.gradeVisible = false;
        this.loadData(); this.loadStatistics();
      } catch (error) { this.$message.error('评定失败'); }
    },
    async handleDelete(id) {
      try {
        await internshipApi.delete(id);
        this.$message.success('删除成功');
        this.loadData(); this.loadStatistics();
      } catch (error) { this.$message.error('删除失败'); }
    },
    getStatusText(status) {
      const map = { 'PENDING': '待审批', 'APPROVED': '已批准', 'IN_PROGRESS': '进行中', 'COMPLETED': '已完成', 'REJECTED': '已拒绝' };
      return map[status] || status;
    },
    getStatusColor(status) {
      const map = { 'PENDING': 'orange', 'APPROVED': 'green', 'IN_PROGRESS': 'blue', 'COMPLETED': 'purple', 'REJECTED': 'red' };
      return map[status] || 'default';
    }
  }
};
</script>

<style scoped>.internship-management { padding: 0; }</style>
