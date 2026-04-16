<!-- src/components/TodoList.vue -->
<template>
  <div class="todo-list-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>待办事项</h2>
      <p class="page-desc">管理和处理您的待办任务</p>
    </div>

    <!-- 筛选和操作栏 -->
    <div class="filter-bar">
      <a-space>
        <a-select v-model:value="filterStatus" placeholder="状态筛选" style="width: 120px" @change="handleFilterChange">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="processing">进行中</a-select-option>
          <a-select-option value="warning">待处理</a-select-option>
          <a-select-option value="completed">已完成</a-select-option>
        </a-select>
        <a-select v-model:value="filterPriority" placeholder="优先级筛选" style="width: 120px" @change="handleFilterChange">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="high">紧急</a-select-option>
          <a-select-option value="medium">重要</a-select-option>
          <a-select-option value="low">普通</a-select-option>
        </a-select>
      </a-space>
      <a-button type="primary" @click="refreshData">
        <template #icon><ReloadOutlined /></template>
        刷新
      </a-button>
    </div>

    <!-- 待办列表 -->
    <a-card :bordered="false" class="modern-card">
      <a-list :data-source="filteredTodoList" item-layout="horizontal" class="todo-list">
        <template #renderItem="{ item }">
          <a-list-item class="todo-item">
            <div class="todo-item-left">
              <div class="todo-dot" :class="item.status"></div>
              <div class="todo-content">
                <div class="todo-title">{{ item.title }}</div>
                <div class="todo-desc">{{ item.description }}</div>
                <div class="todo-meta">
                  <span class="todo-time">创建时间：{{ item.createTime }}</span>
                  <span class="todo-deadline" v-if="item.deadline">截止时间：{{ item.deadline }}</span>
                </div>
              </div>
            </div>
            <div class="todo-item-right">
              <a-tag :color="getPriorityColor(item.priority)" size="small">
                {{ item.priorityText }}
              </a-tag>
              <a-space>
                <a-button type="link" size="small" @click="handleTodo(item)">
                  处理
                </a-button>
                <a-button type="link" size="small" danger @click="completeTodo(item)">
                  完成
                </a-button>
              </a-space>
            </div>
          </a-list-item>
        </template>
      </a-list>

      <!-- 空状态 -->
      <a-empty v-if="filteredTodoList.length === 0" description="暂无待办事项" />
    </a-card>

    <!-- 统计信息 -->
    <a-row :gutter="[16, 16]" class="stats-row">
      <a-col :span="6">
        <a-statistic title="总待办" :value="todoList.length" />
      </a-col>
      <a-col :span="6">
        <a-statistic title="紧急" :value="urgentCount" value-style="color: #f5222d" />
      </a-col>
      <a-col :span="6">
        <a-statistic title="重要" :value="importantCount" value-style="color: #faad14" />
      </a-col>
      <a-col :span="6">
        <a-statistic title="已完成" :value="completedCount" value-style="color: #52c41a" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { ReloadOutlined } from '@ant-design/icons-vue';
import todoApi from '@/api/todo';

export default {
  name: 'TodoList',
  components: {
    ReloadOutlined
  },
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      filterStatus: 'all',
      filterPriority: 'all',
      todoList: []
    };
  },
  computed: {
    filteredTodoList() {
      let result = this.todoList;
      
      // 按状态筛选
      if (this.filterStatus !== 'all') {
        result = result.filter(item => item.status === this.filterStatus);
      }
      
      // 按优先级筛选
      if (this.filterPriority !== 'all') {
        result = result.filter(item => item.priority === this.filterPriority);
      }
      
      return result;
    },
    urgentCount() {
      return this.todoList.filter(item => item.priority === 'high').length;
    },
    importantCount() {
      return this.todoList.filter(item => item.priority === 'medium').length;
    },
    completedCount() {
      return this.todoList.filter(item => item.status === 'completed').length;
    }
  },
  mounted() {
    this.loadTodos();
  },
  methods: {
    async loadTodos() {
      try {
        const params = {};
        if (this.filterStatus !== 'all') params.status = this.filterStatus;
        if (this.filterPriority !== 'all') params.priority = this.filterPriority;
        
        const res = await todoApi.getTodos(params);
        if (res.data.success) {
          this.todoList = res.data.data.map(item => ({
            ...item,
            priorityText: item.priority === 'high' ? '紧急' : (item.priority === 'medium' ? '重要' : '普通')
          }));
        }
      } catch (error) {
        console.error('加载待办事项失败:', error);
        this.$message.error('加载数据失败');
      }
    },
    getPriorityColor(priority) {
      const colorMap = {
        'high': 'red',
        'medium': 'orange',
        'low': 'blue'
      };
      return colorMap[priority] || 'default';
    },
    handleFilterChange() {
      // 筛选变化时自动更新
    },
    refreshData() {
      this.loadTodos();
      this.$message.success('数据已刷新');
    },
    handleTodo(item) {
      this.$message.info(`处理待办事项：${item.title}`);
      // 根据标题跳转到对应页面
      if (item.title.includes('成绩审核')) {
        this.$emit('navigate', 'grade-audit');
      } else if (item.title.includes('排课')) {
        this.$emit('navigate', 'course-scheduling');
      } else if (item.title.includes('学籍')) {
        this.$emit('navigate', 'student-status');
      }
    },
    completeTodo(item) {
      this.$confirm({
        title: '确认完成',
        content: `确定要标记"${item.title}"为已完成吗？`,
        onOk: () => {
          item.status = 'completed';
          this.$message.success('已标记为完成');
        }
      });
    }
  }
};
</script>

<style scoped>
.todo-list-page {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.page-desc {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modern-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.todo-list {
  padding: 0 24px;
}

.todo-item {
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.3s ease;
}

.todo-item:hover {
  background: #fafafa;
  margin: 0 -24px;
  padding: 16px 24px;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.todo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.todo-dot.processing {
  background: #1890ff;
}

.todo-dot.warning {
  background: #faad14;
}

.todo-dot.completed {
  background: #52c41a;
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
}

.todo-desc {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.todo-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #bbb;
}

.todo-time {
  color: #bbb;
}

.todo-deadline {
  color: #ff4d4f;
}

.todo-item-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.stats-row {
  margin-top: 24px;
}
</style>
