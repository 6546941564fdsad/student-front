<!-- src/components/SystemLog.vue -->
<template>
  <div class="system-log">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">系统日志</h2>
      </div>

      <!-- 筛选条件 -->
      <a-form layout="inline" class="filter-form">
        <a-form-item label="操作时间">
          <a-range-picker v-model:value="filters.dateRange" style="width: 240px" />
        </a-form-item>
        <a-form-item label="操作人员">
          <a-input v-model:value="filters.operator" placeholder="请输入操作人员" style="width: 150px" />
        </a-form-item>
        <a-form-item label="操作类型">
          <a-select v-model:value="filters.operationType" placeholder="请选择操作类型" style="width: 150px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="登录">登录</a-select-option>
            <a-select-option value="新增">新增</a-select-option>
            <a-select-option value="修改">修改</a-select-option>
            <a-select-option value="删除">删除</a-select-option>
            <a-select-option value="查询">查询</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="操作状态">
          <a-select v-model:value="filters.status" placeholder="请选择状态" style="width: 150px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="success">成功</a-select-option>
            <a-select-option value="error">失败</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <a-button @click="handleExport">
          <template #icon><DownloadOutlined /></template>
          导出日志
        </a-button>
        <a-button style="margin-left: 8px" @click="handleClear">
          <template #icon><DeleteOutlined /></template>
          清空日志
        </a-button>
      </div>

      <!-- 日志列表表格 -->
      <a-table
        :columns="columns"
        :data-source="logs"
        :pagination="pagination"
        :loading="loading"
        size="middle"
        class="log-table"
        :row-key="record => record.id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'success' ? 'green' : 'red'">
              {{ record.status === 'success' ? '成功' : '失败' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a @click="handleView(record)">详情</a>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 日志详情对话框 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="日志详情"
      width="800px"
      :footer="null"
    >
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="操作人员">{{ currentLog.operator }}</a-descriptions-item>
        <a-descriptions-item label="操作时间">{{ currentLog.operationTime }}</a-descriptions-item>
        <a-descriptions-item label="操作类型">{{ currentLog.operationType }}</a-descriptions-item>
        <a-descriptions-item label="操作状态">
          <a-tag :color="currentLog.status === 'success' ? 'green' : 'red'">
            {{ currentLog.status === 'success' ? '成功' : '失败' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="IP地址" :span="2">{{ currentLog.ipAddress }}</a-descriptions-item>
        <a-descriptions-item label="操作模块" :span="2">{{ currentLog.module }}</a-descriptions-item>
        <a-descriptions-item label="操作方法" :span="2">{{ currentLog.method }}</a-descriptions-item>
        <a-descriptions-item label="请求参数" :span="2">
          <pre>{{ currentLog.requestParams || '无' }}</pre>
        </a-descriptions-item>
        <a-descriptions-item label="返回结果" :span="2">
          <pre>{{ currentLog.responseResult || '无' }}</pre>
        </a-descriptions-item>
        <a-descriptions-item label="错误信息" :span="2" v-if="currentLog.errorMessage">
          <pre style="color: red;">{{ currentLog.errorMessage }}</pre>
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { systemLogApi } from '@/api/systemLog';

export default {
  name: 'SystemLog',
  components: {
    DownloadOutlined,
    DeleteOutlined
  },
  data() {
    return {
      filters: {
        dateRange: [],
        operator: '',
        operationType: '',
        status: ''
      },
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '操作人员',
          dataIndex: 'operator',
          key: 'operator',
          width: 120
        },
        {
          title: '操作时间',
          dataIndex: 'operationTime',
          key: 'operationTime',
          width: 160
        },
        {
          title: '操作类型',
          dataIndex: 'operationType',
          key: 'operationType',
          width: 100,
          align: 'center'
        },
        {
          title: '操作模块',
          dataIndex: 'module',
          key: 'module',
          width: 150
        },
        {
          title: 'IP地址',
          dataIndex: 'ipAddress',
          key: 'ipAddress',
          width: 140
        },
        {
          title: '操作状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 80,
          align: 'center',
          fixed: 'right'
        }
      ],
      logs: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
      },
      detailModalVisible: false,
      currentLog: {}
    };
  },
  mounted() {
    this.loadLogs();
  },
  methods: {
    async loadLogs() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current - 1,
          size: this.pagination.pageSize,
          operator: this.filters.operator || undefined,
          operationType: this.filters.operationType || undefined,
          status: this.filters.status || undefined
        };
        const res = await systemLogApi.getLogs(params);
        if (res.data.success) {
          this.logs = res.data.data.map((item, index) => ({
            ...item,
            index: (this.pagination.current - 1) * this.pagination.pageSize + index + 1
          }));
          this.pagination.total = res.data.total;
        }
      } catch (error) {
        console.error('加载系统日志失败:', error);
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadLogs();
    },
    handleReset() {
      this.filters = {
        dateRange: [],
        operator: '',
        operationType: '',
        status: ''
      };
      this.handleSearch();
    },
    handleExport() {
      this.$message.success('日志导出成功');
    },
    handleClear() {
      this.$confirm({
        title: '确认清空',
        content: '确定要清空所有系统日志吗？此操作不可恢复。',
        onOk: async () => {
          try {
            await systemLogApi.clearLogs();
            this.$message.success('日志已清空');
            this.loadLogs();
          } catch (error) {
            console.error('清空失败:', error);
            this.$message.error('清空失败');
          }
        }
      });
    },
    handleView(record) {
      this.currentLog = record;
      this.detailModalVisible = true;
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadLogs();
    }
  }
};
</script>

<style scoped>
.system-log {
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
}

.action-bar {
  margin-bottom: 16px;
}

.log-table :deep(.ant-table-thead > tr > th) {
  background: #f0f2f5;
  font-weight: 600;
  color: #333;
}

.log-table :deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 200px;
  overflow-y: auto;
}
</style>
