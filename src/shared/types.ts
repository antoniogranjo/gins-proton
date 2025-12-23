export type ResourceType = 'job' | 'crawler' | 'database' | 'workflow' | 'job_run' | 'crawler_run' | 'workflow_run' | 'table';

export interface AWSConfig {
  region: string;
  profile: string;
}

export interface Breadcrumb {
  type: ResourceType;
  id: string; // Name for most, RunId for runs
  label?: string;
  data?: any; // Hold parent data if needed
}

export interface GlueJob {
  Name: string;
  Role?: string;
  CreatedOn?: Date;
  LastModifiedOn?: Date;
  Description?: string;
  Command?: { Name?: string; ScriptLocation?: string };
  DefaultArguments?: Record<string, string>;
  MaxRetries?: number;
  AllocatedCapacity?: number;
  Timeout?: number;
  GlueVersion?: string;
  // Add other fields as needed
}

export interface GlueCrawler {
  Name: string;
  Role?: string;
  State?: string;
  LastUpdated?: Date;
  CreationTime?: Date;
  Targets?: { S3Targets?: { Path?: string }[], JdbcTargets?: { ConnectionName?: string; Path?: string }[] };
  SchemaChangePolicy?: { UpdateBehavior?: string; DeleteBehavior?: string };
  Schedule?: { ScheduleExpression?: string; State?: string };
}

export interface GlueDatabase {
  Name: string;
  Description?: string;
  LocationUri?: string;
  CreateTime?: Date;
}

export interface GlueWorkflow {
  Name: string;
  Description?: string;
  DefaultRunProperties?: Record<string, string>;
  CreatedOn?: Date;
  LastModifiedOn?: Date;
}

export interface GlueTable {
  Name: string;
  DatabaseName?: string;
  Description?: string;
  CreateTime?: Date;
  UpdateTime?: Date;
  StorageDescriptor?: {
    Columns?: { Name: string; Type: string }[];
    Location?: string;
    InputFormat?: string;
    OutputFormat?: string;
  };
  TableType?: string;
}

export interface GlueJobRun {
  Id: string;
  JobName?: string;
  StartedOn?: Date;
  LastModifiedOn?: Date;
  CompletedOn?: Date;
  JobRunState?: string;
  Arguments?: Record<string, string>;
  ErrorMessage?: string;
  ExecutionTime?: number;
}

export interface GlueCrawlerRun {
  CrawlerName?: string;
  SecurityConfiguration?: string;
  LogGroup?: string;
  CreateTime?: Date;
  StartTime?: Date;
  EndTime?: Date;
  Status?: string;
  Error?: string;
}

// Union type for all resources
export type ResourceItem = GlueJob | GlueCrawler | GlueDatabase | GlueWorkflow | GlueTable | GlueJobRun | GlueCrawlerRun;
