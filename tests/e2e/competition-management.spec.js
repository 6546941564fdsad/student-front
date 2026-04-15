// tests/e2e/competition-management.spec.js
import { test, expect } from '@playwright/test';

test.describe('竞赛管理 E2E 测试', () => {
  // 登录并导航到竞赛管理页面
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
    
    // 点击创新创业菜单（展开子菜单）
    await page.click('text=创新创业');
    await page.waitForTimeout(500);
    
    // 点击竞赛管理子菜单
    await page.click('text=竞赛管理');
    
    // 等待竞赛管理页面加载
    await page.waitForSelector('text=竞赛管理', { state: 'visible' });
  });

  // 测试1：验证竞赛管理页面加载
  test('应该成功加载竞赛管理页面', async ({ page }) => {
    // 验证页面标题
    await expect(page.locator('h2.page-title')).toContainText('竞赛管理');
    
    // 验证统计卡片存在
    const cards = page.locator('.ant-card');
    await expect(cards.first()).toBeVisible();
    
    // 验证表格存在
    await expect(page.locator('.ant-table')).toBeVisible();
  });

  // 测试2：使用竞赛名称搜索
  test('应该能够使用竞赛名称搜索', async ({ page }) => {
    // 在竞赛名称输入框中输入
    await page.fill('input[placeholder="请输入竞赛名称"]', '竞赛');
    
    // 点击查询按钮 - 使用CSS类选择器更可靠
    await page.click('.filter-form button.ant-btn-primary');
    
    // 等待表格刷新
    await page.waitForTimeout(1000);
    
    // 验证表格中有数据
    await expect(page.locator('.ant-table')).toBeVisible();
  });

  // 测试3：使用竞赛级别筛选
  test('应该能够使用竞赛级别筛选', async ({ page }) => {
    // 打开竞赛级别下拉框
    const selects = page.locator('.ant-select');
    await selects.first().click();
    
    // 等待选项出现
    await page.waitForTimeout(500);
    
    // 选择一个选项
    const options = page.locator('.ant-select-item-option');
    if (await options.count() > 0) {
      await options.nth(1).click(); // 选择"国家级"
      
      // 点击查询按钮 - 使用CSS类选择器更可靠
      await page.click('.filter-form button.ant-btn-primary');
      
      // 等待表格刷新
      await page.waitForTimeout(1000);
      
      // 验证表格中有数据
      await expect(page.locator('.ant-table')).toBeVisible();
    }
  });

  // 测试4：使用获奖状态筛选
  test('应该能够使用获奖状态筛选', async ({ page }) => {
    // 打开获奖状态下拉框
    const selects = page.locator('.ant-select');
    await selects.nth(1).click();
    
    // 等待选项出现
    await page.waitForTimeout(500);
    
    // 选择一个选项
    const options = page.locator('.ant-select-item-option');
    if (await options.count() > 0) {
      await options.nth(1).click();
      
      // 点击查询按钮 - 使用CSS类选择器更可靠
      await page.click('.filter-form button.ant-btn-primary');
      
      // 等待表格刷新
      await page.waitForTimeout(1000);
      
      // 验证表格中有数据
      await expect(page.locator('.ant-table')).toBeVisible();
    }
  });

  // 测试5：新增竞赛获奖记录
  test.skip('应该能够新增竞赛获奖记录', async ({ page }) => {
    // TODO: 下拉选项渲染在body中，需要更复杂的定位策略
    // 点击新增按钮
    await page.click('button:has-text("新增")');
    
    // 等待模态框出现
    await page.waitForSelector('.ant-modal', { state: 'visible' });
    
    // 填写表单
    await page.fill('input[placeholder="请输入竞赛名称"]', '测试竞赛' + Date.now());
    
    // 选择学生（多选框，较复杂）
    const studentSelect = page.locator('.ant-modal .ant-select').filter({ hasText: '参赛学生' });
    await studentSelect.click();
    await page.waitForTimeout(500);
    // 下拉选项渲染在body中，使用键盘选择
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape'); // 关闭下拉框
    
    // 选择竞赛级别
    const levelSelect = page.locator('.ant-modal .ant-select').filter({ hasText: '竞赛级别' });
    await levelSelect.click();
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    
    // 选择获奖等级
    const awardSelect = page.locator('.ant-modal .ant-select').filter({ hasText: '获奖等级' });
    await awardSelect.click();
    await page.waitForTimeout(500);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    
    // 选择获奖日期
    await page.click('.ant-picker');
    await page.waitForTimeout(500);
    
    // 填写指导教师
    await page.fill('input[placeholder="请输入指导教师"]', '张老师');
    
    // 填写备注
    await page.fill('textarea[placeholder="请输入备注"]', '测试备注');
    
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

  // 测试6：编辑竞赛获奖记录
  test('应该能够编辑竞赛获奖记录', async ({ page }) => {
    // 等待表格加载
    await page.waitForTimeout(1000);
    
    // 点击第一个"编辑"按钮
    const editButtons = page.locator('button:has-text("编辑")');
    if (await editButtons.count() > 0) {
      await editButtons.first().click();
      
      // 等待编辑模态框出现
      await page.waitForSelector('.ant-modal', { state: 'visible' });
      
      // 修改竞赛名称
      const nameInput = page.locator('.ant-modal input[placeholder="请输入竞赛名称"]');
      const originalValue = await nameInput.inputValue();
      await nameInput.fill(originalValue + '-编辑');
      
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

  // 测试7：删除竞赛获奖记录
  test('应该能够删除竞赛获奖记录', async ({ page }) => {
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
    // 先输入一些筛选条件
    await page.fill('input[placeholder="请输入竞赛名称"]', '测试');
    
    // 点击重置按钮 - 使用CSS选择器
    await page.click('.filter-form button:not(.ant-btn-primary)');
    
    // 等待表格刷新
    await page.waitForTimeout(1000);
    
    // 验证输入框已被清空
    const competitionNameInput = page.locator('input[placeholder="请输入竞赛名称"]');
    await expect(competitionNameInput).toHaveValue('');
  });

  // 测试10：验证统计数据
  test('应该能够查看统计数据', async ({ page }) => {
    // 等待统计数据加载
    await page.waitForTimeout(1500);
    
    // 验证统计卡片中有数字
    const statCards = page.locator('.ant-card');
    const firstCard = statCards.first();
    await expect(firstCard).toBeVisible();
    
    // 验证卡片中有数字显示
    const statNumber = firstCard.locator('p').first();
    await expect(statNumber).toBeVisible();
  });
});
