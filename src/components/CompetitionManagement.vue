<!-- src/components/CompetitionManagement.vue -->
<template>
  <div class="competition-management">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">竞赛管理</h2>
        <p class="page-desc">管理学生参加各类学科竞赛的信息和获奖情况</p>
      </div>

      <!-- 统计卡片 -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <TrophyOutlined style="color: #1890ff" />
              <span style="margin-left: 8px">竞赛总数</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #1890ff; margin: 0">
              {{ statistics.totalCount || 0 }}
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <StarOutlined style="color: #faad14" />
              <span style="margin-left: 8px">国家级奖项</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #faad14; margin: 0">
              {{ statistics.nationalCount || 0 }}
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <CheckCircleOutlined style="color: #52c41a" />
              <span style="margin-left: 8px">省级奖项</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #52c41a; margin: 0">
              {{ statistics.provincialCount || 0 }}
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <TeamOutlined style="color: #722ed1" />
              <span style="margin-left: 8px">参与人数</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #722ed1; margin: 0">
              {{ statistics.participantCount || 0 }}
            </p>
          </a-card>
        </a-col>
      </a-row>

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
        <a-button type="primary" @click="showAddModal">
          <template #icon><PlusOutlined /></template>
          新增竞赛
        </a-button>
        <a-button style="margin-left: 8px" @click="handleExport">
          <template #icon><DownloadOutlined /></template>
          导出
        </a-button>
      </div>

      <!-- 竞赛列表表格 -->
      <a-table
        :columns="columns"
        :data-source="competitionList"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'level'">
            <a-tag :color="getLevelColor(record.level)">
              {{ record.level }}
            </a-tag>
          </template>
          <template v-if="column.key === 'awardLevel'">
            <a-tag :color="getAwardColor(record.awardLevel)">
              {{ record.awardLevel }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showDetail(record)">详情</a-button>
              <a-button type="link" size="small" @click="showEditModal(record)">编辑</a-button>
              <a-popconfirm title="确定删除？" @confirm="handleDelete(record.id)">
                <a-button type="link" danger size="small">删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 添加/编辑模态框 -->
    <a-modal
      v-model:open="modalVisible"
      :title="isEdit ? '编辑竞赛信息' : '新增竞赛'"
      width="700px"
      :confirm-loading="submitLoading"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form ref="formRef" :model="form" :rules="formRules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="竞赛名称" name="competitionName">
          <a-input v-model:value="form.competitionName" placeholder="请输入竞赛名称" />
        </a-form-item>
        <a-form-item label="竞赛级别" name="level">
          <a-select v-model:value="form.level" placeholder="请选择竞赛级别">
            <a-select-option value="国家级">国家级</a-select-option>
            <a-select-option value="省级">省级</a-select-option>
            <a-select-option value="校级">校级</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="获奖等级" name="awardLevel">
          <a-select v-model:value="form.awardLevel" placeholder="请选择获奖等级">
            <a-select-option value="特等奖">特等奖</a-select-option>
            <a-select-option value="一等奖">一等奖</a-select-option>
            <a-select-option value="二等奖">二等奖</a-select-option>
            <a-select-option value="三等奖">三等奖</a-select-option>
            <a-select-option value="优秀奖">优秀奖</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="参赛学生" name="studentIds">
          <a-select
            v-model:value="form.studentIds"
            mode="multiple"
            placeholder="请选择参赛学生"
            style="width: 100%"
          >
            <a-select-option v-for="student in studentOptions" :key="student.id" :value="student.id">
              {{ student.name }} ({{ student.studentNo }})
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="指导教师" name="teacher">
          <a-input v-model:value="form.teacher" placeholder="请输入指导教师" />
        </a-form-item>
        <a-form-item label="获奖时间" name="awardDate">
          <a-date-picker v-model:value="form.awardDate" style="width: 100%" />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="form.remark" :rows="3" placeholder="请输入备注信息" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 详情模态框 -->
    <a-modal
      v-model:open="detailVisible"
      title="竞赛详情"
      width="700px"
      :footer="null"
    >
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="竞赛名称" :span="2">{{ currentRecord?.competitionName }}</a-descriptions-item>
        <a-descriptions-item label="竞赛级别">{{ currentRecord?.level }}</a-descriptions-item>
        <a-descriptions-item label="获奖等级">{{ currentRecord?.awardLevel }}</a-descriptions-item>
        <a-descriptions-item label="指导教师">{{ currentRecord?.teacher }}</a-descriptions-item>
        <a-descriptions-item label="获奖时间">{{ formatDate(currentRecord?.awardDate) }}</a-descriptions-item>
        <a-descriptions-item label="参赛学生" :span="2">
          <a-tag v-for="student in currentRecord?.students" :key="student.id" style="margin-bottom: 8px">
            {{ student.name }} ({{ student.studentNo }})
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="备注" :span="2">{{ currentRecord?.remark || '-' }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { TrophyOutlined, StarOutlined, CheckCircleOutlined, TeamOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';

export default {
  name: 'CompetitionManagement',
  components: {
    TrophyOutlined,
    StarOutlined,
    CheckCircleOutlined,
    TeamOutlined,
    PlusOutlined,
    DownloadOutlined
  },
  data() {
    return {
      filters: {
        competitionName: '',
        level: '',
        awardLevel: ''
      },
      statistics: {
        totalCount: 0,
        nationalCount: 0,
        provincialCount: 0,
        participantCount: 0
      },
      columns: [
        { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
        { title: '竞赛名称', dataIndex: 'competitionName', key: 'competitionName', width: 200 },
        { title: '竞赛级别', key: 'level', width: 100, align: 'center' },
        { title: '获奖等级', key: 'awardLevel', width: 100, align: 'center' },
        { title: '指导教师', dataIndex: 'teacher', key: 'teacher', width: 100 },
        { title: '获奖时间', dataIndex: 'awardDate', key: 'awardDate', width: 120 },
        { title: '参赛人数', dataIndex: 'participantCount', key: 'participantCount', width: 100, align: 'center' },
        { title: '操作', key: 'action', width: 180, align: 'center', fixed: 'right' }
      ],
      competitionList: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
      },
      modalVisible: false,
      isEdit: false,
      submitLoading: false,
      form: {
        competitionName: '',
        level: undefined,
        awardLevel: undefined,
        studentIds: [],
        teacher: '',
        awardDate: null,
        remark: ''
      },
      formRules: {
        competitionName: [{ required: true, message: '请输入竞赛名称', trigger: 'blur' }],
        level: [{ required: true, message: '请选择竞赛级别', trigger: 'change' }],
        awardLevel: [{ required: true, message: '请选择获奖等级', trigger: 'change' }],
        studentIds: [{ required: true, message: '请选择参赛学生', trigger: 'change', type: 'array' }]
      },
      studentOptions: [
        { id: 1, name: '张三', studentNo: '2024001' },
        { id: 2, name: '李四', studentNo: '2024002' },
        { id: 3, name: '王五', studentNo: '2024003' }
      ],
      detailVisible: false,
      currentRecord: null
    };
  },
  mounted() {
    this.loadData();
    this.loadStatistics();
  },
  methods: {
    async loadData() {
      this.loading = true;
      // TODO: 调用后端 API
      setTimeout(() => {
        this.competitionList = [
          {
            id: 1,
            index: 1,
            competitionName: '全国大学生程序设计竞赛',
            level: '国家级',
            awardLevel: '一等奖',
            teacher: '张老师',
            awardDate: '2024-11-15',
            participantCount: 3,
            students: [
              { id: 1, name: '张三', studentNo: '2024001' },
              { id: 2, name: '李四', studentNo: '2024002' },
              { id: 3, name: '王五', studentNo: '2024003' }
            ]
          },
          {
            id: 2,
            index: 2,
            competitionName: '省大学生数学建模竞赛',
            level: '省级',
            awardLevel: '二等奖',
            teacher: '李老师',
            awardDate: '2024-10-20',
            participantCount: 2,
            students: [
              { id: 4, name: '赵六', studentNo: '2024004' },
              { id: 5, name: '孙七', studentNo: '2024005' }
            ]
          }
        ];
        this.pagination.total = this.competitionList.length;
        this.loading = false;
      }, 500);
    },
    async loadStatistics() {
      // TODO: 调用后端 API
      this.statistics = {
        totalCount: 25,
        nationalCount: 8,
        provincialCount: 12,
        participantCount: 68
      };
    },
    handleSearch() {
      this.pagination.current = 1;
      this.loadData();
    },
    handleReset() {
      this.filters = { competitionName: '', level: '', awardLevel: '' };
      this.pagination.current = 1;
      this.loadData();
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.loadData();
    },
    showAddModal() {
      this.isEdit = false;
      this.resetForm();
      this.modalVisible = true;
    },
    showEditModal(record) {
      this.isEdit = true;
      this.currentRecord = record;
      this.form = {
        competitionName: record.competitionName,
        level: record.level,
        awardLevel: record.awardLevel,
        studentIds: record.students.map(s => s.id),
        teacher: record.teacher,
        awardDate: dayjs(record.awardDate),
        remark: record.remark || ''
      };
      this.modalVisible = true;
    },
    resetForm() {
      this.form = {
        competitionName: '',
        level: undefined,
        awardLevel: undefined,
        studentIds: [],
        teacher: '',
        awardDate: null,
        remark: ''
      };
      if (this.$refs.formRef) {
        this.$refs.formRef.clearValidate();
      }
    },
    async handleSubmit() {
      try {
        await this.$refs.formRef.validate();
      } catch (error) {
        this.$message.warning('请检查表单填写是否正确');
        return;
      }
      
      this.submitLoading = true;
      // TODO: 调用后端 API
      setTimeout(() => {
        const msg = this.isEdit ? '编辑成功' : '添加成功';
        this.$message.success(msg);
        this.modalVisible = false;
        this.submitLoading = false;
        this.loadData();
        this.loadStatistics();
      }, 1000);
    },
    handleCancel() {
      this.modalVisible = false;
      this.resetForm();
    },
    showDetail(record) {
      this.currentRecord = record;
      this.detailVisible = true;
    },
    async handleDelete(id) {
      // TODO: 调用后端 API
      this.$message.success('删除成功');
      this.loadData();
      this.loadStatistics();
    },
    handleExport() {
      this.$message.info('导出功能开发中...');
    },
    getLevelColor(level) {
      const map = {
        '国家级': 'red',
        '省级': 'blue',
        '校级': 'green'
      };
      return map[level] || 'default';
    },
    getAwardColor(awardLevel) {
      const map = {
        '特等奖': 'purple',
        '一等奖': 'gold',
        '二等奖': 'silver',
        '三等奖': 'orange',
        '优秀奖': 'cyan'
      };
      return map[awardLevel] || 'default';
    },
    formatDate(date) {
      if (!date) return '-';
      return dayjs(date).format('YYYY-MM-DD');
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
