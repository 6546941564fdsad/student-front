-- 学生教务管理系统数据库初始化脚本

-- 创建扩展（如果需要）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'STUDENT',
    email VARCHAR(100),
    phone VARCHAR(20),
    department VARCHAR(100),
    major VARCHAR(100),
    class_name VARCHAR(50),
    student_no VARCHAR(50),
    title VARCHAR(50),
    status VARCHAR(20) DEFAULT '正常',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_student_no ON users(student_no);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 插入默认管理员账号
INSERT INTO users (username, password, name, role, status) 
VALUES ('admin', '123456', '系统管理员', 'ADMIN', '正常')
ON CONFLICT (username) DO NOTHING;

-- 插入测试学生账号
INSERT INTO users (username, password, name, role, student_no, major, class_name, status) 
VALUES 
    ('trump', '123456', '特朗普', 'STUDENT', '2021001', '计算机科学', 'CS2021-1', '正常'),
    ('roosevelt', '123456', '罗斯福', 'STUDENT', '2021002', '软件工程', 'SE2021-1', '正常')
ON CONFLICT (username) DO NOTHING;

-- 成绩表
CREATE TABLE IF NOT EXISTS grades (
    id BIGSERIAL PRIMARY KEY,
    student_no VARCHAR(50) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    usual_score DECIMAL(5,2),
    final_score DECIMAL(5,2),
    total_score DECIMAL(5,2),
    grade_point DECIMAL(3,2),
    credits DECIMAL(3,1),
    status VARCHAR(20) DEFAULT '草稿',
    teacher VARCHAR(100),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_grades_student_no ON grades(student_no);
CREATE INDEX IF NOT EXISTS idx_grades_semester ON grades(semester);

-- 考勤表
CREATE TABLE IF NOT EXISTS attendances (
    id BIGSERIAL PRIMARY KEY,
    student_no VARCHAR(50) NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    class_time VARCHAR(50),
    teacher VARCHAR(100),
    status VARCHAR(20) NOT NULL,
    remark TEXT,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attendances_student_no ON attendances(student_no);
CREATE INDEX IF NOT EXISTS idx_attendances_date ON attendances(date);

-- 课程表
CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    course_code VARCHAR(50) UNIQUE NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    course_type VARCHAR(50),
    credits DECIMAL(3,1),
    teacher VARCHAR(100),
    class_time VARCHAR(100),
    location VARCHAR(100),
    capacity INTEGER DEFAULT 60,
    current_students INTEGER DEFAULT 0,
    semester VARCHAR(50),
    description TEXT,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_courses_semester ON courses(semester);

-- 选课记录表
CREATE TABLE IF NOT EXISTS course_selections (
    id BIGSERIAL PRIMARY KEY,
    student_no VARCHAR(50) NOT NULL,
    course_id BIGINT NOT NULL,
    semester VARCHAR(50) NOT NULL,
    selection_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT '已选',
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_course_selections_student ON course_selections(student_no);
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_selection ON course_selections(student_no, course_id, semester);

-- 竞赛表
CREATE TABLE IF NOT EXISTS competitions (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    level VARCHAR(50),
    type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT '报名中',
    description TEXT,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 学分认定表
CREATE TABLE IF NOT EXISTS credit_recognitions (
    id BIGSERIAL PRIMARY KEY,
    student_no VARCHAR(50) NOT NULL,
    activity_name VARCHAR(200) NOT NULL,
    activity_type VARCHAR(50),
    credits DECIMAL(3,1),
    status VARCHAR(20) DEFAULT '待审核',
    apply_date DATE,
    audit_date DATE,
    auditor VARCHAR(100),
    remark TEXT,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_credit_recognitions_student ON credit_recognitions(student_no);

-- 毕业设计开题表
CREATE TABLE IF NOT EXISTS thesis_proposals (
    id BIGSERIAL PRIMARY KEY,
    student_no VARCHAR(50) NOT NULL,
    title VARCHAR(300) NOT NULL,
    teacher VARCHAR(100),
    academic_year VARCHAR(50),
    status VARCHAR(20) DEFAULT '待提交',
    submit_date DATE,
    content TEXT,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_thesis_proposals_student ON thesis_proposals(student_no);

-- 毕业设计中期检查表
CREATE TABLE IF NOT EXISTS thesis_midterms (
    id BIGSERIAL PRIMARY KEY,
    thesis_id BIGINT NOT NULL,
    progress VARCHAR(20),
    problems TEXT,
    solutions TEXT,
    check_date DATE,
    teacher_comment TEXT,
    status VARCHAR(20) DEFAULT '待检查',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thesis_id) REFERENCES thesis_proposals(id) ON DELETE CASCADE
);

-- 答辩表
CREATE TABLE IF NOT EXISTS defenses (
    id BIGSERIAL PRIMARY KEY,
    thesis_id BIGINT NOT NULL,
    defense_date DATE,
    defense_time VARCHAR(50),
    location VARCHAR(100),
    committee_members TEXT,
    result VARCHAR(20),
    score DECIMAL(5,2),
    comments TEXT,
    status VARCHAR(20) DEFAULT '未安排',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thesis_id) REFERENCES thesis_proposals(id) ON DELETE CASCADE
);

-- 论文成绩表
CREATE TABLE IF NOT EXISTS thesis_grades (
    id BIGSERIAL PRIMARY KEY,
    thesis_id BIGINT NOT NULL,
    teacher_score DECIMAL(5,2),
    reviewer_score DECIMAL(5,2),
    defense_score DECIMAL(5,2),
    final_score DECIMAL(5,2),
    grade VARCHAR(10),
    grader VARCHAR(100),
    grade_date DATE,
    status VARCHAR(20) DEFAULT '未评定',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thesis_id) REFERENCES thesis_proposals(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_thesis_grades_thesis ON thesis_grades(thesis_id);

-- 实习表
CREATE TABLE IF NOT EXISTS internships (
    id BIGSERIAL PRIMARY KEY,
    student_no VARCHAR(50) NOT NULL,
    company VARCHAR(200),
    position VARCHAR(100),
    start_date DATE,
    end_date DATE,
    mentor VARCHAR(100),
    status VARCHAR(20) DEFAULT '申请中',
    report_url VARCHAR(500),
    score DECIMAL(5,2),
    comments TEXT,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_internships_student ON internships(student_no);

-- 教师评价表
CREATE TABLE IF NOT EXISTS teacher_evaluations (
    id BIGSERIAL PRIMARY KEY,
    teacher_name VARCHAR(100) NOT NULL,
    course_name VARCHAR(200),
    semester VARCHAR(50),
    evaluation_content TEXT,
    score DECIMAL(3,2),
    evaluator VARCHAR(100),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 教学评教表
CREATE TABLE IF NOT EXISTS teaching_evaluations (
    id BIGSERIAL PRIMARY KEY,
    teacher_name VARCHAR(100) NOT NULL,
    course_name VARCHAR(200),
    semester VARCHAR(50),
    evaluation_items JSONB,
    total_score DECIMAL(5,2),
    evaluator VARCHAR(100),
    comments TEXT,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 学业预警表
CREATE TABLE IF NOT EXISTS academic_warnings (
    id BIGSERIAL PRIMARY KEY,
    student_no VARCHAR(50) NOT NULL,
    warning_type VARCHAR(50),
    warning_level VARCHAR(20),
    reason TEXT,
    status VARCHAR(20) DEFAULT '待处理',
    handler VARCHAR(100),
    handle_result TEXT,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_academic_warnings_student ON academic_warnings(student_no);

-- 调课申请表
CREATE TABLE IF NOT EXISTS course_changes (
    id BIGSERIAL PRIMARY KEY,
    course_name VARCHAR(200) NOT NULL,
    teacher VARCHAR(100),
    original_time VARCHAR(100),
    new_time VARCHAR(100),
    original_location VARCHAR(100),
    new_location VARCHAR(100),
    reason TEXT,
    status VARCHAR(20) DEFAULT '待审批',
    applicant VARCHAR(100),
    approver VARCHAR(100),
    apply_date DATE,
    approve_date DATE,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 项目表
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50),
    leader VARCHAR(100),
    members TEXT,
    teacher VARCHAR(100),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT '进行中',
    budget DECIMAL(10,2),
    description TEXT,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS '用户表';
COMMENT ON TABLE grades IS '成绩表';
COMMENT ON TABLE attendances IS '考勤表';
COMMENT ON TABLE courses IS '课程表';
COMMENT ON TABLE course_selections IS '选课记录表';
COMMENT ON TABLE competitions IS '竞赛表';
COMMENT ON TABLE credit_recognitions IS '学分认定表';
COMMENT ON TABLE thesis_proposals IS '毕业设计开题表';
COMMENT ON TABLE thesis_midterms IS '毕业设计中期检查表';
COMMENT ON TABLE defenses IS '答辩表';
COMMENT ON TABLE thesis_grades IS '论文成绩表';
COMMENT ON TABLE internships IS '实习表';
COMMENT ON TABLE teacher_evaluations IS '教师评价表';
COMMENT ON TABLE teaching_evaluations IS '教学评教表';
COMMENT ON TABLE academic_warnings IS '学业预警表';
COMMENT ON TABLE course_changes IS '调课申请表';
COMMENT ON TABLE projects IS '项目表';
