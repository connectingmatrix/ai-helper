import {
  WorkflowLogControlLevel,
  WorkflowLogEventLevel,
  WorkflowNodeExecutionResult,
  WorkflowNodeLike,
  WorkflowNodeStatus,
  WorkflowRunLogEvent,
} from './types';

interface WorkflowLogger {
  push: (event: Omit<WorkflowRunLogEvent, 'timestamp'>) => void;
}

const WORKFLOW_LOG_LEVEL_ALIASES: Record<string, WorkflowLogControlLevel> = {
  off: 'off',
  none: 'off',
  silent: 'off',
  false: 'off',
  '0': 'off',
  error: 'error',
  warn: 'warn',
  warning: 'warn',
  info: 'info',
  on: 'info',
  true: 'info',
  '1': 'info',
  debug: 'debug',
  verbose: 'debug',
  trace: 'debug',
};

const LOG_LEVEL_PRIORITY: Record<WorkflowLogEventLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const LOG_LEVEL_THRESHOLD: Record<WorkflowLogControlLevel, number> = {
  off: Number.POSITIVE_INFINITY,
  error: LOG_LEVEL_PRIORITY.error,
  warn: LOG_LEVEL_PRIORITY.warn,
  info: LOG_LEVEL_PRIORITY.info,
  debug: LOG_LEVEL_PRIORITY.debug,
};

const WORKFLOW_STATUS_FAILED = 'failed';
const WORKFLOW_STATUS_WARNING = 'warning';
const WORKFLOW_STATUS_STOPPED = 'stopped';

export const WORKFLOW_EVENT_NAMES = {
  WorkflowStarted: 'workflow.started',
  NodeStarted: 'node.started',
  NodeLog: 'node.log',
  NodeFinished: 'node.finished',
  NodeFailed: 'node.failed',
  WorkflowStopped: 'workflow.stopped',
  WorkflowCompleted: 'workflow.completed',
  WorkflowValidationFailed: 'workflow.validation_failed',
} as const;

export type WorkflowEventName = typeof WORKFLOW_EVENT_NAMES[keyof typeof WORKFLOW_EVENT_NAMES];

const resolveLogLevelFromStatus = (status: WorkflowNodeStatus): WorkflowLogEventLevel => {
  if (status === WORKFLOW_STATUS_FAILED) return 'error';
  if (status === WORKFLOW_STATUS_WARNING || status === WORKFLOW_STATUS_STOPPED) {
    return 'warn';
  }

  return 'info';
};

const shouldLog = (
  controlLevel: WorkflowLogControlLevel,
  eventLevel: WorkflowLogEventLevel,
): boolean => LOG_LEVEL_PRIORITY[eventLevel] >= LOG_LEVEL_THRESHOLD[controlLevel];

export const resolveWorkflowLogControlLevel = (
  inputLevel?: string,
): WorkflowLogControlLevel => {
  const normalized = String(inputLevel || process.env.LOG_LEVEL || 'info')
    .trim()
    .toLowerCase();

  return WORKFLOW_LOG_LEVEL_ALIASES[normalized] || 'info';
};

export interface JsonlWorkflowLogger {
  push: (event: Omit<WorkflowRunLogEvent, 'timestamp'>) => void;
  entries: WorkflowRunLogEvent[];
  toJsonl: () => string;
  level: WorkflowLogControlLevel;
}

export type CreateJsonlWorkflowLoggerOptions = {
  logLevel?: string;
};

export const createJsonlWorkflowLogger = (
  onEvent?: (event: WorkflowRunLogEvent) => void,
  options?: CreateJsonlWorkflowLoggerOptions,
): JsonlWorkflowLogger => {
  const entries: WorkflowRunLogEvent[] = [];
  const level = resolveWorkflowLogControlLevel(options?.logLevel);

  return {
    entries,
    level,
    push: (event) => {
      if (!shouldLog(level, event.level)) return;

      const entry: WorkflowRunLogEvent = {
        ...event,
        timestamp: new Date().toISOString(),
      };

      entries.push(entry);
      onEvent?.(entry);
    },
    toJsonl: () => entries.map((entry) => JSON.stringify(entry)).join('\n'),
  };
};

export const createRunId = (prefix: 'run' | 'step'): string => `${prefix}_${Date.now()}`;

export const logWorkflowStarted = (
  logger: WorkflowLogger,
  workflowId: string,
  runId: string,
): void => {
  logger.push({
    workflowId,
    runId,
    event: WORKFLOW_EVENT_NAMES.WorkflowStarted,
    level: 'info',
  });
};

export const logNodeStarted = (
  logger: WorkflowLogger,
  workflowId: string,
  runId: string,
  node: WorkflowNodeLike,
): void => {
  logger.push({
    workflowId,
    runId,
    nodeId: node.id,
    event: WORKFLOW_EVENT_NAMES.NodeStarted,
    level: 'info',
    message: `Running ${node.name}`,
    data: {
      modelId: node.modelId,
      nodeName: node.name,
    },
  });
};

export const logNodeFinished = (
  logger: WorkflowLogger,
  workflowId: string,
  runId: string,
  nodeId: string,
  result: WorkflowNodeExecutionResult,
  durationMs?: number,
): void => {
  const status = result.status || 'passed';

  logger.push({
    workflowId,
    runId,
    nodeId,
    event: WORKFLOW_EVENT_NAMES.NodeFinished,
    level: resolveLogLevelFromStatus(status),
    data: { status, durationMs, output: result.output },
  });

  (result.logs || []).forEach((line) => {
    logger.push({
      workflowId,
      runId,
      nodeId,
      event: WORKFLOW_EVENT_NAMES.NodeLog,
      level: 'debug',
      message: line,
    });
  });
};

export const logNodeFailed = (
  logger: WorkflowLogger,
  workflowId: string,
  runId: string,
  nodeId: string,
  message: string,
): void => {
  logger.push({
    workflowId,
    runId,
    nodeId,
    event: WORKFLOW_EVENT_NAMES.NodeFailed,
    level: 'error',
    message,
  });
};

export const logWorkflowStopped = (
  logger: WorkflowLogger,
  workflowId: string,
  runId: string,
): void => {
  logger.push({
    workflowId,
    runId,
    event: WORKFLOW_EVENT_NAMES.WorkflowStopped,
    level: 'warn',
    message: 'Workflow execution was stopped.',
  });
};

export const logWorkflowCompleted = (
  logger: WorkflowLogger,
  workflowId: string,
  runId: string,
): void => {
  logger.push({
    workflowId,
    runId,
    event: WORKFLOW_EVENT_NAMES.WorkflowCompleted,
    level: 'info',
  });
};

export const logWorkflowValidationFailed = (
  logger: WorkflowLogger,
  workflowId: string,
  runId: string,
  message: string,
): void => {
  logger.push({
    workflowId,
    runId,
    event: WORKFLOW_EVENT_NAMES.WorkflowValidationFailed,
    level: 'error',
    message,
  });
};
