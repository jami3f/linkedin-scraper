// import { Hono } from "hono";
import puppeteer from "puppeteer";
import { Browser } from "puppeteer";

// const app = new Hono();

// app.get("/", c => c.text("Hello Hono!"));

// app.post("/screenshot", async c => {
// 	const browser = await puppeteer.launch({ headless: "new" });
// 	const { url } = await c.req.json<{ url: string }>();
// 	console.log(url);
// 	console.log("screenshot");
// 	const page = await browser.newPage();
// 	await page.goto(url);
// 	const buffer = await page.screenshot();
// 	await page.close();
// 	browser.close();
// 	return c.stream(async s => {
// 		await s.write(buffer);
// 	});
// });
let browser: Browser;
(async () => {
	browser = await puppeteer.launch({ headless: false });
	const page = (await browser.pages())[0];
	await page.goto("https://www.linkedin.com/in/zahid-din-3787887/");
	await page.waitForNavigation();
	await page.click('button[data-tracking-control-name="auth_wall_desktop_profile-login-toggle"]');
	await page.waitForSelector('button[data-id="sign-in-form__submit-btn"]');
	const username = process.env.username;
	const password = process.env.password;
	if (username === undefined) throw new Error("Username not set");
	if (password === undefined) throw new Error("Password not set");
	await page.click('button[action-type="DENY"]');
	await page.type("input[autocomplete='username']", username, { delay: 50 });
	await page.type("input[autocomplete='current-password']", password, { delay: 50 });
	await page.keyboard.press("Enter");
	await page.waitForResponse("https://www.linkedin.com/feed/?trk=seo-authwall-base_sign-in-submit");
	await page.goto("https://www.linkedin.com/in/zahid-din-3787887/");
	const name = await page.$eval("h1.text-heading-xlarge.inline.t-24.v-align-middle.break-words", el => el.textContent);
	console.log("Name: " + name);
	const bio = await page.$$eval("div[style='-webkit-line-clamp:4;'] > span", els =>
		els.map(el => el.textContent).join("\n")
	);
	console.log("Bio:\n" + bio);
	// console.log((await browser.pages()).map(p => p.url()));
	// await page.click(".nsm7Bb-HzV7m-LgbsSe-BPrWId");
	// const popupPromise = new Promise<Page>(x =>
	// 	browser.once("targetcreated", async t => {
	// 		const page = await t.page();
	// 		if (page !== null) return x(page);
	// 		throw new Error("Page is null");
	// 	})
	// );
	// const loginPage = await popupPromise;
	// await loginPage.waitForSelector("[type='email']");
	// await loginPage.type("input[type='email']", "jamie.fairhurst01@gmail.com", { delay: 50 });
	// await loginPage.keyboard.press("Enter");
})();

process.on("SIGINT", function () {
	console.log("Caught interrupt signal");
	browser.close();
	process.kill(process.pid, "SIGINT");
	process.exit();
});

// export default app;
