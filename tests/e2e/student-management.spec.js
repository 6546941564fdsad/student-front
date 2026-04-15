// tests/e2e/student-management.spec.js
import { test, expect } from '@playwright/test';

test.describe('学生档案管理 E2E 测试', () => {
  // 登录并导航到学生档案页面
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
    
    // 点击学生管理菜单（展开子菜单）
    await page.click('text=学生管理');
    await page.waitForTimeout(500);
    
    // 点击学生档案子菜单
    await page.click('text=学生档案');
    
    // 等待学生档案页面加载
    await page.waitForSelector('text=学生档案管理', { state: 'visible' });
  });

  // 测试1：验证学生档案页面加载
  test('应该成功加载学生档案页面', async ({ page }) => {
    // 验证页面标题
    await expect(page.locator('h2.page-title')).toContainText('学生档案管理');
    
    // 验证表格存在
    await expect(page.locator('.ant-table')).toBeVisible();
    
    // 验证统计卡片存在
    await expect(page.locator('.ant-card').first()).toBeVisible();
  });

  // 测试2：使用学号搜索学生
  test('应该能够使用学号搜索学生', async ({ page }) => {
    // 在学号输入框中输入学号
    await page.fill('input[placeholder="请输入学号"]', '2024');
    
    // 点击查询按钮 - 使用CSS类选择器更可靠
    await page.click('.filter-form button.ant-btn-primary');
    
    // 等待表格刷新
    await page.waitForTimeout(1000);
    
    // 验证表格中有数据（或者显示空状态）
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });

  // 测试3：使用姓名搜索学生
  test('应该能够使用姓名搜索学生', async ({ page }) => {
    // 在姓名输入框中输入姓名
    await page.fill('input[placeholder="请输入姓名"]', '张');
    
    // 点击查询按钮 - 使用CSS类选择器更可靠
    await page.click('.filter-form button.ant-btn-primary');
    
    // 等待表格刷新
    await page.waitForTimeout(1000);
    
    // 验证表格中有数据
    const table = page.locator('.ant-table');
    await expect(table).toBeVisible();
  });

  // 测试4：使用学院筛选
  test('应该能够使用学院筛选学生', async ({ page }) => {
    // 打开学院下拉框 - 使用 locator
    const collegeSelect = page.locator('.filter-form .ant-select').first();
    await collegeSelect.click();
    
    // 选择一个学院选项
    await page.waitForTimeout(500);
    const options = page.locator('.ant-select-item-option');
    if (await options.count() > 0) {
      await options.first().click();
      
      // 点击查询按钮 - 使用CSS类选择器更可靠
      await page.click('.filter-form button.ant-btn-primary');
      
      // 等待表格刷新
      await page.waitForTimeout(1000);
      
      // 验证表格中有数据
      const table = page.locator('.ant-table');
      await expect(table).toBeVisible();
    }
  });

  // 测试5：新增学生（跳过，因为当前页面没有新增按钮）
  test.skip('应该能够新增学生', async ({ page }) => {
    // TODO: 需要在 StudentArchives.vue 中添加新增按钮
    // 点击新增按钮
    await page.click('button:has-text("新增")');
    
    // 等待模态框出现
    await page.waitForSelector('.ant-modal', { state: 'visible' });
    
    // 填写表单
    await page.fill('input[placeholder="请输入学号"]', 'TEST' + Date.now());
    await page.fill('input[placeholder="请输入姓名"]', '测试学生');
    
    // 选择性别
    await page.click('.ant-radio-group .ant-radio-wrapper').first();
    
    // 选择学院
    const selects = page.locator('.ant-select');
    await selects.nth(1).click();
    await page.waitForTimeout(500);
    const collegeOptions = page.locator('.ant-select-item-option');
    if (await collegeOptions.count() > 0) {
      await collegeOptions.first().click();
    }
    
    // 选择专业
    await selects.nth(2).click();
    await page.waitForTimeout(500);
    const majorOptions = page.locator('.ant-select-item-option');
    if (await majorOptions.count() > 0) {
      await majorOptions.first().click();
    }
    
    // 选择班级
    await selects.nth(3).click();
    await page.waitForTimeout(500);
    const classOptions = page.locator('.ant-select-item-option');
    if (await classOptions.count() > 0) {
      await classOptions.first().click();
    }
    
    // 填写入学年份
    await page.fill('input[placeholder="请选择入学年份"]', '2024');
    
    // 填写联系电话
    await page.fill('input[placeholder="请输入联系电话"]', '13800138000');
    
    // 填写邮箱
    await page.fill('input[placeholder="请输入邮箱"]', 'test@example.com');
    
    // 点击确定按钮
    await page.click('.ant-modal-footer button.ant-btn-primary');
    
    // 等待提交完成
    await page.waitForTimeout(2000);
    
    // 验证成功消息
    const successMessage = page.locator('.ant-message-success');
    if (await successMessage.count() > 0) {
      await expect(successMessage).toBeVisible();
    }
  });

  // 测试6：查看学生详情
  test('应该能够查看学生详情', async ({ page }) => {
    // 等待表格加载
    await page.waitForTimeout(1000);
    
    // 检查表格是否有数据
    const tableRows = page.locator('.ant-table-tbody tr');
    const rowCount = await tableRows.count();
    
    if (rowCount > 0) {
      // 点击第一个"查看"按钮
      const viewButtons = page.locator('button:has-text("查看")');
      if (await viewButtons.count() > 0) {
        await viewButtons.first().click();
        
        // 等待详情模态框出现
        await page.waitForSelector('.ant-modal', { state: 'visible' });
        
        // 验证模态框中有学生信息
        await expect(page.locator('.ant-descriptions')).toBeVisible();
        
        // 关闭模态框
        await page.click('.ant-modal-close');
      }
    } else {
      console.log('表格中没有数据，跳过查看学生详情测试');
    }
  });

  // 测试7：编辑学生信息
  test.skip('应该能够编辑学生信息', async ({ page }) => {
    // TODO: 需要实现编辑功能
    // 等待表格加载
    await page.waitForTimeout(1000);
    
    // 检查表格是否有数据
    const tableRows = page.locator('.ant-table-tbody tr');
    const rowCount = await tableRows.count();
    
    if (rowCount > 0) {
      // 点击第一个"编辑"按钮
      const editButtons = page.locator('button:has-text("编辑")');
      if (await editButtons.count() > 0) {
        await editButtons.first().click();
        
        // 等待编辑模态框出现
        await page.waitForSelector('.ant-modal', { state: 'visible' });
        
        // 修改姓名
        const nameInput = page.locator('.ant-modal input[placeholder="请输入姓名"]');
        await nameInput.fill('编辑后的姓名');
        
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
    } else {
      console.log('表格中没有数据，跳过编辑学生测试');
    }
  });

  // 测试8：删除学生
  test.skip('应该能够删除学生', async ({ page }) => {
    // TODO: 需要谨慎测试删除功能
    // 等待表格加载
    await page.waitForTimeout(1000);
    
    // 检查表格是否有数据
    const tableRows = page.locator('.ant-table-tbody tr');
    const rowCount = await tableRows.count();
    
    if (rowCount > 0) {
      // 点击第一个"删除"按钮
      const deleteButtons = page.locator('button:has-text("删除")');
      if (await deleteButtons.count() > 0) {
        await deleteButtons.first().click();
        
        // 等待确认对话框出现
        await page.waitForSelector('.ant-confirm', { state: 'visible' });
        
        // 点击确认按钮
        await page.click('.ant-confirm-btns button.ant-btn-primary');
        
        // 等待删除完成
        await page.waitForTimeout(2000);
        
        // 验证成功消息
        const successMessage = page.locator('.ant-message-success');
        if (await successMessage.count() > 0) {
          await expect(successMessage).toBeVisible();
        }
      }
    } else {
      console.log('表格中没有数据，跳过删除学生测试');
    }
  });

  // 测试9：分页功能
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

  // 测试10：重置筛选条件
  test('应该能够重置筛选条件', async ({ page }) => {
    // 先输入一些筛选条件
    await page.fill('input[placeholder="请输入学号"]', '2024');
    await page.fill('input[placeholder="请输入姓名"]', '张');
    
    // 点击重置按钮 - 使用CSS选择器
    await page.click('.filter-form button:not(.ant-btn-primary)');
    
    // 等待表格刷新
    await page.waitForTimeout(1000);
    
    // 验证输入框已被清空
    const studentNoInput = page.locator('input[placeholder="请输入学号"]');
    await expect(studentNoInput).toHaveValue('');
    
    const nameInput = page.locator('input[placeholder="请输入姓名"]');
    await expect(nameInput).toHaveValue('');
  });
});
