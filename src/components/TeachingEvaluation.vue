<template>
  <div class="teaching-evaluation">
    <a-card>
      <!-- 头部操作区 -->
      <div class="table-header">
        <a-space>
          <a-select 
            v-model:value="filterEvalType" 
            placeholder="选择评教类型" 
            style="width: 150px"
            @change="handleFilterChange"
          >
            <a-select-option value="STUDENT">学生评教</a-select-option>
            <a-select-option value="PEER">同行评教</a-select-option>
            <a-select-option value="SUPERVISOR">督导评教</a-select-option>
          </a-select>
          <a-input 
            v-model:value="searchTeacherName" 
            placeholder="搜索教师姓名"
            style="width: 200px"
            @pressEnter="handleSearch"
          >
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>
          <a-button type="primary" @click="handleSearch">
            <SearchOutlined /> 搜索
          </a-button>
          <a-button type="primary" @click="showAddModal">
            <PlusOutlined /> 添加评教
          </a-button>
        </a-space>
      </div>

      <!-- 数据表格 -->
      <a-table 
        :columns="columns" 
        :data-source="tableData" 
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'evalType'">
            <a-tag :color="getEvalTypeColor(record.evalType)">
              {{ getEvalTypeText(record.evalType) }}
            </a-tag>
          </template>
          
          <template v-if="column.key === 'score'">
            <a-rate :value="record.score" disabled allow-half />
            <span style="margin-left: 8px">{{ record.score }} 分</span>
          </template>
          
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showDetailModal(record)">
                查看详情
              </a-button>
              <a-popconfirm
                title="确定删除该评教记录吗？"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 添加/编辑评教对话框 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      @ok="handleSubmit"
      @cancel="handleCancel"
      width="600px"
      :confirm-loading="submitLoading"
    >
      <a-form 
        ref="formRef"
        :model="form" 
        :rules="formRules"
        :label-col="{ span: 6 }" 
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="评教类型" name="evalType">
          <a-select v-model:value="form.evalType" placeholder="请选择评教类型">
            <a-select-option value="STUDENT">学生评教</a-select-option>
            <a-select-option value="PEER">同行评教</a-select-option>
            <a-select-option value="SUPERVISOR">督导评教</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="教师姓名" name="teacherName">
          <a-input v-model:value="form.teacherName" placeholder="请输入教师姓名" />
        </a-form-item>
        
        <a-form-item label="课程名称" name="courseName">
          <a-input v-model:value="form.courseName" placeholder="请输入课程名称" />
        </a-form-item>
        
        <a-form-item label="评教人" name="evaluatorName">
          <a-input v-model:value="form.evaluatorName" placeholder="请输入评教人姓名" />
        </a-form-item>
        
        <a-form-item label="评分" name="score">
          <a-rate v-model:value="form.score" allow-half />
          <span style="margin-left: 8px; color: #999">{{ form.score }} 分</span>
        </a-form-item>
        
        <a-form-item label="评价内容" name="content">
          <a-textarea 
            v-model:value="form.content" 
            :rows="4" 
            placeholder="请输入评价内容（选填）" 
            :maxlength="500"
            show-count
          />
        </a-form-item>
        
        <a-form-item label="评价学期" name="semester">
          <a-input v-model:value="form.semester" placeholder="如：2025-2026-1" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 查看详情对话框 -->
    <a-modal
      v-model:open="detailVisible"
      title="评教详情"
      :footer="null"
      width="600px"
    >
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="评教类型">
          <a-tag :color="getEvalTypeColor(currentRecord.evalType)">
            {{ getEvalTypeText(currentRecord.evalType) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="教师姓名">{{ currentRecord.teacherName }}</a-descriptions-item>
        <a-descriptions-item label="课程名称">{{ currentRecord.courseName }}</a-descriptions-item>
        <a-descriptions-item label="评教人">{{ currentRecord.evaluatorName }}</a-descriptions-item>
        <a-descriptions-item label="评分" :span="2">
          <a-rate :value="currentRecord.score" disabled allow-half />
          {{ currentRecord.score }} 分
        </a-descriptions-item>
        <a-descriptions-item label="评价内容" :span="2">
          {{ currentRecord.content || '无' }}
        </a-descriptions-item>
        <a-descriptions-item label="评价学期">{{ currentRecord.semester }}</a-descriptions-item>
        <a-descriptions-item label="创建时间">{{ currentRecord.createTime }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { evaluationApi } from '../api/evaluation';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons-vue';

export default {
  name: 'TeachingEvaluation',
  components: {
    SearchOutlined,
    PlusOutlined
  },
  data() {
    return {
      loading: false,
      submitLoading: false,
      tableData: [],
      filterEvalType: undefined,
      searchTeacherName: '',
      modalVisible: false,
      detailVisible: false,
      modalTitle: '添加评教',
      currentRecord: {},
      formRef: null,
      form: {
        evalType: 'STUDENT',
        teacherId: 1,
        teacherName: '',
        courseName: '',
        evaluatorId: 1,
        evaluatorName: '',
        evaluatorRole: 'STUDENT',
        score: 5,
        content: '',
        semester: '2025-2026-1'
      },
      // 表单验证规则
      formRules: {
        evalType: [
          { required: true, message: '请选择评教类型', trigger: 'change' }
        ],
        teacherName: [
          { required: true, message: '请输入教师姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '教师姓名长度在 2-20 个字符之间', trigger: 'blur' }
        ],
        courseName: [
          { max: 100, message: '课程名称不能超过 100 个字符', trigger: 'blur' }
        ],
        evaluatorName: [
          { required: true, message: '请输入评教人姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '评教人姓名长度在 2-20 个字符之间', trigger: 'blur' }
        ],
        score: [
          { required: true, message: '请进行评分', trigger: 'change' },
          { type: 'number', min: 0.5, max: 5, message: '评分范围为 0.5-5 分', trigger: 'change' }
        ],
        content: [
          { max: 500, message: '评价内容不能超过 500 个字符', trigger: 'blur' }
        ],
        semester: [
          { required: true, message: '请输入评价学期', trigger: 'blur' },
          { pattern: /^\d{4}-\d{4}-\d$/, message: '学期格式不正确，如：2025-2026-1', trigger: 'blur' }
        ]
      },
      columns: [
        { title: '评教类型', dataIndex: 'evalType', key: 'evalType', width: 120 },
        { title: '教师姓名', dataIndex: 'teacherName', key: 'teacherName', width: 120 },
        { title: '课程名称', dataIndex: 'courseName', key: 'courseName' },
        { title: '评教人', dataIndex: 'evaluatorName', key: 'evaluatorName', width: 120 },
        { title: '评分', dataIndex: 'score', key: 'score', width: 180 },
        { title: '评价学期', dataIndex: 'semester', key: 'semester', width: 120 },
        { title: '操作', key: 'action', width: 150, fixed: 'right' }
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total) => `共 ${total} 条记录`
      }
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const response = await evaluationApi.getAll();
        let data = response.data || [];
        
        // 应用筛选
        if (this.filterEvalType) {
          data = data.filter(item => item.evalType === this.filterEvalType);
        }
        if (this.searchTeacherName) {
          data = data.filter(item => 
            item.teacherName && item.teacherName.includes(this.searchTeacherName)
          );
        }
        
        this.tableData = data;
        this.pagination.total = data.length;
      } catch (error) {
        console.error('加载评教数据失败:', error);
        const errorMsg = error.response?.data?.message || '加载数据失败，请检查网络连接';
        this.$message.error(errorMsg);
        this.tableData = [];
        this.pagination.total = 0;
      } finally {
        this.loading = false;
      }
    },
    
    handleFilterChange() {
      this.loadData();
    },
    
    handleSearch() {
      this.loadData();
    },
    
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
    },
    
    showAddModal() {
      this.modalTitle = '添加评教';
      this.form = {
        evalType: 'STUDENT',
        teacherId: 1,
        teacherName: '',
        courseName: '',
        evaluatorId: 1,
        evaluatorName: '',
        evaluatorRole: 'STUDENT',
        score: 5,
        content: '',
        semester: '2025-2026-1'
      };
      this.modalVisible = true;
    },
    
    showDetailModal(record) {
      this.currentRecord = { ...record };
      this.detailVisible = true;
    },
    
    async handleSubmit() {
      // 表单验证
      try {
        await this.$refs.formRef.validate();
      } catch (error) {
        this.$message.warning('请检查表单填写是否正确');
        return;
      }
      
      this.submitLoading = true;
      try {
        await evaluationApi.add(this.form);
        this.$message.success('评教提交成功！');
        this.modalVisible = false;
        this.loadData();
      } catch (error) {
        console.error('提交失败:', error);
        const errorMsg = error.response?.data?.message || '提交失败，请稍后重试';
        this.$message.error(errorMsg);
      } finally {
        this.submitLoading = false;
      }
    },
    
    handleCancel() {
      this.modalVisible = false;
    },
    
    async handleDelete(id) {
      try {
        await evaluationApi.delete(id);
        this.$message.success('删除成功！');
        this.loadData();
      } catch (error) {
        console.error('删除失败:', error);
        const errorMsg = error.response?.data?.message || '删除失败，请稍后重试';
        this.$message.error(errorMsg);
      }
    },
    
    getEvalTypeText(type) {
      const map = {
        'STUDENT': '学生评教',
        'PEER': '同行评教',
        'SUPERVISOR': '督导评教'
      };
      return map[type] || type;
    },
    
    getEvalTypeColor(type) {
      const map = {
        'STUDENT': 'blue',
        'PEER': 'green',
        'SUPERVISOR': 'orange'
      };
      return map[type] || 'default';
    }
  }
};
</script>

<style scoped>
.teaching-evaluation {
  padding: 0;
}

.table-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
