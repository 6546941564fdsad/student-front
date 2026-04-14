<!-- src/components/ProjectManagement.vue -->
<template>
  <div class="project-management">
    <a-card :bordered="false">
      <div class="page-header">
        <h2 class="page-title">项目管理</h2>
        <p class="page-desc">管理大学生创新创业训练计划项目</p>
      </div>

      <!-- 统计卡片 -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="6"><a-card :bordered="false"><template #title><FolderOutlined style="color: #1890ff" /><span style="margin-left: 8px">项目总数</span></template><p style="font-size: 32px; font-weight: bold; color: #1890ff; margin: 0">{{ statistics.totalCount || 0 }}</p></a-card></a-col>
        <a-col :span="6"><a-card :bordered="false"><template #title><CheckCircleOutlined style="color: #52c41a" /><span style="margin-left: 8px">国家级</span></template><p style="font-size: 32px; font-weight: bold; color: #52c41a; margin: 0">{{ statistics.nationalCount || 0 }}</p></a-card></a-col>
        <a-col :span="6"><a-card :bordered="false"><template #title><ClockCircleOutlined style="color: #faad14" /><span style="margin-left: 8px">进行中</span></template><p style="font-size: 32px; font-weight: bold; color: #faad14; margin: 0">{{ statistics.inProgressCount || 0 }}</p></a-card></a-col>
        <a-col :span="6"><a-card :bordered="false"><template #title><TrophyOutlined style="color: #722ed1" /><span style="margin-left: 8px">已结题</span></template><p style="font-size: 32px; font-weight: bold; color: #722ed1; margin: 0">{{ statistics.completedCount || 0 }}</p></a-card></a-col>
      </a-row>

      <!-- 筛选和操作 -->
      <a-form layout="inline" class="filter-form">
        <a-form-item label="项目名称"><a-input v-model:value="filters.projectName" placeholder="请输入项目名称" style="width: 200px" /></a-form-item>
        <a-form-item label="项目级别"><a-select v-model:value="filters.level" placeholder="请选择级别" style="width: 150px" allow-clear><a-select-option value="">全部</a-select-option><a-select-option value="国家级">国家级</a-select-option><a-select-option value="省级">省级</a-select-option><a-select-option value="校级">校级</a-select-option></a-select></a-form-item>
        <a-form-item label="项目状态"><a-select v-model:value="filters.status" placeholder="请选择状态" style="width: 150px" allow-clear><a-select-option value="">全部</a-select-option><a-select-option value="申报中">申报中</a-select-option><a-select-option value="进行中">进行中</a-select-option><a-select-option value="已结题">已结题</a-select-option></a-select></a-form-item>
        <a-form-item><a-button type="primary" @click="handleSearch">查询</a-button><a-button style="margin-left: 8px" @click="handleReset">重置</a-button></a-form-item>
      </a-form>

      <div class="action-bar">
        <a-button type="primary" @click="showAddModal"><PlusOutlined /> 新增项目</a-button>
        <a-button style="margin-left: 8px" @click="handleExport"><DownloadOutlined /> 导出</a-button>
      </div>

      <!-- 项目列表 -->
      <a-table :columns="columns" :data-source="projectList" :loading="loading" :pagination="pagination" row-key="id" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'level'"><a-tag :color="getLevelColor(record.level)">{{ record.level }}</a-tag></template>
          <template v-if="column.key === 'status'"><a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag></template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showDetail(record)">详情</a-button>
              <a-button type="link" size="small" @click="showEditModal(record)">编辑</a-button>
              <a-popconfirm title="确定删除？" @confirm="handleDelete(record.id)"><a-button type="link" danger size="small">删除</a-button></a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 添加/编辑模态框 -->
    <a-modal v-model:open="modalVisible" :title="isEdit ? '编辑项目' : '新增项目'" width="700px" :confirm-loading="submitLoading" @ok="handleSubmit" @cancel="handleCancel">
      <a-form ref="formRef" :model="form" :rules="formRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="项目名称" name="projectName"><a-input v-model:value="form.projectName" placeholder="请输入项目名称" /></a-form-item>
        <a-form-item label="项目级别" name="level"><a-select v-model:value="form.level" placeholder="请选择项目级别"><a-select-option value="国家级">国家级</a-select-option><a-select-option value="省级">省级</a-select-option><a-select-option value="校级">校级</a-select-option></a-select></a-form-item>
        <a-form-item label="项目负责人" name="leaderId"><a-select v-model:value="form.leaderId" placeholder="请选择负责人"><a-select-option v-for="student in studentOptions" :key="student.id" :value="student.id">{{ student.name }} ({{ student.studentNo }})</a-select-option></a-select></a-form-item>
        <a-form-item label="指导教师" name="teacher"><a-input v-model:value="form.teacher" placeholder="请输入指导教师" /></a-form-item>
        <a-form-item label="立项时间" name="startDate"><a-date-picker v-model:value="form.startDate" style="width: 100%" /></a-form-item>
        <a-form-item label="预计结题时间" name="endDate"><a-date-picker v-model:value="form.endDate" style="width: 100%" /></a-form-item>
        <a-form-item label="项目经费" name="budget"><a-input-number v-model:value="form.budget" :min="0" :precision="2" style="width: 100%" placeholder="请输入经费（元）" /></a-form-item>
        <a-form-item label="项目简介" name="description"><a-textarea v-model:value="form.description" :rows="4" placeholder="请输入项目简介" /></a-form-item>
      </a-form>
    </a-modal>

    <!-- 详情模态框 -->
    <a-modal v-model:open="detailVisible" title="项目详情" width="800px" :footer="null">
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="项目名称" :span="2">{{ currentRecord?.projectName }}</a-descriptions-item>
        <a-descriptions-item label="项目级别">{{ currentRecord?.level }}</a-descriptions-item>
        <a-descriptions-item label="项目状态">{{ currentRecord?.status }}</a-descriptions-item>
        <a-descriptions-item label="项目负责人">{{ currentRecord?.leaderName }}</a-descriptions-item>
        <a-descriptions-item label="指导教师">{{ currentRecord?.teacher }}</a-descriptions-item>
        <a-descriptions-item label="立项时间">{{ formatDate(currentRecord?.startDate) }}</a-descriptions-item>
        <a-descriptions-item label="预计结题时间">{{ formatDate(currentRecord?.endDate) }}</a-descriptions-item>
        <a-descriptions-item label="项目经费">{{ currentRecord?.budget }} 元</a-descriptions-item>
        <a-descriptions-item label="项目简介" :span="2">{{ currentRecord?.description || '-' }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { FolderOutlined, CheckCircleOutlined, ClockCircleOutlined, TrophyOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

export default {
  name: 'ProjectManagement',
  components: { FolderOutlined, CheckCircleOutlined, ClockCircleOutlined, TrophyOutlined, PlusOutlined, DownloadOutlined },
  data() {
    return {
      filters: { projectName: '', level: '', status: '' },
      statistics: { totalCount: 0, nationalCount: 0, inProgressCount: 0, completedCount: 0 },
      columns: [
        { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
        { title: '项目名称', dataIndex: 'projectName', key: 'projectName', width: 200 },
        { title: '项目级别', key: 'level', width: 100, align: 'center' },
        { title: '项目负责人', dataIndex: 'leaderName', key: 'leaderName', width: 100 },
        { title: '指导教师', dataIndex: 'teacher', key: 'teacher', width: 100 },
        { title: '立项时间', dataIndex: 'startDate', key: 'startDate', width: 120 },
        { title: '项目状态', key: 'status', width: 100, align: 'center' },
        { title: '操作', key: 'action', width: 180, align: 'center', fixed: 'right' }
      ],
      projectList: [],
      loading: false,
      pagination: { current: 1, pageSize: 10, total: 0, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` },
      modalVisible: false,
      isEdit: false,
      submitLoading: false,
      form: { projectName: '', level: undefined, leaderId: undefined, teacher: '', startDate: null, endDate: null, budget: 0, description: '' },
      formRules: {
        projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        level: [{ required: true, message: '请选择项目级别', trigger: 'change' }],
        leaderId: [{ required: true, message: '请选择项目负责人', trigger: 'change' }]
      },
      studentOptions: [{ id: 1, name: '张三', studentNo: '2024001' }, { id: 2, name: '李四', studentNo: '2024002' }],
      detailVisible: false,
      currentRecord: null
    };
  },
  mounted() { this.loadData(); this.loadStatistics(); },
  methods: {
    async loadData() {
      this.loading = true;
      setTimeout(() => {
        this.projectList = [
          { id: 1, index: 1, projectName: '基于AI的智能教学系统', level: '国家级', leaderName: '张三', teacher: '张老师', startDate: '2024-09-01', status: '进行中', budget: 10000, description: '开发一个智能教学辅助系统' },
          { id: 2, index: 2, projectName: '校园二手交易平台', level: '省级', leaderName: '李四', teacher: '李老师', startDate: '2024-10-15', status: '申报中', budget: 5000, description: '搭建校园二手物品交易平台' }
        ];
        this.pagination.total = this.projectList.length;
        this.loading = false;
      }, 500);
    },
    async loadStatistics() { this.statistics = { totalCount: 18, nationalCount: 5, inProgressCount: 12, completedCount: 6 }; },
    handleSearch() { this.pagination.current = 1; this.loadData(); },
    handleReset() { this.filters = { projectName: '', level: '', status: '' }; this.pagination.current = 1; this.loadData(); },
    handleTableChange(pagination) { this.pagination.current = pagination.current; this.pagination.pageSize = pagination.pageSize; this.loadData(); },
    showAddModal() { this.isEdit = false; this.resetForm(); this.modalVisible = true; },
    showEditModal(record) { this.isEdit = true; this.currentRecord = record; this.form = { ...record, leaderId: 1, startDate: dayjs(record.startDate), endDate: record.endDate ? dayjs(record.endDate) : null }; this.modalVisible = true; },
    resetForm() { this.form = { projectName: '', level: undefined, leaderId: undefined, teacher: '', startDate: null, endDate: null, budget: 0, description: '' }; if (this.$refs.formRef) this.$refs.formRef.clearValidate(); },
    async handleSubmit() { try { await this.$refs.formRef.validate(); } catch (error) { this.$message.warning('请检查表单'); return; } this.submitLoading = true; setTimeout(() => { this.$message.success(this.isEdit ? '编辑成功' : '添加成功'); this.modalVisible = false; this.submitLoading = false; this.loadData(); this.loadStatistics(); }, 1000); },
    handleCancel() { this.modalVisible = false; this.resetForm(); },
    showDetail(record) { this.currentRecord = record; this.detailVisible = true; },
    async handleDelete(id) { this.$message.success('删除成功'); this.loadData(); this.loadStatistics(); },
    handleExport() { this.$message.info('导出功能开发中...'); },
    getLevelColor(level) { const map = { '国家级': 'red', '省级': 'blue', '校级': 'green' }; return map[level] || 'default'; },
    getStatusColor(status) { const map = { '申报中': 'orange', '进行中': 'blue', '已结题': 'green' }; return map[status] || 'default'; },
    formatDate(date) { if (!date) return '-'; return dayjs(date).format('YYYY-MM-DD'); }
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
