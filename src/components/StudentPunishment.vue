<!-- src/components/StudentPunishment.vue -->
<template>
  <div class="student-punishment">
    <a-card :bordered="false">
      <div class="page-header">
        <h2 class="page-title">奖惩管理</h2>
      </div>

      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="reward" tab="奖励管理">
          <a-table :columns="columns" :data-source="rewards" :pagination="pagination">
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
          <a-table :columns="columns" :data-source="punishments" :pagination="pagination">
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
  </div>
</template>

<script>
export default {
  name: 'StudentPunishment',
  data() {
    return {
      activeTab: 'reward',
      pagination: { current: 1, pageSize: 10, total: 0 },
      columns: [
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo', width: 120 },
        { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
        { title: '类型', dataIndex: 'type', key: 'type', width: 120 },
        { title: '日期', dataIndex: 'date', key: 'date', width: 120 },
        { title: '原因', dataIndex: 'reason', key: 'reason' },
        { title: '操作', key: 'action', width: 150 }
      ],
      rewards: [
        { id: 1, studentNo: '2024001001', name: '张三', type: '奖学金', date: '2024-10-01', reason: '优秀学习成绩' }
      ],
      punishments: [
        { id: 2, studentNo: '2024001002', name: '李四', type: '警告', date: '2024-11-15', reason: '违反课堂纪律' }
      ]
    };
  },
  methods: {
    view(record) { this.$message.info(`查看详情：${record.name}`); },
    edit(record) { this.$message.info(`编辑：${record.name}`); }
  }
};
</script>

<style scoped>
.student-punishment { padding: 0; }
.page-header { margin-bottom: 16px; }
.page-title { margin: 0; font-size: 18px; font-weight: 600; color: #333; }
</style>
