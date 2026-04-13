<template>
  <div class="academic-warning">
    <a-card>
      <!-- 统计卡片 -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <ExclamationCircleOutlined style="color: #ff4d4f" />
              <span style="margin-left: 8px">待处理预警</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #ff4d4f; margin: 0">
              {{ pendingCount }}
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <WarningOutlined style="color: #fa8c16" />
              <span style="margin-left: 8px">高级预警</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #fa8c16; margin: 0">
              {{ highLevelCount }}
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <UserOutlined style="color: #1890ff" />
              <span style="margin-left: 8px">预警学生数</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #1890ff; margin: 0">
              {{ warnedStudentCount }}
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <CheckCircleOutlined style="color: #52c41a" />
              <span style="margin-left: 8px">已处理</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #52c41a; margin: 0">
              {{ processedCount }}
            </p>
          </a-card>
        </a-col>
      </a-row>

      <!-- 头部操作区 -->
      <div class="table-header">
        <a-space>
          <a-select 
            v-model:value="filterWarningType" 
            placeholder="预警类型" 
            style="width: 150px"
            @change="handleFilterChange"
          >
            <a-select-option value="CREDIT">学分不足</a-select-option>
            <a-select-option value="GRADE">挂科预警</a-select-option>
            <a-select-option value="ATTENDANCE">出勤率预警</a-select-option>
          </a-select>
          <a-select 
            v-model:value="filterWarningLevel" 
            placeholder="预警等级" 
            style="width: 120px"
            @change="handleFilterChange"
          >
            <a-select-option value="LOW">低</a-select-option>
            <a-select-option value="MEDIUM">中</a-select-option>
            <a-select-option value="HIGH">高</a-select-option>
            <a-select-option value="URGENT">紧急</a-select-option>
          </a-select>
          <a-select 
            v-model:value="filterStatus" 
            placeholder="处理状态" 
            style="width: 120px"
            @change="handleFilterChange"
          >
            <a-select-option value="PENDING">待处理</a-select-option>
            <a-select-option value="PROCESSED">已处理</a-select-option>
            <a-select-option value="IGNORED">已忽略</a-select-option>
          </a-select>
          <a-button type="primary" @click="showAddModal">
            <PlusOutlined /> 新增预警
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
          <template v-if="column.key === 'warningType'">
            <a-tag :color="getWarningTypeColor(record.warningType)">
              {{ getWarningTypeText(record.warningType) }}
            </a-tag>
          </template>
          
          <template v-if="column.key === 'warningLevel'">
            <a-badge 
              :status="getWarningLevelStatus(record.warningLevel)"
              :text="getWarningLevelText(record.warningLevel)"
            />
          </template>
          
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ getStatusText(record.status) }}
            </a-tag>
          </template>
          
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button 
                type="link" 
                size="small" 
                @click="showDetailModal(record)"
              >
                查看详情
              </a-button>
              <a-button 
                v-if="record.status === 'PENDING'"
                type="link" 
                size="small"
                @click="showProcessModal(record)"
              >
                处理
              </a-button>
              <a-popconfirm
                title="确定删除该预警记录吗？"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 添加预警对话框 -->
    <a-modal
      v-model:open="modalVisible"
      title="新增预警"
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
        <a-form-item label="学生姓名" name="studentName">
          <a-input v-model:value="form.studentName" placeholder="请输入学生姓名" />
        </a-form-item>
        
        <a-form-item label="学号" name="studentNo">
          <a-input v-model:value="form.studentNo" placeholder="请输入学号" />
        </a-form-item>
        
        <a-form-item label="预警类型" name="warningType">
          <a-select v-model:value="form.warningType" placeholder="请选择预警类型">
            <a-select-option value="CREDIT">学分不足</a-select-option>
            <a-select-option value="GRADE">挂科预警</a-select-option>
            <a-select-option value="ATTENDANCE">出勤率预警</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="预警等级" name="warningLevel">
          <a-select v-model:value="form.warningLevel" placeholder="请选择预警等级">
            <a-select-option value="LOW">低</a-select-option>
            <a-select-option value="MEDIUM">中</a-select-option>
            <a-select-option value="HIGH">高</a-select-option>
            <a-select-option value="URGENT">紧急</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="预警标题" name="title">
          <a-input v-model:value="form.title" placeholder="请输入预警标题" />
        </a-form-item>
        
        <a-form-item label="预警内容" name="content">
          <a-textarea 
            v-model:value="form.content" 
            :rows="4" 
            placeholder="请输入预警内容" 
            :maxlength="500"
            show-count
          />
        </a-form-item>
        
        <a-form-item label="学期" name="semester">
          <a-input v-model:value="form.semester" placeholder="如：2025-2026-1" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 处理预警对话框 -->
    <a-modal
      v-model:open="processModalVisible"
      title="处理预警"
      @ok="handleProcessSubmit"
      @cancel="processModalVisible = false"
      width="600px"
    >
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="处理结果">
          <a-radio-group v-model:value="processForm.status">
            <a-radio value="PROCESSED">已处理</a-radio>
            <a-radio value="IGNORED">已忽略</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item label="处理备注">
          <a-textarea v-model:value="processForm.handleRemark" :rows="4" placeholder="请输入处理备注" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 查看详情对话框 -->
    <a-modal
      v-model:open="detailVisible"
      title="预警详情"
      :footer="null"
      width="600px"
    >
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="学生姓名">{{ currentRecord.studentName }}</a-descriptions-item>
        <a-descriptions-item label="学号">{{ currentRecord.studentNo }}</a-descriptions-item>
        <a-descriptions-item label="预警类型">
          <a-tag :color="getWarningTypeColor(currentRecord.warningType)">
            {{ getWarningTypeText(currentRecord.warningType) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="预警等级">
          <a-badge 
            :status="getWarningLevelStatus(currentRecord.warningLevel)"
            :text="getWarningLevelText(currentRecord.warningLevel)"
          />
        </a-descriptions-item>
        <a-descriptions-item label="预警标题" :span="2">{{ currentRecord.title }}</a-descriptions-item>
        <a-descriptions-item label="预警内容" :span="2">{{ currentRecord.content }}</a-descriptions-item>
        <a-descriptions-item label="处理状态">
          <a-tag :color="getStatusColor(currentRecord.status)">
            {{ getStatusText(currentRecord.status) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="学期">{{ currentRecord.semester }}</a-descriptions-item>
        <a-descriptions-item label="创建时间" :span="2">{{ currentRecord.createTime }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { warningApi } from '../api/warning';
import { 
  ExclamationCircleOutlined, 
  WarningOutlined, 
  UserOutlined, 
  CheckCircleOutlined,
  PlusOutlined 
} from '@ant-design/icons-vue';

export default {
  name: 'AcademicWarning',
  components: {
    ExclamationCircleOutlined,
    WarningOutlined,
    UserOutlined,
    CheckCircleOutlined,
    PlusOutlined
  },
  data() {
    return {
      loading: false,
      submitLoading: false,
      tableData: [],
      pendingCount: 0,
      highLevelCount: 0,
      warnedStudentCount: 0,
      processedCount: 0,
      filterWarningType: undefined,
      filterWarningLevel: undefined,
      filterStatus: undefined,
      modalVisible: false,
      processModalVisible: false,
      detailVisible: false,
      currentRecord: {},
      formRef: null,
      form: {
        studentId: 1,
        studentName: '',
        studentNo: '',
        warningType: 'CREDIT',
        warningLevel: 'MEDIUM',
        title: '',
        content: '',
        semester: '2025-2026-1',
        status: 'PENDING'
      },
      processForm: {
        status: 'PROCESSED',
        handleRemark: ''
      },
      // 表单验证规则
      formRules: {
        studentName: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '学生姓名长度在 2-20 个字符之间', trigger: 'blur' }
        ],
        studentNo: [
          { required: true, message: '请输入学号', trigger: 'blur' },
          { pattern: /^\d{8,12}$/, message: '学号格式不正确（8-12位数字）', trigger: 'blur' }
        ],
        warningType: [
          { required: true, message: '请选择预警类型', trigger: 'change' }
        ],
        warningLevel: [
          { required: true, message: '请选择预警等级', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入预警标题', trigger: 'blur' },
          { min: 5, max: 100, message: '标题长度在 5-100 个字符之间', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入预警内容', trigger: 'blur' },
          { min: 10, max: 500, message: '内容长度在 10-500 个字符之间', trigger: 'blur' }
        ],
        semester: [
          { required: true, message: '请输入学期', trigger: 'blur' },
          { pattern: /^\d{4}-\d{4}-\d$/, message: '学期格式不正确，如：2025-2026-1', trigger: 'blur' }
        ]
      },
      columns: [
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo', width: 120 },
        { title: '学生姓名', dataIndex: 'studentName', key: 'studentName', width: 100 },
        { title: '预警类型', dataIndex: 'warningType', key: 'warningType', width: 100 },
        { title: '预警等级', dataIndex: 'warningLevel', key: 'warningLevel', width: 100 },
        { title: '预警标题', dataIndex: 'title', key: 'title' },
        { title: '学期', dataIndex: 'semester', key: 'semester', width: 120 },
        { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
        { title: '操作', key: 'action', width: 180, fixed: 'right' }
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
    this.loadStatistics();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const response = await warningApi.getAll();
        let data = response.data || [];
        
        if (this.filterWarningType) {
          data = data.filter(item => item.warningType === this.filterWarningType);
        }
        if (this.filterWarningLevel) {
          data = data.filter(item => item.warningLevel === this.filterWarningLevel);
        }
        if (this.filterStatus) {
          data = data.filter(item => item.status === this.filterStatus);
        }
        
        this.tableData = data;
        this.pagination.total = data.length;
      } catch (error) {
        console.error('加载预警数据失败:', error);
        const errorMsg = error.response?.data?.message || '加载数据失败，请检查网络连接';
        this.$message.error(errorMsg);
        this.tableData = [];
        this.pagination.total = 0;
      } finally {
        this.loading = false;
      }
    },
    
    async loadStatistics() {
      try {
        const [pendingRes, processedRes] = await Promise.all([
          warningApi.getByStatus('PENDING'),
          warningApi.getByStatus('PROCESSED')
        ]);
        this.pendingCount = pendingRes.data?.length || 0;
        this.processedCount = processedRes.data?.length || 0;
        
        const highRes = await warningApi.getByWarningLevel('HIGH');
        this.highLevelCount = highRes.data?.length || 0;
        
        const uniqueStudents = new Set(this.tableData.map(item => item.studentId));
        this.warnedStudentCount = uniqueStudents.size;
      } catch (error) {
        console.error('加载统计数据失败:', error);
      }
    },
    
    handleFilterChange() {
      this.loadData();
      this.loadStatistics();
    },
    
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
    },
    
    showAddModal() {
      this.form = {
        studentId: 1,
        studentName: '',
        studentNo: '',
        warningType: 'CREDIT',
        warningLevel: 'MEDIUM',
        title: '',
        content: '',
        semester: '2025-2026-1',
        status: 'PENDING'
      };
      this.modalVisible = true;
    },
    
    showDetailModal(record) {
      this.currentRecord = { ...record };
      this.detailVisible = true;
    },
    
    showProcessModal(record) {
      this.currentRecord = { ...record };
      this.processForm = {
        status: 'PROCESSED',
        handleRemark: ''
      };
      this.processModalVisible = true;
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
        await warningApi.add(this.form);
        this.$message.success('预警创建成功！');
        this.modalVisible = false;
        this.loadData();
        this.loadStatistics();
      } catch (error) {
        console.error('提交失败:', error);
        const errorMsg = error.response?.data?.message || '提交失败，请稍后重试';
        this.$message.error(errorMsg);
      } finally {
        this.submitLoading = false;
      }
    },
    
    async handleProcessSubmit() {
      try {
        const updateData = {
          ...this.currentRecord,
          status: this.processForm.status,
          handleRemark: this.processForm.handleRemark,
          handlerName: '管理员',
          handleTime: new Date().toISOString()
        };
        await warningApi.update(this.currentRecord.id, updateData);
        this.$message.success('处理成功！');
        this.processModalVisible = false;
        this.loadData();
        this.loadStatistics();
      } catch (error) {
        console.error('处理失败:', error);
        const errorMsg = error.response?.data?.message || '处理失败，请稍后重试';
        this.$message.error(errorMsg);
      }
    },
    
    handleCancel() {
      this.modalVisible = false;
    },
    
    async handleDelete(id) {
      try {
        await warningApi.delete(id);
        this.$message.success('删除成功！');
        this.loadData();
        this.loadStatistics();
      } catch (error) {
        console.error('删除失败:', error);
        const errorMsg = error.response?.data?.message || '删除失败，请稍后重试';
        this.$message.error(errorMsg);
      }
    },
    
    getWarningTypeText(type) {
      const map = {
        'CREDIT': '学分不足',
        'GRADE': '挂科预警',
        'ATTENDANCE': '出勤率预警'
      };
      return map[type] || type;
    },
    
    getWarningTypeColor(type) {
      const map = {
        'CREDIT': 'blue',
        'GRADE': 'red',
        'ATTENDANCE': 'orange'
      };
      return map[type] || 'default';
    },
    
    getWarningLevelText(level) {
      const map = {
        'LOW': '低',
        'MEDIUM': '中',
        'HIGH': '高',
        'URGENT': '紧急'
      };
      return map[level] || level;
    },
    
    getWarningLevelStatus(level) {
      const map = {
        'LOW': 'success',
        'MEDIUM': 'processing',
        'HIGH': 'warning',
        'URGENT': 'error'
      };
      return map[level] || 'default';
    },
    
    getStatusText(status) {
      const map = {
        'PENDING': '待处理',
        'PROCESSED': '已处理',
        'IGNORED': '已忽略'
      };
      return map[status] || status;
    },
    
    getStatusColor(status) {
      const map = {
        'PENDING': 'orange',
        'PROCESSED': 'green',
        'IGNORED': 'default'
      };
      return map[status] || 'default';
    }
  }
};
</script>

<style scoped>
.academic-warning {
  padding: 0;
}

.table-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
