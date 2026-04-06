<!-- src/components/DataDictionary.vue -->
<template>
  <div class="data-dictionary">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">数据字典管理</h2>
      </div>

      <!-- 筛选条件 -->
      <a-form layout="inline" class="filter-form">
        <a-form-item label="字典类型">
          <a-select v-model:value="filters.dictType" placeholder="请选择字典类型" style="width: 180px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="gender">性别</a-select-option>
            <a-select-option value="education_level">学历层次</a-select-option>
            <a-select-option value="political_status">政治面貌</a-select-option>
            <a-select-option value="exam_type">考试类型</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="字典标签">
          <a-input v-model:value="filters.dictLabel" placeholder="请输入字典标签" style="width: 150px" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增字典
        </a-button>
        <a-button style="margin-left: 8px" @click="handleRefresh">
          <template #icon><ReloadOutlined /></template>
          刷新缓存
        </a-button>
      </div>

      <!-- 数据字典表格 -->
      <a-table
        :columns="columns"
        :data-source="dictionaries"
        :pagination="pagination"
        :loading="loading"
        size="middle"
        class="dictionary-table"
        :row-key="record => record.id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status ? 'green' : 'red'">
              {{ record.status ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除该字典项吗？" @confirm="handleDelete(record)">
                <a style="color: #ff4d4f">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue';

export default {
  name: 'DataDictionary',
  components: {
    PlusOutlined,
    ReloadOutlined
  },
  data() {
    return {
      filters: {
        dictType: '',
        dictLabel: ''
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
          title: '字典类型',
          dataIndex: 'dictType',
          key: 'dictType',
          width: 150
        },
        {
          title: '字典标签',
          dataIndex: 'dictLabel',
          key: 'dictLabel',
          width: 150
        },
        {
          title: '字典键值',
          dataIndex: 'dictValue',
          key: 'dictValue',
          width: 150
        },
        {
          title: '排序',
          dataIndex: 'sortOrder',
          key: 'sortOrder',
          width: 80,
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          width: 160
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          fixed: 'right'
        }
      ],
      dictionaries: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
      }
    };
  },
  mounted() {
    this.loadDictionaries();
  },
  methods: {
    loadDictionaries() {
      this.loading = true;
      // 模拟数据
      setTimeout(() => {
        this.dictionaries = [
          {
            id: 1,
            index: 1,
            dictType: 'gender',
            dictLabel: '男',
            dictValue: '1',
            sortOrder: 1,
            status: true,
            remark: '男性',
            createTime: '2024-01-01 10:00:00'
          },
          {
            id: 2,
            index: 2,
            dictType: 'gender',
            dictLabel: '女',
            dictValue: '2',
            sortOrder: 2,
            status: true,
            remark: '女性',
            createTime: '2024-01-01 10:00:00'
          },
          {
            id: 3,
            index: 3,
            dictType: 'education_level',
            dictLabel: '本科',
            dictValue: 'undergraduate',
            sortOrder: 1,
            status: true,
            remark: '本科学历',
            createTime: '2024-01-01 10:00:00'
          }
        ];
        this.pagination.total = this.dictionaries.length;
        this.loading = false;
      }, 500);
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadDictionaries();
    },
    handleReset() {
      this.filters = {
        dictType: '',
        dictLabel: ''
      };
      this.handleSearch();
    },
    handleAdd() {
      this.$message.info('新增字典项功能开发中');
    },
    handleRefresh() {
      this.$message.success('缓存刷新成功');
    },
    handleEdit(record) {
      this.$message.info(`编辑字典项：${record.dictLabel}`);
    },
    handleDelete(record) {
      this.$message.success(`已删除字典项：${record.dictLabel}`);
      this.loadDictionaries();
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadDictionaries();
    }
  }
};
</script>

<style scoped>
.data-dictionary {
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

.dictionary-table :deep(.ant-table-thead > tr > th) {
  background: #f0f2f5;
  font-weight: 600;
  color: #333;
}

.dictionary-table :deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
}
</style>
