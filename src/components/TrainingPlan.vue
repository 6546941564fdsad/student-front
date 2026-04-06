<!-- src/components/TrainingPlan.vue -->
<template>
  <div class="training-plan">
    <a-card title="培养方案">
      <a-tabs v-model:activeKey="activeTab">
        <!-- 理论课程 -->
        <a-tab-pane key="theory" tab="理论课程">
          <a-table :columns="theoryColumns" :data-source="theoryCourses" row-key="id" :pagination="{ pageSize: 10 }">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'type'">
                <a-tag color="blue">{{ record.type }}</a-tag>
              </template>
              <template v-if="column.key === 'required'">
                <a-tag :color="record.required === '必修' ? 'red' : 'green'">{{ record.required }}</a-tag>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        
        <!-- 实践环节 -->
        <a-tab-pane key="practice" tab="实践环节">
          <a-table :columns="practiceColumns" :data-source="practiceCourses" row-key="id" :pagination="{ pageSize: 10 }">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'type'">
                <a-tag color="orange">{{ record.type }}</a-tag>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        
        <!-- 毕业学分要求 -->
        <a-tab-pane key="credit" tab="毕业学分要求">
          <a-card title="毕业学分要求总览">
            <a-row :gutter="16" style="margin-bottom: 16px">
              <a-col :span="6">
                <a-statistic title="总学分要求" :value="totalCredit" suffix="学分" />
              </a-col>
              <a-col :span="6">
                <a-statistic title="已获得学分" :value="obtainedCredit" suffix="学分" :value-style="{ color: '#3f8600' }" />
              </a-col>
              <a-col :span="6">
                <a-statistic title="未获得学分" :value="totalCredit - obtainedCredit" suffix="学分" :value-style="{ color: '#cf1322' }" />
              </a-col>
              <a-col :span="6">
                <a-statistic title="完成进度" :value="progress" suffix="%" :precision="1" />
              </a-col>
            </a-row>
            
            <a-progress :percent="progress" :precision="1" :status="progress >= 100 ? 'success' : 'active'" />
            
            <a-table :columns="creditColumns" :data-source="creditRequirements" row-key="category" :pagination="false" style="margin-top: 16px">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'progress'">
                  <a-progress :percent="record.progress" size="small" :status="record.progress >= 100 ? 'success' : 'active'" />
                </template>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
        
        <!-- 专业课程模块 -->
        <a-tab-pane key="module" tab="专业课程模块">
          <a-collapse v-model:activeKey="activeModules">
            <a-collapse-panel v-for="module in courseModules" :key="module.id" :header="module.name">
              <p><strong>模块说明：</strong>{{ module.description }}</p>
              <p><strong>要求学分：</strong>{{ module.requiredCredit }} 学分</p>
              <a-table :columns="moduleCourseColumns" :data-source="module.courses" row-key="id" :pagination="false" size="small">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'type'">
                    <a-tag :color="record.type === '必修' ? 'red' : 'green'">{{ record.type }}</a-tag>
                  </template>
                </template>
              </a-table>
            </a-collapse-panel>
          </a-collapse>
        </a-tab-pane>
        
        <!-- 专业课组 -->
        <a-tab-pane key="group" tab="专业课组">
          <a-table :columns="groupColumns" :data-source="courseGroups" row-key="id" :pagination="false">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'courses'">
                <a-space direction="vertical">
                  <a-tag v-for="course in record.courses" :key="course">{{ course }}</a-tag>
                </a-space>
              </template>
              <template v-if="column.key === 'required'">
                至少选择 {{ record.requiredCount }} 门
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
export default {
  name: 'TrainingPlan',
  data() {
    return {
      activeTab: 'theory',
      activeModules: ['1'],
      totalCredit: 160,
      obtainedCredit: 120,
      theoryCourses: [
        { id: 1, code: 'CS101', name: '高等数学', credit: 5, type: '公共基础课', required: '必修', semester: '第一学期' },
        { id: 2, code: 'CS102', name: '大学英语', credit: 4, type: '公共基础课', required: '必修', semester: '第一学期' },
        { id: 3, code: 'CS201', name: '数据结构', credit: 4, type: '专业基础课', required: '必修', semester: '第三学期' },
        { id: 4, code: 'CS202', name: '操作系统', credit: 3, type: '专业基础课', required: '必修', semester: '第四学期' }
      ],
      practiceCourses: [
        { id: 1, name: '军事训练', credit: 2, type: '集中实践', duration: '2周', semester: '第一学期' },
        { id: 2, name: '课程设计', credit: 2, type: '集中实践', duration: '2周', semester: '第四学期' },
        { id: 3, name: '毕业实习', credit: 4, type: '集中实践', duration: '8周', semester: '第七学期' },
        { id: 4, name: '毕业设计', credit: 8, type: '集中实践', duration: '16周', semester: '第八学期' }
      ],
      creditRequirements: [
        { category: '公共基础课', required: 50, obtained: 45, progress: 90 },
        { category: '专业基础课', required: 40, obtained: 35, progress: 87.5 },
        { category: '专业核心课', required: 30, obtained: 20, progress: 66.7 },
        { category: '专业选修课', required: 15, obtained: 10, progress: 66.7 },
        { category: '集中实践', required: 25, obtained: 10, progress: 40 }
      ],
      courseModules: [
        {
          id: '1',
          name: '软件开发方向',
          description: '培养软件开发能力，掌握主流开发技术',
          requiredCredit: 20,
          courses: [
            { id: 1, name: 'Java程序设计', credit: 3, type: '必修' },
            { id: 2, name: 'Web前端开发', credit: 2, type: '必修' },
            { id: 3, name: '数据库原理', credit: 3, type: '必修' },
            { id: 4, name: '软件工程', credit: 2, type: '选修' }
          ]
        },
        {
          id: '2',
          name: '人工智能方向',
          description: '培养人工智能应用能力',
          requiredCredit: 18,
          courses: [
            { id: 1, name: '机器学习', credit: 3, type: '必修' },
            { id: 2, name: '深度学习', credit: 3, type: '必修' },
            { id: 3, name: '自然语言处理', credit: 2, type: '选修' }
          ]
        }
      ],
      courseGroups: [
        { id: 1, name: '专业选修课组A', requiredCount: 3, courses: ['Java程序设计', 'Python编程', 'Web前端开发', '移动应用开发'] },
        { id: 2, name: '专业选修课组B', requiredCount: 2, courses: ['机器学习', '深度学习', '计算机视觉', '自然语言处理'] }
      ],
      theoryColumns: [
        { title: '课程编号', dataIndex: 'code', key: 'code', width: 100 },
        { title: '课程名称', dataIndex: 'name', key: 'name', width: 150 },
        { title: '学分', dataIndex: 'credit', key: 'credit', width: 80 },
        { title: '课程类型', key: 'type', width: 120 },
        { title: '修读要求', key: 'required', width: 100 },
        { title: '开设学期', dataIndex: 'semester', key: 'semester', width: 120 }
      ],
      practiceColumns: [
        { title: '实践名称', dataIndex: 'name', key: 'name', width: 150 },
        { title: '学分', dataIndex: 'credit', key: 'credit', width: 80 },
        { title: '实践类型', key: 'type', width: 120 },
        { title: '实践时长', dataIndex: 'duration', key: 'duration', width: 120 },
        { title: '开设学期', dataIndex: 'semester', key: 'semester', width: 120 }
      ],
      creditColumns: [
        { title: '课程类别', dataIndex: 'category', key: 'category', width: 150 },
        { title: '要求学分', dataIndex: 'required', key: 'required', width: 100 },
        { title: '已获得学分', dataIndex: 'obtained', key: 'obtained', width: 120 },
        { title: '完成进度', key: 'progress', width: 200 }
      ],
      moduleCourseColumns: [
        { title: '课程名称', dataIndex: 'name', key: 'name', width: 150 },
        { title: '学分', dataIndex: 'credit', key: 'credit', width: 80 },
        { title: '修读类型', key: 'type', width: 100 }
      ],
      groupColumns: [
        { title: '课组名称', dataIndex: 'name', key: 'name', width: 200 },
        { title: '课程列表', key: 'courses' },
        { title: '选择要求', key: 'required', width: 150 }
      ]
    };
  },
  computed: {
    progress() {
      return (this.obtainedCredit / this.totalCredit * 100).toFixed(1);
    }
  }
};
</script>

<style scoped>
.training-plan {
  padding: 20px;
}
</style>
