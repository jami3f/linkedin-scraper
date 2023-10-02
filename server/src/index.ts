import { Hono } from "hono";
import { puppeteer } from "puppeteer";

const browser = await puppeteer.launch();

const app = new Hono();

app.get("/", c => c.text("Hello Hono!"));

export default app;
