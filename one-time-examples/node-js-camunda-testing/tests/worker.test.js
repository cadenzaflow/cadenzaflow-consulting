const CamundaHelper = require("./helpers/camundaHelper.js");
const CreditService = require("../src/services/CreditService.js");
const { startWorker } = require("../src/workers/index.js");

jest.mock("../src/services/CreditService.js");

describe("Camunda External Task Workers", () => {
    let camundaHelper;
    let creditServiceMock;
    let workerClient;
    const bpmnPath = "./bpmn/java-script-external.bpmn";

    beforeAll(async () => {
        camundaHelper = new CamundaHelper(global.camundaUrl);

        const deployment = await camundaHelper.deployBpmnDiagram(bpmnPath);
        console.log(`✅ Deployed BPMN: ${JSON.stringify(deployment.deployedProcessDefinitions)}`);

        creditServiceMock = new CreditService();
        workerClient = startWorker(creditServiceMock);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        workerClient.stop(); // Stop worker after tests
    });

    it("🥳 - Happy Path - Should Accept Application with Mocked Credit Score", async () => {
        creditServiceMock.getCreditScore.mockReturnValue(80);
        creditServiceMock.getCustomerExists.mockReturnValue(false);

        const processKey = "ApplicationReceived";
        const variables = { someInput: { value: "test", type: "String" } };

        const processInstance = await camundaHelper.startProcessInstance(processKey, variables);
        const hasPassedAddCustomer = await camundaHelper.checkElement(processInstance.id, "Add Customer", true);
        const hasPassedSendCustomer = await camundaHelper.checkElement(processInstance.id, "Send Confirmation", true);
        const instanceStatus = await camundaHelper.instanceIsCompleted(processInstance.id);

        expect(creditServiceMock.getCreditScore).toHaveBeenCalled();
        expect(creditServiceMock.getCustomerExists).toHaveBeenCalled();
        expect(hasPassedAddCustomer).toBe(true);
        expect(hasPassedSendCustomer).toBe(true);
        expect(instanceStatus).toBe(true);
    });

    it("🙅 - Should Reject Application with Mocked Credit Score", async () => {
        creditServiceMock.getCreditScore.mockReturnValue(30);
        creditServiceMock.getCustomerExists.mockReturnValue(true);

        const processKey = "ApplicationReceived";
        const variables = { someInput: { value: "test", type: "String" } };

        const processInstance = await camundaHelper.startProcessInstance(processKey, variables);
        const hasPassedAddCustomer = await camundaHelper.checkElement(processInstance.id, "Get Credit Score", true);
        const hasPassedSendCustomer = await camundaHelper.checkElement(processInstance.id, "Send Rejection", true);
        const instanceStatus = await camundaHelper.instanceIsCompleted(processInstance.id);

        expect(creditServiceMock.getCreditScore).toHaveBeenCalled();
        expect(hasPassedAddCustomer).toBe(true);
        expect(hasPassedSendCustomer).toBe(true);
        expect(instanceStatus).toBe(true);
    });

    it("2️⃣ - Should Identify Duplicate with Mocked Credit Score", async () => {
        creditServiceMock.getCreditScore.mockReturnValue(80);
        creditServiceMock.getCustomerExists.mockReturnValue(true);

        const processKey = "ApplicationReceived";
        const variables = { someInput: { value: "test", type: "String" } };

        const processInstance = await camundaHelper.startProcessInstance(processKey, variables);
        const hascancelledAddCustomer = await camundaHelper.checkElement(processInstance.id, "Add Customer", false);
        expect(hascancelledAddCustomer).toBe(true);
        const isUserTaskActive = await camundaHelper.isUserTaskActive(processInstance.id, "Send Information");
        expect(isUserTaskActive).toBe(true);
        const userTaskId = await camundaHelper.getUserTaskId(processInstance.id, "Send Information");
        await camundaHelper.completeUserTask(userTaskId);
        const instanceStatus = await camundaHelper.instanceIsCompleted(processInstance.id);

        expect(creditServiceMock.getCreditScore).toHaveBeenCalled();
        expect(creditServiceMock.getCustomerExists).toHaveBeenCalled();
    
        expect(instanceStatus).toBe(true);
    });
});
