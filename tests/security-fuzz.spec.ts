import { test, expect } from '@playwright/test';
import payloads from '../payload.json';

const TARGET_URLS = [
    // 'http://localhost:8000/login.php',
    // 'http://localhost:8000/search.php'
];

test.describe('Dynamic Auto-Discovery Security Fuzzer', () => {

    for (const url of TARGET_URLS) {
        test.describe(`Scanning Target: ${url}`, () => {

            for (const payload of payloads.xss_reflected) {
                test(`XSS Payload: ${payload}`, async ({ page }) => {
                    let xssTriggered = false;

                    page.on('dialog', async dialog => {
                        if (dialog.message() === 'XSS_FOUND') {
                            xssTriggered = true;
                        }
                        await dialog.accept();
                    });

                    await page.goto(url);

                    const inputs = await page.locator('input:not([type="submit"]):not([type="button"]):not([type="hidden"]), textarea').all();
                    
                    if (inputs.length === 0) {
                        console.log(`No inputs found on ${url}, skipping...`);
                        return;
                    }

                    for (const input of inputs) {
                        await input.fill(payload);
                    }

                    const submitBtn = page.locator('button[type="submit"], input[type="submit"]').first();
                    if (await submitBtn.isVisible()) {
                        await submitBtn.click();
                    } else {
                        await page.keyboard.press('Enter');
                    }

                    await page.waitForTimeout(500);

                    expect(xssTriggered).toBe(false);
                });
            }

            for (const payload of payloads.sqli_auth_bypass) {
                test(`SQLi Payload: ${payload}`, async ({ page }) => {
                    await page.goto(url);

                    const inputs = await page.locator('input:not([type="submit"]):not([type="button"]):not([type="hidden"]), textarea').all();
                    if (inputs.length === 0) return;

                    // Suntikkan payload secara cerdas
                    for (const input of inputs) {
                        const type = await input.getAttribute('type');
                        if (type === 'password') {
                            await input.fill('dummyPassword123');
                        } else {
                            await input.fill(payload);
                        }
                    }

                    const submitBtn = page.locator('button[type="submit"], input[type="submit"]').first();
                    if (await submitBtn.isVisible()) {
                        await submitBtn.click();
                    } else {
                        await page.keyboard.press('Enter');
                    }

                    const bodyText = await page.locator('body').textContent();
                    
                    const isVulnerable = bodyText?.includes('Login berhasil') || 
                                         bodyText?.includes('SQL syntax') || 
                                         bodyText?.includes('mysqli_');

                    expect(isVulnerable).toBe(false);
                });
            }

        });
    }
});