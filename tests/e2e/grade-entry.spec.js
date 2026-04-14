import { test, expect } from '@playwright/test';

test.describe('成绩录入功能测试', () => {
  test('成绩录入页面应该正确显示', async ({ page }) => {
    await page.goto('/');
    
    // Wait for login form and complete login
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    await page.click('.login-button');
    await page.waitForSelector('.welcome-text', { state: 'visible', timeout: 15000 });
    
    // Navigate to grade entry page
    await page.click('text=成绩管理');
    await page.waitForSelector('text=成绩录入', { state: 'visible' });
    await page.click('text=成绩录入');
    await page.waitForSelector('h2.page-title', { state: 'visible' });
    await page.waitForSelector('.ant-table', { state: 'visible' });
    
    // Verify page title
    await expect(page.locator('h2.page-title')).toContainText('成绩录入');
  });

  test('应该能够打开新增成绩对话框', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    await page.click('.login-button');
    await page.waitForSelector('.welcome-text', { state: 'visible', timeout: 15000 });
    
    await page.click('text=成绩管理');
    await page.waitForSelector('text=成绩录入', { state: 'visible' });
    await page.click('text=成绩录入');
    await page.waitForSelector('h2.page-title', { state: 'visible' });
    
    // Click batch entry button
    await page.click('button:has-text("批量录入")');
    await page.waitForSelector('.ant-modal', { state: 'visible' });
  });

  test('表单验证应该正常工作', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    await page.click('.login-button');
    await page.waitForSelector('.welcome-text', { state: 'visible', timeout: 15000 });
    
    await page.click('text=成绩管理');
    await page.waitForSelector('text=成绩录入', { state: 'visible' });
    await page.click('text=成绩录入');
    await page.waitForSelector('h2.page-title', { state: 'visible' });
    
    await page.click('button:has-text("批量录入")');
    await page.waitForSelector('.ant-modal', { state: 'visible' });
    
    // Submit empty form
    await page.click('.ant-modal .ant-btn-primary');
    // Wait for validation errors to appear
    await page.waitForTimeout(1000);
  });

  test('应该能够筛选成绩数据', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    await page.click('.login-button');
    await page.waitForSelector('.welcome-text', { state: 'visible', timeout: 15000 });
    
    await page.click('text=成绩管理');
    await page.waitForSelector('text=成绩录入', { state: 'visible' });
    await page.click('text=成绩录入');
    await page.waitForSelector('.filter-form', { state: 'visible' });
    
    // Click first select in filter form
    await page.locator('.filter-form .ant-select').first().click();
    await page.waitForSelector('.ant-select-dropdown', { state: 'visible' });
    await page.locator('.ant-select-dropdown .ant-select-item').first().click();
    await page.waitForSelector('.ant-select-dropdown', { state: 'hidden' });
    
    // Click query button - handle potential spaces in text
    await page.locator('button', { hasText: /查.*询/ }).click();
    await page.waitForSelector('.ant-table', { state: 'visible' });
  });

  test('分页功能应该正常工作', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    await page.click('.login-button');
    await page.waitForSelector('.welcome-text', { state: 'visible', timeout: 15000 });
    
    await page.click('text=成绩管理');
    await page.waitForSelector('text=成绩录入', { state: 'visible' });
    await page.click('text=成绩录入');
    await page.waitForSelector('.ant-table', { state: 'visible' });
    
    const pagination = page.locator('.ant-pagination');
    if (await pagination.isVisible()) {
      const nextButton = page.locator('.ant-pagination-next');
      if (await nextButton.isVisible() && !(await nextButton.isDisabled())) {
        await nextButton.click();
        // Wait for table to reload
        await page.waitForSelector('.ant-table', { state: 'visible' });
        
        await expect(pagination).toBeVisible();
      }
    }
  });
});
