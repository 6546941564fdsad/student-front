<template>
  <div class="teacher-evaluation">
    <a-card>
      <!-- 统计卡片 -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <TeamOutlined style="color: #1890ff" />
              <span style="margin-left: 8px">总评价数</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #1890ff; margin: 0">
              {{ statistics.totalCount || 0 }}
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <UserOutlined style="color: #52c41a" />
              <span style="margin-left: 8px">学生评教</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #52c41a; margin: 0">
              {{ statistics.studentCount || 0 }}
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <TeamOutlined style="color: #fa8c16" />
              <span style="margin-left: 8px">同行互评</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #fa8c16; margin: 0">
              {{ statistics.peerCount || 0 }}
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <StarOutlined style="color: #722ed1" />
              <span style="margin-left: 8px">平均评分</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #722ed1; margin: 0">
              {{ statistics.avgScore || 0 }}
            </p>
          </a-card>
        </a-col>
      </a-row>

      <!-- 搜索和筛选 -->
      <a-row :gutter="16" style="margin-bottom: 16px">
        <a-col :span="6">
          <a-select v-model:value="filterEvalType" placeholder="评价类型" allow-clear style="width: 100%" @change="handleFilter">
            <a-select-option value="STUDENT">学生评教</a-select-option>
            <a-select-option value="PEER">同行互评</a-select-option>
            <a-select-option value="SUPERVISOR">督导评价</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="6">
          <a-input v-model:value="filterSemester" placeholder="评价学期" allow-clear @pressEnter="handleFilter" />
        </a-col>
        <a-col :span="12" style="text-align: right">
          <a-button type="primary" @click="handleFilter">
            <template #icon><SearchOutlined /></template>
            查询
          </a-button>
          <a-button style="margin-left: 8px" @click="handleReset">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
          <a-button type="primary" style="margin-left: 8px" @click="showAddModal">
            <template #icon><PlusOutlined /></template>
            添加评价
          </a-button>
        </a-col>
      </a-row>

      <!-- 评价列表表格 -->
      <a-table
        :columns="columns"
        :data-source="evaluationList"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
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
          <template v-if="column.key === 'isAnonymous'">
            <a-tag :color="record.isAnonymous ? 'blue' : 'default'">
              {{ record.isAnonymous ? '匿名' : '实名' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showDetail(record)">详情</a-button>
              <a-popconfirm
                title="确定要删除这条评价记录吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 添加评价模态框 -->
    <a-modal
      v-model:open="modalVisible"
      title="添加教师评价"
      width="700px"
      :confirm-loading="submitLoading"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form 
        ref="formRef"
        :model="form" 
        :rules="formRules"
        :label-col="{ span: 6 }" 
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="评价类型" name="evalType">
          <a-select v-model:value="form.evalType" placeholder="请选择评价类型">
            <a-select-option value="STUDENT">学生评教</a-select-option>
            <a-select-option value="PEER">同行互评</a-select-option>
            <a-select-option value="SUPERVISOR">督导评价</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="教师ID" name="teacherId">
          <a-input-number v-model:value="form.teacherId" :min="1" placeholder="请输入教师ID" style="width: 100%" />
        </a-form-item>

        <a-form-item label="教师姓名" name="teacherName">
          <a-input v-model:value="form.teacherName" placeholder="请输入教师姓名" />
        </a-form-item>

        <a-form-item label="课程ID" name="courseId">
          <a-input-number v-model:value="form.courseId" :min="1" placeholder="请输入课程ID" style="width: 100%" />
        </a-form-item>

        <a-form-item label="课程名称" name="courseName">
          <a-input v-model:value="form.courseName" placeholder="请输入课程名称" />
        </a-form-item>

        <a-form-item label="评价人ID" name="evaluatorId">
          <a-input-number v-model:value="form.evaluatorId" :min="1" placeholder="请输入评价人ID" style="width: 100%" />
        </a-form-item>

        <a-form-item label="评价人姓名" name="evaluatorName">
          <a-input v-model:value="form.evaluatorName" placeholder="请输入评价人姓名" />
        </a-form-item>

        <a-form-item label="评价人角色" name="evaluatorRole">
          <a-select v-model:value="form.evaluatorRole" placeholder="请选择评价人角色">
            <a-select-option value="STUDENT">学生</a-select-option>
            <a-select-option value="TEACHER">教师</a-select-option>
            <a-select-option value="SUPERVISOR">督导</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="评分" name="score">
          <a-slider v-model:value="form.score" :min="1" :max="5" :step="0.5" :marks="{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5' }" />
          <div style="text-align: center; margin-top: 8px">
            <a-tag color="blue">{{ form.score }} 分</a-tag>
          </div>
        </a-form-item>

        <a-form-item label="评价内容" name="content">
          <a-textarea 
            v-model:value="form.content" 
            placeholder="请输入评价内容（可选）" 
            :rows="4" 
            :maxlength="1000"
            show-count
          />
        </a-form-item>

        <a-form-item label="评价学期" name="semester">
          <a-input v-model:value="form.semester" placeholder="格式：2025-2026-1" />
        </a-form-item>

        <a-form-item label="是否匿名" name="isAnonymous">
          <a-switch v-model:checked="form.isAnonymous" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 详情模态框 -->
    <a-modal
      v-model:open="detailVisible"
      title="评价详情"
      width="600px"
      :footer="null"
    >
      <a-descriptions bordered :column="2" v-if="currentEvaluation">
        <a-descriptions-item label="评价类型">
          <a-tag :color="getEvalTypeColor(currentEvaluation.evalType)">
            {{ getEvalTypeText(currentEvaluation.evalType) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="评分">
          <a-rate :value="currentEvaluation.score" disabled allow-half />
          {{ currentEvaluation.score }} 分
        </a-descriptions-item>
        <a-descriptions-item label="教师姓名">{{ currentEvaluation.teacherName }}</a-descriptions-item>
        <a-descriptions-item label="课程名称">{{ currentEvaluation.courseName }}</a-descriptions-item>
        <a-descriptions-item label="评价人">{{ currentEvaluation.evaluatorName }}</a-descriptions-item>
        <a-descriptions-item label="评价人角色">{{ getEvaluatorRoleText(currentEvaluation.evaluatorRole) }}</a-descriptions-item>
        <a-descriptions-item label="是否匿名">
          <a-tag :color="currentEvaluation.isAnonymous ? 'blue' : 'default'">
            {{ currentEvaluation.isAnonymous ? '匿名' : '实名' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="评价学期">{{ currentEvaluation.semester }}</a-descriptions-item>
        <a-descriptions-item label="评价内容" :span="2">{{ currentEvaluation.content || '无' }}</a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="2">{{ formatTime(currentEvaluation.createTime) }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { teacherEvaluationApi } from '../api/teacherEvaluation';
import { 
  TeamOutlined, 
  UserOutlined, 
  StarOutlined,
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'TeacherEvaluation',
  components: {
    TeamOutlined,
    UserOutlined,
    StarOutlined,
    SearchOutlined,
    ReloadOutlined,
    PlusOutlined
  },
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      loading: false,
      submitLoading: false,
      evaluationList: [],
      statistics: {},
      modalVisible: false,
      detailVisible: false,
      currentEvaluation: null,
      formRef: null,
      filterEvalType: undefined,
      filterSemester: '',
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
      },
      form: {
        evalType: undefined,
        teacherId: undefined,
        teacherName: '',
        courseId: undefined,
        courseName: '',
        evaluatorId: undefined,
        evaluatorName: '',
        evaluatorRole: undefined,
        score: 3.0,
        content: '',
        semester: '',
        isAnonymous: false
      },
      formRules: {
        evalType: [
          { required: true, message: '请选择评价类型', trigger: 'change' }
        ],
        teacherId: [
          { required: true, message: '请输入教师ID', trigger: 'blur' }
        ],
        teacherName: [
          { required: true, message: '请输入教师姓名', trigger: 'blur' },
          { min: 2, max: 50, message: '教师姓名长度在 2-50 个字符之间', trigger: 'blur' }
        ],
        courseId: [
          { required: true, message: '请输入课程ID', trigger: 'blur' }
        ],
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' }
        ],
        evaluatorId: [
          { required: true, message: '请输入评价人ID', trigger: 'blur' }
        ],
        evaluatorName: [
          { required: true, message: '请输入评价人姓名', trigger: 'blur' },
          { min: 2, max: 50, message: '评价人姓名长度在 2-50 个字符之间', trigger: 'blur' }
        ],
        evaluatorRole: [
          { required: true, message: '请选择评价人角色', trigger: 'change' }
        ],
        score: [
          { required: true, message: '请进行评分', trigger: 'change' }
        ],
        semester: [
          { required: true, message: '请输入评价学期', trigger: 'blur' },
          { pattern: /^\d{4}-\d{4}-\d$/, message: '学期格式不正确，如：2025-2026-1', trigger: 'blur' }
        ]
      },
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '评价类型', dataIndex: 'evalType', key: 'evalType', width: 120 },
        { title: '教师姓名', dataIndex: 'teacherName', key: 'teacherName', width: 120 },
        { title: '课程名称', dataIndex: 'courseName', key: 'courseName', width: 150 },
        { title: '评价人', dataIndex: 'evaluatorName', key: 'evaluatorName', width: 120 },
        { title: '评分', dataIndex: 'score', key: 'score', width: 180 },
        { title: '是否匿名', dataIndex: 'isAnonymous', key: 'isAnonymous', width: 100 },
        { title: '评价学期', dataIndex: 'semester', key: 'semester', width: 120 },
        { title: '操作', key: 'action', fixed: 'right', width: 150 }
      ]
    };
  },
  mounted() {
    this.loadData();
    this.loadStatistics();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current - 1,
          size: this.pagination.pageSize
        };
        
        let response;
        if (this.filterEvalType) {
          response = await teacherEvaluationApi.getByType(this.filterEvalType, params.page, params.size);
        } else if (this.filterSemester) {
          response = await teacherEvaluationApi.getBySemester(this.filterSemester, params.page, params.size);
        } else {
          response = await teacherEvaluationApi.getAll(params.page, params.size);
        }
        
        this.evaluationList = response.data.content;
        this.pagination.total = response.data.totalElements;
      } catch (error) {
        console.error('加载数据失败:', error);
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
    },

    async loadStatistics() {
      try {
        const response = await teacherEvaluationApi.getStatistics();
        this.statistics = response.data;
      } catch (error) {
        console.error('加载统计数据失败:', error);
      }
    },

    handleFilter() {
      this.pagination.current = 1;
      this.loadData();
    },

    handleReset() {
      this.filterEvalType = undefined;
      this.filterSemester = '';
      this.pagination.current = 1;
      this.loadData();
    },

    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadData();
    },

    showAddModal() {
      this.modalVisible = true;
      this.resetForm();
    },

    showDetail(record) {
      this.currentEvaluation = record;
      this.detailVisible = true;
    },

    resetForm() {
      this.form = {
        evalType: undefined,
        teacherId: undefined,
        teacherName: '',
        courseId: undefined,
        courseName: '',
        evaluatorId: undefined,
        evaluatorName: '',
        evaluatorRole: undefined,
        score: 3.0,
        content: '',
        semester: '',
        isAnonymous: false
      };
      if (this.$refs.formRef) {
        this.$refs.formRef.clearValidate();
      }
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
        await teacherEvaluationApi.add(this.form);
        this.$message.success('评价提交成功！');
        this.modalVisible = false;
        this.loadData();
        this.loadStatistics();
      } catch (error) {
        const errorMsg = error.response?.data?.message || '提交失败，请稍后重试';
        this.$message.error(errorMsg);
      } finally {
        this.submitLoading = false;
      }
    },

    handleCancel() {
      this.modalVisible = false;
      this.resetForm();
    },

    async handleDelete(id) {
      try {
        await teacherEvaluationApi.delete(id);
        this.$message.success('删除成功');
        this.loadData();
        this.loadStatistics();
      } catch (error) {
        console.error('删除失败:', error);
        this.$message.error('删除失败');
      }
    },

    getEvalTypeText(type) {
      const map = {
        'STUDENT': '学生评教',
        'PEER': '同行互评',
        'SUPERVISOR': '督导评价'
      };
      return map[type] || type;
    },

    getEvalTypeColor(type) {
      const map = {
        'STUDENT': 'green',
        'PEER': 'orange',
        'SUPERVISOR': 'purple'
      };
      return map[type] || 'default';
    },

    getEvaluatorRoleText(role) {
      const map = {
        'STUDENT': '学生',
        'TEACHER': '教师',
        'SUPERVISOR': '督导'
      };
      return map[role] || role;
    },

    formatTime(time) {
      if (!time) return '-';
      return new Date(time).toLocaleString('zh-CN');
    }
  }
};
</script>

<style scoped>
.teacher-evaluation {
  padding: 0;
}
</style>
