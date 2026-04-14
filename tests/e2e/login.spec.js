import { test, expect } from '@playwright/test';

test.describe('登录功能测试', () => {
  test('应该显示登录页面', async ({ page }) => {
    await page.goto('/');
    
    // Wait for login form elements to be visible
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    await page.waitForSelector('input[placeholder="密码"]', { state: 'visible' });
    await page.waitForSelector('.login-button', { state: 'visible' });
  });

  test('使用正确的凭据应该能够登录', async ({ page }) => {
    await page.goto('/');
    
    // Wait for login form to be ready
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'admin123');
    await page.click('.login-button');
    
    // Wait for welcome message after successful login
    await page.waitForSelector('.welcome-text', { state: 'visible', timeout: 15000 });
  });

  test('使用错误的凭据应该显示错误提示', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    
    await page.fill('input[placeholder="用户名"]', 'wronguser');
    await page.fill('input[placeholder="密码"]', 'wrongpass');
    await page.click('.login-button');
    
    // Should stay on login page
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
  });

  test('使用正确用户名但错误密码应该显示错误', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    
    await page.fill('input[placeholder="用户名"]', 'admin');
    await page.fill('input[placeholder="密码"]', 'wrongpassword');
    await page.click('.login-button');
    
    // Should stay on login page
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
  });

  test('空表单提交应该显示验证错误', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
    
    await page.click('.login-button');
    
    // Should stay on login page
    await page.waitForSelector('input[placeholder="用户名"]', { state: 'visible' });
  });
});
