<template>
  <div class="thesis-grade">
    <a-card title="论文成绩" :bordered="false">
      <template #extra>
        <a-button type="primary" @click="showAddModal"><PlusOutlined /> 评定成绩</a-button>
      </template>
      <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading" row-key="id" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'gradeLevel'">
            <a-tag :color="getGradeColor(record.gradeLevel)">{{ record.gradeLevel || '-' }}</a-tag>
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
    <a-modal v-model:open="modalVisible" title="评定成绩" width="600px" @ok="handleSubmit">
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="学号" required><a-input v-model:value="form.studentNo" /></a-form-item>
        <a-form-item label="学生姓名"><a-input v-model:value="form.studentName" /></a-form-item>
        <a-form-item label="论文题目"><a-input v-model:value="form.thesisTitle" /></a-form-item>
        <a-form-item label="指导教师"><a-input v-model:value="form.teacher" /></a-form-item>
        <a-form-item label="指导评分"><a-input-number v-model:value="form.teacherScore" :min="0" :max="100" style="width: 100%" /></a-form-item>
        <a-form-item label="评阅评分"><a-input-number v-model:value="form.reviewerScore" :min="0" :max="100" style="width: 100%" /></a-form-item>
        <a-form-item label="答辩评分"><a-input-number v-model:value="form.defenseScore" :min="0" :max="100" style="width: 100%" /></a-form-item>
        <a-form-item label="评语"><a-textarea v-model:value="form.comments" :rows="3" /></a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { PlusOutlined } from '@ant-design/icons-vue';
import { thesisGradeApi } from '../api/thesisGrade';
export default {
  name: 'ThesisGrade',
  components: { PlusOutlined },
  data() {
    return {
      loading: false, dataSource: [], pagination: { current: 1, pageSize: 10, total: 0 },
      modalVisible: false, editingId: null,
      form: { studentNo: '', studentName: '', thesisTitle: '', teacher: '', teacherScore: null, reviewerScore: null, defenseScore: null, comments: '' },
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo' },
        { title: '学生姓名', dataIndex: 'studentName', key: 'studentName' },
        { title: '论文题目', dataIndex: 'thesisTitle', key: 'thesisTitle', ellipsis: true },
        { title: '总成绩', dataIndex: 'finalScore', key: 'finalScore', width: 100 },
        { title: '等级', dataIndex: 'gradeLevel', key: 'gradeLevel', width: 100 },
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
        const res = await thesisGradeApi.getAll(this.pagination.current - 1, this.pagination.pageSize);
        if (res.data.success) { this.dataSource = res.data.data.content || []; this.pagination.total = res.data.data.totalElements || 0; }
      } catch (error) { this.$message.error('加载失败'); }
      finally { this.loading = false; }
    },
    handleTableChange(pagination) { this.pagination.current = pagination.current; this.loadData(); },
    showAddModal() { this.editingId = null; this.form = { studentNo: '', studentName: '', thesisTitle: '', teacher: '', teacherScore: null, reviewerScore: null, defenseScore: null, comments: '' }; this.modalVisible = true; },
    handleEdit(record) { this.editingId = record.id; this.form = { ...record }; this.modalVisible = true; },
    async handleSubmit() {
      try {
        if (this.editingId) { await thesisGradeApi.update(this.editingId, this.form); this.$message.success('更新成功'); }
        else { await thesisGradeApi.add(this.form); this.$message.success('评定成功'); }
        this.modalVisible = false; this.loadData();
      } catch (error) { this.$message.error('操作失败'); }
    },
    async handleDelete(id) {
      try { await thesisGradeApi.delete(id); this.$message.success('删除成功'); this.loadData(); }
      catch (error) { this.$message.error('删除失败'); }
    },
    getGradeColor(level) {
      const colors = { '优秀': 'green', '良好': 'blue', '中等': 'orange', '及格': 'cyan', '不及格': 'red' };
      return colors[level] || 'default';
    }
  }
};
</script>
