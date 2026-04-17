<!-- src/components/StudentStatus.vue -->
<template>
  <div class="student-status">
    <a-card :bordered="false">
      <div class="page-header">
        <h2 class="page-title">学籍管理</h2>
      </div>

      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="status-change" tab="学籍异动">
          <a-table
            :columns="changeColumns"
            :data-source="statusChanges"
            :pagination="pagination"
            :loading="loading"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">
                  {{ record.status }}
                </a-tag>
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="approve(record)">审批</a-button>
                  <a-button type="link" size="small" @click="viewDetail(record)">详情</a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <a-tab-pane key="status-query" tab="学籍查询">
          <a-form layout="inline" class="filter-form">
            <a-form-item label="学号">
              <a-input v-model:value="filters.studentNo" placeholder="请输入学号" />
            </a-form-item>
            <a-form-item label="姓名">
              <a-input v-model:value="filters.name" placeholder="请输入姓名" />
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-form-item>
          </a-form>

          <a-table
            :columns="queryColumns"
            :data-source="studentRecords"
            :pagination="pagination"
          />
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 审批弹窗 -->
    <a-modal
      v-model:open="showAuditModal"
      title="学籍异动审批"
      @ok="handleAuditSubmit"
    >
      <a-form :model="auditForm" layout="vertical">
        <a-form-item label="学号">
          <a-input v-model:value="auditForm.studentNo" disabled />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-model:value="auditForm.name" disabled />
        </a-form-item>
        <a-form-item label="异动类型">
          <a-input v-model:value="auditForm.changeType" disabled />
        </a-form-item>
        <a-form-item label="审批状态">
          <a-select v-model:value="auditForm.status">
            <a-select-option value="待审批">待审批</a-select-option>
            <a-select-option value="已通过">已通过</a-select-option>
            <a-select-option value="已拒绝">已拒绝</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="审批意见">
          <a-textarea v-model:value="auditForm.remark" :rows="3" placeholder="请输入审批意见" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import studentStatusApi from '@/api/studentStatus';

export default {
  name: 'StudentStatus',
  data() {
    return {
      activeTab: 'status-change',
      filters: {
        studentNo: '',
        name: ''
      },
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      changeColumns: [
        { title: '申请编号', dataIndex: 'applyNo', key: 'applyNo', width: 150 },
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo', width: 120 },
        { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
        { title: '异动类型', dataIndex: 'changeType', key: 'changeType', width: 120 },
        { title: '申请日期', dataIndex: 'applyDate', key: 'applyDate', width: 120 },
        { title: '状态', key: 'status', width: 100 },
        { title: '操作', key: 'action', width: 150 }
      ],
      queryColumns: [
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo', width: 120 },
        { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
        { title: '学院', dataIndex: 'college', key: 'college' },
        { title: '专业', dataIndex: 'major', key: 'major' },
        { title: '班级', dataIndex: 'className', key: 'className' },
        { title: '学籍状态', dataIndex: 'status', key: 'status', width: 100 }
      ],
      statusChanges: [],
      studentRecords: [],
      showAuditModal: false,
      auditForm: {}
    };
  },
  mounted() {
    this.loadStatusChanges();
    this.loadStudentRecords();
  },
  methods: {
    getStatusColor(status) {
      const colorMap = {
        '待审批': 'orange',
        '已通过': 'green',
        '已拒绝': 'red'
      };
      return colorMap[status] || 'default';
    },
    async loadStatusChanges() {
      this.loading = true;
      try {
        const res = await studentStatusApi.getChanges({
          page: this.pagination.current - 1,
          size: this.pagination.pageSize
        });
        if (res.data.success) {
          this.statusChanges = res.data.data.map(item => ({
            ...item,
            applyNo: `YC${new Date(item.applyDate).getFullYear()}${String(item.id).padStart(4, '0')}`
          }));
          this.pagination.total = res.data.total;
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
    },
    loadStudentRecords() {
      // TODO: 对接学生查询API
      this.studentRecords = [];
      this.pagination.total = 0;
    },
    handleSearch() {
      this.loadStudentRecords();
    },
    approve(record) {
      this.auditForm = { ...record };
      this.showAuditModal = true;
    },
    viewDetail(record) {
      this.$message.info(`查看详情：${record.applyNo}`);
    },
    async handleAuditSubmit() {
      try {
        await studentStatusApi.updateChange(this.auditForm.id, this.auditForm);
        this.$message.success('审批成功');
        this.showAuditModal = false;
        this.loadStatusChanges();
      } catch (error) {
        this.$message.error('审批失败');
      }
    }
  }
};
</script>

<style scoped>
.student-status {
  padding: 0;
}

.page-header {
  margin-bottom: 16px;
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
