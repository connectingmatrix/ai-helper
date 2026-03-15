export type WorkflowLogControlLevel = 'off' | 'error' | 'warn' | 'info' | 'debug';

export type WorkflowLogEventLevel = 'error' | 'warn' | 'info' | 'debug';

export type WorkflowRunLogEvent = {
  timestamp: string;
  level: WorkflowLogEventLevel;
  event: string;
  workflowId: string;
  runId: string;
  nodeId?: string;
  message?: string;
  data?: unknown;
};

export type WorkflowNodeStatus =
  | 'passed'
  | 'failed'
  | 'warning'
  | 'running'
  | 'stopped'
  | string;

export type WorkflowNodeLike = {
  id: string;
  name: string;
  modelId?: string | null;
};

export type WorkflowNodeExecutionResult = {
  status?: WorkflowNodeStatus;
  logs?: string[];
  output: unknown;
};

export type WorkflowFileEnvelope = {
  name?: string | null;
  mimeType?: string | null;
  size?: number | null;
  encoding?: string | null;
  contentBase64?: string | null;
  extractedText?: string | null;
};

export type WorkflowMulterFileLike = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  [key: string]: unknown;
};
