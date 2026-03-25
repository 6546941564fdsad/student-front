<!-- src/components/StudentStatistics.vue -->
<template>
  <div class="student-statistics">
    <a-card title="学生统计">
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <a-card size="small" class="stat-card">
          <a-statistic title="总学生数" :value="totalStudents" />
        </a-card>
        <a-card size="small" class="stat-card">
          <a-statistic title="男生人数" :value="maleStudents" />
        </a-card>
        <a-card size="small" class="stat-card">
          <a-statistic title="女生人数" :value="femaleStudents" />
        </a-card>
        <a-card size="small" class="stat-card">
          <a-statistic title="异动人数" :value="abnormalStudents" />
        </a-card>
      </div>
      
      <!-- 图表区域 -->
      <div class="charts">
        <a-card class="chart-card">
          <template #title>专业分布</template>
          <div class="chart-container">
            <a-spin v-if="loading" />
            <div v-else ref="majorChartRef" style="height: 300px"></div>
          </div>
        </a-card>
        <a-card class="chart-card">
          <template #title>状态分布</template>
          <div class="chart-container">
            <a-spin v-if="loading" />
            <div v-else ref="statusChartRef" style="height: 300px"></div>
          </div>
        </a-card>
      </div>
      
      <!-- 异动数据表格 -->
      <a-card class="table-card">
        <template #title>近期异动数据</template>
        <a-table :columns="abnormalColumns" :data-source="abnormalData" row-key="id" :loading="loading">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
            </template>
          </template>
        </a-table>
      </a-card>
    </a-card>
  </div>
</template>

<script>
import { studentApi } from '../api/student';

export default {
  name: 'StudentStatistics',
  data() {
    return {
      loading: false,
      students: [],
      majorChartRef: null,
      statusChartRef: null,
      abnormalColumns: [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '学号',
          dataIndex: 'studentId',
          key: 'studentId'
        },
        {
          title: '专业',
          dataIndex: 'major',
          key: 'major'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status'
        },
        {
          title: '异动时间',
          dataIndex: 'updateTime',
          key: 'updateTime'
        }
      ]
    };
  },
  computed: {
    totalStudents() {
      return this.students.length;
    },
    maleStudents() {
      return this.students.filter(student => student.gender === '男').length;
    },
    femaleStudents() {
      return this.students.filter(student => student.gender === '女').length;
    },
    abnormalStudents() {
      return this.students.filter(student => 
        student.status && student.status !== '正常'
      ).length;
    },
    abnormalData() {
      return this.students
        .filter(student => student.status && student.status !== '正常')
        .sort((a, b) => new Date(b.updateTime || 0) - new Date(a.updateTime || 0))
        .slice(0, 10);
    }
  },
  mounted() {
    this.fetchStudents();
  },
  methods: {
    async fetchStudents() {
      this.loading = true;
      try {
        const response = await studentApi.getStudents();
        this.students = response.data;
        this.$nextTick(() => {
          this.initCharts();
        });
      } catch (error) {
        console.error('获取学生数据失败:', error);
        this.$message.error('获取学生数据失败');
      } finally {
        this.loading = false;
      }
    },
    initCharts() {
      // 这里可以使用 ECharts 等图表库实现
      // 由于没有引入图表库，这里只做占位
      console.log('初始化图表');
    },
    getStatusColor(status) {
      switch (status) {
        case '正常':
          return 'green';
        case '休学':
          return 'orange';
        case '退学':
          return 'red';
        case '毕业':
          return 'blue';
        default:
          return 'default';
      }
    }
  }
};
</script>

<style scoped>
.student-statistics {
  padding: 20px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
}

.charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.chart-card {
  height: 350px;
}

.chart-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-card {
  margin-top: 24px;
}

@media (max-width: 768px) {
  .charts {
    grid-template-columns: 1fr;
  }
  
  .chart-card {
    height: 300px;
  }
}
</style>