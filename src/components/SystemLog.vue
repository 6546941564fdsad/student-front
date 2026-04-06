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
    loadLogs() {
      this.loading = true;
      // 模拟数据
      setTimeout(() => {
        this.logs = [
          {
            id: 1,
            index: 1,
            operator: 'admin',
            operationTime: '2025-01-15 10:30:25',
            operationType: '登录',
            module: '系统登录',
            ipAddress: '192.168.1.100',
            status: 'success',
            method: 'POST /api/auth/login',
            requestParams: '{"username":"admin","password":"******"}',
            responseResult: '{"code":200,"message":"登录成功"}',
            errorMessage: null
          },
          {
            id: 2,
            index: 2,
            operator: 'admin',
            operationTime: '2025-01-15 10:35:12',
            operationType: '新增',
            module: '学生管理',
            ipAddress: '192.168.1.100',
            status: 'success',
            method: 'POST /api/students',
            requestParams: '{"name":"张三","studentId":"2021001"}',
            responseResult: '{"code":200,"message":"新增成功"}',
            errorMessage: null
          },
          {
            id: 3,
            index: 3,
            operator: 'teacher1',
            operationTime: '2025-01-15 11:20:45',
            operationType: '修改',
            module: '成绩管理',
            ipAddress: '192.168.1.105',
            status: 'error',
            method: 'PUT /api/grades/1',
            requestParams: '{"score":95}',
            responseResult: null,
            errorMessage: '数据库连接超时'
          }
        ];
        this.pagination.total = this.logs.length;
        this.loading = false;
      }, 500);
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
      this.$message.warning('清空日志功能需要管理员权限');
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
