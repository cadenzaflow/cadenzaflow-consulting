# Camunda 7 Unit Testing in JavaScript

## 📌 Overview
This project demonstrates **how to write unit tests for Camunda BPMN processes in JavaScript** using Jest and TestContainers. It sets up a testable Camunda environment, mocks external dependencies, and validates process execution.

## 🚀 Getting Started

### **1. Prerequisites**
Ensure you have the following installed:
- Node.js (LTS version recommended)
- Docker (for running Camunda in TestContainers)

### **2. Installation**
Clone the repository and install dependencies:
```sh
npm install
```

### **3. Running Tests**
To execute the unit tests, run:
```sh
npm test
```
This will:
1. Start a **Camunda TestContainer**.
2. Deploy a BPMN process.
3. Execute test cases using mocked dependencies.
4. Validate process execution.
5. Tear down the container after tests complete.

## 🛠 How It Works

### **1. Setting Up Camunda for Tests**
The `setupCamundaTestContainer.js` file starts a **Camunda TestContainer**:
```js
const { GenericContainer } = require("testcontainers");
...
const camundaContainer = await new GenericContainer("camunda/camunda-bpm-platform:7.22.0")
    .withExposedPorts(8080)
    .start();
...
```

### **2. Writing Unit Tests**
The test suite (`worker.test.js`) validates Camunda process execution:
```js
describe("Camunda External Task Workers", () => {
    it("🥳 - Should Accept Application with Mocked Credit Score", async () => {
        creditServiceMock.getCreditScore.mockReturnValue(80);
        const processInstance = await camundaHelper.startProcessInstance("ApplicationReceived", variables);
        expect(instanceStatus).toBe(true);
    });
});
```

### **3. Mocking External Dependencies**
The `CreditService.js` file is **mocked in tests**:
```js
jest.mock("../services/CreditService.js");
```

## 🔥 Key Features
✔️ Uses **Jest** for unit testing.  
✔️ Runs Camunda BPM in a **TestContainer** (Docker).  
✔️ Mocks **external dependencies** (e.g., `CreditService`).  
✔️ Validates process execution (completed, user tasks, rejections).  
