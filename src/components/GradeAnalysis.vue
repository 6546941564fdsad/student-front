<!-- src/components/GradeAnalysis.vue -->
<template>
  <div class="grade-analysis">
    <a-card title="成绩分析">
      <!-- 分析维度选择 -->
      <div class="dimension-selector">
        <a-radio-group v-model:value="analysisDimension" @change="handleDimensionChange">
          <a-radio-button value="course">按课程</a-radio-button>
          <a-radio-button value="class">按班级</a-radio-button>
          <a-radio-button value="major">按专业</a-radio-button>
        </a-radio-group>
      </div>
      
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <a-card size="small" class="stat-card">
          <a-statistic title="总人数" :value="totalStudents" />
        </a-card>
        <a-card size="small" class="stat-card">
          <a-statistic title="平均分" :value="averageScore" precision="2" />
        </a-card>
        <a-card size="small" class="stat-card">
          <a-statistic title="及格率" :value="passRate" precision="2" suffix="%" />
        </a-card>
        <a-card size="small" class="stat-card">
          <a-statistic title="优秀率" :value="excellentRate" precision="2" suffix="%" />
        </a-card>
      </div>
      
      <!-- 图表区域 -->
      <div class="charts">
        <a-card class="chart-card">
          <template #title>成绩分布</template>
          <div class="chart-container">
            <a-spin v-if="loading" />
            <div v-else ref="distributionChartRef" style="height: 300px"></div>
          </div>
        </a-card>
        <a-card class="chart-card">
          <template #title>分数段统计</template>
          <div class="chart-container">
            <a-spin v-if="loading" />
            <div v-else ref="rangeChartRef" style="height: 300px"></div>
          </div>
        </a-card>
      </div>
      
      <!-- 详细数据表格 -->
      <a-card class="table-card">
        <template #title>详细数据</template>
        <a-table :columns="analysisColumns" :data-source="analysisData" row-key="id" :loading="loading">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'average'">
              {{ record.average.toFixed(2) }}
            </template>
            <template v-if="column.key === 'passRate'">
              {{ (record.passRate * 100).toFixed(2) }}%
            </template>
            <template v-if="column.key === 'excellentRate'">
              {{ (record.excellentRate * 100).toFixed(2) }}%
            </template>
          </template>
        </a-table>
      </a-card>
      
      <!-- 导出按钮 -->
      <div class="export-actions">
        <a-button @click="exportReport">
          <template #icon><download-outlined /></template>
          导出报表
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
import { DownloadOutlined } from '@ant-design/icons-vue';

export default {
  name: 'GradeAnalysis',
  components: {
    DownloadOutlined
  },
  data() {
    return {
      loading: false,
      analysisDimension: 'course',
      grades: [
        {
          id: 1,
          studentId: 1,
          studentName: '张三',
          courseId: 1,
          courseName: '数据结构',
          className: '计科1班',
          major: '计算机科学与技术',
          score: 85
        },
        {
          id: 2,
          studentId: 2,
          studentName: '李四',
          courseId: 1,
          courseName: '数据结构',
          className: '计科1班',
          major: '计算机科学与技术',
          score: 90
        },
        {
          id: 3,
          studentId: 3,
          studentName: '王五',
          courseId: 1,
          courseName: '数据结构',
          className: '计科2班',
          major: '计算机科学与技术',
          score: 75
        },
        {
          id: 4,
          studentId: 4,
          studentName: '赵六',
          courseId: 2,
          courseName: '操作系统',
          className: '计科1班',
          major: '计算机科学与技术',
          score: 80
        },
        {
          id: 5,
          studentId: 5,
          studentName: '孙七',
          courseId: 2,
          courseName: '操作系统',
          className: '计科2班',
          major: '计算机科学与技术',
          score: 65
        },
        {
          id: 6,
          studentId: 6,
          studentName: '周八',
          courseId: 3,
          courseName: '软件工程',
          className: '软工1班',
          major: '软件工程',
          score: 95
        }
      ],
      distributionChartRef: null,
      rangeChartRef: null
    };
  },
  computed: {
    totalStudents() {
      return this.grades.length;
    },
    averageScore() {
      if (this.grades.length === 0) return 0;
      const sum = this.grades.reduce((acc, grade) => acc + grade.score, 0);
      return sum / this.grades.length;
    },
    passRate() {
      if (this.grades.length === 0) return 0;
      const passCount = this.grades.filter(grade => grade.score >= 60).length;
      return (passCount / this.grades.length) * 100;
    },
    excellentRate() {
      if (this.grades.length === 0) return 0;
      const excellentCount = this.grades.filter(grade => grade.score >= 90).length;
      return (excellentCount / this.grades.length) * 100;
    },
    analysisColumns() {
      switch (this.analysisDimension) {
        case 'course':
          return [
            { title: '课程', dataIndex: 'name', key: 'name' },
            { title: '人数', dataIndex: 'count', key: 'count' },
            { title: '平均分', dataIndex: 'average', key: 'average' },
            { title: '及格率', dataIndex: 'passRate', key: 'passRate' },
            { title: '优秀率', dataIndex: 'excellentRate', key: 'excellentRate' }
          ];
        case 'class':
          return [
            { title: '班级', dataIndex: 'name', key: 'name' },
            { title: '人数', dataIndex: 'count', key: 'count' },
            { title: '平均分', dataIndex: 'average', key: 'average' },
            { title: '及格率', dataIndex: 'passRate', key: 'passRate' },
            { title: '优秀率', dataIndex: 'excellentRate', key: 'excellentRate' }
          ];
        case 'major':
          return [
            { title: '专业', dataIndex: 'name', key: 'name' },
            { title: '人数', dataIndex: 'count', key: 'count' },
            { title: '平均分', dataIndex: 'average', key: 'average' },
            { title: '及格率', dataIndex: 'passRate', key: 'passRate' },
            { title: '优秀率', dataIndex: 'excellentRate', key: 'excellentRate' }
          ];
        default:
          return [];
      }
    },
    analysisData() {
      switch (this.analysisDimension) {
        case 'course':
          return this.analyzeByCourse();
        case 'class':
          return this.analyzeByClass();
        case 'major':
          return this.analyzeByMajor();
        default:
          return [];
      }
    }
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    handleDimensionChange() {
      this.$nextTick(() => {
        this.initCharts();
      });
    },
    analyzeByCourse() {
      const courseMap = new Map();
      this.grades.forEach(grade => {
        if (!courseMap.has(grade.courseId)) {
          courseMap.set(grade.courseId, {
            id: grade.courseId,
            name: grade.courseName,
            scores: []
          });
        }
        courseMap.get(grade.courseId).scores.push(grade.score);
      });
      return Array.from(courseMap.values()).map(course => {
        const total = course.scores.reduce((acc, score) => acc + score, 0);
        const average = total / course.scores.length;
        const passCount = course.scores.filter(score => score >= 60).length;
        const excellentCount = course.scores.filter(score => score >= 90).length;
        return {
          ...course,
          count: course.scores.length,
          average,
          passRate: passCount / course.scores.length,
          excellentRate: excellentCount / course.scores.length
        };
      });
    },
    analyzeByClass() {
      const classMap = new Map();
      this.grades.forEach(grade => {
        if (!classMap.has(grade.className)) {
          classMap.set(grade.className, {
            id: grade.className,
            name: grade.className,
            scores: []
          });
        }
        classMap.get(grade.className).scores.push(grade.score);
      });
      return Array.from(classMap.values()).map(classItem => {
        const total = classItem.scores.reduce((acc, score) => acc + score, 0);
        const average = total / classItem.scores.length;
        const passCount = classItem.scores.filter(score => score >= 60).length;
        const excellentCount = classItem.scores.filter(score => score >= 90).length;
        return {
          ...classItem,
          count: classItem.scores.length,
          average,
          passRate: passCount / classItem.scores.length,
          excellentRate: excellentCount / classItem.scores.length
        };
      });
    },
    analyzeByMajor() {
      const majorMap = new Map();
      this.grades.forEach(grade => {
        if (!majorMap.has(grade.major)) {
          majorMap.set(grade.major, {
            id: grade.major,
            name: grade.major,
            scores: []
          });
        }
        majorMap.get(grade.major).scores.push(grade.score);
      });
      return Array.from(majorMap.values()).map(major => {
        const total = major.scores.reduce((acc, score) => acc + score, 0);
        const average = total / major.scores.length;
        const passCount = major.scores.filter(score => score >= 60).length;
        const excellentCount = major.scores.filter(score => score >= 90).length;
        return {
          ...major,
          count: major.scores.length,
          average,
          passRate: passCount / major.scores.length,
          excellentRate: excellentCount / major.scores.length
        };
      });
    },
    initCharts() {
      // 这里可以使用 ECharts 等图表库实现
      // 由于没有引入图表库，这里只做占位
      console.log('初始化图表');
    },
    exportReport() {
      // 导出报表
      this.$message.success('导出报表成功');
    }
  }
};
</script>

<style scoped>
.grade-analysis {
  padding: 20px;
}

.dimension-selector {
  margin-bottom: 24px;
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
  margin-bottom: 24px;
}

.export-actions {
  text-align: right;
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