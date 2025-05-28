package com.camunda.consulting.loop_detector.plugin;

import org.camunda.bpm.engine.delegate.ExecutionListener;
import org.camunda.bpm.engine.impl.bpmn.parser.AbstractBpmnParseListener;
import org.camunda.bpm.engine.impl.pvm.process.ActivityImpl;
import org.camunda.bpm.engine.impl.pvm.process.ScopeImpl;
import org.camunda.bpm.engine.impl.util.xml.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoopDetectorParseListener extends AbstractBpmnParseListener {

  private static final Logger LOG = LoggerFactory.getLogger(LoopDetectorParseListener.class);

  @Override
  public void parseExclusiveGateway(Element exclusiveGwElement, ScopeImpl scope,
      ActivityImpl activity) {
    LOG.info("Parsing exclusive gateway");
    LoopDetectionListener loopDetectionListener = new LoopDetectionListener();
    activity.addListener(ExecutionListener.EVENTNAME_START, loopDetectionListener);
    LOG.info("Execution listener appended");
  }
}
