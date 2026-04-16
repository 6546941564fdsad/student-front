<!-- src/components/GradeAnalysis.vue -->
<template>
  <div class="grade-analysis">
    <a-card :bordered="false">
      <!-- 页面标题 -->
      <div class="page-header">
        <h2 class="page-title">成绩分析</h2>
        <p class="page-desc">多维度分析学生成绩分布和趋势</p>
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
            <a-select-option value="">全部课程</a-select-option>
            <a-select-option value="1">Java程序设计</a-select-option>
            <a-select-option value="2">数据结构</a-select-option>
            <a-select-option value="3">数据库原理</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="班级">
          <a-select v-model:value="filters.classId" placeholder="请选择班级" style="width: 150px">
            <a-select-option value="">全部班级</a-select-option>
            <a-select-option value="1">计科2401班</a-select-option>
            <a-select-option value="2">计科2402班</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">查询</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>

      <!-- 统计卡片 -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <TeamOutlined style="color: #1890ff" />
              <span style="margin-left: 8px">总人数</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #1890ff; margin: 0">
              {{ statistics.totalCount || 0 }}
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <TrophyOutlined style="color: #52c41a" />
              <span style="margin-left: 8px">平均分</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #52c41a; margin: 0">
              {{ statistics.avgGrade || 0 }}
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <RiseOutlined style="color: #faad14" />
              <span style="margin-left: 8px">最高分</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #faad14; margin: 0">
              {{ statistics.maxGrade || 0 }}
            </p>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card :bordered="false">
            <template #title>
              <FallOutlined style="color: #f5222d" />
              <span style="margin-left: 8px">最低分</span>
            </template>
            <p style="font-size: 32px; font-weight: bold; color: #f5222d; margin: 0">
              {{ statistics.minGrade || 0 }}
            </p>
          </a-card>
        </a-col>
      </a-row>

      <!-- 图表区域 -->
      <a-row :gutter="16" style="margin-bottom: 24px">
        <a-col :span="12">
          <a-card title="成绩分布">
            <div ref="distributionChart" style="height: 300px"></div>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card title="及格率分析">
            <div ref="passRateChart" style="height: 300px"></div>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col :span="24">
          <a-card title="成绩趋势">
            <div ref="trendChart" style="height: 300px"></div>
          </a-card>
        </a-col>
      </a-row>

      <!-- 详细数据表格 -->
      <a-divider>详细数据</a-divider>
      <a-table
        :columns="columns"
        :data-source="analysisList"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'passRate'">
            <a-progress
              :percent="record.passRate"
              :stroke-color="getPassRateColor(record.passRate)"
            />
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link" size="small" @click="showDetail(record)">查看详情</a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 详情模态框 -->
    <a-modal
      v-model:open="detailVisible"
      title="成绩详情"
      width="800px"
      :footer="null"
    >
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="课程名称">{{ currentRecord?.courseName }}</a-descriptions-item>
        <a-descriptions-item label="教师姓名">{{ currentRecord?.teacherName }}</a-descriptions-item>
        <a-descriptions-item label="学期">{{ currentRecord?.semester }}</a-descriptions-item>
        <a-descriptions-item label="班级">{{ currentRecord?.className }}</a-descriptions-item>
        <a-descriptions-item label="总人数">{{ currentRecord?.totalCount }} 人</a-descriptions-item>
        <a-descriptions-item label="平均分">{{ currentRecord?.avgGrade }} 分</a-descriptions-item>
        <a-descriptions-item label="最高分">{{ currentRecord?.maxGrade }} 分</a-descriptions-item>
        <a-descriptions-item label="最低分">{{ currentRecord?.minGrade }} 分</a-descriptions-item>
        <a-descriptions-item label="及格率">{{ currentRecord?.passRate }}%</a-descriptions-item>
        <a-descriptions-item label="优秀率">{{ currentRecord?.excellentRate }}%</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import { TeamOutlined, TrophyOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons-vue';
import * as echarts from 'echarts';
import gradeApi from '../api/grade';

export default {
  name: 'GradeAnalysis',
  components: {
    TeamOutlined,
    TrophyOutlined,
    RiseOutlined,
    FallOutlined
  },
  data() {
    return {
      filters: {
        semester: '',
        courseId: undefined,
        classId: undefined
      },
      statistics: {
        totalCount: 0,
        avgGrade: 0,
        maxGrade: 0,
        minGrade: 0
      },
      columns: [
        { title: '序号', dataIndex: 'index', key: 'index', width: 60, align: 'center' },
        { title: '课程名称', dataIndex: 'courseName', key: 'courseName', width: 150 },
        { title: '教师姓名', dataIndex: 'teacherName', key: 'teacherName', width: 100 },
        { title: '学期', dataIndex: 'semester', key: 'semester', width: 150 },
        { title: '班级', dataIndex: 'className', key: 'className', width: 120 },
        { title: '总人数', dataIndex: 'totalCount', key: 'totalCount', width: 100, align: 'center' },
        { title: '平均分', dataIndex: 'avgGrade', key: 'avgGrade', width: 100, align: 'center' },
        { title: '最高分', dataIndex: 'maxGrade', key: 'maxGrade', width: 100, align: 'center' },
        { title: '最低分', dataIndex: 'minGrade', key: 'minGrade', width: 100, align: 'center' },
        { title: '及格率', key: 'passRate', width: 150 },
        { title: '操作', key: 'action', width: 120, align: 'center', fixed: 'right' }
      ],
      analysisList: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
      },
      detailVisible: false,
      currentRecord: null,
      distributionChart: null,
      passRateChart: null,
      trendChart: null
    };
  },
  mounted() {
    this.loadData();
    this.initCharts();
  },
  beforeUnmount() {
    // 销毁图表实例
    if (this.distributionChart) this.distributionChart.dispose();
    if (this.passRateChart) this.passRateChart.dispose();
    if (this.trendChart) this.trendChart.dispose();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        // 获取统计数据
        const statsRes = await gradeApi.getStatistics();
        if (statsRes.data.success) {
          this.statistics = statsRes.data.data || {
            totalCount: 0,
            avgGrade: 0,
            maxGrade: 0,
            minGrade: 0
          };
        }
        
        // 获取分析列表
        const params = {
          page: this.pagination.current - 1,
          size: this.pagination.pageSize,
          semester: this.filters.semester || undefined
        };
        const res = await gradeApi.getAll(params.page, params.size);
        if (res.data.success) {
          // Spring Data Page 对象结构: { content: [...], totalElements: 100, ... }
          const pageData = res.data.data;
          const content = Array.isArray(pageData) ? pageData : (pageData.content || []);
          const total = pageData.totalElements || 0;
          
          this.analysisList = content.map((item, index) => ({
            ...item,
            index: (this.pagination.current - 1) * this.pagination.pageSize + index + 1
          }));
          this.pagination.total = total;
        }
        
        // 更新图表
        this.updateCharts();
      } catch (error) {
        console.error('加载成绩分析数据失败:', error);
        this.$message.error('加载成绩分析数据失败');
      } finally {
        this.loading = false;
      }
    },
    initCharts() {
      // 成绩分布图
      this.distributionChart = echarts.init(this.$refs.distributionChart);
      
      // 及格率分析图
      this.passRateChart = echarts.init(this.$refs.passRateChart);
      
      // 成绩趋势图
      this.trendChart = echarts.init(this.$refs.trendChart);
    },
    updateCharts() {
      this.updateDistributionChart();
      this.updatePassRateChart();
      this.updateTrendChart();
    },
    updateDistributionChart() {
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        xAxis: {
          type: 'category',
          data: ['<60', '60-69', '70-79', '80-89', '90-100']
        },
        yAxis: {
          type: 'value',
          name: '人数'
        },
        series: [{
          data: [8, 15, 35, 42, 20],
          type: 'bar',
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          }
        }]
      };
      this.distributionChart.setOption(option);
    },
    updatePassRateChart() {
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [{
          type: 'pie',
          radius: '60%',
          data: [
            { value: 112, name: '及格', itemStyle: { color: '#52c41a' } },
            { value: 8, name: '不及格', itemStyle: { color: '#f5222d' } }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      this.passRateChart.setOption(option);
    },
    updateTrendChart() {
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['平均分', '最高分', '最低分']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周']
        },
        yAxis: {
          type: 'value',
          name: '分数'
        },
        series: [
          {
            name: '平均分',
            type: 'line',
            data: [75, 76, 78, 79, 80, 81, 82, 82.5],
            smooth: true,
            itemStyle: { color: '#1890ff' }
          },
          {
            name: '最高分',
            type: 'line',
            data: [90, 91, 92, 93, 94, 94, 95, 95],
            smooth: true,
            itemStyle: { color: '#52c41a' }
          },
          {
            name: '最低分',
            type: 'line',
            data: [55, 56, 57, 58, 58, 59, 60, 60],
            smooth: true,
            itemStyle: { color: '#f5222d' }
          }
        ]
      };
      this.trendChart.setOption(option);
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
    showDetail(record) {
      this.currentRecord = record;
      this.detailVisible = true;
    },
    getPassRateColor(rate) {
      if (rate >= 90) return '#52c41a';
      if (rate >= 80) return '#1890ff';
      if (rate >= 70) return '#faad14';
      return '#f5222d';
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
</style>
