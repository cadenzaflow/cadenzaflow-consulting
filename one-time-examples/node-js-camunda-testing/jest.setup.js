const { startCamunda, stopCamunda } = require("./tests/config/setupCamundaTestContainer.js");

beforeAll(async () => {
    global.camundaUrl = await startCamunda();
    process.env.CAMUNDA_URL = global.camundaUrl;

    console.log(`🚀 Camunda Test Container Started (URL: ${global.camundaUrl})`);
});

afterAll(async () => {
    console.log("🛑 Stopping Camunda Test Container...");
    await stopCamunda();
});
