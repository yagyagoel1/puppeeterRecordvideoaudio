const { launch, getStream, wss } = require("puppeteer-stream");
const fs = require("fs");

const file = fs.createWriteStream(__dirname + "/test.webm");

async function test() {
	const browser = await launch({
		executablePath: "/usr/bin/google-chrome", 
		defaultViewport: {
			width: 1920,
			height: 1080,
		},
	});

	const page = await browser.newPage();
	await page.goto("https://youtube.com/watch?v=fRJ03btNsao&list=RDfRJ03btNsao&index=2");
	const stream = await getStream(page, { audio: true, video: true });
	console.log("recording");

	stream.pipe(file);
	setTimeout(async () => {
		await stream.destroy();
		file.close();
		console.log("finished");

		await browser.close();
		(await wss).close();
	}, 1000 * 10);
}

test();