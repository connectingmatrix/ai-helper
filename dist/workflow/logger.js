"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWorkflowValidationFailed = exports.logWorkflowCompleted = exports.logWorkflowStopped = exports.logNodeFailed = exports.logNodeFinished = exports.logNodeStarted = exports.logWorkflowStarted = exports.createRunId = exports.createJsonlWorkflowLogger = exports.resolveWorkflowLogControlLevel = exports.WORKFLOW_EVENT_NAMES = void 0;
const WORKFLOW_LOG_LEVEL_ALIASES = {
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
const LOG_LEVEL_PRIORITY = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
};
const LOG_LEVEL_THRESHOLD = {
    off: Number.POSITIVE_INFINITY,
    error: LOG_LEVEL_PRIORITY.error,
    warn: LOG_LEVEL_PRIORITY.warn,
    info: LOG_LEVEL_PRIORITY.info,
    debug: LOG_LEVEL_PRIORITY.debug,
};
const WORKFLOW_STATUS_FAILED = 'failed';
const WORKFLOW_STATUS_WARNING = 'warning';
const WORKFLOW_STATUS_STOPPED = 'stopped';
exports.WORKFLOW_EVENT_NAMES = {
    WorkflowStarted: 'workflow.started',
    NodeStarted: 'node.started',
    NodeLog: 'node.log',
    NodeFinished: 'node.finished',
    NodeFailed: 'node.failed',
    WorkflowStopped: 'workflow.stopped',
    WorkflowCompleted: 'workflow.completed',
    WorkflowValidationFailed: 'workflow.validation_failed',
};
const resolveLogLevelFromStatus = (status) => {
    if (status === WORKFLOW_STATUS_FAILED)
        return 'error';
    if (status === WORKFLOW_STATUS_WARNING || status === WORKFLOW_STATUS_STOPPED) {
        return 'warn';
    }
    return 'info';
};
const shouldLog = (controlLevel, eventLevel) => LOG_LEVEL_PRIORITY[eventLevel] >= LOG_LEVEL_THRESHOLD[controlLevel];
const resolveWorkflowLogControlLevel = (inputLevel) => {
    const normalized = String(inputLevel || process.env.LOG_LEVEL || 'info')
        .trim()
        .toLowerCase();
    return WORKFLOW_LOG_LEVEL_ALIASES[normalized] || 'info';
};
exports.resolveWorkflowLogControlLevel = resolveWorkflowLogControlLevel;
const createJsonlWorkflowLogger = (onEvent, options) => {
    const entries = [];
    const level = (0, exports.resolveWorkflowLogControlLevel)(options?.logLevel);
    return {
        entries,
        level,
        push: (event) => {
            if (!shouldLog(level, event.level))
                return;
            const entry = {
                ...event,
                timestamp: new Date().toISOString(),
            };
            entries.push(entry);
            onEvent?.(entry);
        },
        toJsonl: () => entries.map((entry) => JSON.stringify(entry)).join('\n'),
    };
};
exports.createJsonlWorkflowLogger = createJsonlWorkflowLogger;
const createRunId = (prefix) => `${prefix}_${Date.now()}`;
exports.createRunId = createRunId;
const logWorkflowStarted = (logger, workflowId, runId) => {
    logger.push({
        workflowId,
        runId,
        event: exports.WORKFLOW_EVENT_NAMES.WorkflowStarted,
        level: 'info',
    });
};
exports.logWorkflowStarted = logWorkflowStarted;
const logNodeStarted = (logger, workflowId, runId, node) => {
    logger.push({
        workflowId,
        runId,
        nodeId: node.id,
        event: exports.WORKFLOW_EVENT_NAMES.NodeStarted,
        level: 'info',
        message: `Running ${node.name}`,
        data: {
            modelId: node.modelId,
            nodeName: node.name,
        },
    });
};
exports.logNodeStarted = logNodeStarted;
const logNodeFinished = (logger, workflowId, runId, nodeId, result, durationMs) => {
    const status = result.status || 'passed';
    logger.push({
        workflowId,
        runId,
        nodeId,
        event: exports.WORKFLOW_EVENT_NAMES.NodeFinished,
        level: resolveLogLevelFromStatus(status),
        data: { status, durationMs, output: result.output },
    });
    (result.logs || []).forEach((line) => {
        logger.push({
            workflowId,
            runId,
            nodeId,
            event: exports.WORKFLOW_EVENT_NAMES.NodeLog,
            level: 'debug',
            message: line,
        });
    });
};
exports.logNodeFinished = logNodeFinished;
const logNodeFailed = (logger, workflowId, runId, nodeId, message) => {
    logger.push({
        workflowId,
        runId,
        nodeId,
        event: exports.WORKFLOW_EVENT_NAMES.NodeFailed,
        level: 'error',
        message,
    });
};
exports.logNodeFailed = logNodeFailed;
const logWorkflowStopped = (logger, workflowId, runId) => {
    logger.push({
        workflowId,
        runId,
        event: exports.WORKFLOW_EVENT_NAMES.WorkflowStopped,
        level: 'warn',
        message: 'Workflow execution was stopped.',
    });
};
exports.logWorkflowStopped = logWorkflowStopped;
const logWorkflowCompleted = (logger, workflowId, runId) => {
    logger.push({
        workflowId,
        runId,
        event: exports.WORKFLOW_EVENT_NAMES.WorkflowCompleted,
        level: 'info',
    });
};
exports.logWorkflowCompleted = logWorkflowCompleted;
const logWorkflowValidationFailed = (logger, workflowId, runId, message) => {
    logger.push({
        workflowId,
        runId,
        event: exports.WORKFLOW_EVENT_NAMES.WorkflowValidationFailed,
        level: 'error',
        message,
    });
};
exports.logWorkflowValidationFailed = logWorkflowValidationFailed;
