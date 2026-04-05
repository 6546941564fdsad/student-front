<!-- src/components/OperationLog.vue -->
<template>
  <div class="operation-log">
    <a-card title="操作日志">
      <!-- 筛选栏 -->
      <div class="filter-section">
        <a-space size="large">
          <a-input-search 
            placeholder="搜索操作内容" 
            style="width: 300px" 
            @search="handleSearch"
          />
          <a-select placeholder="操作类型" style="width: 150px" @change="handleTypeFilter">
            <a-option value="">全部</a-option>
            <a-option value="登录">登录</a-option>
            <a-option value="新增">新增</a-option>
            <a-option value="编辑">编辑</a-option>
            <a-option value="删除">删除</a-option>
            <a-option value="导出">导出</a-option>
          </a-select>
          <a-select placeholder="操作人" style="width: 150px" @change="handleOperatorFilter">
            <a-option value="">全部</a-option>
            <a-option value="admin">系统管理员</a-option>
            <a-option value="teacher01">张老师</a-option>
            <a-option value="student01">张三</a-option>
          </a-select>
          <a-date-picker placeholder="开始日期" style="width: 150px" @change="handleStartDateChange" />
          <a-date-picker placeholder="结束日期" style="width: 150px" @change="handleEndDateChange" />
        </a-space>
      </div>
      
      <!-- 日志列表 -->
      <a-table :columns="columns" :data-source="filteredLogs" row-key="id" :loading="loading" :scroll="{ x: 1200 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <a-tag :color="getTypeColor(record.type)">{{ record.type }}</a-tag>
          </template>
          <template v-if="column.key === 'result'">
            <a-tag :color="record.result === '成功' ? 'green' : 'red'">{{ record.result }}</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'OperationLog',
  data() {
    return {
      loading: false,
      searchText: '',
      typeFilter: '',
      operatorFilter: '',
      startDate: null,
      endDate: null,
      logs: [
        {
          id: 1,
          operator: 'admin',
          operatorName: '系统管理员',
          type: '登录',
          content: '用户登录系统',
          ip: '192.168.1.100',
          time: '2026-04-05 09:30:00',
          result: '成功'
        },
        {
          id: 2,
          operator: 'teacher01',
          operatorName: '张老师',
          type: '新增',
          content: '添加学生信息：张三',
          ip: '192.168.1.101',
          time: '2026-04-05 10:15:00',
          result: '成功'
        },
        {
          id: 3,
          operator: 'admin',
          operatorName: '系统管理员',
          type: '编辑',
          content: '修改课程信息：数据结构',
          ip: '192.168.1.100',
          time: '2026-04-05 11:00:00',
          result: '成功'
        },
        {
          id: 4,
          operator: 'teacher01',
          operatorName: '张老师',
          type: '删除',
          content: '删除学生信息：李四',
          ip: '192.168.1.101',
          time: '2026-04-05 14:20:00',
          result: '成功'
        },
        {
          id: 5,
          operator: 'student01',
          operatorName: '张三',
          type: '导出',
          content: '导出成绩报表',
          ip: '192.168.1.102',
          time: '2026-04-05 15:45:00',
          result: '成功'
        }
      ],
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '操作人', dataIndex: 'operatorName', key: 'operatorName', width: 120 },
        { title: '操作类型', dataIndex: 'type', key: 'type', width: 100 },
        { title: '操作内容', dataIndex: 'content', key: 'content', width: 250 },
        { title: 'IP地址', dataIndex: 'ip', key: 'ip', width: 150 },
        { title: '操作时间', dataIndex: 'time', key: 'time', width: 180 },
        { title: '结果', dataIndex: 'result', key: 'result', width: 100 }
      ]
    };
  },
  computed: {
    filteredLogs() {
      return this.logs.filter(log => {
        const matchesSearch = !this.searchText || 
          log.content.includes(this.searchText) || 
          log.operatorName.includes(this.searchText);
        const matchesType = !this.typeFilter || log.type === this.typeFilter;
        const matchesOperator = !this.operatorFilter || log.operator === this.operatorFilter;
        return matchesSearch && matchesType && matchesOperator;
      });
    }
  },
  methods: {
    handleSearch(value) {
      this.searchText = value;
    },
    handleTypeFilter(value) {
      this.typeFilter = value;
    },
    handleOperatorFilter(value) {
      this.operatorFilter = value;
    },
    handleStartDateChange(date) {
      this.startDate = date ? date.format('YYYY-MM-DD') : null;
    },
    handleEndDateChange(date) {
      this.endDate = date ? date.format('YYYY-MM-DD') : null;
    },
    getTypeColor(type) {
      switch (type) {
        case '登录': return 'blue';
        case '新增': return 'green';
        case '编辑': return 'orange';
        case '删除': return 'red';
        case '导出': return 'purple';
        default: return 'default';
      }
    }
  }
};
</script>

<style scoped>
.operation-log {
  padding: 20px;
}

.filter-section {
  margin-bottom: 16px;
}
</style>
