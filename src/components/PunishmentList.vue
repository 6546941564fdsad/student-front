<!-- src/components/PunishmentList.vue -->
<template>
  <div class="punishment-list">
    <a-card title="惩处记录列表">
      <!-- 工具栏：搜索、筛选、批量操作、导入导出 -->
      <div class="toolbar">
        <div class="filter-section">
          <a-space size="large" wrap>
            <!-- 搜索 -->
            <a-input-search 
              placeholder="搜索学生姓名/学号/惩处内容" 
              style="width: 320px" 
              @search="handleSearch"
            />
            
            <!-- 组织架构筛选 -->
            <a-cascader 
              placeholder="选择学院-专业-班级" 
              style="width: 320px"
              :options="organizationOptions"
              @change="handleOrganizationFilter"
              :field-names="{ label: 'name', value: 'id', children: 'children' }"
              expand-trigger="hover"
            />
          </a-space>
        </div>
        
        <div class="filter-section" style="margin-top: 16px">
          <a-space size="large" wrap>
            <!-- 惩处类型筛选 -->
            <a-select placeholder="按惩处类型筛选" style="width: 150px" @change="handleTypeFilter">
              <a-option value="all">全部</a-option>
              <a-option value="违纪">违纪</a-option>
              <a-option value="欠费">欠费</a-option>
              <a-option value="警告">警告</a-option>
              <a-option value="记过">记过</a-option>
              <a-option value="留校察看">留校察看</a-option>
            </a-select>
            
            <!-- 状态筛选 -->
            <a-select placeholder="按处理状态筛选" style="width: 150px" @change="handleStatusFilter">
              <a-option value="all">全部</a-option>
              <a-option value="待处理">待处理</a-option>
              <a-option value="已处理">已处理</a-option>
              <a-option value="已销账">已销账</a-option>
            </a-select>
            
            <!-- 时间筛选 -->
            <a-date-picker 
              placeholder="选择开始日期" 
              style="width: 150px" 
              @change="handleStartDateChange"
            />
            <a-date-picker 
              placeholder="选择结束日期" 
              style="width: 150px" 
              @change="handleEndDateChange"
            />
          </a-space>
        </div>
        
        <div class="action-section" style="margin-top: 16px">
          <a-space size="large">
            <!-- 重置筛选 -->
            <a-button @click="resetFilters">
              <template #icon><reload-outlined /></template>
              重置筛选
            </a-button>
            
            <!-- 批量操作 -->
            <a-dropdown>
              <a-button>
                批量操作
                <template #icon><down-outlined /></template>
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="batchDelete">批量删除</a-menu-item>
                  <a-menu-item @click="batchExport">批量导出</a-menu-item>
                  <a-menu-item @click="batchProcess">批量处理</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
            
            <!-- 导入导出 -->
            <a-upload name="file" :showUploadList="false" @change="handleImport">
              <a-button>
                <template #icon><upload-outlined /></template>
                导入惩处记录
              </a-button>
            </a-upload>
            <a-button @click="handleExport">
              <template #icon><download-outlined /></template>
              导出惩处记录
            </a-button>
            
            <!-- 新增惩处 -->
            <a-button type="primary" @click="showAddForm">
              <template #icon><plus-outlined /></template>
              新增惩处
            </a-button>
          </a-space>
        </div>
      </div>
      
      <a-table 
        :columns="columns" 
        :data-source="filteredPunishments" 
        row-key="id" 
        :loading="loading"
        :row-selection="rowSelection"
        :scroll="{ x: 1200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space size="small">
              <a-button type="primary" size="small" @click="viewDetails(record)">
                <template #icon><eye-outlined /></template>
                查看
              </a-button>
              <a-button size="small" @click="editPunishment(record)">
                <template #icon><form-outlined /></template>
                编辑
              </a-button>
              <a-button danger size="small" @click="deletePunishment(record.id)">
                <template #icon><delete-outlined /></template>
                删除
              </a-button>
              <a-button v-if="record.status === '待处理'" type="primary" size="small" @click="processPunishment(record)">
                处理
              </a-button>
              <a-button v-else-if="record.status === '已处理' && record.type === '欠费'" type="primary" size="small" @click="writeOffPunishment(record)">
                销账
              </a-button>
            </a-space>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
          </template>
          <template v-else-if="column.key === 'type'">
            <a-tag :color="getTypeColor(record.type)">{{ record.type }}</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
    
    <!-- 惩处详情抽屉 -->
    <a-drawer
      :width="600"
      :title="currentPunishment ? '惩处详情' : '新增惩处'"
      placement="right"
      :open="showForm"
      @close="cancelForm"
    >
      <template #extra>
        <a-button style="margin-right: 8px" @click="cancelForm">取消</a-button>
        <a-button type="primary" @click="handleDrawerOk">保存</a-button>
      </template>
      <PunishmentForm 
        ref="punishmentFormRef"
        :punishment="currentPunishment" 
        @save="savePunishment"
      />
    </a-drawer>
  </div>
</template>

<script>
import { 
  PlusOutlined, 
  FormOutlined, 
  DeleteOutlined, 
  DownOutlined, 
  UploadOutlined, 
  DownloadOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'PunishmentList',
  components: {
    PlusOutlined,
    FormOutlined,
    DeleteOutlined,
    DownOutlined,
    UploadOutlined,
    DownloadOutlined,
    ReloadOutlined,
    EyeOutlined
  },
  data() {
    return {
      punishments: [],
      showForm: false,
      currentPunishment: null,
      loading: false,
      searchText: '',
      // 筛选条件
      collegeFilter: '',
      majorFilter: '',
      classFilter: '',
      typeFilter: '',
      statusFilter: '',
      startDate: null,
      endDate: null,
      selectedRowKeys: [],
      // 组织架构数据
      organizationOptions: [
        {
          id: 'college_1',
          name: '大数据学院',
          children: [
            {
              id: 'major_1',
              name: '计算机科学与技术',
              children: [
                { id: 'class_1', name: '计科2024级1班' },
                { id: 'class_2', name: '计科2024级2班' },
                { id: 'class_3', name: '计科2023级1班' },
                { id: 'class_4', name: '计科2023级2班' }
              ]
            },
            {
              id: 'major_2',
              name: '软件工程',
              children: [
                { id: 'class_5', name: '软件2024级1班' },
                { id: 'class_6', name: '软件2024级2班' }
              ]
            }
          ]
        },
        {
          id: 'college_2',
          name: '电气学院',
          children: [
            {
              id: 'major_3',
              name: '电器与信息工程',
              children: [
                { id: 'class_7', name: '电气2024级1班' },
                { id: 'class_8', name: '电气2024级2班' },
                { id: 'class_9', name: '电气2023级1班' }
              ]
            }
          ]
        }
      ],
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 80
        },
        {
          title: '学生姓名',
          dataIndex: 'studentName',
          key: 'studentName',
          width: 100
        },
        {
          title: '学号',
          dataIndex: 'studentId',
          key: 'studentId',
          width: 120
        },
        {
          title: '学院',
          dataIndex: 'college',
          key: 'college',
          width: 120
        },
        {
          title: '专业',
          dataIndex: 'major',
          key: 'major',
          width: 150
        },
        {
          title: '班级',
          dataIndex: 'className',
          key: 'className',
          width: 120
        },
        {
          title: '惩处类型',
          dataIndex: 'type',
          key: 'type',
          width: 100
        },
        {
          title: '惩处内容',
          dataIndex: 'content',
          key: 'content',
          width: 200
        },
        {
          title: '惩处时间',
          dataIndex: 'punishmentDate',
          key: 'punishmentDate',
          width: 150
        },
        {
          title: '录入时间',
          dataIndex: 'entryDate',
          key: 'entryDate',
          width: 150
        },
        {
          title: '处理状态',
          dataIndex: 'status',
          key: 'status',
          width: 100
        },
        {
          title: '操作',
          key: 'action',
          width: 200
        }
      ]
    };
  },
  computed: {
    filteredPunishments() {
      return this.punishments.filter(punishment => {
        // 搜索条件
        const matchesSearch = !this.searchText || 
          punishment.studentName.includes(this.searchText) || 
          punishment.studentId.includes(this.searchText) ||
          punishment.content.includes(this.searchText);
        
        // 组织架构条件
        const matchesCollege = !this.collegeFilter || punishment.college === this.collegeFilter;
        const matchesMajor = !this.majorFilter || punishment.major === this.majorFilter;
        const matchesClass = !this.classFilter || punishment.className === this.classFilter;
        
        // 类型和状态条件
        const matchesType = !this.typeFilter || punishment.type === this.typeFilter;
        const matchesStatus = !this.statusFilter || punishment.status === this.statusFilter;
        
        // 时间条件
        const matchesDate = (!this.startDate && !this.endDate) || 
          (this.startDate && !this.endDate && punishment.punishmentDate >= this.startDate) ||
          (!this.startDate && this.endDate && punishment.punishmentDate <= this.endDate) ||
          (this.startDate && this.endDate && punishment.punishmentDate >= this.startDate && punishment.punishmentDate <= this.endDate);
        
        return matchesSearch && matchesCollege && matchesMajor && matchesClass && 
               matchesType && matchesStatus && matchesDate;
      });
    },
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys) => {
          this.selectedRowKeys = selectedRowKeys;
        }
      };
    }
  },
  mounted() {
    this.fetchPunishments();
  },
  methods: {
    async fetchPunishments() {
      this.loading = true;
      try {
        // 模拟数据
        this.punishments = [
          {
            id: 1,
            studentName: '张三',
            studentId: '2024001',
            college: '大数据学院',
            major: '计算机科学与技术',
            className: '计科2024级1班',
            type: '违纪',
            content: '旷课3节',
            punishmentDate: '2026-03-01',
            entryDate: '2026-03-02',
            status: '待处理'
          },
          {
            id: 2,
            studentName: '李四',
            studentId: '2024002',
            college: '大数据学院',
            major: '软件工程',
            className: '软件2024级1班',
            type: '欠费',
            content: '欠缴学费5000元',
            punishmentDate: '2026-02-15',
            entryDate: '2026-02-16',
            status: '已处理'
          },
          {
            id: 3,
            studentName: '王五',
            studentId: '2023001',
            college: '电气学院',
            major: '电器与信息工程',
            className: '电气2023级1班',
            type: '警告',
            content: '考试作弊',
            punishmentDate: '2026-01-10',
            entryDate: '2026-01-11',
            status: '已处理'
          }
        ];
      } catch (error) {
        console.error('获取惩处记录失败:', error);
        this.$message.error('获取惩处记录失败');
      } finally {
        this.loading = false;
      }
    },
    showAddForm() {
      this.currentPunishment = null;
      this.showForm = true;
    },
    viewDetails(punishment) {
      this.currentPunishment = punishment;
      this.showForm = true;
    },
    editPunishment(punishment) {
      this.currentPunishment = punishment;
      this.showForm = true;
    },
    handleDrawerOk() {
      if (this.$refs.punishmentFormRef) {
        this.$refs.punishmentFormRef.handleSave();
      }
    },
    async savePunishment(punishmentData) {
      this.loading = true;
      try {
        if (this.currentPunishment) {
          // 编辑惩处
          const index = this.punishments.findIndex(p => p.id === this.currentPunishment.id);
          if (index !== -1) {
            this.punishments[index] = { ...this.punishments[index], ...punishmentData };
          }
          this.$message.success('编辑惩处成功');
        } else {
          // 新增惩处
          const newPunishment = {
            id: this.punishments.length + 1,
            ...punishmentData,
            entryDate: new Date().toISOString().split('T')[0],
            status: '待处理'
          };
          this.punishments.unshift(newPunishment);
          this.$message.success('新增惩处成功');
        }
        this.cancelForm();
      } catch (error) {
        console.error('保存惩处失败:', error);
        this.$message.error('保存惩处失败');
      } finally {
        this.loading = false;
      }
    },
    cancelForm() {
      this.showForm = false;
      this.currentPunishment = null;
    },
    async deletePunishment(id) {
      this.$confirm({
        title: '删除确认',
        content: '确定要删除这个惩处记录吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          this.loading = true;
          try {
            this.punishments = this.punishments.filter(p => p.id !== id);
            this.$message.success('删除惩处记录成功');
          } catch (error) {
            console.error('删除惩处记录失败:', error);
            this.$message.error('删除惩处记录失败');
          } finally {
            this.loading = false;
          }
        }
      });
    },
    // 处理惩处
    processPunishment(punishment) {
      this.$confirm({
        title: '处理确认',
        content: `确定要处理 ${punishment.studentName} 的惩处记录吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const index = this.punishments.findIndex(p => p.id === punishment.id);
          if (index !== -1) {
            this.punishments[index].status = '已处理';
            this.$message.success('惩处处理成功');
          }
        }
      });
    },
    // 销账处理
    writeOffPunishment(punishment) {
      this.$confirm({
        title: '销账确认',
        content: `确定要为 ${punishment.studentName} 销账吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const index = this.punishments.findIndex(p => p.id === punishment.id);
          if (index !== -1) {
            this.punishments[index].status = '已销账';
            this.$message.success('销账成功');
          }
        }
      });
    },
    // 批量操作
    batchDelete() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要删除的惩处记录');
        return;
      }
      this.$confirm({
        title: '批量删除确认',
        content: `确定要删除选中的 ${this.selectedRowKeys.length} 条惩处记录吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          this.loading = true;
          try {
            this.punishments = this.punishments.filter(p => !this.selectedRowKeys.includes(p.id));
            this.selectedRowKeys = [];
            this.$message.success('批量删除成功');
          } catch (error) {
            console.error('批量删除失败:', error);
            this.$message.error('批量删除失败');
          } finally {
            this.loading = false;
          }
        }
      });
    },
    batchExport() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要导出的惩处记录');
        return;
      }
      const selectedPunishments = this.punishments.filter(p => this.selectedRowKeys.includes(p.id));
      console.log('批量导出:', selectedPunishments);
      this.$message.success('导出成功');
    },
    batchProcess() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择要处理的惩处记录');
        return;
      }
      this.$confirm({
        title: '批量处理确认',
        content: `确定要处理选中的 ${this.selectedRowKeys.length} 条惩处记录吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.punishments = this.punishments.map(p => {
            if (this.selectedRowKeys.includes(p.id) && p.status === '待处理') {
              return { ...p, status: '已处理' };
            }
            return p;
          });
          this.selectedRowKeys = [];
          this.$message.success('批量处理成功');
        }
      });
    },
    // 筛选处理
    handleSearch(value) {
      this.searchText = value;
    },
    handleOrganizationFilter(value) {
      if (value && value.length > 0) {
        const [collegeId, majorId, classId] = value;
        const college = this.findOrganizationById(collegeId);
        const major = college ? this.findOrganizationById(majorId, college.children) : null;
        const classItem = major ? this.findOrganizationById(classId, major.children) : null;
        this.collegeFilter = college ? college.name : '';
        this.majorFilter = major ? major.name : '';
        this.classFilter = classItem ? classItem.name : '';
      } else {
        this.collegeFilter = '';
        this.majorFilter = '';
        this.classFilter = '';
      }
    },
    handleTypeFilter(value) {
      this.typeFilter = value === 'all' ? '' : value;
    },
    handleStatusFilter(value) {
      this.statusFilter = value === 'all' ? '' : value;
    },
    handleStartDateChange(date) {
      this.startDate = date ? date.format('YYYY-MM-DD') : null;
    },
    handleEndDateChange(date) {
      this.endDate = date ? date.format('YYYY-MM-DD') : null;
    },
    resetFilters() {
      this.searchText = '';
      this.collegeFilter = '';
      this.majorFilter = '';
      this.classFilter = '';
      this.typeFilter = '';
      this.statusFilter = '';
      this.startDate = null;
      this.endDate = null;
      this.selectedRowKeys = [];
      this.$message.success('筛选条件已重置');
    },
    // 辅助方法
    findOrganizationById(id, list = null) {
      const searchList = list || this.organizationOptions;
      for (const item of searchList) {
        if (item.id === id) return item;
        if (item.children) {
          const found = this.findOrganizationById(id, item.children);
          if (found) return found;
        }
      }
      return null;
    },
    getStatusColor(status) {
      switch (status) {
        case '待处理': return 'blue';
        case '已处理': return 'green';
        case '已销账': return 'purple';
        default: return 'default';
      }
    },
    getTypeColor(type) {
      switch (type) {
        case '违纪': return 'red';
        case '欠费': return 'orange';
        case '警告': return 'yellow';
        case '记过': return 'red';
        case '留校察看': return 'red';
        default: return 'default';
      }
    },
    // 导入导出
    handleImport(info) {
      console.log('导入惩处记录:', info);
      this.$message.success('导入成功');
    },
    handleExport() {
      console.log('导出所有惩处记录');
      this.$message.success('导出成功');
    }
  }
};
</script>

<style scoped>
.punishment-list {
  padding: 24px;
  background-color: #f0f2f5;
  min-height: 80vh;
}

.toolbar {
  margin-bottom: 24px;
}

.filter-section {
  margin-bottom: 16px;
}

.action-section {
  margin-top: 16px;
}
</style>