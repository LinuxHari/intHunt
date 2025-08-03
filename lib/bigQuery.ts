"use server";

import { BigQuery } from "@google-cloud/bigquery";

const bigquery = new BigQuery({
  projectId: process.env.BIGQUERY_PROJECT_ID,
  credentials: {
    client_email: process.env.BIGQUERY_CLIENT_EMAIL,
    private_key: process.env.BIGQUERY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const runBigQueryQuery = async (query: string) => {
  try {
    const [job] = await bigquery.createQueryJob({ query: query });
    console.log(`BigQuery Job ${job.id} started.`);

    const [rows] = await job.getQueryResults();

    console.log(`BigQuery Job ${job.id} completed.`);
    return rows;
  } catch (error) {
    console.error("ERROR running BigQuery query:", error);
    throw error;
  }
};

export { runBigQueryQuery };
