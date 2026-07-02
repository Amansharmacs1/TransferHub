const puppeteer = require('puppeteer');

(async () => {
  console.log('Starting E2E test for Device Pairing & Connection...');
  const browser = await puppeteer.launch({ headless: 'new' });
  
  try {
    const pageA = await browser.newPage();
    const pageB = await browser.newPage();

    console.log('Opening /transfer on both devices...');
    await Promise.all([
      pageA.goto('http://localhost:5173/transfer'),
      pageB.goto('http://localhost:5173/transfer')
    ]);

    // Function to extract pairing code
    const getCode = async (page) => {
      await page.waitForSelector('span.text-5xl');
      return await page.$eval('span.text-5xl', el => el.innerText);
    };

    const codeA = await getCode(pageA);
    const codeB = await getCode(pageB);

    console.log(`Device A code: ${codeA}`);
    console.log(`Device B code: ${codeB}`);

    if (!codeA || !codeB) {
      throw new Error('Failed to retrieve pairing codes');
    }

    console.log(`Device A is requesting connection to Device B (${codeB})...`);
    await pageA.type('input[placeholder="e.g. A1B2C3"]', codeB);
    
    // Click connect button
    const connectButton = await pageA.$('button[type="submit"]');
    await connectButton.click();

    console.log('Waiting for connection request modal on Device B...');
    await pageB.waitForXPath('//button[contains(., "Accept")]', { timeout: 5000 });
    
    console.log('Device B accepting the connection...');
    const [acceptButton] = await pageB.$x('//button[contains(., "Accept")]');
    await acceptButton.click();

    console.log('Waiting for both devices to show "Connected!"...');
    await Promise.all([
      pageA.waitForXPath('//h2[contains(text(), "Connected!")]', { timeout: 5000 }),
      pageB.waitForXPath('//h2[contains(text(), "Connected!")]', { timeout: 5000 })
    ]);
    
    console.log('Successfully paired both devices!');

    console.log('Testing disconnection...');
    const [disconnectButton] = await pageA.$x('//button[contains(., "Disconnect")]');
    await disconnectButton.click();

    console.log('Waiting for both devices to return to pairing UI...');
    await Promise.all([
      pageA.waitForXPath('//h2[contains(text(), "Pair Device")]', { timeout: 5000 }),
      pageB.waitForXPath('//h2[contains(text(), "Pair Device")]', { timeout: 5000 })
    ]);

    console.log('Successfully disconnected!');
    console.log('✅ ALL E2E TESTS PASSED');

  } catch (err) {
    console.error('❌ E2E TEST FAILED:', err.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
