import { test, expect } from '@playwright/test';

test.describe('导航功能测试', () => {
  test('应该能够访问数据统计页面', async ({ page }) => {
    await page.goto('/');
    
    // Wait for login form and complete login
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    await page.click('.login-button');
    await page.waitForSelector('.welcome-text', { state: 'visible', timeout: 15000 });
    
    // Click "系统概览" to expand menu
    await page.click('text=系统概览');
    await page.waitForSelector('text=数据统计', { state: 'visible' });
    
    // Navigate to data stats
    await page.click('text=数据统计');
    await page.waitForSelector('text=数据统计', { state: 'visible', timeout: 10000 });
  });

  test('应该能够访问学生档案页面', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    await page.click('.login-button');
    await page.waitForSelector('.welcome-text', { state: 'visible', timeout: 15000 });
    
    await page.click('text=学生管理');
    await page.waitForSelector('text=学生档案', { state: 'visible' });
    await page.click('text=学生档案');
    await page.waitForSelector('h2.page-title', { state: 'visible' });
  });

  test('应该能够访问成绩录入页面', async ({ page }) => {
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
  });

  test('应该能够访问竞赛管理页面', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    await page.click('.login-button');
    await page.waitForSelector('.welcome-text', { state: 'visible', timeout: 15000 });
    
    await page.click('text=创新创业');
    await page.waitForSelector('text=竞赛管理', { state: 'visible' });
    await page.click('text=竞赛管理');
    await page.waitForSelector('h2.page-title', { state: 'visible' });
  });

  test('应该能够访问开题管理页面', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    await page.click('.login-button');
    await page.waitForSelector('.welcome-text', { state: 'visible', timeout: 15000 });
    
    await page.click('text=毕业设计(论文)');
    await page.waitForSelector('text=开题管理', { state: 'visible' });
    await page.click('text=开题管理');
    await page.waitForSelector('.thesis-proposal', { state: 'visible' });
  });

  test('面包屑导航应该正确显示', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    await page.click('.login-button');
    await page.waitForSelector('.welcome-text', { state: 'visible', timeout: 15000 });
    
    await page.click('text=成绩管理');
    await page.waitForSelector('text=成绩录入', { state: 'visible' });
    await page.click('text=成绩录入');
    await page.waitForSelector('.ant-breadcrumb', { state: 'visible' });
  });

  test('应该能够退出登录', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    await page.click('.login-button');
    await page.waitForSelector('.welcome-text', { state: 'visible', timeout: 15000 });
    
    await page.click('.user-button');
    await page.waitForSelector('text=退出登录', { state: 'visible' });
    await page.click('text=退出登录');
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
  });
});
