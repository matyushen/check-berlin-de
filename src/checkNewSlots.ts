import {chromium} from 'playwright'
import { sendMessage } from './sendMessage';

const url = 'https://service.berlin.de/dienstleistung/324269/en/';

export const checkNewSlots = async () => {
 const browser = await chromium.launch({
    headless: process.env.HEADLESS === "true",
  });
  const context = await browser.newContext({
    viewport: {
      width: 1440,
      height: 900
    }
  });

  const page = await context.newPage();
  await page.goto(url);
  await page.goto('https://service.berlin.de/terminvereinbarung/termin/tag.php?termin=1&dienstleister=122243&anliegen[]=324269&herkunft=1');
  // await page.click('text=Look for an available appointment anywhere in Berlin.');
  await page.waitForURL('https://service.berlin.de/terminvereinbarung/termin/day/')

  const slot = await page.$('tr > td.buchbar');

  if (!!slot) {
    const msg = `Found slots at ${url}`;
    console.log(msg);
    await sendMessage(msg, page);
  } {
    console.log('No new slots yet!');
  }

  await context.close();
  await browser.close();
}