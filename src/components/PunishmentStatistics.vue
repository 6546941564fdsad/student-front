<!-- src/components/PunishmentStatistics.vue -->
<template>
  <div class="punishment-statistics">
    <a-card title="惩处统计">
      <!-- 统计筛选 -->
      <div class="filter-section" style="margin-bottom: 24px">
        <a-space size="large">
          <a-select placeholder="按统计维度" style="width: 150px" v-model:value="statisticsDimension" @change="updateStatistics">
            <a-option value="college">按学院</a-option>
            <a-option value="class">按班级</a-option>
            <a-option value="type">按类型</a-option>
            <a-option value="status">按状态</a-option>
          </a-select>
          
          <a-date-picker 
            placeholder="选择开始日期" 
            style="width: 150px" 
            v-model="startDate"
            @change="updateStatistics"
          />
          <a-date-picker 
            placeholder="选择结束日期" 
            style="width: 150px" 
            v-model="endDate"
            @change="updateStatistics"
          />
          
          <a-button type="primary" @click="exportStatistics">
            <template #icon><download-outlined /></template>
            导出统计
          </a-button>
        </a-space>
      </div>
      
      <!-- 统计图表 -->
      <div class="chart-section">
        <a-row :gutter="[24, 24]">
          <a-col :span="12">
            <a-card title="惩处数量分布">
              <div id="punishmentChart" style="height: 400px"></div>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card title="惩处趋势分析">
              <div id="trendChart" style="height: 400px"></div>
            </a-card>
          </a-col>
        </a-row>
        
        <a-row :gutter="[24, 24]" style="margin-top: 24px">
          <a-col :span="24">
            <a-card title="详细统计数据">
              <a-table :columns="statisticColumns" :data-source="statisticData" row-key="key">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'count'">
                    <a-tag color="blue">{{ record.count }}</a-tag>
                  </template>
                  <template v-if="column.key === 'percentage'">
                    <a-progress :percent="record.percentage" :show-info="false" />
                  </template>
                </template>
              </a-table>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-card>
  </div>
</template>

<script>
import { 
  DownloadOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'PunishmentStatistics',
  components: {
    DownloadOutlined
  },
  data() {
    return {
      statisticsDimension: 'college',
      startDate: null,
      endDate: null,
      statisticData: [],
      statisticColumns: [
        {
          title: '统计维度',
          dataIndex: 'key',
          key: 'key'
        },
        {
          title: '惩处数量',
          dataIndex: 'count',
          key: 'count'
        },
        {
          title: '占比',
          dataIndex: 'percentage',
          key: 'percentage'
        },
        {
          title: '操作',
          key: 'action',
          customRender: function(text, record) {
            return this.$createElement('a', {
              attrs: { href: 'javascript:void(0)' },
              on: { click: () => this.viewDetails(record.key) }
            }, '查看详情');
          }
        }
      ],
      // 模拟数据
      punishmentData: [
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
        },
        {
          id: 4,
          studentName: '赵六',
          studentId: '2024003',
          college: '大数据学院',
          major: '计算机科学与技术',
          className: '计科2024级1班',
          type: '违纪',
          content: '迟到多次',
          punishmentDate: '2026-03-15',
          entryDate: '2026-03-16',
          status: '待处理'
        },
        {
          id: 5,
          studentName: '孙七',
          studentId: '2023002',
          college: '电气学院',
          major: '电器与信息工程',
          className: '电气2023级1班',
          type: '欠费',
          content: '欠缴住宿费1000元',
          punishmentDate: '2026-02-20',
          entryDate: '2026-02-21',
          status: '已销账'
        }
      ]
    };
  },
  mounted() {
    this.updateStatistics();
  },
  methods: {
    updateStatistics() {
      this.calculateStatistics();
      this.renderCharts();
    },
    
    calculateStatistics() {
      const data = this.punishmentData;
      const dimension = this.statisticsDimension;
      
      // 按维度分组
      const groupedData = {};
      data.forEach(item => {
        let key;
        switch (dimension) {
          case 'college':
            key = item.college;
            break;
          case 'class':
            key = `${item.college}-${item.className}`;
            break;
          case 'type':
            key = item.type;
            break;
          case 'status':
            key = item.status;
            break;
          default:
            key = item.college;
        }
        
        if (!groupedData[key]) {
          groupedData[key] = 0;
        }
        groupedData[key]++;
      });
      
      // 计算总数和百分比
      const total = Object.values(groupedData).reduce((sum, count) => sum + count, 0);
      this.statisticData = Object.entries(groupedData).map(([key, count]) => ({
        key,
        count,
        percentage: Math.round((count / total) * 100)
      }));
    },
    
    renderCharts() {
      // 这里可以集成ECharts等图表库
      console.log('渲染图表:', this.statisticData);
      // 实际项目中可以使用ECharts来渲染饼图和折线图
    },
    
    viewDetails(key) {
      console.log('查看详情:', key);
      this.$message.info(`查看 ${key} 的详细惩处记录`);
    },
    
    exportStatistics() {
      console.log('导出统计数据');
      this.$message.success('导出成功');
    }
  }
};
</script>

<style scoped>
.punishment-statistics {
  padding: 24px;
  background-color: #f0f2f5;
  min-height: 80vh;
}

.filter-section {
  margin-bottom: 24px;
}

.chart-section {
  margin-top: 24px;
}
</style>