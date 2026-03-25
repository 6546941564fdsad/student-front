<!-- src/App.vue -->
<template>
  <div id="app">
    <div v-if="isLoggedIn">
      <a-layout class="app-layout">
        <!-- 头部 -->
        <a-layout-header class="header">
          <div class="logo">学生管理系统</div>
          <a-menu mode="horizontal" :selected-keys="[currentMenu]" class="menu">
            <a-menu-item key="dashboard">
              <template #icon><DashboardOutlined /></template>
              首页仪表盘
            </a-menu-item>
          </a-menu>
          <div class="user-info">
            <a-dropdown>
              <a-button type="text">
                欢迎，{{ user.username }}
                <template #icon><down-outlined /></template>
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="logout">
                    <template #icon><logout-outlined /></template>
                    登出
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </a-layout-header>
        
        <!-- 身体 -->
        <a-layout>
          <!-- 侧栏 -->
          <a-layout-sider 
            width="200" 
            collapsible 
            v-model:collapsed="collapsed"
            class="sider"
          >
            <div class="logo-collapsed" v-if="collapsed">
              <span>学生系统</span>
            </div>
            <a-menu
              mode="inline"
              :selected-keys="[selectedSideMenu]"
              class="side-menu"
              @click="handleSideMenuClick"
            >
              <!-- 一级分类 -->
              <a-sub-menu key="students">
                <template #title>
                  <span>
                    <UserOutlined />
                    <span>学生管理</span>
                  </span>
                </template>
                <a-menu-item key="student-list">学生列表</a-menu-item>
                <a-menu-item key="student-profile">学生档案</a-menu-item>
                <a-menu-item key="student-statistics">学生统计</a-menu-item>
              </a-sub-menu>
              
              <a-sub-menu key="courses">
                <template #title>
                  <span>
                    <BookOutlined />
                    <span>课程管理</span>
                  </span>
                </template>
                <a-menu-item key="course-list">课程列表</a-menu-item>
                <a-menu-item key="course-scheduling">排课管理</a-menu-item>
                <a-menu-item key="course-selection">选课管理</a-menu-item>
              </a-sub-menu>
              
              <a-sub-menu key="grades">
                <template #title>
                  <span>
                    <FormOutlined />
                    <span>成绩管理</span>
                  </span>
                </template>
                <a-menu-item key="grade-entry">成绩录入</a-menu-item>
                <a-menu-item key="grade-audit">成绩审核</a-menu-item>
                <a-menu-item key="grade-analysis">成绩分析</a-menu-item>
              </a-sub-menu>
              
              <a-sub-menu key="system">
                <template #title>
                  <span>
                    <SettingOutlined />
                    <span>系统管理</span>
                  </span>
                </template>
                <a-menu-item key="user-management">
                  <template #icon><UserSwitchOutlined /></template>
                  用户管理
                </a-menu-item>
                <a-menu-item key="permission-management">
                  <template #icon><LockOutlined /></template>
                  权限管理
                </a-menu-item>
                <a-menu-item key="operation-log">
                  <template #icon><FileTextOutlined /></template>
                  操作日志
                </a-menu-item>
                <a-menu-item key="data-backup">
                  <template #icon><DatabaseOutlined /></template>
                  数据备份
                </a-menu-item>
              </a-sub-menu>
            </a-menu>
          </a-layout-sider>
          
          <!-- 主内容 -->
          <a-layout-content class="content">
            <component :is="currentComponent" />
          </a-layout-content>
        </a-layout>
        
        <!-- 脚 -->
        <a-layout-footer class="footer">
          <div class="footer-content">
            <p>© 2026 学生管理系统 版权所有</p>
            <p>版本 1.0.0</p>
          </div>
        </a-layout-footer>
      </a-layout>
    </div>
    <Login v-else @login-success="handleLoginSuccess" />
  </div>
</template>

<script>
import StudentList from './components/StudentList.vue';
import StudentProfile from './components/StudentProfile.vue';
import StudentStatistics from './components/StudentStatistics.vue';
import CourseList from './components/CourseList.vue';
import CourseScheduling from './components/CourseScheduling.vue';
import CourseSelection from './components/CourseSelection.vue';
import GradeEntry from './components/GradeEntry.vue';
import GradeAudit from './components/GradeAudit.vue';
import GradeAnalysis from './components/GradeAnalysis.vue';
import Login from './components/Login.vue';
import { 
  DownOutlined, 
  LogoutOutlined,
  UserOutlined,
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  PieChartOutlined,
  BookOutlined,
  FormOutlined,
  DashboardOutlined,
  SettingOutlined,
  UserSwitchOutlined,
  DatabaseOutlined,
  LockOutlined,
  FileTextOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'App',
  components: {
    StudentList,
    StudentProfile,
    StudentStatistics,
    CourseList,
    CourseScheduling,
    CourseSelection,
    GradeEntry,
    GradeAudit,
    GradeAnalysis,
    Login,
    DownOutlined,
    LogoutOutlined,
    UserOutlined,
    PlusOutlined,
    UploadOutlined,
    DownloadOutlined,
    PieChartOutlined,
    BookOutlined,
    FormOutlined,
    DashboardOutlined,
    SettingOutlined,
    UserSwitchOutlined,
    DatabaseOutlined,
    LockOutlined,
    FileTextOutlined
  },
  data() {
    return {
      isLoggedIn: false,
      user: null,
      currentMenu: 'dashboard',
      selectedSideMenu: 'student-list',
      collapsed: false,
      currentComponent: 'StudentList'
    };
  },
  mounted() {
    // 检查本地存储中是否有用户信息
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.user = JSON.parse(userStr);
        this.isLoggedIn = true;
      }
    },
    handleLoginSuccess() {
      this.checkLoginStatus();
    },
    logout() {
      // 清除本地存储中的用户信息
      localStorage.removeItem('user');
      this.isLoggedIn = false;
      this.user = null;
    },
    handleSideMenuClick({ key }) {
      this.selectedSideMenu = key;
      // 根据选择的菜单项切换组件
      switch (key) {
        // 学生管理
        case 'student-list':
          this.currentComponent = 'StudentList';
          break;
        case 'student-profile':
          this.currentComponent = 'StudentProfile';
          break;
        case 'student-statistics':
          this.currentComponent = 'StudentStatistics';
          break;
        // 课程管理
        case 'course-list':
          this.currentComponent = 'CourseList';
          break;
        case 'course-scheduling':
          this.currentComponent = 'CourseScheduling';
          break;
        case 'course-selection':
          this.currentComponent = 'CourseSelection';
          break;
        // 成绩管理
        case 'grade-entry':
          this.currentComponent = 'GradeEntry';
          break;
        case 'grade-audit':
          this.currentComponent = 'GradeAudit';
          break;
        case 'grade-analysis':
          this.currentComponent = 'GradeAnalysis';
          break;
        default:
          this.currentComponent = 'StudentList';
      }
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

.app-layout {
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background-color: #1890ff;
  height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-right: 24px;
}

.logo-collapsed {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  background-color: #1890ff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu {
  flex: 1;
}

/* 强制覆盖 Ant Design 的默认样式 */
.menu :deep(.ant-menu-item) {
  color: white !important;
  opacity: 1 !important;
  font-weight: 500;
}

.menu :deep(.ant-menu-item-selected) {
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  opacity: 1 !important;
}

.menu :deep(.ant-menu-item:hover) {
  color: white !important;
  opacity: 1 !important;
}

.user-info {
  margin-left: 24px;
}

.user-info .ant-btn {
  color: white !important;
  opacity: 1 !important;
}

.sider {
  background-color: #001529;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.side-menu {
  height: 100%;
  border-right: none;
}

/* 强制覆盖 Ant Design 的默认样式 */
.side-menu :deep(.ant-menu-item) {
  color: rgba(255, 255, 255, 0.85) !important;
  margin: 8px 0;
  border-radius: 4px;
  opacity: 1 !important;
  font-weight: 500;
}

.side-menu :deep(.ant-menu-item:hover) {
  color: white !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
  opacity: 1 !important;
}

.side-menu :deep(.ant-menu-item-selected) {
  color: white !important;
  background-color: #1890ff !important;
  opacity: 1 !important;
}

.side-menu :deep(.ant-menu-submenu-title) {
  color: rgba(255, 255, 255, 0.85) !important;
  margin: 8px 0;
  border-radius: 4px;
  opacity: 1 !important;
  font-weight: 500;
}

.side-menu :deep(.ant-menu-submenu-title:hover) {
  color: white !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
  opacity: 1 !important;
}

/* 确保子菜单文字也可见 */
.side-menu :deep(.ant-menu-submenu .ant-menu-item) {
  color: rgba(255, 255, 255, 0.85) !important;
  opacity: 1 !important;
}

.side-menu :deep(.ant-menu-submenu .ant-menu-item:hover) {
  color: white !important;
  opacity: 1 !important;
}

.content {
  padding: 24px;
  min-height: calc(100vh - 128px);
  background-color: #f0f2f5;
  overflow: auto;
}

.footer {
  background-color: #001529;
  color: rgba(255, 255, 255, 0.65);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
}

.footer-content {
  text-align: center;
  font-size: 14px;
}

.footer-content p {
  margin: 0;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sider {
    display: none;
  }
  
  .content {
    min-height: calc(100vh - 128px);
  }
}
</style>