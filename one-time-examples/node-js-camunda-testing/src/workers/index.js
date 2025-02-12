const { Client, logger, Variables } = require("camunda-external-task-client-js");
const CreditService = require("../services/CreditService.js");

function startWorker(creditServiceInstance = new CreditService()) {
    const config = {
        baseUrl: process.env.CAMUNDA_URL || "http://localhost:8080/engine-rest",
        use: logger
    };

    const client = new Client(config);

    client.subscribe("credit-score", async ({ task, taskService }) => {
        console.log(`🛠️ - 📊 Processing Credit Score Task: ${task.id}`);

        const creditScore = creditServiceInstance.getCreditScore();
        console.log(`📊 Generated Credit Score: ${creditScore}`);

        const customerExists = creditServiceInstance.getCustomerExists();
        console.log(`👤 Generated Customer Exists: ${customerExists}`);

        const variables = new Variables();
        variables.set("creditScore", creditScore);
        variables.set("customerExists", customerExists);

        await taskService.complete(task, variables);
        console.log(`✅ - 📊 Credit Score Task ${task.id} completed.`);
    });

    client.subscribe("add-customer", async ({ task, taskService }) => {
        console.log(`Processing Add Customer Task: ${task.id}`);
        const customerExists = task.variables.get("customerExists");
        
        if (customerExists) {
            console.log(`Customer already exists, throwing bpmn error for task: ${task.id}`);
            await taskService.handleBpmnError(task, "CustomerExists", "This Customer already exist");
        } else {
            await taskService.complete(task);
            console.log(`Add Customer Task ${task.id} completed.`);
        }
    });
    
    
    client.subscribe("send-confirmation", async ({ task, taskService }) => {
        console.log(`Processing Send Confirmation Task: ${task.id}`);
        await taskService.complete(task);
        console.log(`Send Confirmation Task ${task.id} completed.`);
    });
    
    
    client.subscribe("send-information", async ({ task, taskService }) => {
        console.log(`Processing Send Information Task: ${task.id}`);
        await taskService.complete(task);
        console.log(`Send Information Task ${task.id} completed.`);
    });
    
    
    client.subscribe("send-rejection", async ({ task, taskService }) => {
        console.log(`Processing Send Rejection Task: ${task.id}`);
        await taskService.complete(task);
        console.log(`Send Rejection Task ${task.id} completed.`);
    });
    

    return client;
}

module.exports = { startWorker };

// Start the worker normally if not in a test environment
if (require.main === module) {
    startWorker();
}