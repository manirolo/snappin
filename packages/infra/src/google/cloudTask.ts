import { CloudTasksClient } from "@google-cloud/tasks"
import { env } from "@snappin/env"

let client: CloudTasksClient | null = null

export function getCloudTasksClient() {
  if (!client) {
    client = new CloudTasksClient({
      projectId: env.google.projectId
    })
  }

  return client
}

export * from "@google-cloud/tasks"
