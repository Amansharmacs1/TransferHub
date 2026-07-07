import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('TransferHub E2E File Transfer', () => {
  test('should successfully pair two clients and transfer a file', async ({ browser }) => {
    // We need two distinct browser contexts to represent two different users
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();

    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    pageA.on('console', msg => console.log(`Page A: ${msg.text()}`));
    pageB.on('console', msg => console.log(`Page B: ${msg.text()}`));

    // 1. Peer A goes to the site and gets their pairing code
    await pageA.goto('/');
    
    // Ensure Peer A is connected and wait for the code
    await expect(pageA.getByText('Your Device Code')).toBeVisible({ timeout: 10000 });
    
    // Extract Peer A's pairing code
    const codeElementA = pageA.locator('span.text-5xl.font-mono');
    await expect(codeElementA).toBeVisible();
    const codeA = await codeElementA.innerText();
    expect(codeA).toHaveLength(6);
    console.log(`Peer A pairing code is: ${codeA}`);

    // 2. Peer B goes to the site
    await pageB.goto('/');
    await expect(pageB.getByText('Your Device Code')).toBeVisible({ timeout: 10000 });

    // 3. Peer B connects to Peer A
    await pageB.getByPlaceholder('e.g. A1B2C3').fill(codeA);
    await pageB.getByRole('button', { name: 'Connect' }).click();

    // 4. Peer A receives and accepts the pairing request
    await expect(pageA.getByText('Connection Request')).toBeVisible({ timeout: 10000 });
    await pageA.getByRole('button', { name: 'Accept' }).click();

    // 5. Both peers should now be on the Transfer page
    await expect(pageA.getByText('Send & Receive Files')).toBeVisible({ timeout: 15000 });
    await expect(pageB.getByText('Send & Receive Files')).toBeVisible({ timeout: 15000 });
    
    console.log('Peers are connected!');

    // 6. Peer A selects a mock file to send
    const testFilePath = path.join('/tmp', 'test-file.txt');
    fs.writeFileSync(testFilePath, 'Hello, TransferHub!');
    
    // Listen for file chooser event
    const fileChooserPromise = pageA.waitForEvent('filechooser');
    await pageA.getByText('Select Files').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testFilePath);

    // Click Send All to start transfer
    await pageA.getByRole('button', { name: 'Send All' }).click({ force: true });

    // 7. Wait for transfer to complete on both sides
    // Peer A should see "completed"
    await expect(pageA.locator('.text-green-500').first()).toBeVisible({ timeout: 20000 });
    
    // Peer B should receive the file and display it
    await expect(pageB.getByText(/Received Files/i).first()).toBeVisible({ timeout: 20000 });
    await expect(pageB.getByText('test-file.txt')).toBeVisible({ timeout: 10000 });
    
    console.log('File transfer completed successfully!');

    // Cleanup
    fs.unlinkSync(testFilePath);
    await contextA.close();
    await contextB.close();
  });
});
