package com.camunda.consulting.loop_detector.plugin;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.ExecutionListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoopDetectionListener implements ExecutionListener {
  
  private static int maxRuns = 5;
  
  private static final Logger LOG = LoggerFactory.getLogger(LoopDetectionListener.class);

  @Override
  public void notify(DelegateExecution execution) throws Exception {
    String activityId = execution.getCurrentActivityId();
    String processInstanceId = execution.getProcessInstanceId();
    long count = execution.getProcessEngineServices().getHistoryService().createHistoricActivityInstanceQuery().activityId(activityId).processInstanceId(processInstanceId).count();
    LOG.info("Count is {}", count);
    if (count > maxRuns) {
      LOG.warn("LOOP with more than {} runs detected.", maxRuns);
      throw new RuntimeException("Loop with more than " + maxRuns + " runs detected. Stop the process instance");
    }
  }

}
