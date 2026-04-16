<!-- src/components/GradeEntry.vue -->
<template>
  <div class="grade-entry">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">成绩录入</h2>
        <p class="page-desc">教师可以批量录入或单个录入学生成绩</p>
      </div>

      <!-- 筛选条件 -->
      <a-form layout="inline" class="filter-form">
        <a-form-item label="学期">
          <a-select v-model:value="filters.semester" placeholder="请选择学期" style="width: 180px">
            <a-select-option value="2024-2025学年第一学期">2024-2025学年第一学期</a-select-option>
            <a-select-option value="2024-2025学年第二学期">2024-2025学年第二学期</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="课程">
          <a-select v-model:value="filters.courseId" placeholder="请选择课程" style="width: 200px">
            <a-select-option value="1">Java程序设计</a-select-option>
            <a-select-option value="2">数据结构</a-select-option>
            <a-select-option value="3">数据库原理</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="班级">
          <a-select v-model:value="filters.classId" placeholder="请选择班级" style="width: 150px">
            <a-select-option value="1">计科2401班</a-select-option>
            <a-select-option value="2">计科2402班</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <a-button type="primary" @click="showBatchEntryModal">
          <template #icon><PlusOutlined /></template>
          批量录入
        </a-button>
        <a-button style="margin-left: 8px" @click="handleImport">
          <template #icon><UploadOutlined /></template>
          导入成绩
        </a-button>
        <a-button style="margin-left: 8px" @click="handleSave">
          <template #icon><SaveOutlined /></template>
          保存成绩
        </a-button>
      </div>

      <!-- 成绩录入表格 -->
      <a-table
        :columns="columns"
        :data-source="gradeList"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'grade'">
            <a-input-number
              v-model:value="record.grade"
              :min="0"
              :max="100"
              :precision="1"
              style="width: 100px"
              placeholder="请输入成绩"
            />
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm title="确定删除？" @confirm="handleDelete(record.id)">
                <a-button type="link" danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 批量录入模态框 -->
    <a-modal
      v-model:open="batchModalVisible"
      title="批量录入成绩"
      width="800px"
      :confirm-loading="submitLoading"
      @ok="handleBatchSubmit"
      @cancel="handleBatchCancel"
    >
      <a-alert
        message="提示"
        description="请在下方表格中填写学生成绩，成绩范围为0-100分，支持一位小数"
        type="info"
        show-icon
        style="margin-bottom: 16px"
      />
      <a-table
        :columns="batchColumns"
        :data-source="batchGradeList"
        :pagination="false"
        row-key="studentId"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'grade'">
            <a-input-number
              v-model:value="record.grade"
              :min="0"
              :max="100"
              :precision="1"
              style="width: 100%"
              placeholder="成绩"
            />
          </template>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { PlusOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons-vue';
import gradeApi from '../api/grade';
import eventBus from '../utils/eventBus';

export default {
  name: 'GradeEntry',
  components: {
    PlusOutlined,
    UploadOutlined,
    SaveOutlined
  },
  data() {
    return {
      filters: {
        semester: '',
        courseId: undefined,
        classId: undefined
      },
      columns: [
        { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo', width: 120 },
        { title: '姓名', dataIndex: 'studentName', key: 'studentName', width: 100 },
        { title: '班级', dataIndex: 'className', key: 'className', width: 120 },
        { title: '课程名称', dataIndex: 'courseName', key: 'courseName', width: 150 },
        { title: '平时成绩', dataIndex: 'usualGrade', key: 'usualGrade', width: 100 },
        { title: '期末成绩', dataIndex: 'finalGrade', key: 'finalGrade', width: 100 },
        { title: '总评成绩', key: 'grade', width: 150 },
        { title: '状态', key: 'status', width: 100, align: 'center' },
        { title: '操作', key: 'action', width: 150, align: 'center', fixed: 'right' }
      ],
      gradeList: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
      },
      batchModalVisible: false,
      submitLoading: false,
      batchColumns: [
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo', width: 120 },
        { title: '姓名', dataIndex: 'studentName', key: 'studentName', width: 100 },
        { title: '总评成绩', key: 'grade', width: 150 }
      ],
      batchGradeList: []
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current - 1,
          size: this.pagination.pageSize,
          semester: this.filters.semester || undefined,
          status: 'draft'
        };
        const res = await gradeApi.getAll(params.page, params.size);
        if (res.data.success) {
          // Spring Data Page 对象结构: { content: [...], totalElements: 100, ... }
          const pageData = res.data.data;
          const content = Array.isArray(pageData) ? pageData : (pageData.content || []);
          const total = pageData.totalElements || 0;
          
          this.gradeList = content.map((item, index) => ({
            ...item,
            index: (this.pagination.current - 1) * this.pagination.pageSize + index + 1
          }));
          this.pagination.total = total;
        }
      } catch (error) {
        console.error('加载成绩数据失败:', error);
        this.$message.error('加载成绩数据失败');
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadData();
    },
    handleReset() {
      this.filters = { semester: '', courseId: undefined, classId: undefined };
      this.pagination.current = 1;
      this.loadData();
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadData();
    },
    showBatchEntryModal() {
      this.batchGradeList = [
        { studentId: 1, studentNo: '2024001', studentName: '张三', grade: undefined },
        { studentId: 2, studentNo: '2024002', studentName: '李四', grade: undefined },
        { studentId: 3, studentNo: '2024003', studentName: '王五', grade: undefined }
      ];
      this.batchModalVisible = true;
    },
    async handleBatchSubmit() {
      this.submitLoading = true;
      try {
        const grades = this.batchGradeList.map(item => ({
          studentNo: item.studentNo,
          grade: item.grade
        }));
        const res = await gradeApi.batchAdd(grades);
        if (res.data.success) {
          this.$message.success(res.data.message || '批量录入成功！');
          this.batchModalVisible = false;
          this.loadData();
          
          // 通知 Dashboard 数据已变化
          eventBus.emit('data-changed', { module: 'grade', action: 'add' });
        } else {
          this.$message.error(res.data.message || '批量录入失败');
        }
      } catch (error) {
        console.error('批量录入失败:', error);
        this.$message.error('批量录入失败');
      } finally {
        this.submitLoading = false;
      }
    },
    handleBatchCancel() {
      this.batchModalVisible = false;
    },
    handleImport() {
      this.$message.info('导入成绩功能 - 请上传Excel文件');
    },
    handleSave() {
      this.$message.success('成绩保存成功！');
    },
    handleEdit(record) {
      this.$message.info(`编辑 ${record.studentName} 的成绩`);
    },
    async handleDelete(id) {
      try {
        const res = await gradeApi.delete(id);
        if (res.data.success) {
          this.$message.success(res.data.message || '删除成功');
          this.loadData();
        } else {
          this.$message.error(res.data.message || '删除失败');
        }
      } catch (error) {
        console.error('删除失败:', error);
        this.$message.error('删除失败');
      }
    },
    getStatusText(status) {
      const map = {
        'draft': '草稿',
        'submitted': '已提交',
        'audited': '已审核'
      };
      return map[status] || status;
    },
    getStatusColor(status) {
      const map = {
        'draft': 'default',
        'submitted': 'blue',
        'audited': 'green'
      };
      return map[status] || 'default';
    }
  }
};
</script>

<style scoped>
.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.page-desc {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

.filter-form {
  margin-bottom: 16px;
}

.action-bar {
  margin-bottom: 16px;
}
</style>
