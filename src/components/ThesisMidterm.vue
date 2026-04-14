<template>
  <div class="thesis-midterm">
    <a-card title="中期检查" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="showAddModal"><PlusOutlined /> 提交进度报告</a-button>
      </template>
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading" row-key="id" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'passed' ? 'green' : record.status === 'failed' ? 'red' : 'orange'">
              {{ record.status === 'passed' ? '已通过' : record.status === 'failed' ? '未通过' : '待检查' }}
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
    <a-modal v-model:open="modalVisible" title="提交进度报告" width="700px" @ok="handleSubmit">
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="学号" required><a-input v-model:value="form.studentNo" /></a-form-item>
        <a-form-item label="学生姓名"><a-input v-model:value="form.studentName" /></a-form-item>
        <a-form-item label="论文题目"><a-input v-model:value="form.thesisTitle" /></a-form-item>
        <a-form-item label="指导教师"><a-input v-model:value="form.teacher" /></a-form-item>
        <a-form-item label="进度报告"><a-textarea v-model:value="form.progressReport" :rows="4" /></a-form-item>
        <a-form-item label="存在问题"><a-textarea v-model:value="form.problems" :rows="3" /></a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { PlusOutlined } from '@ant-design/icons-vue';
import { thesisMidtermApi } from '../api/thesisMidterm';
export default {
  name: 'ThesisMidterm',
  components: { PlusOutlined },
  data() {
    return {
      loading: false, dataSource: [], pagination: { current: 1, pageSize: 10, total: 0 },
      modalVisible: false, form: { studentNo: '', studentName: '', thesisTitle: '', teacher: '', progressReport: '', problems: '' },
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo' },
        { title: '学生姓名', dataIndex: 'studentName', key: 'studentName' },
        { title: '论文题目', dataIndex: 'thesisTitle', key: 'thesisTitle', ellipsis: true },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime', width: 180 },
        { title: '操作', key: 'action', width: 150 }
      ]
    };
  },
  mounted() { this.loadData(); },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const res = await thesisMidtermApi.getAll(this.pagination.current - 1, this.pagination.pageSize);
        if (res.data.success) { this.dataSource = res.data.data.content || []; this.pagination.total = res.data.data.totalElements || 0; }
      } catch (error) { this.$message.error('加载失败'); }
      finally { this.loading = false; }
    },
    handleTableChange(pagination) { this.pagination.current = pagination.current; this.loadData(); },
    showAddModal() { this.form = { studentNo: '', studentName: '', thesisTitle: '', teacher: '', progressReport: '', problems: '' }; this.modalVisible = true; },
    async handleSubmit() {
      try { await thesisMidtermApi.add(this.form); this.$message.success('提交成功'); this.modalVisible = false; this.loadData(); }
      catch (error) { this.$message.error('操作失败'); }
    },
    handleView() { this.$message.info('查看详情'); },
    async handleDelete(id) {
      try { await thesisMidtermApi.delete(id); this.$message.success('删除成功'); this.loadData(); }
      catch (error) { this.$message.error('删除失败'); }
    }
  }
};
</script>
