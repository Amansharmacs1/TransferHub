# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: transfer.spec.js >> TransferHub E2E File Transfer >> should successfully pair two clients and transfer a file
- Location: e2e/transfer.spec.js:6:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.text-green-500').first()
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 20000ms
  - waiting for locator('.text-green-500').first()

```

```yaml
- heading "TransferHub" [level=1]
- navigation:
  - link "Transfers":
    - /url: /
  - link "Clipboard":
    - /url: /clipboard
  - link "History":
    - /url: /history
  - link "Settings":
    - /url: /settings
- heading "Connection" [level=3]
- text: 97H45E
- button "Disconnect"
- main:
  - heading "Send & Receive Files" [level=1]
  - paragraph: Secure, peer-to-peer file transfer directly between devices.
  - heading "Drag & Drop Files or Folders" [level=3]
  - paragraph: Send images, videos, documents, or entire folders securely.
  - text: Select Files
  - button "Select Files"
  - text: Select Folder
  - button "Select Folder"
  - heading "Active Transfers" [level=3]
  - paragraph: test-file.txt
  - text: 19 Bytes preparing
  - button
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import fs from 'fs';
  3  | import path from 'path';
  4  | 
  5  | test.describe('TransferHub E2E File Transfer', () => {
  6  |   test('should successfully pair two clients and transfer a file', async ({ browser }) => {
  7  |     // We need two distinct browser contexts to represent two different users
  8  |     const contextA = await browser.newContext();
  9  |     const contextB = await browser.newContext();
  10 | 
  11 |     const pageA = await contextA.newPage();
  12 |     const pageB = await contextB.newPage();
  13 | 
  14 |     pageA.on('console', msg => console.log(`Page A: ${msg.text()}`));
  15 |     pageB.on('console', msg => console.log(`Page B: ${msg.text()}`));
  16 | 
  17 |     // 1. Peer A goes to the site and gets their pairing code
  18 |     await pageA.goto('/');
  19 |     
  20 |     // Ensure Peer A is connected and wait for the code
  21 |     await expect(pageA.getByText('Your Device Code')).toBeVisible({ timeout: 10000 });
  22 |     
  23 |     // Extract Peer A's pairing code
  24 |     const codeElementA = pageA.locator('span.text-5xl.font-mono');
  25 |     await expect(codeElementA).toBeVisible();
  26 |     const codeA = await codeElementA.innerText();
  27 |     expect(codeA).toHaveLength(6);
  28 |     console.log(`Peer A pairing code is: ${codeA}`);
  29 | 
  30 |     // 2. Peer B goes to the site
  31 |     await pageB.goto('/');
  32 |     await expect(pageB.getByText('Your Device Code')).toBeVisible({ timeout: 10000 });
  33 | 
  34 |     // 3. Peer B connects to Peer A
  35 |     await pageB.getByPlaceholder('e.g. A1B2C3').fill(codeA);
  36 |     await pageB.getByRole('button', { name: 'Connect' }).click();
  37 | 
  38 |     // 4. Peer A receives and accepts the pairing request
  39 |     await expect(pageA.getByText('Connection Request')).toBeVisible({ timeout: 10000 });
  40 |     await pageA.getByRole('button', { name: 'Accept' }).click();
  41 | 
  42 |     // 5. Both peers should now be on the Transfer page
  43 |     await expect(pageA.getByText('Send & Receive Files')).toBeVisible({ timeout: 15000 });
  44 |     await expect(pageB.getByText('Send & Receive Files')).toBeVisible({ timeout: 15000 });
  45 |     
  46 |     console.log('Peers are connected!');
  47 | 
  48 |     // 6. Peer A selects a mock file to send
  49 |     const testFilePath = path.join('/tmp', 'test-file.txt');
  50 |     fs.writeFileSync(testFilePath, 'Hello, TransferHub!');
  51 |     
  52 |     // Listen for file chooser event
  53 |     const fileChooserPromise = pageA.waitForEvent('filechooser');
  54 |     await pageA.getByText('Select Files').click();
  55 |     const fileChooser = await fileChooserPromise;
  56 |     await fileChooser.setFiles(testFilePath);
  57 | 
  58 |     // Click Send All to start transfer
  59 |     await pageA.getByRole('button', { name: 'Send All' }).click({ force: true });
  60 | 
  61 |     // 7. Wait for transfer to complete on both sides
  62 |     // Peer A should see "completed"
> 63 |     await expect(pageA.locator('.text-green-500').first()).toBeVisible({ timeout: 20000 });
     |                                                            ^ Error: expect(locator).toBeVisible() failed
  64 |     
  65 |     // Peer B should receive the file and display it
  66 |     await expect(pageB.getByText(/Received Files/i).first()).toBeVisible({ timeout: 20000 });
  67 |     await expect(pageB.getByText('test-file.txt')).toBeVisible({ timeout: 10000 });
  68 |     
  69 |     console.log('File transfer completed successfully!');
  70 | 
  71 |     // Cleanup
  72 |     fs.unlinkSync(testFilePath);
  73 |     await contextA.close();
  74 |     await contextB.close();
  75 |   });
  76 | });
  77 | 
```