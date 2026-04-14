<template>
  <div class="thesis-proposal">
    <a-card title="开题管理" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="showAddModal">
          <PlusOutlined /> 提交开题报告
        </a-button>
      </template>

      <!-- 搜索栏 -->
      <a-form layout="inline" style="margin-bottom: 16px">
        <a-form-item label="学号">
          <a-input v-model:value="searchForm.studentNo" placeholder="请输入学号" style="width: 200px" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="loadData">查询</a-button>
          <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 数据表格 -->
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">查看</a-button>
              <a-button type="link" size="small" danger @click="handleDelete(record.id)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 添加/编辑模态框 -->
    <a-modal
      v-model:open="modalVisible"
      :title="editingId ? '编辑开题报告' : '提交开题报告'"
      width="700px"
      @ok="handleSubmit"
    >
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="学号" required>
          <a-input v-model:value="form.studentNo" placeholder="请输入学号" />
        </a-form-item>
        <a-form-item label="学生姓名">
          <a-input v-model:value="form.studentName" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="论文题目" required>
          <a-input v-model:value="form.thesisTitle" placeholder="请输入论文题目" />
        </a-form-item>
        <a-form-item label="指导教师">
          <a-input v-model:value="form.teacher" placeholder="请输入指导教师" />
        </a-form-item>
        <a-form-item label="开题报告内容">
          <a-textarea v-model:value="form.proposalContent" :rows="6" placeholder="请输入开题报告内容" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue';
import { thesisProposalApi } from '../api/thesisProposal';

export default {
  name: 'ThesisProposal',
  components: { PlusOutlined },
  data() {
    return {
      loading: false,
      dataSource: [],
      pagination: { current: 1, pageSize: 10, total: 0 },
      modalVisible: false,
      editingId: null,
      form: { studentNo: '', studentName: '', thesisTitle: '', teacher: '', proposalContent: '' },
      searchForm: { studentNo: '' },
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo' },
        { title: '学生姓名', dataIndex: 'studentName', key: 'studentName' },
        { title: '论文题目', dataIndex: 'thesisTitle', key: 'thesisTitle', ellipsis: true },
        { title: '指导教师', dataIndex: 'teacher', key: 'teacher' },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime', width: 180 },
        { title: '操作', key: 'action', width: 150 }
      ]
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const res = await thesisProposalApi.getAll(this.pagination.current - 1, this.pagination.pageSize);
        if (res.data.success) {
          this.dataSource = res.data.data.content || [];
          this.pagination.total = res.data.data.totalElements || 0;
        }
      } catch (error) {
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.loadData();
    },
    showAddModal() {
      this.editingId = null;
      this.form = { studentNo: '', studentName: '', thesisTitle: '', teacher: '', proposalContent: '' };
      this.modalVisible = true;
    },
    async handleSubmit() {
      try {
        if (this.editingId) {
          await thesisProposalApi.update(this.editingId, this.form);
          this.$message.success('更新成功');
        } else {
          await thesisProposalApi.add(this.form);
          this.$message.success('提交成功');
        }
        this.modalVisible = false;
        this.loadData();
      } catch (error) {
        this.$message.error('操作失败');
      }
    },
    handleView(record) {
      this.$message.info('查看详情功能待完善');
    },
    async handleDelete(id) {
      try {
        await thesisProposalApi.delete(id);
        this.$message.success('删除成功');
        this.loadData();
      } catch (error) {
        this.$message.error('删除失败');
      }
    },
    resetSearch() {
      this.searchForm = { studentNo: '' };
      this.loadData();
    },
    getStatusColor(status) {
      const colors = { pending: 'orange', approved: 'green', rejected: 'red' };
      return colors[status] || 'default';
    },
    getStatusText(status) {
      const texts = { pending: '待审核', approved: '已通过', rejected: '已驳回' };
      return texts[status] || status;
    }
  }
};
</script>
