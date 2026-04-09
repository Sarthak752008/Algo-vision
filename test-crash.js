import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR STR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('PAGE EXCEPTION STACK:');
    console.log(error.stack);
  });

  await page.goto('http://localhost:8080/visualize/radix-sort');
  await page.waitForSelector('button');
  
  // Click the 3D button
  const buttons = await page.$$('button');
  for (let btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('3D')) {
      await btn.click();
      break;
    }
  }

  // Wait to see if error happens
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
