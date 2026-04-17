<!-- src/components/GraduationAudit.vue -->
<template>
  <div class="graduation-audit">
    <a-card :bordered="false">
      <div class="page-header">
        <h2 class="page-title">毕业审核</h2>
      </div>

      <a-form layout="inline" class="filter-form">
        <a-form-item label="学号">
          <a-input v-model:value="filters.studentNo" placeholder="请输入学号" />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-model:value="filters.name" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="审核状态">
          <a-select v-model:value="filters.status" style="width: 150px" allow-clear>
            <a-select-option value="待审核">待审核</a-select-option>
            <a-select-option value="已通过">已通过</a-select-option>
            <a-select-option value="未通过">未通过</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <a-table :columns="columns" :data-source="audits" :pagination="pagination" :loading="loading">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-badge :status="getStatusType(record.status)" :text="record.status" />
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="audit(record)">审核</a-button>
              <a-button type="link" size="small" @click="viewDetail(record)">详情</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 审核弹窗 -->
    <a-modal
      v-model:open="showAuditModal"
      title="毕业审核"
      @ok="handleAuditSubmit"
    >
      <a-form :model="auditForm" layout="vertical">
        <a-form-item label="学号">
          <a-input v-model:value="auditForm.studentNo" disabled />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-model:value="auditForm.name" disabled />
        </a-form-item>
        <a-form-item label="审核状态">
          <a-select v-model:value="auditForm.status">
            <a-select-option value="待审核">待审核</a-select-option>
            <a-select-option value="已通过">已通过</a-select-option>
            <a-select-option value="未通过">未通过</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="审核意见">
          <a-textarea v-model:value="auditForm.remark" :rows="3" placeholder="请输入审核意见" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import graduationAuditApi from '@/api/graduationAudit';

export default {
  name: 'GraduationAudit',
  data() {
    return {
      filters: { studentNo: '', name: '', status: '' },
      loading: false,
      pagination: { current: 1, pageSize: 10, total: 0 },
      columns: [
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo', width: 120 },
        { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
        { title: '学院', dataIndex: 'college', key: 'college' },
        { title: '专业', dataIndex: 'major', key: 'major' },
        { title: '已修学分', dataIndex: 'credits', key: 'credits', width: 100 },
        { title: '审核状态', key: 'status', width: 100 },
        { title: '操作', key: 'action', width: 150 }
      ],
      audits: [],
      showAuditModal: false,
      auditForm: {}
    };
  },
  mounted() {
    this.loadAudits();
  },
  methods: {
    async loadAudits() {
      this.loading = true;
      try {
        const res = await graduationAuditApi.getAudits({
          page: this.pagination.current - 1,
          size: this.pagination.pageSize,
          status: this.filters.status || undefined
        });
        if (res.data.success) {
          this.audits = res.data.data;
          this.pagination.total = res.data.total;
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
    },
    getStatusType(status) {
      return status === '已通过' ? 'success' : status === '未通过' ? 'error' : 'processing';
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadAudits();
    },
    handleReset() {
      this.filters = { studentNo: '', name: '', status: '' };
      this.handleSearch();
    },
    audit(record) {
      this.auditForm = { ...record };
      this.showAuditModal = true;
    },
    viewDetail(record) {
      this.$message.info(`查看详情：${record.name}`);
    },
    async handleAuditSubmit() {
      try {
        await graduationAuditApi.updateAudit(this.auditForm.id, this.auditForm);
        this.$message.success('审核成功');
        this.showAuditModal = false;
        this.loadAudits();
      } catch (error) {
        this.$message.error('审核失败');
      }
    }
  }
};
</script>

<style scoped>
.graduation-audit { padding: 0; }
.page-header { margin-bottom: 16px; }
.page-title { margin: 0; font-size: 18px; font-weight: 600; color: #333; }
.filter-form { margin-bottom: 16px; padding: 16px; background: #fafafa; border-radius: 4px; }
</style>
