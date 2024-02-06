export enum EQueueName {
  ANALYZE_PROJECT = 'auditor_platform_tools:analyze_project',
}

export enum EQueueJob {
  HANDLE_ANALYZE_PROJECT = `${EQueueName.ANALYZE_PROJECT}::HandleAnalyzeProject`,
  HANDLE_UPDATE_ANALYSIS = `${EQueueName.ANALYZE_PROJECT}::HandleUpdateAnalysis`,
}
