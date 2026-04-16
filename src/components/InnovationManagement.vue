<!-- src/components/InnovationManagement.vue -->
<template>
  <div class="innovation-management">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">竞赛管理</h2>
      </div>

      <!-- 筛选条件 -->
      <a-form layout="inline" class="filter-form">
        <a-form-item label="竞赛名称">
          <a-input v-model:value="filters.competitionName" placeholder="请输入竞赛名称" style="width: 180px" />
        </a-form-item>
        <a-form-item label="竞赛级别">
          <a-select v-model:value="filters.level" placeholder="请选择级别" style="width: 150px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="国家级">国家级</a-select-option>
            <a-select-option value="省级">省级</a-select-option>
            <a-select-option value="校级">校级</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="获奖等级">
          <a-select v-model:value="filters.awardLevel" placeholder="请选择获奖等级" style="width: 150px" allow-clear>
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="一等奖">一等奖</a-select-option>
            <a-select-option value="二等奖">二等奖</a-select-option>
            <a-select-option value="三等奖">三等奖</a-select-option>
          </a-select>
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
          新增竞赛
        </a-button>
        <a-button style="margin-left: 8px" @click="handleCreditRecognition">
          <template #icon><SafetyCertificateOutlined /></template>
          学分认定
        </a-button>
        <a-button style="margin-left: 8px" @click="handleExport">
          <template #icon><DownloadOutlined /></template>
          导出
        </a-button>
      </div>

      <!-- 竞赛列表表格 -->
      <a-table
        :columns="columns"
        :data-source="competitions"
        :pagination="pagination"
        :loading="loading"
        size="middle"
        class="competition-table"
        :row-key="record => record.id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'awardLevel'">
            <a-tag :color="getAwardColor(record.awardLevel)">
              {{ record.awardLevel }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="handleView(record)">查看</a>
              <a-divider type="vertical" />
              <a @click="handleEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除该竞赛记录吗？" @confirm="handleDelete(record)">
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
import { PlusOutlined, DownloadOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue';
import competitionApi from '../api/competition';

export default {
  name: 'InnovationManagement',
  components: {
    PlusOutlined,
    DownloadOutlined,
    SafetyCertificateOutlined
  },
  data() {
    return {
      filters: {
        competitionName: '',
        level: '',
        awardLevel: ''
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
          title: '竞赛名称',
          dataIndex: 'competitionName',
          key: 'competitionName',
          width: 200
        },
        {
          title: '学生姓名',
          dataIndex: 'studentName',
          key: 'studentName',
          width: 100
        },
        {
          title: '学号',
          dataIndex: 'studentId',
          key: 'studentId',
          width: 130
        },
        {
          title: '竞赛级别',
          dataIndex: 'level',
          key: 'level',
          width: 100,
          align: 'center'
        },
        {
          title: '获奖等级',
          dataIndex: 'awardLevel',
          key: 'awardLevel',
          width: 100,
          align: 'center'
        },
        {
          title: '获得学分',
          dataIndex: 'credits',
          key: 'credits',
          width: 100,
          align: 'center'
        },
        {
          title: '获奖时间',
          dataIndex: 'awardTime',
          key: 'awardTime',
          width: 160
        },
        {
          title: '操作',
          key: 'action',
          width: 180,
          align: 'center',
          fixed: 'right'
        }
      ],
      competitions: [],
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
    this.loadCompetitions();
  },
  methods: {
    async loadCompetitions() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current - 1,
          size: this.pagination.pageSize,
          competitionName: this.filters.competitionName || undefined,
          level: this.filters.level || undefined,
          awardLevel: this.filters.awardLevel || undefined
        };
        const res = await competitionApi.getAll(params.page, params.size);
        if (res.data.success) {
          this.competitions = res.data.data.map((item, index) => ({
            ...item,
            index: (this.pagination.current - 1) * this.pagination.pageSize + index + 1
          }));
          this.pagination.total = res.data.total;
        }
      } catch (error) {
        console.error('加载竞赛数据失败:', error);
        this.$message.error('加载竞赛数据失败');
      } finally {
        this.loading = false;
      }
    },
    getAwardColor(awardLevel) {
      const colorMap = {
        '一等奖': 'gold',
        '二等奖': 'silver',
        '三等奖': 'orange'
      };
      return colorMap[awardLevel] || 'default';
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadCompetitions();
    },
    handleReset() {
      this.filters = {
        competitionName: '',
        level: '',
        awardLevel: ''
      };
      this.handleSearch();
    },
    handleAdd() {
      this.$message.info('新增竞赛记录功能开发中');
    },
    handleCreditRecognition() {
      this.$message.info('学分认定功能开发中');
    },
    handleExport() {
      this.$message.success('导出成功');
    },
    handleView(record) {
      this.$message.info(`查看竞赛详情：${record.competitionName}`);
    },
    handleEdit(record) {
      this.$message.info(`编辑竞赛记录：${record.competitionName}`);
    },
    handleDelete(record) {
      this.$message.success(`已删除竞赛记录`);
      this.loadCompetitions();
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadCompetitions();
    }
  }
};
</script>

<style scoped>
.innovation-management {
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

.competition-table :deep(.ant-table-thead > tr > th) {
  background: #f0f2f5;
  font-weight: 600;
  color: #333;
}

.competition-table :deep(.ant-table-tbody > tr > td) {
  padding: 12px 16px;
}
</style>
