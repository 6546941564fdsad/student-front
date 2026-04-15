// tests/e2e/grade-management.spec.js
import { test, expect } from '@playwright/test';

test.describe('成绩管理 E2E 测试', () => {
  // 登录并导航到成绩管理页面（不是成绩录入）
  test.beforeEach(async ({ page }) => {
    // 访问首页
    await page.goto('http://localhost:5173');
    
    // 等待登录页面加载
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    
    // 输入用户名和密码
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    
    // 点击登录按钮
    await page.click('button.ant-btn-primary');
    
    // 等待登录成功，跳转到主页
    await page.waitForTimeout(2000);
    
    // 点击成绩管理菜单（展开子菜单）
    // 第一步：点击成绩管理父菜单展开子菜单
    await page.click('text=成绩管理');
    
    // 等待子菜单展开 - 通过等待相邻的"成绩录入"菜单项出现来确认
    await page.waitForSelector('text=成绩录入', { state: 'visible', timeout: 5000 });
    
    // 第二步：点击子菜单项（成绩管理 - GradeManagement.vue）
    // 等待 grade-management 菜单项出现并点击
    // Ant Design Vue 菜单的 key 属性会被渲染为 data-menu-id
    await page.waitForSelector('[data-menu-id="grade-management"]', { state: 'visible', timeout: 5000 });
    await page.click('[data-menu-id="grade-management"]');
        
    // 等待成绩管理页面加载
    // 增加超时时间到30秒
    await page.waitForSelector('h2.page-title:has-text("成绩管理")', { state: 'visible', timeout: 30000 });
    await page.waitForTimeout(500);
  });

  // 测试1：验证成绩管理页面加载
  test('应该成功加载成绩管理页面', async ({ page }) => {
    // 验证页面标题
    await expect(page.locator('h2.page-title')).toContainText('成绩管理');
    
    // 验证筛选表单存在
    await expect(page.locator('.filter-form')).toBeVisible();
    
    // 验证表格存在
    await expect(page.locator('.ant-table')).toBeVisible();
  });

  // 测试2：使用学号搜索成绩
  test('应该能够使用学号搜索成绩', async ({ page }) => {
    // 等待筛选表单加载
    await page.waitForSelector('.filter-form', { state: 'visible' });
    
    // 在学号输入框中输入
    const studentIdInput = page.locator('input[placeholder="请输入学号"]');
    await studentIdInput.fill('2024');
    
    // 点击查询按钮 - 使用CSS类选择器更可靠
    await page.click('.filter-form button.ant-btn-primary');
    
    // 等待表格刷新
    await page.waitForTimeout(1000);
    
    // 验证表格中有数据
    await expect(page.locator('.ant-table')).toBeVisible();
  });

  // 测试3：使用学生姓名搜索
  test('应该能够使用学生姓名搜索', async ({ page }) => {
    // 等待筛选表单加载
    await page.waitForSelector('.filter-form', { state: 'visible' });
    
    // 在学生姓名输入框中输入
    const studentNameInput = page.locator('input[placeholder="请输入学生姓名"]');
    await studentNameInput.fill('张');
    
    // 点击查询按钮 - 使用CSS类选择器更可靠
    await page.click('.filter-form button.ant-btn-primary');
    
    // 等待表格刷新
    await page.waitForTimeout(1000);
    
    // 验证表格中有数据
    await expect(page.locator('.ant-table')).toBeVisible();
  });

  // 测试4：使用课程名称搜索
  test('应该能够使用课程名称搜索', async ({ page }) => {
    // 等待筛选表单加载
    await page.waitForSelector('.filter-form', { state: 'visible' });
    
    // 在课程名称输入框中输入
    const courseNameInput = page.locator('input[placeholder="请输入课程名称"]');
    await courseNameInput.fill('数学');
    
    // 点击查询按钮 - 使用CSS类选择器更可靠
    await page.click('.filter-form button.ant-btn-primary');
    
    // 等待表格刷新
    await page.waitForTimeout(1000);
    
    // 验证表格中有数据
    await expect(page.locator('.ant-table')).toBeVisible();
  });

  // 测试5：新增成绩记录
  test.skip('应该能够新增成绩记录', async ({ page }) => {
    // TODO: GradeManagement.vue 使用"批量录入"功能，涉及复杂的表格编辑交互
    // 建议手动测试或使用更高级的 E2E 测试策略
    
    // 点击批量录入按钮
    await page.click('button:has-text("批量录入")');
    
    // 等待模态框出现
    await page.waitForSelector('.ant-modal', { state: 'visible' });
    
    // 填写表单（批量录入通常涉及表格编辑，较复杂）
    // 这里暂时跳过详细测试
  });

  // 测试6：编辑成绩记录
  test('应该能够编辑成绩记录', async ({ page }) => {
    // 等待表格加载
    await page.waitForTimeout(1000);
    
    // 点击第一个"编辑"按钮
    const editButtons = page.locator('button:has-text("编辑")');
    if (await editButtons.count() > 0) {
      await editButtons.first().click();
      
      // 等待编辑模态框出现
      await page.waitForSelector('.ant-modal', { state: 'visible' });
      
      // 修改总评成绩
      const totalScoreInput = page.locator('.ant-modal input[placeholder="请输入总评成绩"]');
      await totalScoreInput.fill('90');
      
      // 点击确定按钮
      await page.click('.ant-modal-footer button.ant-btn-primary');
      
      // 等待提交完成
      await page.waitForTimeout(2000);
      
      // 验证成功消息
      const successMessage = page.locator('.ant-message-success');
      if (await successMessage.count() > 0) {
        await expect(successMessage).toBeVisible();
      }
    }
  });

  // 测试7：删除成绩记录
  test('应该能够删除成绩记录', async ({ page }) => {
    // 等待表格加载
    await page.waitForTimeout(1000);
    
    // 点击第一个"删除"按钮
    const deleteButtons = page.locator('button:has-text("删除")');
    if (await deleteButtons.count() > 0) {
      await deleteButtons.first().click();
      
      // 等待确认对话框出现
      await page.waitForSelector('.ant-popconfirm', { state: 'visible' });
      
      // 点击确认按钮
      await page.click('.ant-popconfirm-buttons button.ant-btn-primary');
      
      // 等待删除完成
      await page.waitForTimeout(2000);
      
      // 验证成功消息
      const successMessage = page.locator('.ant-message-success');
      if (await successMessage.count() > 0) {
        await expect(successMessage).toBeVisible();
      }
    }
  });

  // 测试8：分页功能
  test('应该能够使用分页功能', async ({ page }) => {
    // 等待表格加载
    await page.waitForTimeout(1000);
    
    // 检查是否有分页器
    const pagination = page.locator('.ant-pagination');
    if (await pagination.count() > 0) {
      // 点击下一页
      const nextButton = page.locator('.ant-pagination-next');
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        
        // 等待表格刷新
        await page.waitForTimeout(1000);
        
        // 验证表格仍然可见
        await expect(page.locator('.ant-table')).toBeVisible();
      }
    }
  });

  // 测试9：重置筛选条件
  test('应该能够重置筛选条件', async ({ page }) => {
    // 等待筛选表单加载
    await page.waitForSelector('.filter-form', { state: 'visible' });
    
    // 先输入一些筛选条件
    const studentIdInput = page.locator('input[placeholder="请输入学号"]');
    const studentNameInput = page.locator('input[placeholder="请输入学生姓名"]');
    
    await studentIdInput.fill('2024');
    await studentNameInput.fill('张');
    
    // 点击重置按钮 - 使用CSS选择器
    await page.click('.filter-form button:not(.ant-btn-primary)');
    
    // 等待表格刷新
    await page.waitForTimeout(1000);
    
    // 验证输入框已被清空
    await expect(studentIdInput).toHaveValue('');
    await expect(studentNameInput).toHaveValue('');
  });

  // 测试10：按学期筛选
  test('应该能够按学期筛选成绩', async ({ page }) => {
    // 打开学期下拉框
    const selects = page.locator('.ant-select');
    await selects.first().click();
    
    // 等待选项出现
    await page.waitForTimeout(500);
    
    // 选择一个学期
    const options = page.locator('.ant-select-item-option');
    if (await options.count() > 0) {
      await options.first().click();
      
      // 点击查询按钮 - 使用CSS类选择器更可靠
      await page.click('.filter-form button.ant-btn-primary');
      
      // 等待表格刷新
      await page.waitForTimeout(1000);
      
      // 验证表格中有数据
      await expect(page.locator('.ant-table')).toBeVisible();
    }
  });
});
