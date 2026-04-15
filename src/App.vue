<!-- src/App.vue -->
<template>
  <div id="app">
    <div v-if="isLoggedIn">
      <a-layout class="app-layout">
        <!-- 头部 -->
        <a-layout-header class="header">
          <!-- 左侧 Logo -->
          <div class="header-left">
            <div class="logo">
              <h1>教务后台管理系统</h1>
            </div>
          </div>
          
          <!-- 中间导航 -->
          <div class="header-center">
            <!-- 移除首页仪表盘 -->
          </div>
          
          <!-- 右侧导航栏 -->
          <div class="header-right">
            <a-menu mode="horizontal" theme="dark" class="right-menu">
              <a-menu-item key="home">
                <template #icon><HomeOutlined /></template>
                <span>首页</span>
              </a-menu-item>
              <a-menu-item key="main">
                <template #icon><AppstoreOutlined /></template>
                <span>主控</span>
              </a-menu-item>
              <a-menu-item key="search">
                <template #icon><SearchOutlined /></template>
                <span>搜索</span>
              </a-menu-item>
              <!-- 更多选项 -->
              <a-sub-menu key="more">
                <template #icon><MoreOutlined /></template>
                <template #title><span>更多</span></template>
                <a-menu-item key="theme">
                  <template #icon><ExperimentOutlined /></template>
                  <span>主题</span>
                </a-menu-item>
                <a-menu-item key="history">
                  <template #icon><ClockOutlined /></template>
                  <span>历史</span>
                </a-menu-item>
                <a-menu-item key="favorite">
                  <template #icon><HeartOutlined /></template>
                  <span>关注</span>
                </a-menu-item>
              </a-sub-menu>
            </a-menu>
            <a-dropdown>
              <a-button type="text" class="user-button">
                <span class="welcome-text">欢迎, {{ user.username }}</span>
                <down-outlined />
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="logout">
                    <template #icon><logout-outlined /></template>
                    退出登录
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
              <span>教务后台</span>
            </div>
            <a-menu
              mode="inline"
              theme="dark"
              :selected-keys="[selectedSideMenu]"
              class="side-menu"
              @click="handleSideMenuClick"
            >
              <!-- 系统概览 -->
              <a-sub-menu key="dashboard-group" v-if="checkPermission('data-stats') || checkPermission('todo-list') || checkPermission('system-notice')">
                <template #icon><DashboardOutlined /></template>
                <template #title>
                  <span>系统概览</span>
                </template>
                <a-menu-item key="data-stats" v-if="checkPermission('data-stats')">
                  <span>数据统计</span>
                </a-menu-item>
                <a-menu-item key="todo-list" v-if="checkPermission('todo-list')">
                  <span>待办事项</span>
                </a-menu-item>
                <a-menu-item key="system-notice" v-if="checkPermission('system-notice')">
                  <span>系统公告</span>
                </a-menu-item>
              </a-sub-menu>
              
              <!-- 学生管理 -->
              <a-sub-menu key="student-group" v-if="checkPermission('student-archives') || checkPermission('student-status') || checkPermission('student-punishment') || checkPermission('graduation-audit')">
                <template #icon><UserOutlined /></template>
                <template #title>
                  <span>学生管理</span>
                </template>
                <a-menu-item key="student-archives" v-if="checkPermission('student-archives')">
                  <span>学生档案</span>
                </a-menu-item>
                <a-menu-item key="student-status" v-if="checkPermission('student-status')">
                  <span>学籍管理</span>
                </a-menu-item>
                <a-menu-item key="student-punishment" v-if="checkPermission('student-punishment')">
                  <span>奖惩管理</span>
                </a-menu-item>
                <a-menu-item key="graduation-audit" v-if="checkPermission('graduation-audit')">
                  <span>毕业审核</span>
                </a-menu-item>
              </a-sub-menu>
              
              <!-- 课程管理 -->
              <a-sub-menu key="course-group" v-if="checkPermission('course-library') || checkPermission('training-plan') || checkPermission('teaching-plan') || checkPermission('course-scheduling')">
                <template #icon><BookOutlined /></template>
                <template #title>
                  <span>课程管理</span>
                </template>
                <a-menu-item key="course-library" v-if="checkPermission('course-library')">
                  <span>课程库管理</span>
                </a-menu-item>
                <a-menu-item key="training-plan" v-if="checkPermission('training-plan')">
                  <span>培养方案管理</span>
                </a-menu-item>
                <a-menu-item key="teaching-plan" v-if="checkPermission('teaching-plan')">
                  <span>教学计划</span>
                </a-menu-item>
                <a-menu-item key="course-scheduling" v-if="checkPermission('course-scheduling')">
                  <span>课程排课</span>
                </a-menu-item>
              </a-sub-menu>
              
              <!-- 教师管理 -->
              <a-sub-menu key="teacher-group" v-if="checkPermission('teacher-archives') || checkPermission('teaching-task') || checkPermission('teacher-evaluation')">
                <template #icon><TeamOutlined /></template>
                <template #title>
                  <span>教师管理</span>
                </template>
                <a-menu-item key="teacher-archives" v-if="checkPermission('teacher-archives')">
                  <span>教师档案</span>
                </a-menu-item>
                <a-menu-item key="teaching-task" v-if="checkPermission('teaching-task')">
                  <span>教学任务</span>
                </a-menu-item>
                <a-menu-item key="teacher-evaluation" v-if="checkPermission('teacher-evaluation')">
                  <span>教师评价</span>
                </a-menu-item>
              </a-sub-menu>
              
              <!-- 成绩管理 -->
              <a-sub-menu key="grade-group" v-if="checkPermission('grade-management') || checkPermission('grade-entry') || checkPermission('grade-audit') || checkPermission('grade-analysis') || checkPermission('grade-export')">
                <template #icon><BarChartOutlined /></template>
                <template #title>
                  <span>成绩管理</span>
                </template>
                <a-menu-item key="grade-management" v-if="checkPermission('grade-management')">
                  <span>成绩管理</span>
                </a-menu-item>
                <a-menu-item key="grade-entry" v-if="checkPermission('grade-entry')">
                  <span>成绩录入</span>
                </a-menu-item>
                <a-menu-item key="grade-audit" v-if="checkPermission('grade-audit')">
                  <span>成绩审核</span>
                </a-menu-item>
                <a-menu-item key="grade-analysis" v-if="checkPermission('grade-analysis')">
                  <span>成绩分析</span>
                </a-menu-item>
                <a-menu-item key="grade-export" v-if="checkPermission('grade-export')">
                  <span>成绩导出</span>
                </a-menu-item>
              </a-sub-menu>
              
              <!-- 教学运行 -->
              <a-sub-menu key="teaching-group" v-if="checkPermission('course-selection') || checkPermission('attendance-management') || checkPermission('exam-arrangement') || checkPermission('internship-management')">
                <template #icon><ClockCircleOutlined /></template>
                <template #title>
                  <span>教学运行</span>
                </template>
                <a-menu-item key="course-selection" v-if="checkPermission('course-selection')">
                  <span>选课管理</span>
                </a-menu-item>
                <a-menu-item key="attendance-management" v-if="checkPermission('attendance-management')">
                  <span>考勤管理</span>
                </a-menu-item>
                <a-menu-item key="exam-arrangement" v-if="checkPermission('exam-arrangement')">
                  <span>考试安排</span>
                </a-menu-item>
                <a-menu-item key="internship-management" v-if="checkPermission('internship-management')">
                  <span>实习管理</span>
                </a-menu-item>
              </a-sub-menu>
              
              <!-- 创新创业 -->
              <a-sub-menu key="innovation-group" v-if="checkPermission('competition-management') || checkPermission('project-management') || checkPermission('credit-recognition')">
                <template #icon><TrophyOutlined /></template>
                <template #title>
                  <span>创新创业</span>
                </template>
                <a-menu-item key="competition-management" v-if="checkPermission('competition-management')">
                  <span>竞赛管理</span>
                </a-menu-item>
                <a-menu-item key="project-management" v-if="checkPermission('project-management')">
                  <span>项目管理</span>
                </a-menu-item>
                <a-menu-item key="credit-recognition" v-if="checkPermission('credit-recognition')">
                  <span>学分认定</span>
                </a-menu-item>
              </a-sub-menu>
              
              <!-- 毕业设计(论文) -->
              <a-sub-menu key="thesis-group" v-if="checkPermission('thesis-proposal') || checkPermission('thesis-midterm') || checkPermission('defense-management') || checkPermission('thesis-grade')">
                <template #icon><FileAddOutlined /></template>
                <template #title>
                  <span>毕业设计(论文)</span>
                </template>
                <a-menu-item key="thesis-proposal" v-if="checkPermission('thesis-proposal')">
                  <span>开题管理</span>
                </a-menu-item>
                <a-menu-item key="thesis-midterm" v-if="checkPermission('thesis-midterm')">
                  <span>中期检查</span>
                </a-menu-item>
                <a-menu-item key="defense-management" v-if="checkPermission('defense-management')">
                  <span>答辩管理</span>
                </a-menu-item>
                <a-menu-item key="thesis-grade" v-if="checkPermission('thesis-grade')">
                  <span>成绩管理</span>
                </a-menu-item>
              </a-sub-menu>
              
              <!-- 教学质量管理 -->
              <a-sub-menu key="quality-group" v-if="checkPermission('teaching-evaluation') || checkPermission('academic-warning') || checkPermission('course-change')">
                <template #icon><StarOutlined /></template>
                <template #title>
                  <span>教学质量管理</span>
                </template>
                <a-menu-item key="teaching-evaluation" v-if="checkPermission('teaching-evaluation')">
                  <span>教学评教</span>
                </a-menu-item>
                <a-menu-item key="academic-warning" v-if="checkPermission('academic-warning')">
                  <span>学业预警</span>
                </a-menu-item>
                <a-menu-item key="course-change" v-if="checkPermission('course-change')">
                  <span>调课管理</span>
                </a-menu-item>
              </a-sub-menu>
              
              <!-- 系统设置 -->
              <a-sub-menu key="system-group" v-if="checkPermission('user-management') || checkPermission('role-permission') || checkPermission('data-dictionary') || checkPermission('system-log')">
                <template #icon><SettingOutlined /></template>
                <template #title>
                  <span>系统设置</span>
                </template>
                <a-menu-item key="user-management" v-if="checkPermission('user-management')">
                  <span>用户管理</span>
                </a-menu-item>
                <a-menu-item key="role-permission" v-if="checkPermission('role-permission')">
                  <span>角色权限</span>
                </a-menu-item>
                <a-menu-item key="data-dictionary" v-if="checkPermission('data-dictionary')">
                  <span>数据字典</span>
                </a-menu-item>
                <a-menu-item key="system-log" v-if="checkPermission('system-log')">
                  <span>系统日志</span>
                </a-menu-item>
              </a-sub-menu>
            </a-menu>
          </a-layout-sider>
          
          <!-- 主内容 -->
          <a-layout-content class="content">
            <!-- 面包屑导航 -->
            <div class="breadcrumb-bar">
              <a-breadcrumb>
                <a-breadcrumb-item>{{ currentParentMenu }}</a-breadcrumb-item>
                <a-breadcrumb-item>{{ currentChildMenu }}</a-breadcrumb-item>
              </a-breadcrumb>
            </div>
            <div>
              <!-- 动态组件 - 每个组件独立渲染 -->
              <DataStats v-if="currentComponent === 'DataStats'" :key="contentKey + '-data-stats'" :user="user" />
              <TodoList v-if="currentComponent === 'TodoList'" :key="contentKey + '-todo-list'" :user="user" />
              <SystemNotice v-if="currentComponent === 'SystemNotice'" :key="contentKey + '-system-notice'" :user="user" />
              <StudentArchives v-if="currentComponent === 'StudentArchives'" :key="contentKey + '-student-archives'" :user="user" />
              <StudentStatus v-if="currentComponent === 'StudentStatus'" :key="contentKey + '-student-status'" :user="user" />
              <StudentPunishment v-if="currentComponent === 'StudentPunishment'" :key="contentKey + '-student-punishment'" :user="user" />
              <GraduationAudit v-if="currentComponent === 'GraduationAudit'" :key="contentKey + '-graduation-audit'" :user="user" />
              <CourseLibrary v-if="currentComponent === 'CourseLibrary'" :key="contentKey + '-course-library'" :user="user" />
              <TrainingPlan v-if="currentComponent === 'TrainingPlan'" :key="contentKey + '-training-plan'" :user="user" />
              <TeachingSchedule v-if="currentComponent === 'TeachingSchedule'" :key="contentKey + '-teaching-schedule'" :user="user" />
              <CourseScheduling v-if="currentComponent === 'CourseScheduling'" :key="contentKey + '-course-scheduling'" :user="user" />
              <TeacherManagement v-if="currentComponent === 'TeacherManagement'" :key="contentKey + '-teacher-management'" :user="user" />
              <TeachingTask v-if="currentComponent === 'TeachingTask'" :key="contentKey + '-teaching-task'" :user="user" />
              <GradeManagement v-if="currentComponent === 'GradeManagement'" :key="contentKey + '-grade-management'" :user="user" />
              <GradeEntry v-if="currentComponent === 'GradeEntry'" :key="contentKey + '-grade-entry'" :user="user" />
              <GradeAudit v-if="currentComponent === 'GradeAudit'" :key="contentKey + '-grade-audit'" :user="user" />
              <GradeAnalysis v-if="currentComponent === 'GradeAnalysis'" :key="contentKey + '-grade-analysis'" :user="user" />
              <GradeExport v-if="currentComponent === 'GradeExport'" :key="contentKey + '-grade-export'" :user="user" />
              <CourseSelectionManagement v-if="currentComponent === 'CourseSelectionManagement'" :key="contentKey + '-course-selection'" :user="user" />
              <AttendanceManagement v-if="currentComponent === 'AttendanceManagement'" :key="contentKey + '-attendance'" :user="user" />
              <ExamArrangement v-if="currentComponent === 'ExamArrangement'" :key="contentKey + '-exam-arrangement'" :user="user" />
              <InnovationManagement v-if="currentComponent === 'InnovationManagement'" :key="contentKey + '-innovation'" :user="user" />
              <CompetitionManagement v-if="currentComponent === 'CompetitionManagement'" :key="contentKey + '-competition-management'" :user="user" />
              <ProjectManagement v-if="currentComponent === 'ProjectManagement'" :key="contentKey + '-project-management'" :user="user" />
              <CreditRecognition v-if="currentComponent === 'CreditRecognition'" :key="contentKey + '-credit-recognition'" :user="user" />
              <ThesisManagement v-if="currentComponent === 'ThesisManagement'" :key="contentKey + '-thesis'" :user="user" />
              <ThesisProposal v-if="currentComponent === 'ThesisProposal'" :key="contentKey + '-thesis-proposal'" :user="user" />
              <ThesisMidterm v-if="currentComponent === 'ThesisMidterm'" :key="contentKey + '-thesis-midterm'" :user="user" />
              <DefenseManagement v-if="currentComponent === 'DefenseManagement'" :key="contentKey + '-defense-management'" :user="user" />
              <ThesisGrade v-if="currentComponent === 'ThesisGrade'" :key="contentKey + '-thesis-grade'" :user="user" />
              <UserManagement v-if="currentComponent === 'UserManagement'" :key="contentKey + '-user-management'" :user="user" />
              <RoleManagement v-if="currentComponent === 'RoleManagement'" :key="contentKey + '-role-management'" :user="user" />
              <DataDictionary v-if="currentComponent === 'DataDictionary'" :key="contentKey + '-data-dictionary'" :user="user" />
              <SystemLog v-if="currentComponent === 'SystemLog'" :key="contentKey + '-system-log'" :user="user" />
              <TeachingEvaluation v-if="currentComponent === 'TeachingEvaluation'" :key="contentKey + '-teaching-evaluation'" :user="user" />
              <AcademicWarning v-if="currentComponent === 'AcademicWarning'" :key="contentKey + '-academic-warning'" :user="user" />
              <CourseChange v-if="currentComponent === 'CourseChange'" :key="contentKey + '-course-change'" :user="user" />
              <TeacherEvaluation v-if="currentComponent === 'TeacherEvaluation'" :key="contentKey + '-teacher-evaluation'" :user="user" />
              <InternshipManagement v-if="currentComponent === 'InternshipManagement'" :key="contentKey + '-internship-management'" :user="user" />
              <Dashboard v-show="currentComponent !== 'DataStats' && currentComponent !== 'TodoList' && currentComponent !== 'SystemNotice' && currentComponent !== 'StudentArchives' && currentComponent !== 'StudentStatus' && currentComponent !== 'StudentPunishment' && currentComponent !== 'GraduationAudit' && currentComponent !== 'CourseLibrary' && currentComponent !== 'TrainingPlan' && currentComponent !== 'TeachingSchedule' && currentComponent !== 'CourseScheduling' && currentComponent !== 'TeacherManagement' && currentComponent !== 'TeachingTask' && currentComponent !== 'GradeManagement' && currentComponent !== 'CourseSelectionManagement' && currentComponent !== 'AttendanceManagement' && currentComponent !== 'ExamArrangement' && currentComponent !== 'InnovationManagement' && currentComponent !== 'ThesisManagement' && currentComponent !== 'UserManagement' && currentComponent !== 'RoleManagement' && currentComponent !== 'DataDictionary' && currentComponent !== 'SystemLog'" :key="contentKey + '-dashboard'" :user="user" />
            </div>
          </a-layout-content>
        </a-layout>
        
        <!-- 脚 -->
        <a-layout-footer class="footer">
          <div class="footer-content">
            <p>© 2026 教务后台管理系统 版权所有</p>
            <p>版本 1.0.0</p>
          </div>
        </a-layout-footer>
      </a-layout>
    </div>
    <Login v-else @login-success="handleLoginSuccess" />
  </div>
</template>

<script>
import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';
import DataStats from './components/DataStats.vue';
import TodoList from './components/TodoList.vue';
import SystemNotice from './components/SystemNotice.vue';
import StudentArchives from './components/StudentArchives.vue';
import StudentStatus from './components/StudentStatus.vue';
import StudentPunishment from './components/StudentPunishment.vue';
import GraduationAudit from './components/GraduationAudit.vue';
import CourseLibrary from './components/CourseLibrary.vue';
import TrainingPlan from './components/TrainingPlan.vue';
import TeachingSchedule from './components/TeachingSchedule.vue';
import CourseScheduling from './components/CourseScheduling.vue';
import UserManagement from './components/UserManagement.vue';
import TeacherManagement from './components/TeacherManagement.vue';
import TeachingTask from './components/TeachingTask.vue';
import GradeManagement from './components/GradeManagement.vue';
import GradeEntry from './components/GradeEntry.vue';
import GradeAudit from './components/GradeAudit.vue';
import GradeAnalysis from './components/GradeAnalysis.vue';
import GradeExport from './components/GradeExport.vue';
import CourseSelectionManagement from './components/CourseSelectionManagement.vue';
import AttendanceManagement from './components/AttendanceManagement.vue';
import ExamArrangement from './components/ExamArrangement.vue';
import InnovationManagement from './components/InnovationManagement.vue';
import CompetitionManagement from './components/CompetitionManagement.vue';
import ProjectManagement from './components/ProjectManagement.vue';
import CreditRecognition from './components/CreditRecognition.vue';
import ThesisManagement from './components/ThesisManagement.vue';
import ThesisProposal from './components/ThesisProposal.vue';
import ThesisMidterm from './components/ThesisMidterm.vue';
import DefenseManagement from './components/DefenseManagement.vue';
import ThesisGrade from './components/ThesisGrade.vue';
import RoleManagement from './components/RoleManagement.vue';
import DataDictionary from './components/DataDictionary.vue';
import SystemLog from './components/SystemLog.vue';
import TeachingEvaluation from './components/TeachingEvaluation.vue';
import AcademicWarning from './components/AcademicWarning.vue';
import CourseChange from './components/CourseChange.vue';
import TeacherEvaluation from './components/TeacherEvaluation.vue';
import InternshipManagement from './components/InternshipManagement.vue';
import { hasPermission } from './utils/permission';
import { 
  DownOutlined, 
  LogoutOutlined,
  UserOutlined,
  TeamOutlined,
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
  FileTextOutlined,
  AlertOutlined,
  CalendarOutlined,
  IdcardOutlined,
  ShoppingCartOutlined,
  ScheduleOutlined,
  ClockCircleOutlined,
  SolutionOutlined,
  FileSearchOutlined,
  SafetyCertificateOutlined,
  RedoOutlined,
  BarChartOutlined,
  BulbOutlined,
  ReadOutlined,
  HomeOutlined,
  AppstoreOutlined,
  SearchOutlined,
  ExperimentOutlined,
  ClockCircleOutlined as ClockOutlined,
  HeartOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  StopOutlined,
  SwapOutlined,
  ThunderboltOutlined,
  BellOutlined,
  NotificationOutlined,
  ExclamationCircleOutlined,
  StarOutlined,
  EditOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  ProjectOutlined,
  CreditCardOutlined,
  FileAddOutlined,
  SoundOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'App',
  components: {
    Login,
    Dashboard,
    DataStats,
    TodoList,
    SystemNotice,
    StudentArchives,
    StudentStatus,
    StudentPunishment,
    GraduationAudit,
    CourseLibrary,
    TrainingPlan,
    TeachingSchedule,
    CourseScheduling,
    UserManagement,
    TeacherManagement,
    TeachingTask,
    GradeManagement,
    GradeEntry,
    GradeAudit,
    GradeAnalysis,
    GradeExport,
    CourseSelectionManagement,
    AttendanceManagement,
    ExamArrangement,
    InnovationManagement,
    CompetitionManagement,
    ProjectManagement,
    CreditRecognition,
    ThesisManagement,
    ThesisProposal,
    ThesisMidterm,
    DefenseManagement,
    ThesisGrade,
    RoleManagement,
    DataDictionary,
    SystemLog,
    TeachingEvaluation,
    AcademicWarning,
    CourseChange,
    TeacherEvaluation,
    InternshipManagement,
    DownOutlined,
    LogoutOutlined,
    UserOutlined,
    TeamOutlined,
    HomeOutlined,
    AppstoreOutlined,
    SearchOutlined,
    ExperimentOutlined,
    ClockOutlined,
    HeartOutlined,
    MoreOutlined,
    PlayCircleOutlined,
    StopOutlined,
    SwapOutlined,
    ReadOutlined,
    ThunderboltOutlined,
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
    FileTextOutlined,
    AlertOutlined,
    CalendarOutlined,
    IdcardOutlined,
    ShoppingCartOutlined,
    ScheduleOutlined,
    ClockCircleOutlined,
    SolutionOutlined,
    FileSearchOutlined,
    SafetyCertificateOutlined,
    BarChartOutlined,
    BulbOutlined,
    BellOutlined,
    NotificationOutlined,
    ExclamationCircleOutlined,
    StarOutlined,
    EditOutlined,
    CheckCircleOutlined,
    TrophyOutlined,
    ProjectOutlined,
    CreditCardOutlined,
    FileAddOutlined,
    SoundOutlined
  },
  data() {
    return {
      isLoggedIn: false,
      user: null,
      userRole: '', // 用户角色
      currentMenu: 'dashboard',
      selectedSideMenu: 'data-stats',
      collapsed: false,
      currentComponent: 'Dashboard',
      contentKey: 0,
      // 菜单映射关系
      menuMap: {
        'data-stats': { parent: '系统概览', child: '数据统计' },
        'todo-list': { parent: '系统概览', child: '待办事项' },
        'system-notice': { parent: '系统概览', child: '系统公告' },
        'student-archives': { parent: '学生管理', child: '学生档案' },
        'student-status': { parent: '学生管理', child: '学籍管理' },
        'student-punishment': { parent: '学生管理', child: '奖惩管理' },
        'graduation-audit': { parent: '学生管理', child: '毕业审核' },
        'course-library': { parent: '课程管理', child: '课程库管理' },
        'training-plan': { parent: '课程管理', child: '培养方案管理' },
        'teaching-plan': { parent: '课程管理', child: '教学计划' },
        'course-scheduling': { parent: '课程管理', child: '课程排课' },
        'teacher-archives': { parent: '教师管理', child: '教师档案' },
        'teaching-task': { parent: '教师管理', child: '教学任务' },
        'teacher-evaluation': { parent: '教师管理', child: '教师评价' },
        'grade-management': { parent: '成绩管理', child: '成绩管理' },
        'grade-entry': { parent: '成绩管理', child: '成绩录入' },
        'grade-audit': { parent: '成绩管理', child: '成绩审核' },
        'grade-analysis': { parent: '成绩管理', child: '成绩分析' },
        'grade-export': { parent: '成绩管理', child: '成绩导出' },
        'course-selection': { parent: '教学运行', child: '选课管理' },
        'attendance-management': { parent: '教学运行', child: '考勤管理' },
        'exam-arrangement': { parent: '教学运行', child: '考试安排' },
        'internship-management': { parent: '教学运行', child: '实习管理' },
        'competition-management': { parent: '创新创业', child: '竞赛管理' },
        'project-management': { parent: '创新创业', child: '项目管理' },
        'credit-recognition': { parent: '创新创业', child: '学分认定' },
        'thesis-proposal': { parent: '毕业设计(论文)', child: '开题管理' },
        'thesis-midterm': { parent: '毕业设计(论文)', child: '中期检查' },
        'defense-management': { parent: '毕业设计(论文)', child: '答辩管理' },
        'thesis-grade': { parent: '毕业设计(论文)', child: '成绩管理' },
        'teaching-evaluation': { parent: '教学质量管理', child: '教学评教' },
        'academic-warning': { parent: '教学质量管理', child: '学业预警' },
        'course-change': { parent: '教学质量管理', child: '调课管理' },
        'user-management': { parent: '系统设置', child: '用户管理' },
        'role-permission': { parent: '系统设置', child: '角色权限' },
        'data-dictionary': { parent: '系统设置', child: '数据字典' },
        'system-log': { parent: '系统设置', child: '系统日志' }
      }
    };
  },
  computed: {
    // 当前父级菜单名称
    currentParentMenu() {
      const menu = this.menuMap[this.selectedSideMenu];
      return menu ? menu.parent : '系统概览';
    },
    // 当前子级菜单名称
    currentChildMenu() {
      const menu = this.menuMap[this.selectedSideMenu];
      return menu ? menu.child : '数据统计';
    }
  },
  mounted() {
    // 检查登录状态，如果已登录则恢复状态
    this.checkLoginStatus();
    
    // 监听 Token 过期事件，自动退出登录（不刷新页面）
    window.addEventListener('token-expired', () => {
      console.log('Token expired, logging out...');
      this.logout();
    });
  },
  methods: {
    checkLoginStatus() {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.user = JSON.parse(userStr);
        this.userRole = this.user.role || 'SUPER_ADMIN';
        this.isLoggedIn = true;
        // 恢复上次访问的菜单项
        const lastMenu = localStorage.getItem('lastMenu');
        if (lastMenu) {
          this.selectedSideMenu = lastMenu;
        }
        // 恢复登录状态后，初始化组件
        this.$nextTick(() => {
          this.handleSideMenuClick({ key: this.selectedSideMenu });
        });
      }
    },
    handleLoginSuccess() {
      // 登录成功后设置状态
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.user = JSON.parse(userStr);
        this.userRole = this.user.role || 'SUPER_ADMIN'; // 从用户信息中获取角色
        this.isLoggedIn = true;
        // 根据默认选中的菜单项设置组件
        this.handleSideMenuClick({ key: this.selectedSideMenu });
      }
    },
    logout() {
      // 清除本地存储中的用户信息和 Token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('lastMenu');
      this.isLoggedIn = false;
      this.user = null;
      this.userRole = '';
      this.selectedSideMenu = 'data-stats';
      this.currentComponent = 'Dashboard';
    },
    // 检查是否有权限访问某个菜单项
    checkPermission(menuKey) {
      return hasPermission(this.userRole, menuKey);
    },
    handleSideMenuClick({ key }) {
      this.selectedSideMenu = key;
      
      // 保存当前菜单项到 localStorage，以便刷新后恢复
      localStorage.setItem('lastMenu', key);
      
      // 使用 nextTick 确保 DOM 更新后再设置新组件
      this.$nextTick(() => {
        // 根据选择的菜单项切换组件
        switch (key) {
          // 系统概览
          case 'data-stats':
            this.currentComponent = 'DataStats';
            break;
          case 'todo-list':
            this.currentComponent = 'TodoList';
            break;
          case 'system-notice':
            this.currentComponent = 'SystemNotice';
            break;
          
          // 学生管理
          case 'student-archives':
            this.currentComponent = 'StudentArchives';
            break;
          case 'student-status':
            this.currentComponent = 'StudentStatus';
            break;
          case 'student-punishment':
            this.currentComponent = 'StudentPunishment';
            break;
          case 'graduation-audit':
            this.currentComponent = 'GraduationAudit';
            break;
          
          // 课程管理
          case 'course-library':
            this.currentComponent = 'CourseLibrary';
            break;
          case 'training-plan':
            this.currentComponent = 'TrainingPlan';
            break;
          case 'teaching-plan':
            this.currentComponent = 'TeachingSchedule';
            break;
          case 'course-scheduling':
            this.currentComponent = 'CourseScheduling';
            break;
          
          // 教师管理
          case 'teacher-archives':
            this.currentComponent = 'TeacherManagement';
            break;
          case 'teaching-task':
            this.currentComponent = 'TeachingTask';
            break;
          case 'teacher-evaluation':
            this.currentComponent = 'TeacherEvaluation';
            break;
          
          // 成绩管理
          case 'grade-management':
            this.currentComponent = 'GradeManagement';
            break;
          case 'grade-entry':
            this.currentComponent = 'GradeEntry';
            break;
          case 'grade-audit':
            this.currentComponent = 'GradeAudit';
            break;
          case 'grade-analysis':
            this.currentComponent = 'GradeAnalysis';
            break;
          case 'grade-export':
            this.currentComponent = 'GradeExport';
            break;
          
          // 教学运行
          case 'course-selection':
            this.currentComponent = 'CourseSelectionManagement';
            break;
          case 'attendance-management':
            this.currentComponent = 'AttendanceManagement';
            break;
          case 'exam-arrangement':
            this.currentComponent = 'ExamArrangement';
            break;
          case 'internship-management':
            this.currentComponent = 'InternshipManagement';
            break;
          
          // 创新创业
          case 'competition-management':
            this.currentComponent = 'CompetitionManagement';
            break;
          case 'project-management':
            this.currentComponent = 'ProjectManagement';
            break;
          case 'credit-recognition':
            this.currentComponent = 'CreditRecognition';
            break;
          
          // 毕业设计(论文)
          case 'thesis-proposal':
            this.currentComponent = 'ThesisProposal';
            break;
          case 'thesis-midterm':
            this.currentComponent = 'ThesisMidterm';
            break;
          case 'defense-management':
            this.currentComponent = 'DefenseManagement';
            break;
          case 'thesis-grade':
            this.currentComponent = 'ThesisGrade';
            break;
          
          // 教学质量管理
          case 'teaching-evaluation':
            this.currentComponent = 'TeachingEvaluation';
            break;
          case 'academic-warning':
            this.currentComponent = 'AcademicWarning';
            break;
          case 'course-change':
            this.currentComponent = 'CourseChange';
            break;
            
          // 系统设置
          case 'user-management':
            this.currentComponent = 'UserManagement';
            break;
          case 'role-permission':
            this.currentComponent = 'RoleManagement';
            break;
          case 'data-dictionary':
            this.currentComponent = 'DataDictionary';
            break;
          case 'system-log':
            this.currentComponent = 'SystemLog';
            break;
            
          default:
            this.currentComponent = 'Dashboard';
        }
        
        // 设置完组件后增加 contentKey，强制重新渲染
        this.contentKey++;
      });
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
  background-color: #001529;
  height: 56px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header-left {
  display: flex;
  align-items: center;
  min-width: 200px;
}

.logo {
  padding: 0 16px;
  background-color: #001529;
}

.logo h1 {
  margin: 0;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  line-height: 56px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.top-menu {
  background: transparent;
  border-bottom: none;
  line-height: 56px;
  min-width: 150px;
}

.top-menu :deep(.ant-menu-item) {
  color: rgba(255, 255, 255, 0.65);
  border-bottom: 2px solid transparent;
  padding: 0 20px;
  font-weight: 500;
  height: 56px;
  line-height: 56px;
}

.top-menu :deep(.ant-menu-item:hover) {
  color: #fff;
  background: transparent;
}

.top-menu :deep(.ant-menu-item-selected) {
  color: #1890ff !important;
  border-bottom: 2px solid #1890ff;
  background: transparent !important;
}

.top-menu :deep(.ant-menu-item .anticon) {
  color: inherit;
}

.header-right {
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 0;
}

.right-menu {
  background: transparent !important;
  border-bottom: none;
  line-height: 56px;
  min-width: auto;
}

/* 减少菜单项之间的间距 */
.right-menu :deep(.ant-menu-item),
.right-menu :deep(.ant-menu-submenu) {
  margin: 0 2px !important;
}

.right-menu :deep(.ant-menu-item) {
  color: #fff !important;
  padding: 0 12px;
  font-weight: 500;
  height: 56px;
  line-height: 56px;
  min-width: auto;
  text-align: center;
}

.right-menu :deep(.ant-menu-item:hover) {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.15) !important;
}

.right-menu :deep(.ant-menu-item-selected) {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.2) !important;
}

.right-menu :deep(.ant-menu-item .anticon) {
  color: #fff !important;
  font-size: 16px;
  margin-right: 6px;
}

.right-menu :deep(.ant-menu-submenu) {
  color: #fff !important;
}

.right-menu :deep(.ant-menu-submenu-title) {
  color: #fff !important;
  padding: 0 12px;
  height: 56px;
  line-height: 56px;
  min-width: auto;
  text-align: center;
}

.right-menu :deep(.ant-menu-submenu-title:hover) {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.15) !important;
}

.right-menu :deep(.ant-menu-submenu .anticon) {
  color: #fff !important;
}

/* 确保下拉菜单完整显示 */
.right-menu :deep(.ant-menu-submenu-popup) {
  z-index: 1050 !important;
}

.right-menu :deep(.ant-menu-submenu .ant-menu-item) {
  padding: 0 16px !important;
  min-width: 120px;
  text-align: left;
}

.user-button {
  color: #fff !important;
  font-size: 14px;
  padding: 0 16px;
  height: 56px;
  border: none;
  background: transparent !important;
}

.welcome-text {
  margin-right: 8px;
}

.user-button :deep(.anticon) {
  color: #fff;
  font-size: 12px;
}

.user-button:hover {
  color: #fff !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

.sider {
  background-color: #001529;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.side-menu {
  height: 100%;
  border-right: none;
}

/* 子菜单标题样式 */
.side-menu :deep(.ant-menu-submenu-title) {
  color: rgba(255, 255, 255, 0.85) !important;
  font-weight: 600;
}

.side-menu :deep(.ant-menu-submenu-title:hover) {
  color: #fff !important;
}

/* 强制覆盖 Ant Design 的默认样式 */
.side-menu :deep(.ant-menu-item) {
  color: rgba(255, 255, 255, 0.85) !important;
  margin: 4px 8px;
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

.content {
  padding: 0;
  min-height: calc(100vh - 128px);
  background-color: #f0f2f5;
  overflow: auto;
}

.breadcrumb-bar {
  padding: 16px 24px;
  background: #fff;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.breadcrumb-bar :deep(.ant-breadcrumb) {
  font-size: 14px;
}

.breadcrumb-bar :deep(.ant-breadcrumb-separator) {
  margin: 0 8px;
}

.breadcrumb-bar :deep(.ant-breadcrumb a) {
  color: rgba(0, 0, 0, 0.45);
  transition: color 0.3s;
}

.breadcrumb-bar :deep(.ant-breadcrumb a:hover) {
  color: #1890ff;
}

.breadcrumb-bar :deep(.ant-breadcrumb li:last-child .ant-breadcrumb-link) {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}

.content > div {
  padding: 0 24px 24px 24px;
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

<style>
/* 全局样式 - 最高优先级覆盖 Ant Design 导航栏颜色 */
.app-layout .header .header-right .right-menu .ant-menu-item,
.app-layout .header .header-right .right-menu .ant-menu-submenu-title,
.app-layout .header .header-right .right-menu .ant-menu-item *,
.app-layout .header .header-right .right-menu .ant-menu-submenu-title *,
.app-layout .header .header-right .right-menu .ant-menu-submenu .ant-menu-item,
.app-layout .header .header-right .right-menu .ant-menu-submenu .ant-menu-item * {
  color: #ffffff !important;
}

.app-layout .header .header-right .right-menu .ant-menu-item:hover,
.app-layout .header .header-right .right-menu .ant-menu-submenu-title:hover,
.app-layout .header .header-right .right-menu .ant-menu-item:hover *,
.app-layout .header .header-right .right-menu .ant-menu-submenu-title:hover * {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.15) !important;
}

.app-layout .header .header-right .right-menu .ant-menu-item-selected,
.app-layout .header .header-right .right-menu .ant-menu-submenu-selected > .ant-menu-submenu-title {
  background: rgba(255, 255, 255, 0.2) !important;
}

.app-layout .header .header-right .user-button,
.app-layout .header .header-right .user-button *,
.app-layout .header .header-right .user-button .welcome-text {
  color: #ffffff !important;
}

.app-layout .header .header-right .user-button:hover {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.1) !important;
}
</style>