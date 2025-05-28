package com.camunda.consulting.loop_detector.plugin;

import java.util.ArrayList;
import java.util.List;
import org.camunda.bpm.engine.impl.bpmn.parser.BpmnParseListener;
import org.camunda.bpm.engine.impl.cfg.AbstractProcessEnginePlugin;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class LoopDetectionEnginePlugin extends AbstractProcessEnginePlugin {
  
  private static final Logger LOG = LoggerFactory.getLogger(LoopDetectionEnginePlugin.class);

  @Override
  public void preInit(ProcessEngineConfigurationImpl processEngineConfiguration) {
    LOG.info("Initializing Loop detection");
    // get all existing preParseListeners
    List<BpmnParseListener> preParseListeners = processEngineConfiguration.getCustomPreBPMNParseListeners();
    
    if(preParseListeners == null) {
      // if no preParseListener exists, create new list
      preParseListeners = new ArrayList<BpmnParseListener>();
      processEngineConfiguration.setCustomPreBPMNParseListeners(preParseListeners);
    }
    
    // add new BPMN Parse Listener
    preParseListeners.add(new LoopDetectorParseListener());
  }
}
