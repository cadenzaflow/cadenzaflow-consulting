const request = require("supertest");
const fs = require("fs");
const path = require("path");

class CamundaHelper {
    constructor(camundaUrl) {
        this.camundaUrl = camundaUrl;
    }

    async deployBpmnDiagram(diagramPath) {
        const fullPath = path.resolve(diagramPath);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`🚨 BPMN file not found at: ${fullPath}`);
        }

        const response = await request(this.camundaUrl)
            .post("/deployment/create")
            .field("deployment-name", "TestDeployment")
            .attach("diagram.bpmn", fullPath, { contentType: "text/xml" });

        return response.body;
    }

    async startProcessInstance(processKey, variables) {
        const response = await request(this.camundaUrl)
            .post(`/process-definition/key/${processKey}/start`)
            .send({ variables });

        return response.body;
    }

    async getProcessInstance(instanceId) {
        const response = await request(this.camundaUrl)
            .get(`/history/process-instance/${instanceId}`);

        return response.body;
    }

    async instanceIsCompleted(instanceId, timeout = 10000, interval = 1000) {
        return await this.pollUntil(async () => {
            const instance = await this.getProcessInstance(instanceId);
            return instance.state === "COMPLETED";
        }, timeout, interval);
    }    

    async pollUntil(fnCondition, timeout = 10000, interval = 1000) {
        const startTime = Date.now();
    
        while (Date.now() - startTime < timeout) {
            const result = await fnCondition();
            if (result) return true;
    
            await new Promise((resolve) => setTimeout(resolve, interval));
        }
    
        return false;
    }
    
    async checkElement(processInstanceId, activityName, finished, timeout = 10000, interval = 1000) {
        return await this.pollUntil(async () => {
            try {
                const response = await request(this.camundaUrl)
                    .get(`/history/activity-instance`)
                    .query({
                        processInstanceId: processInstanceId,
                        activityName: activityName,
                        finished: finished
                    });

                const activityInstances = response.body;
                return activityInstances.length > 0;
            } catch (error) {
                console.error(`❌ Error checking if "${activityName}" was passed:`, error.message);
                return false;
            }
        }, timeout, interval);
    }

    async isUserTaskActive(processInstanceId, activityName, timeout = 10000, interval = 1000) {
        return await this.pollUntil(async () => {
            try {
                const response = await request(this.camundaUrl)
                    .get(`/task`)
                    .query({
                        processInstanceId: processInstanceId,
                        name: activityName,
                        taskState: "Created"
                    });

                return response.body.length > 0;
            } catch (error) {
                console.error(`❌ Error checking if user task "${activityName}" is active:`, error.message);
                return false;
            }
        }, timeout, interval);
    }

    // Only works with one token at this UserTask

    async getUserTaskId(processInstanceId, activityName, timeout = 10000, interval = 1000) {
        try {
            const response = await request(this.camundaUrl)
                .get(`/task`)
                .query({
                    processInstanceId: processInstanceId,
                    name: activityName,
                    taskState: "Created"
                });

            const tasks = response.body;
            return tasks[0].id
        } catch (error) {
            console.error(`❌ Error fetching user task ID for "${activityName}":`, error.message);
            return null;
        }
    }

    async completeUserTask(taskId, variables = {}) {
        try {
            const response = await request(this.camundaUrl)
                .post(`/task/${taskId}/complete`)
                .send({ variables });

            return response.status === 204;
        } catch (error) {
            console.error(`❌ Error completing user task with ID "${taskId}":`, error.message);
            return false;
        }
    }




}

module.exports = CamundaHelper;
