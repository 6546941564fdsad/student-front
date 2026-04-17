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

    <!-- 新增/编辑字典项弹窗 -->
    <a-modal
      v-model:open="showEditModal"
      :title="editForm.id ? '编辑字典项' : '新增字典项'"
      :confirm-loading="editLoading"
      @ok="handleEditSubmit"
    >
      <a-form :model="editForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="字典类型" required>
          <a-select v-model:value="editForm.dictType" placeholder="请选择字典类型">
            <a-select-option value="gender">性别</a-select-option>
            <a-select-option value="education_level">学历层次</a-select-option>
            <a-select-option value="political_status">政治面貌</a-select-option>
            <a-select-option value="exam_type">考试类型</a-select-option>
            <a-select-option value="status">状态</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="字典标签" required>
          <a-input v-model:value="editForm.dictLabel" placeholder="请输入字典标签" />
        </a-form-item>
        <a-form-item label="字典键值" required>
          <a-input v-model:value="editForm.dictValue" placeholder="请输入字典键值" />
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number v-model:value="editForm.sortOrder" :min="0" style="width: 100%" />
        </a-form-item>
        <a-form-item label="状态">
          <a-switch v-model:checked="editForm.status" checked-children="启用" un-checked-children="禁用" />
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="editForm.remark" placeholder="请输入备注" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue';
import { dataDictionaryApi } from '@/api/dataDictionary';

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
      },
      showEditModal: false,
      editLoading: false,
      editForm: {
        id: null,
        dictType: '',
        dictLabel: '',
        dictValue: '',
        sortOrder: 0,
        status: true,
        remark: ''
      }
    };
  },
  mounted() {
    this.loadDictionaries();
  },
  methods: {
    async loadDictionaries() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current - 1,
          size: this.pagination.pageSize,
          dictType: this.filters.dictType || undefined,
          dictLabel: this.filters.dictLabel || undefined
        };
        const res = await dataDictionaryApi.getDictionaries(params);
        if (res.data.success) {
          this.dictionaries = res.data.data.map((item, index) => ({
            ...item,
            index: (this.pagination.current - 1) * this.pagination.pageSize + index + 1
          }));
          this.pagination.total = res.data.total;
        }
      } catch (error) {
        console.error('加载数据字典失败:', error);
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
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
      this.editForm = {
        id: null,
        dictType: '',
        dictLabel: '',
        dictValue: '',
        sortOrder: 0,
        status: true,
        remark: ''
      };
      this.showEditModal = true;
    },
    handleRefresh() {
      this.$message.success('缓存刷新成功');
    },
    handleEdit(record) {
      this.editForm = { ...record };
      this.showEditModal = true;
    },
    async handleEditSubmit() {
      this.editLoading = true;
      try {
        if (this.editForm.id) {
          await dataDictionaryApi.updateDictionary(this.editForm.id, this.editForm);
          this.$message.success('更新成功');
        } else {
          await dataDictionaryApi.addDictionary(this.editForm);
          this.$message.success('新增成功');
        }
        this.showEditModal = false;
        this.loadDictionaries();
      } catch (error) {
        console.error('保存失败:', error);
        this.$message.error('保存失败');
      } finally {
        this.editLoading = false;
      }
    },
    async handleDelete(record) {
      try {
        await dataDictionaryApi.deleteDictionary(record.id);
        this.$message.success(`已删除字典项：${record.dictLabel}`);
        this.loadDictionaries();
      } catch (error) {
        console.error('删除失败:', error);
        this.$message.error('删除失败');
      }
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
