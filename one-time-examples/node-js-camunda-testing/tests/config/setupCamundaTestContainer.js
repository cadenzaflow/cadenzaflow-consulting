const { GenericContainer } = require("testcontainers");

let camundaContainer;

const startCamunda = async () => {
    camundaContainer = await new GenericContainer("camunda/camunda-bpm-platform:7.22.0")
        .withExposedPorts(8080)
        .start();

    const mappedPort = camundaContainer.getMappedPort(8080);
    const camundaUrl = `http://localhost:${mappedPort}/engine-rest`;

    console.log(`✅ Camunda TestContainer started at ${camundaUrl}`);
    
    return camundaUrl;
};

const stopCamunda = async () => {
    if (camundaContainer) {
        await camundaContainer.stop();
        console.log("🛑 Camunda TestContainer stopped.");
    }
};

module.exports = { startCamunda, stopCamunda };
