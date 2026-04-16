<!-- src/components/CreditRecognition.vue -->
<template>
  <div class="credit-recognition">
    <a-card :bordered="false">
      <div class="page-header">
        <h2 class="page-title">学分认定</h2>
        <p class="page-desc">根据竞赛获奖、项目成果等认定创新学分</p>
      </div>

      <!-- 统计卡片 -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="6"><a-card :bordered="false"><template #title><FileTextOutlined style="color: #1890ff" /><span style="margin-left: 8px">申请总数</span></template><p style="font-size: 32px; font-weight: bold; color: #1890ff; margin: 0">{{ statistics.totalCount || 0 }}</p></a-card></a-col>
        <a-col :span="6"><a-card :bordered="false"><template #title><ClockCircleOutlined style="color: #faad14" /><span style="margin-left: 8px">待审核</span></template><p style="font-size: 32px; font-weight: bold; color: #faad14; margin: 0">{{ statistics.pendingCount || 0 }}</p></a-card></a-col>
        <a-col :span="6"><a-card :bordered="false"><template #title><CheckCircleOutlined style="color: #52c41a" /><span style="margin-left: 8px">已通过</span></template><p style="font-size: 32px; font-weight: bold; color: #52c41a; margin: 0">{{ statistics.approvedCount || 0 }}</p></a-card></a-col>
        <a-col :span="6"><a-card :bordered="false"><template #title><DollarCircleOutlined style="color: #722ed1" /><span style="margin-left: 8px">认定总学分</span></template><p style="font-size: 32px; font-weight: bold; color: #722ed1; margin: 0">{{ statistics.totalCredits || 0 }}</p></a-card></a-col>
      </a-row>

      <!-- 筛选和操作 -->
      <a-form layout="inline" class="filter-form">
        <a-form-item label="学生姓名"><a-input v-model:value="filters.studentName" placeholder="请输入学生姓名" style="width: 150px" /></a-form-item>
        <a-form-item label="认定类型"><a-select v-model:value="filters.type" placeholder="请选择类型" style="width: 150px" allow-clear><a-select-option value="">全部</a-select-option><a-select-option value="竞赛获奖">竞赛获奖</a-select-option><a-select-option value="项目成果">项目成果</a-select-option><a-select-option value="论文发表">论文发表</a-select-option></a-select></a-form-item>
        <a-form-item label="审核状态"><a-select v-model:value="filters.status" placeholder="请选择状态" style="width: 150px" allow-clear><a-select-option value="">全部</a-select-option><a-select-option value="pending">待审核</a-select-option><a-select-option value="approved">已通过</a-select-option><a-select-option value="rejected">已驳回</a-select-option></a-select></a-form-item>
        <a-form-item><a-button type="primary" @click="handleSearch">查询</a-button><a-button style="margin-left: 8px" @click="handleReset">重置</a-button></a-form-item>
      </a-form>

      <div class="action-bar">
        <a-button type="primary" @click="showAddModal"><PlusOutlined /> 新增申请</a-button>
        <a-button style="margin-left: 8px" @click="handleExport"><DownloadOutlined /> 导出</a-button>
      </div>

      <!-- 列表表格 -->
      <a-table :columns="columns" :data-source="recognitionList" :loading="loading" :pagination="pagination" row-key="id" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'"><a-tag color="blue">{{ record.type }}</a-tag></template>
          <template v-if="column.key === 'credits'"><a-tag color="green">{{ record.credits }} 学分</a-tag></template>
          <template v-if="column.key === 'status'"><a-tag :color="getStatusColor(record.status)">{{ getStatusText(record.status) }}</a-tag></template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showDetail(record)">详情</a-button>
              <a-button v-if="record.status === 'pending'" type="link" size="small" @click="showApproveModal(record)">审核</a-button>
              <a-popconfirm title="确定删除？" @confirm="handleDelete(record.id)"><a-button type="link" danger size="small">删除</a-button></a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 添加模态框 -->
    <a-modal v-model:open="modalVisible" title="新增学分认定申请" width="700px" :confirm-loading="submitLoading" @ok="handleSubmit" @cancel="handleCancel">
      <a-form ref="formRef" :model="form" :rules="formRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="学生" name="studentId"><a-select v-model:value="form.studentId" placeholder="请选择学生"><a-select-option v-for="s in studentOptions" :key="s.id" :value="s.id">{{ s.name }} ({{ s.studentNo }})</a-select-option></a-select></a-form-item>
        <a-form-item label="认定类型" name="type"><a-select v-model:value="form.type" placeholder="请选择类型"><a-select-option value="竞赛获奖">竞赛获奖</a-select-option><a-select-option value="项目成果">项目成果</a-select-option><a-select-option value="论文发表">论文发表</a-select-option></a-select></a-form-item>
        <a-form-item label="成果名称" name="achievementName"><a-input v-model:value="form.achievementName" placeholder="请输入成果名称" /></a-form-item>
        <a-form-item label="认定学分" name="credits"><a-input-number v-model:value="form.credits" :min="0.5" :max="10" :step="0.5" style="width: 100%" placeholder="请输入学分" /></a-form-item>
        <a-form-item label="证明材料" name="certificate"><a-upload action="/api/upload" list-type="text"><a-button><UploadOutlined /> 上传文件</a-button></a-upload></a-form-item>
        <a-form-item label="申请说明" name="description"><a-textarea v-model:value="form.description" :rows="4" placeholder="请输入申请说明" /></a-form-item>
      </a-form>
    </a-modal>

    <!-- 审核模态框 -->
    <a-modal v-model:open="approveVisible" title="学分认定审核" @ok="handleApprove">
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="学生姓名"><span>{{ currentRecord?.studentName }}</span></a-form-item>
        <a-form-item label="认定类型"><span>{{ currentRecord?.type }}</span></a-form-item>
        <a-form-item label="认定学分"><span>{{ currentRecord?.credits }} 学分</span></a-form-item>
        <a-form-item label="审核意见"><a-textarea v-model:value="approveOpinion" :rows="4" placeholder="请输入审核意见" /></a-form-item>
        <a-form-item label="审核结果"><a-radio-group v-model:value="approveResult"><a-radio value="approved">通过</a-radio><a-radio value="rejected">驳回</a-radio></a-radio-group></a-form-item>
      </a-form>
    </a-modal>

    <!-- 详情模态框 -->
    <a-modal v-model:open="detailVisible" title="认定详情" width="700px" :footer="null">
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="学生姓名">{{ currentRecord?.studentName }}</a-descriptions-item>
        <a-descriptions-item label="学号">{{ currentRecord?.studentNo }}</a-descriptions-item>
        <a-descriptions-item label="认定类型">{{ currentRecord?.type }}</a-descriptions-item>
        <a-descriptions-item label="认定学分">{{ currentRecord?.credits }} 学分</a-descriptions-item>
        <a-descriptions-item label="成果名称" :span="2">{{ currentRecord?.achievementName }}</a-descriptions-item>
        <a-descriptions-item label="审核状态">{{ getStatusText(currentRecord?.status) }}</a-descriptions-item>
        <a-descriptions-item label="审核时间">{{ currentRecord?.auditTime || '-' }}</a-descriptions-item>
        <a-descriptions-item label="审核意见" :span="2">{{ currentRecord?.auditOpinion || '-' }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined, DollarCircleOutlined, PlusOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons-vue';
import creditRecognitionApi from '../api/creditRecognition';
import studentApi from '../api/student';
import eventBus from '../utils/eventBus';
import { parsePageResponse } from '../utils/responseHandler';

export default {
  name: 'CreditRecognition',
  components: { FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined, DollarCircleOutlined, PlusOutlined, DownloadOutlined, UploadOutlined },
  data() {
    return {
      filters: { studentName: '', type: '', status: '' },
      statistics: { totalCount: 0, pendingCount: 0, approvedCount: 0, totalCredits: 0 },
      columns: [
        { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
        { title: '学生姓名', dataIndex: 'studentName', key: 'studentName', width: 100 },
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo', width: 120 },
        { title: '认定类型', key: 'type', width: 120, align: 'center' },
        { title: '成果名称', dataIndex: 'achievementName', key: 'achievementName', width: 200 },
        { title: '认定学分', key: 'credits', width: 100, align: 'center' },
        { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime', width: 160 },
        { title: '审核状态', key: 'status', width: 100, align: 'center' },
        { title: '操作', key: 'action', width: 180, align: 'center', fixed: 'right' }
      ],
      recognitionList: [],
      loading: false,
      pagination: { current: 1, pageSize: 10, total: 0, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` },
      modalVisible: false,
      submitLoading: false,
      form: { studentId: undefined, type: undefined, achievementName: '', credits: 2, description: '' },
      formRules: {
        studentId: [{ required: true, message: '请选择学生', trigger: 'change' }],
        type: [{ required: true, message: '请选择认定类型', trigger: 'change' }],
        achievementName: [{ required: true, message: '请输入成果名称', trigger: 'blur' }],
        credits: [{ required: true, message: '请输入认定学分', trigger: 'blur' }]
      },
      studentOptions: [],
      approveVisible: false,
      approveOpinion: '',
      approveResult: 'approved',
      currentRecord: null,
      detailVisible: false
    };
  },
  mounted() { 
    this.loadData(); 
    this.loadStatistics();
    this.loadStudentOptions();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current - 1,
          size: this.pagination.pageSize
        };
        
        // 添加筛选条件
        if (this.filters.studentName) {
          params.studentName = this.filters.studentName;
        }
        if (this.filters.type) {
          params.type = this.filters.type;
        }
        if (this.filters.status) {
          params.status = this.filters.status;
        }
        
        const res = await creditRecognitionApi.getAll(params.page, params.size);
        if (res.data.success) {
          const { list, total } = parsePageResponse(res.data);
          this.recognitionList = list.map((item, index) => ({
            ...item,
            index: (this.pagination.current - 1) * this.pagination.pageSize + index + 1
          }));
          this.pagination.total = total;
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
    },
    async loadStatistics() {
      try {
        const res = await creditRecognitionApi.getStatistics();
        if (res.data.success) {
          this.statistics = res.data.data;
        }
      } catch (error) {
        console.error('加载统计数据失败:', error);
      }
    },
    async loadStudentOptions() {
      try {
        // 获取所有学生作为选项
        const res = await studentApi.getAll(0, 1000);
        if (res.data.success) {
          this.studentOptions = res.data.data.map(s => ({
            id: s.id,
            name: s.name,
            studentNo: s.studentNo
          }));
        }
      } catch (error) {
        console.error('加载学生列表失败:', error);
      }
    },
    handleSearch() { this.pagination.current = 1; this.loadData(); },
    handleReset() { this.filters = { studentName: '', type: '', status: '' }; this.pagination.current = 1; this.loadData(); },
    handleTableChange(pagination) { this.pagination.current = pagination.current; this.pagination.pageSize = pagination.pageSize; this.loadData(); },
    showAddModal() { this.resetForm(); this.modalVisible = true; },
    resetForm() { this.form = { studentId: undefined, type: undefined, achievementName: '', credits: 2, description: '' }; if (this.$refs.formRef) this.$refs.formRef.clearValidate(); },
    async handleSubmit() { 
      try { 
        await this.$refs.formRef.validate(); 
      } catch (error) { 
        this.$message.warning('请检查表单'); 
        return; 
      } 
      
      this.submitLoading = true;
      try {
        await creditRecognitionApi.add(this.form);
        this.$message.success('申请提交成功');
        this.modalVisible = false;
        this.loadData();
        this.loadStatistics();
        
        // 通知 Dashboard 数据已变化
        eventBus.emit('data-changed', { module: 'credit', action: 'add' });
      } catch (error) {
        console.error('提交失败:', error);
        this.$message.error('提交失败');
      } finally {
        this.submitLoading = false;
      }
    },
    handleCancel() { this.modalVisible = false; this.resetForm(); },
    showApproveModal(record) { this.currentRecord = record; this.approveOpinion = ''; this.approveResult = 'approved'; this.approveVisible = true; },
    async handleApprove() {
      try {
        await creditRecognitionApi.audit(this.currentRecord.id, {
          result: this.approveResult,
          opinion: this.approveOpinion
        });
        this.$message.success(this.approveResult === 'approved' ? '审核通过' : '已驳回');
        this.approveVisible = false;
        this.loadData();
        this.loadStatistics();
        
        // 通知 Dashboard 数据已变化
        eventBus.emit('data-changed', { module: 'credit', action: 'audit' });
      } catch (error) {
        console.error('审核失败:', error);
        this.$message.error('审核失败');
      }
    },
    showDetail(record) { this.currentRecord = record; this.detailVisible = true; },
    async handleDelete(id) {
      try {
        await creditRecognitionApi.delete(id);
        this.$message.success('删除成功');
        this.loadData();
        this.loadStatistics();
      } catch (error) {
        console.error('删除失败:', error);
        this.$message.error('删除失败');
      }
    },
    handleExport() { this.$message.info('导出功能开发中...'); },
    getStatusText(status) { const map = { 'pending': '待审核', 'approved': '已通过', 'rejected': '已驳回' }; return map[status] || status; },
    getStatusColor(status) { const map = { 'pending': 'orange', 'approved': 'green', 'rejected': 'red' }; return map[status] || 'default'; }
  }
};
</script>

<style scoped>
.page-header { margin-bottom: 24px; }
.page-title { font-size: 20px; font-weight: 600; color: #262626; margin: 0 0 8px 0; }
.page-desc { font-size: 14px; color: #8c8c8c; margin: 0; }
.filter-form { margin-bottom: 16px; }
.action-bar { margin-bottom: 16px; }
</style>
