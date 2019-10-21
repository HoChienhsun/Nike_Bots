const puppeteer = require('puppeteer');
const atob = require('atob');
const btoa = require('btoa');
const personalData = require('./config.js')
const scriptUrlPatterns = [
  '*'
]
const requestCache = new Map();

async function main() {
//set enable-automation for browser when executing this code // 
const args = puppeteer.defaultArgs().filter(arg => arg !== '--enable-asm-webassembly')
args.push('--enable-webgl-draft-extensions', '--shared-array-buffer')
const browser = await puppeteer.launch({ ignoreDefaultArgs: true, args })
//const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();
await page.setViewport({width: 1200, height: 3000})
await page.goto('https://www.nike.com/tw/'); // wait until page load
//const navigationPromise = page.waitForNavigation();
//await page.waitForSelector('#AccountNavigationContainer > button')
await page.$eval("#AccountNavigationContainer > button", elem => elem.click());
//debug at console
//document.querySelector("#AccountNavigationContainer > button").click()
await page.waitForSelector('input[type="email"]')
await page.type('input[type="email"]', personalData.email);
await page.type('input[type="password"]', personalData.password);
//console.log(await page.cookies());
await page.$eval('input[type="button"]', elem => elem.click());
await page.waitFor(4000);
await page.waitForSelector('li[data-nav="5"]');
await page.$eval('li[data-nav="5"] > a', elem => elem.click());
await page.waitForSelector('a[aria-label="現貨 filter"] > div');
await page.$eval('a[aria-label="現貨 filter"] > div', elem => elem.click());
await page.waitForSelector('img[src="https://secure-images.nike.com/is/image/DotCom/302370_160_A_PREM?$SNKRS_COVER_WD$&align=0,1"]');
await page.$eval('img[src="https://secure-images.nike.com/is/image/DotCom/302370_160_A_PREM?$SNKRS_COVER_WD$&align=0,1"]', elem => elem.click());
await page.waitForSelector('button[class="size-grid-dropdown size-grid-button"]');
await page.evaluate(() => Array.from(document.querySelectorAll('button[class="size-grid-dropdown size-grid-button"]'), element => 
{
if(element.textContent === personalData.size)
  element.click();
}));
await page.$eval('button[data-qa="add-to-cart"]', elem => elem.click());
await page.waitFor(2000);
//await page.waitForSelector('div[class = "ncss-row.cart-button-row"]> button[data-qa="checkout-link"]');
await page.$eval('button[data-qa="checkout-link"]', elem => elem.click());
/*await page.waitForSelector('a[aria-label="購物車"]');
await page.$eval('a[aria-label="購物車"]', elem => elem.click());
await page.$eval('button[data-automation="go-to-checkout-button"]', elem => elem.click());
await page.waitForSelector('button[data-automation="checkout-button"]');
await page.$eval('button[data-automation="checkout-button"]', elem => elem.click());*/


await page.waitForSelector('#Shipping_LastName')
await page.type('#Shipping_LastName', personalData.LN);
await page.type('#Shipping_FirstName',personalData.FN);
await page.type('#Shipping_phonenumber', personalData.phoneNumber);
await page.waitForSelector('input[ng-model="userOrder.GovId.TaiwanPassport"]')
await page.$eval('input[ng-model="userOrder.GovId.TaiwanPassport"]', elem => elem.click());
await page.type('input[id = "governmentid"]', personalData.governmentid);

//await page.$eval('input[name="shipping"]', elem => elem.click());
await page.waitForSelector('div[class="gdpr-inner-section"] > label[class="checkbox-container"] > input[type="checkbox"]')
await page.$eval('div[class="gdpr-inner-section"] > label[class="checkbox-container"] > input[type="checkbox"]', elem => elem.click());
await page.$eval('button[id="shippingSubmit"]', elem => elem.click());




//await page.$eval('button[class="size-grid-dropdown size-grid-button"]', elem => console.log(elem));

/*
await page.waitForSelector('a[aria-label="即將推出 filter"] > div');
await page.$eval('a[aria-label="即將推出 filter"] > div', elem => elem.click());
await page.waitForSelector('img[src="https://secure-images.nike.com/is/image/DotCom/CK4122_001_A_PREM?$SNKRS_COVER_WD$&align=0,1"]');
await page.$eval('img[src="https://secure-images.nike.com/is/image/DotCom/CK4122_001_A_PREM?$SNKRS_COVER_WD$&align=0,1"]', elem => elem.click());
*/


await page.waitFor(7000);
await page.screenshot({path: 'buddy-screenshot.png'});


/*
const client = await page.target().createCDPSession();
await client.send('Network.enable');
await client.send('Network.setRequestInterception', { 
  patterns: scriptUrlPatterns.map(pattern => ({
    urlPattern: pattern, resourceType: 'Script', interceptionStage: 'HeadersReceived'
  }))
});

client.on('Network.requestIntercepted', async ({ interceptionId, request, responseHeaders, resourceType }) => {
 // console.log(`Intercepted ${request.url} {interception id: ${interceptionId}}`);

  const response = await client.send('Network.getResponseBodyForInterception',{ interceptionId });
  const contentTypeHeader = Object.keys(responseHeaders).find(k => k.toLowerCase() === 'content-type');
  let newBody, contentType = responseHeaders[contentTypeHeader];
  console.log("responseHeaders: ",responseHeaders);

  if (requestCache.has(response.body)) {
    newBody = requestCache.get(response.body);
  } 
  else {
    const bodyData = response.base64Encoded ? atob(response.body) : response.body;
    try {
      if (resourceType === 'Script') newBody = prettier.format(bodyData, { parser: 'babel' })
      else newBody === bodyData
    } catch(e) {
      //console.log(`Failed to process ${request.url} {interception id: ${interceptionId}}: ${e}`);
      newBody = bodyData
    }

    requestCache.set(response.body, newBody);
  }

  const newHeaders = [
    'Date: ' + (new Date()).toUTCString(),
    'Connection: closed',
    'Content-Length: ' + newBody.length,
    'Content-Type: ' + contentType
  ];
  console.log("newHeaders : ",newHeaders)
  //console.log(`Continuing interception ${interceptionId}`)
  client.send('Network.continueInterceptedRequest', {
    interceptionId,
    rawResponse: btoa('HTTP/1.1 200 OK' + '\r\n' + newHeaders.join('\r\n') + '\r\n\r\n' + newBody)
  });
});
*/


}

main();