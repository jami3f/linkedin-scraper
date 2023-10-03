import { Hono } from "hono";
import puppeteer from "puppeteer";
import { Browser } from "puppeteer";
import Jimp from "jimp";

const app = new Hono();

type headlessMode = false | "new";
let browser: Browser;

app.get("/", async c => {
	return c.json({
		message: "Hello World!",
	});
});

app.post("/scrape", async c => {
	const isHeadless: headlessMode = false;
	const reqBody = await c.req.json<{ url: string }>();
	if (reqBody.url === undefined || !reqBody.url.startsWith("https://www.linkedin.com/in/")) {
		console.error(`URL '${reqBody.url}' is invalid`);
		c.status(400);
		return c.json({
			error: "Invalid URL",
		});
	}
	const username = process.env.username;
	const password = process.env.password;
	if (username === undefined) throw new Error("Username not set");
	if (password === undefined) throw new Error("Password not set");
	console.log(`Getting info from ${reqBody.url}`);
	browser = await puppeteer.launch({ headless: isHeadless });
	const page = (await browser.pages())[0];
	await page.goto(reqBody.url);
	await page.waitForNavigation();
	if ((await page.$("button[data-tracking-control-name='auth_wall_desktop_profile-login-toggle']")) !== null)
		await page.click('button[data-tracking-control-name="auth_wall_desktop_profile-login-toggle"]');
	else await page.click("button.sign-in-modal__outlet-btn.cursor-pointer.btn-md.btn-primary");
	await page.waitForSelector("input[autocomplete='username']");
	await page.click("input[autocomplete='username']");
	await page.type("input[autocomplete='username']", username, { delay: 50 });
	await page.click("input[autocomplete='current-password']");
	await page.type("input[autocomplete='current-password']", password, { delay: 50 });
	await page.keyboard.press("Enter");
	await page.waitForResponse(response => {
		console.log(response.url().split("?")[0] + "/");
		console.log(`${reqBody.url}?originalSubdomain=uk`);
		console.log(response.url().split("?")[0] + "/" === reqBody.url);

		return (
			response.url() === "https://www.linkedin.com/feed/?trk=seo-authwall-base_sign-in-submit" ||
			response.url() === "https://www.linkedin.com/feed/" ||
			response.url().split("?")[0] + "/" === reqBody.url
		);
	});
	await page.goto(reqBody.url);
	console.log("Getting name...");
	await page.waitForSelector("h1.text-heading-xlarge.inline.t-24.v-align-middle.break-words");
	const name = await page.$eval("h1.text-heading-xlarge.inline.t-24.v-align-middle.break-words", el => el.textContent);
	console.log(name);
	console.log("Getting bio...");
	await page.waitForSelector(
		"div.inline-show-more-text.inline-show-more-text--is-collapsed.inline-show-more-text--is-collapsed-with-line-clamp.full-width"
	);
	const bio: string = await page.$eval(
		"div.inline-show-more-text.inline-show-more-text--is-collapsed.inline-show-more-text--is-collapsed-with-line-clamp.full-width > span",
		el => el.textContent
	);
	console.log(bio.substring(0, 100) + "...");
	console.log("Getting profile picture...");
	await page.waitForSelector(`img[alt='${name}']`);
	const imgURL = await page.$eval(`img[alt='${name}']`, el => el.getAttribute("src"));
	console.log(imgURL);
	browser.close();
	const imgRes = await fetch(imgURL);
	const img = await imgRes.blob();
	const imgBuffer = await img.arrayBuffer();
	const jimpImage = await Jimp.read(Buffer.from(imgBuffer));
	const png = await jimpImage.writeAsync("test.png");
	const pngBuffer = await png.getBufferAsync(Jimp.MIME_PNG);
	return c.json({
		name,
		bio,
		profilePic: pngBuffer.toString("base64"),
	});
});

process.on("SIGINT", function () {
	console.log("Caught interrupt signal");
	process.kill(process.pid, "SIGINT");
	process.exit();
});

export default app;
