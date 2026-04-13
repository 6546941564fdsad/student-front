<template>
  <div class="course-change">
    <a-card>
      <!-- 统计卡片 -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <ClockCircleOutlined style="color: #1890ff" />
              <span style="margin-left: 8px">待审批</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #1890ff; margin: 0">
              {{ pendingCount }}
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <SwapOutlined style="color: #fa8c16" />
              <span style="margin-left: 8px">调课申请</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #fa8c16; margin: 0">
              {{ changeCount }}
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <StopOutlined style="color: #ff4d4f" />
              <span style="margin-left: 8px">停课申请</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #ff4d4f; margin: 0">
              {{ suspendCount }}
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <RedoOutlined style="color: #52c41a" />
              <span style="margin-left: 8px">已批准</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #52c41a; margin: 0">
              {{ approvedCount }}
            </p>
          </a-card>
        </a-col>
      </a-row>

      <!-- 头部操作区 -->
      <div class="table-header">
        <a-space>
          <a-select 
            v-model:value="filterChangeType" 
            placeholder="变更类型" 
            style="width: 130px"
            @change="handleFilterChange"
          >
            <a-select-option value="CHANGE">调课</a-select-option>
            <a-select-option value="SUSPEND">停课</a-select-option>
            <a-select-option value="MAKEUP">补课</a-select-option>
          </a-select>
          <a-select 
            v-model:value="filterStatus" 
            placeholder="审批状态" 
            style="width: 130px"
            @change="handleFilterChange"
          >
            <a-select-option value="PENDING">待审批</a-select-option>
            <a-select-option value="APPROVED">已批准</a-select-option>
            <a-select-option value="REJECTED">已拒绝</a-select-option>
          </a-select>
          <a-button type="primary" @click="showAddModal">
            <PlusOutlined /> 提交申请
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
          <template v-if="column.key === 'changeType'">
            <a-tag :color="getChangeTypeColor(record.changeType)">
              {{ getChangeTypeText(record.changeType) }}
            </a-tag>
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
                @click="showApproveModal(record)"
              >
                审批
              </a-button>
              <a-popconfirm
                title="确定删除该申请吗？"
                @confirm="handleDelete(record.id)"
              >
                <a-button type="link" danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 提交申请对话框 -->
    <a-modal
      v-model:open="modalVisible"
      title="提交调课/停课申请"
      @ok="handleSubmit"
      @cancel="handleCancel"
      width="700px"
    >
      <a-form :model="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="变更类型" required>
          <a-select v-model:value="form.changeType">
            <a-select-option value="CHANGE">调课</a-select-option>
            <a-select-option value="SUSPEND">停课</a-select-option>
            <a-select-option value="MAKEUP">补课</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="课程名称" required>
          <a-input v-model:value="form.courseName" placeholder="请输入课程名称" />
        </a-form-item>
        
        <a-form-item label="班级名称">
          <a-input v-model:value="form.className" placeholder="请输入班级名称" />
        </a-form-item>
        
        <a-form-item label="原上课日期" required>
          <a-date-picker v-model:value="form.originalDate" style="width: 100%" />
        </a-form-item>
        
        <a-form-item label="原上课时间" required>
          <a-input v-model:value="form.originalTime" placeholder="如：1-2节" />
        </a-form-item>
        
        <a-form-item label="原上课地点">
          <a-input v-model:value="form.originalLocation" placeholder="请输入原上课地点" />
        </a-form-item>
        
        <a-form-item 
          v-if="form.changeType !== 'SUSPEND'" 
          label="新上课日期" 
          required
        >
          <a-date-picker v-model:value="form.newDate" style="width: 100%" />
        </a-form-item>
        
        <a-form-item 
          v-if="form.changeType !== 'SUSPEND'" 
          label="新上课时间" 
          required
        >
          <a-input v-model:value="form.newTime" placeholder="如：3-4节" />
        </a-form-item>
        
        <a-form-item 
          v-if="form.changeType !== 'SUSPEND'" 
          label="新上课地点"
        >
          <a-input v-model:value="form.newLocation" placeholder="请输入新上课地点" />
        </a-form-item>
        
        <a-form-item label="变更原因" required>
          <a-textarea v-model:value="form.reason" :rows="4" placeholder="请详细说明变更原因" />
        </a-form-item>
        
        <a-form-item label="学期" required>
          <a-input v-model:value="form.semester" placeholder="如：2025-2026-1" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 审批对话框 -->
    <a-modal
      v-model:open="approveModalVisible"
      title="审批申请"
      @ok="handleApproveSubmit"
      @cancel="approveModalVisible = false"
      width="600px"
    >
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="审批结果" required>
          <a-radio-group v-model:value="approveForm.status">
            <a-radio value="APPROVED">批准</a-radio>
            <a-radio value="REJECTED">拒绝</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item label="审批意见">
          <a-textarea v-model:value="approveForm.approveRemark" :rows="4" placeholder="请输入审批意见" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 查看详情对话框 -->
    <a-modal
      v-model:open="detailVisible"
      title="申请详情"
      :footer="null"
      width="700px"
    >
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="变更类型">
          <a-tag :color="getChangeTypeColor(currentRecord.changeType)">
            {{ getChangeTypeText(currentRecord.changeType) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="课程名称">{{ currentRecord.courseName }}</a-descriptions-item>
        <a-descriptions-item label="班级名称">{{ currentRecord.className }}</a-descriptions-item>
        <a-descriptions-item label="申请时间">{{ currentRecord.applyTime }}</a-descriptions-item>
        <a-descriptions-item label="原上课日期">{{ currentRecord.originalDate }}</a-descriptions-item>
        <a-descriptions-item label="原上课时间">{{ currentRecord.originalTime }}</a-descriptions-item>
        <a-descriptions-item label="原上课地点">{{ currentRecord.originalLocation }}</a-descriptions-item>
        <a-descriptions-item label="审批状态">
          <a-tag :color="getStatusColor(currentRecord.status)">
            {{ getStatusText(currentRecord.status) }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="变更原因" :span="2">{{ currentRecord.reason }}</a-descriptions-item>
        <a-descriptions-item 
          v-if="currentRecord.newDate" 
          label="新上课日期"
        >
          {{ currentRecord.newDate }}
        </a-descriptions-item>
        <a-descriptions-item 
          v-if="currentRecord.newTime" 
          label="新上课时间"
        >
          {{ currentRecord.newTime }}
        </a-descriptions-item>
        <a-descriptions-item 
          v-if="currentRecord.newLocation" 
          label="新上课地点" 
          :span="2"
        >
          {{ currentRecord.newLocation }}
        </a-descriptions-item>
        <a-descriptions-item 
          v-if="currentRecord.approveRemark" 
          label="审批意见" 
          :span="2"
        >
          {{ currentRecord.approveRemark }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { courseChangeApi } from '../api/courseChange';
import { 
  ClockCircleOutlined, 
  SwapOutlined, 
  StopOutlined, 
  RedoOutlined,
  PlusOutlined 
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

export default {
  name: 'CourseChange',
  components: {
    ClockCircleOutlined,
    SwapOutlined,
    StopOutlined,
    RedoOutlined,
    PlusOutlined
  },
  data() {
    return {
      loading: false,
      tableData: [],
      pendingCount: 0,
      changeCount: 0,
      suspendCount: 0,
      approvedCount: 0,
      filterChangeType: undefined,
      filterStatus: undefined,
      modalVisible: false,
      approveModalVisible: false,
      detailVisible: false,
      currentRecord: {},
      form: {
        changeType: 'CHANGE',
        teacherId: 1,
        teacherName: '当前教师',
        courseName: '',
        className: '',
        originalDate: null,
        originalTime: '',
        originalLocation: '',
        newDate: null,
        newTime: '',
        newLocation: '',
        reason: '',
        semester: '2025-2026-1'
      },
      approveForm: {
        status: 'APPROVED',
        approveRemark: ''
      },
      columns: [
        { title: '变更类型', dataIndex: 'changeType', key: 'changeType', width: 100 },
        { title: '课程名称', dataIndex: 'courseName', key: 'courseName', width: 150 },
        { title: '班级名称', dataIndex: 'className', key: 'className', width: 120 },
        { title: '原上课日期', dataIndex: 'originalDate', key: 'originalDate', width: 120 },
        { title: '原上课时间', dataIndex: 'originalTime', key: 'originalTime', width: 100 },
        { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime', width: 160 },
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
        const response = await courseChangeApi.getAll();
        let data = response.data || [];
        
        if (this.filterChangeType) {
          data = data.filter(item => item.changeType === this.filterChangeType);
        }
        if (this.filterStatus) {
          data = data.filter(item => item.status === this.filterStatus);
        }
        
        this.tableData = data;
        this.pagination.total = data.length;
      } catch (error) {
        console.error('加载变更数据失败:', error);
        this.$message.error('加载数据失败');
      } finally {
        this.loading = false;
      }
    },
    
    async loadStatistics() {
      try {
        const [pendingRes, approvedRes] = await Promise.all([
          courseChangeApi.getByStatus('PENDING'),
          courseChangeApi.getByStatus('APPROVED')
        ]);
        this.pendingCount = pendingRes.data?.length || 0;
        this.approvedCount = approvedRes.data?.length || 0;
        
        const changeRes = await courseChangeApi.getByChangeType('CHANGE');
        this.changeCount = changeRes.data?.length || 0;
        
        const suspendRes = await courseChangeApi.getByChangeType('SUSPEND');
        this.suspendCount = suspendRes.data?.length || 0;
      } catch (error) {
        console.error('加载统计数据失败:', error);
      }
    },
    
    handleFilterChange() {
      this.loadData();
    },
    
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
    },
    
    showAddModal() {
      this.form = {
        changeType: 'CHANGE',
        teacherId: 1,
        teacherName: '当前教师',
        courseName: '',
        className: '',
        originalDate: null,
        originalTime: '',
        originalLocation: '',
        newDate: null,
        newTime: '',
        newLocation: '',
        reason: '',
        semester: '2025-2026-1'
      };
      this.modalVisible = true;
    },
    
    showDetailModal(record) {
      this.currentRecord = { ...record };
      this.detailVisible = true;
    },
    
    showApproveModal(record) {
      this.currentRecord = { ...record };
      this.approveForm = {
        status: 'APPROVED',
        approveRemark: ''
      };
      this.approveModalVisible = true;
    },
    
    async handleSubmit() {
      if (!this.form.courseName || !this.form.originalTime || !this.form.reason) {
        this.$message.warning('请填写必填项');
        return;
      }
      
      const submitData = {
        ...this.form,
        originalDate: this.form.originalDate ? dayjs(this.form.originalDate).format('YYYY-MM-DD') : null,
        newDate: this.form.newDate ? dayjs(this.form.newDate).format('YYYY-MM-DD') : null
      };
      
      try {
        await courseChangeApi.add(submitData);
        this.$message.success('申请提交成功');
        this.modalVisible = false;
        this.loadData();
        this.loadStatistics();
      } catch (error) {
        console.error('提交失败:', error);
        this.$message.error('提交失败');
      }
    },
    
    async handleApproveSubmit() {
      try {
        const updateData = {
          ...this.currentRecord,
          status: this.approveForm.status,
          approveRemark: this.approveForm.approveRemark,
          approverName: '管理员',
          approveTime: new Date().toISOString()
        };
        await courseChangeApi.update(this.currentRecord.id, updateData);
        this.$message.success('审批成功');
        this.approveModalVisible = false;
        this.loadData();
        this.loadStatistics();
      } catch (error) {
        console.error('审批失败:', error);
        this.$message.error('审批失败');
      }
    },
    
    handleCancel() {
      this.modalVisible = false;
    },
    
    async handleDelete(id) {
      try {
        await courseChangeApi.delete(id);
        this.$message.success('删除成功');
        this.loadData();
        this.loadStatistics();
      } catch (error) {
        console.error('删除失败:', error);
        this.$message.error('删除失败');
      }
    },
    
    getChangeTypeText(type) {
      const map = {
        'CHANGE': '调课',
        'SUSPEND': '停课',
        'MAKEUP': '补课'
      };
      return map[type] || type;
    },
    
    getChangeTypeColor(type) {
      const map = {
        'CHANGE': 'orange',
        'SUSPEND': 'red',
        'MAKEUP': 'blue'
      };
      return map[type] || 'default';
    },
    
    getStatusText(status) {
      const map = {
        'PENDING': '待审批',
        'APPROVED': '已批准',
        'REJECTED': '已拒绝'
      };
      return map[status] || status;
    },
    
    getStatusColor(status) {
      const map = {
        'PENDING': 'orange',
        'APPROVED': 'green',
        'REJECTED': 'red'
      };
      return map[status] || 'default';
    }
  }
};
</script>

<style scoped>
.course-change {
  padding: 0;
}

.table-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
