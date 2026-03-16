import { WorkflowLogControlLevel, WorkflowNodeExecutionResult, WorkflowNodeLike, WorkflowRunLogEvent } from './types';
interface WorkflowLogger {
    push: (event: Omit<WorkflowRunLogEvent, 'timestamp'>) => void;
}
export declare const WORKFLOW_EVENT_NAMES: {
    readonly WorkflowStarted: "workflow.started";
    readonly NodeStarted: "node.started";
    readonly NodeLog: "node.log";
    readonly NodeFinished: "node.finished";
    readonly NodeFailed: "node.failed";
    readonly WorkflowStopped: "workflow.stopped";
    readonly WorkflowCompleted: "workflow.completed";
    readonly WorkflowValidationFailed: "workflow.validation_failed";
};
export type WorkflowEventName = typeof WORKFLOW_EVENT_NAMES[keyof typeof WORKFLOW_EVENT_NAMES];
export declare const resolveWorkflowLogControlLevel: (inputLevel?: string) => WorkflowLogControlLevel;
export interface JsonlWorkflowLogger {
    push: (event: Omit<WorkflowRunLogEvent, 'timestamp'>) => void;
    entries: WorkflowRunLogEvent[];
    toJsonl: () => string;
    level: WorkflowLogControlLevel;
}
export type CreateJsonlWorkflowLoggerOptions = {
    logLevel?: string;
};
export declare const createJsonlWorkflowLogger: (onEvent?: (event: WorkflowRunLogEvent) => void, options?: CreateJsonlWorkflowLoggerOptions) => JsonlWorkflowLogger;
export declare const createRunId: (prefix: "run" | "step") => string;
export declare const logWorkflowStarted: (logger: WorkflowLogger, workflowId: string, runId: string) => void;
export declare const logNodeStarted: (logger: WorkflowLogger, workflowId: string, runId: string, node: WorkflowNodeLike) => void;
export declare const logNodeFinished: (logger: WorkflowLogger, workflowId: string, runId: string, nodeId: string, result: WorkflowNodeExecutionResult, durationMs?: number) => void;
export declare const logNodeFailed: (logger: WorkflowLogger, workflowId: string, runId: string, nodeId: string, message: string) => void;
export declare const logWorkflowStopped: (logger: WorkflowLogger, workflowId: string, runId: string) => void;
export declare const logWorkflowCompleted: (logger: WorkflowLogger, workflowId: string, runId: string) => void;
export declare const logWorkflowValidationFailed: (logger: WorkflowLogger, workflowId: string, runId: string, message: string) => void;
export {};
//# sourceMappingURL=logger.d.ts.map