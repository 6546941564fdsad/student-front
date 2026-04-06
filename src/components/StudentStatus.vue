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
  </div>
</template>

<script>
export default {
  name: 'StudentStatus',
  data() {
    return {
      activeTab: 'status-change',
      filters: {
        studentNo: '',
        name: ''
      },
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
      statusChanges: [
        {
          id: 1,
          applyNo: 'YC20250001',
          studentNo: '2024001001',
          name: '张三',
          changeType: '休学',
          applyDate: '2025-03-01',
          status: '待审批'
        },
        {
          id: 2,
          applyNo: 'YC20250002',
          studentNo: '2024001002',
          name: '李四',
          changeType: '转专业',
          applyDate: '2025-03-02',
          status: '已通过'
        }
      ],
      studentRecords: []
    };
  },
  mounted() {
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
    loadStudentRecords() {
      this.studentRecords = [
        {
          studentNo: '2024001001',
          name: '张三',
          college: '大数据与计算机学院',
          major: '计算机科学与技术',
          className: '计科2401班',
          status: '在读'
        }
      ];
      this.pagination.total = this.studentRecords.length;
    },
    handleSearch() {
      this.loadStudentRecords();
    },
    approve(record) {
      this.$message.info(`审批学籍异动：${record.applyNo}`);
    },
    viewDetail(record) {
      this.$message.info(`查看详情：${record.applyNo}`);
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
