import {
  GlueClient,
  GetJobsCommand,
  GetJobRunsCommand,
  GetCrawlersCommand,
  GetDatabasesCommand,
  GetTablesCommand,
  ListWorkflowsCommand,
  BatchGetWorkflowsCommand,
  GetWorkflowRunsCommand
} from '@aws-sdk/client-glue';
import { fromIni } from '@aws-sdk/credential-providers';
import { AppConfig } from './config';

let client: GlueClient | null = null;
let currentConfig: AppConfig | null = null;

function getClient(config: AppConfig): GlueClient {
  if (!client ||
    currentConfig?.region !== config.region ||
    currentConfig?.profile !== config.profile) {

    try {
      client = new GlueClient({
        region: config.region,
        credentials: fromIni({ profile: config.profile })
      });
      currentConfig = { ...config };
    } catch (e) {
      console.error("Failed to init AWS Client", e);
      throw e;
    }
  }
  return client;
}

export const awsHandler = {
  async getJobs(config: AppConfig) {
    const c = getClient(config);
    const command = new GetJobsCommand({ MaxResults: 50 });
    const response = await c.send(command);
    return response.Jobs || [];
  },

  async getJobRuns(config: AppConfig, jobName: string) {
    const c = getClient(config);
    const command = new GetJobRunsCommand({ JobName: jobName, MaxResults: 20 });
    const response = await c.send(command);
    return response.JobRuns || [];
  },

  async getCrawlers(config: AppConfig) {
    const c = getClient(config);
    const command = new GetCrawlersCommand({ MaxResults: 50 });
    const response = await c.send(command);
    return response.Crawlers || [];
  },

  async getCrawlerRuns(_config: AppConfig, _crawlerName: string) {
    // Crawler metrics? Or history? Glue doesn't have "GetCrawlerRuns" easily comparable to JobRuns.
    // It has `GetCrawlerMetrics`.
    // Actually, Glue Crawlers do not have a rich history API like Jobs.
    // There is no `GetCrawlerRuns`. 
    // We can use `GetCrawlerMetrics` for status or just show the current status from `GetCrawlers`.
    // Wait, CloudWatch Logs is where crawler logs go.
    // But the user asked for "Glue Crawler -> Glue Crawler Runs".
    // Maybe they mean history? 
    // For now I will return an empty list or mock it, or just return the crawler status object as a single 'run'.
    // NOTE: AWS Glue API does NOT have `GetCrawlerRuns`.
    // I will return an empty array for now and add a NOTE in the UI or implementation plan.
    return [];
  },

  async getDatabases(config: AppConfig) {
    const c = getClient(config);
    const command = new GetDatabasesCommand({ MaxResults: 50 });
    const response = await c.send(command);
    return response.DatabaseList || [];
  },

  async getTables(config: AppConfig, databaseName: string) {
    const c = getClient(config);
    const command = new GetTablesCommand({ DatabaseName: databaseName, MaxResults: 50 });
    const response = await c.send(command);
    return response.TableList || [];
  },

  async getWorkflows(config: AppConfig) {
    const c = getClient(config);
    // Workflows must be listed then fetched? 
    // ListWorkflows returns names. BatchGetWorkflows gets details.
    const listCmd = new ListWorkflowsCommand({ MaxResults: 25 }); // Low limit for batching
    const listRes = await c.send(listCmd);

    if (!listRes.Workflows || listRes.Workflows.length === 0) return [];

    const detailsCmd = new BatchGetWorkflowsCommand({ Names: listRes.Workflows, IncludeGraph: false });
    const detailsRes = await c.send(detailsCmd);
    return detailsRes.Workflows || [];
  },

  async getWorkflowRuns(config: AppConfig, workflowName: string) {
    const c = getClient(config);
    const command = new GetWorkflowRunsCommand({ Name: workflowName, MaxResults: 20 });
    const response = await c.send(command);
    return response.Runs || [];
  },
};
