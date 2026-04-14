<template>
  <div class="defense-management">
    <a-card title="答辩管理" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="showAddModal"><PlusOutlined /> 安排答辩</a-button>
      </template>
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading" row-key="id" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'completed' ? 'green' : 'blue'">
              {{ record.status === 'completed' ? '已完成' : '已安排' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-button type="link" size="small" danger @click="handleDelete(record.id)">删除</a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model:open="modalVisible" title="安排答辩" width="600px" @ok="handleSubmit">
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="学号" required><a-input v-model:value="form.studentNo" /></a-form-item>
        <a-form-item label="学生姓名"><a-input v-model:value="form.studentName" /></a-form-item>
        <a-form-item label="论文题目"><a-input v-model:value="form.thesisTitle" /></a-form-item>
        <a-form-item label="指导教师"><a-input v-model:value="form.teacher" /></a-form-item>
        <a-form-item label="答辩教室"><a-input v-model:value="form.defenseRoom" /></a-form-item>
        <a-form-item label="答辩时间"><a-date-picker v-model:value="form.defenseTime" show-time style="width: 100%" /></a-form-item>
        <a-form-item label="答辩小组"><a-input v-model:value="form.defenseGroup" /></a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { PlusOutlined } from '@ant-design/icons-vue';
import { defenseApi } from '../api/defense';
import dayjs from 'dayjs';
export default {
  name: 'DefenseManagement',
  components: { PlusOutlined },
  data() {
    return {
      loading: false, dataSource: [], pagination: { current: 1, pageSize: 10, total: 0 },
      modalVisible: false, editingId: null,
      form: { studentNo: '', studentName: '', thesisTitle: '', teacher: '', defenseRoom: '', defenseTime: null, defenseGroup: '' },
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo' },
        { title: '学生姓名', dataIndex: 'studentName', key: 'studentName' },
        { title: '论文题目', dataIndex: 'thesisTitle', key: 'thesisTitle', ellipsis: true },
        { title: '答辩教室', dataIndex: 'defenseRoom', key: 'defenseRoom' },
        { title: '答辩时间', dataIndex: 'defenseTime', key: 'defenseTime', width: 180 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '操作', key: 'action', width: 150 }
      ]
    };
  },
  mounted() { this.loadData(); },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const res = await defenseApi.getAll(this.pagination.current - 1, this.pagination.pageSize);
        if (res.data.success) { this.dataSource = res.data.data.content || []; this.pagination.total = res.data.data.totalElements || 0; }
      } catch (error) { this.$message.error('加载失败'); }
      finally { this.loading = false; }
    },
    handleTableChange(pagination) { this.pagination.current = pagination.current; this.loadData(); },
    showAddModal() { this.editingId = null; this.form = { studentNo: '', studentName: '', thesisTitle: '', teacher: '', defenseRoom: '', defenseTime: null, defenseGroup: '' }; this.modalVisible = true; },
    handleEdit(record) {
      this.editingId = record.id;
      this.form = { ...record, defenseTime: record.defenseTime ? dayjs(record.defenseTime) : null };
      this.modalVisible = true;
    },
    async handleSubmit() {
      try {
        const data = { ...this.form, defenseTime: this.form.defenseTime ? this.form.defenseTime.format('YYYY-MM-DD HH:mm:ss') : null };
        if (this.editingId) { await defenseApi.update(this.editingId, data); this.$message.success('更新成功'); }
        else { await defenseApi.add(data); this.$message.success('添加成功'); }
        this.modalVisible = false; this.loadData();
      } catch (error) { this.$message.error('操作失败'); }
    },
    async handleDelete(id) {
      try { await defenseApi.delete(id); this.$message.success('删除成功'); this.loadData(); }
      catch (error) { this.$message.error('删除失败'); }
    }
  }
};
</script>
