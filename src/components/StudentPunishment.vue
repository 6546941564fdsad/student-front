<!-- src/components/StudentPunishment.vue -->
<template>
  <div class="student-punishment">
    <a-card :bordered="false">
      <div class="page-header">
        <h2 class="page-title">奖惩管理</h2>
      </div>

      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="reward" tab="奖励管理">
          <a-table :columns="columns" :data-source="records" :pagination="pagination" :loading="loading">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="view(record)">查看</a-button>
                  <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <a-tab-pane key="punishment" tab="处分管理">
          <a-table :columns="columns" :data-source="records" :pagination="pagination" :loading="loading">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="view(record)">查看</a-button>
                  <a-button type="link" size="small" @click="edit(record)">编辑</a-button>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:open="showEditModal"
      :title="editForm.id ? '编辑记录' : '新增记录'"
      @ok="handleEditSubmit"
    >
      <a-form :model="editForm" layout="vertical">
        <a-form-item label="学号">
          <a-input v-model:value="editForm.studentNo" />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-model:value="editForm.name" />
        </a-form-item>
        <a-form-item label="类型">
          <a-select v-model:value="editForm.type">
            <a-select-option value="奖励">奖励</a-select-option>
            <a-select-option value="处分">处分</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="日期">
          <a-date-picker v-model:value="editForm.date" style="width: 100%" />
        </a-form-item>
        <a-form-item label="原因">
          <a-textarea v-model:value="editForm.reason" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import punishmentApi from '@/api/punishment';

export default {
  name: 'StudentPunishment',
  data() {
    return {
      activeTab: 'reward',
      loading: false,
      pagination: { current: 1, pageSize: 10, total: 0 },
      columns: [
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo', width: 120 },
        { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
        { title: '类型', dataIndex: 'type', key: 'type', width: 120 },
        { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
        { title: '原因', dataIndex: 'reason', key: 'reason' },
        { title: '操作', key: 'action', width: 150 }
      ],
      records: [],
      showEditModal: false,
      editForm: {}
    };
  },
  mounted() {
    this.loadRecords();
  },
  methods: {
    async loadRecords() {
      this.loading = true;
      try {
        const res = await punishmentApi.getPunishments({
          page: this.pagination.current - 1,
          size: this.pagination.pageSize,
          type: this.activeTab === 'reward' ? '奖励' : '处分'
        });
        if (res.data.success) {
          this.records = res.data.data;
          this.pagination.total = res.data.total;
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        this.loading = false;
      }
    },
    view(record) {
      this.$message.info(`查看详情：${record.name}`);
    },
    edit(record) {
      this.editForm = { ...record };
      this.showEditModal = true;
    },
    async handleEditSubmit() {
      try {
        if (this.editForm.id) {
          await punishmentApi.updatePunishment(this.editForm.id, this.editForm);
        } else {
          await punishmentApi.addPunishment(this.editForm);
        }
        this.$message.success('保存成功');
        this.showEditModal = false;
        this.loadRecords();
      } catch (error) {
        this.$message.error('保存失败');
      }
    }
  }
};
</script>

<style scoped>
.student-punishment { padding: 0; }
.page-header { margin-bottom: 16px; }
.page-title { margin: 0; font-size: 18px; font-weight: 600; color: #333; }
</style>
