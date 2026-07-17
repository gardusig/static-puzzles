import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, CreateTableCommand, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'

export interface DbClient {
  put(table: string, item: Record<string, unknown>): Promise<void>
  get(table: string, id: string): Promise<Record<string, unknown> | undefined>
  query(table: string, prefix: string): Promise<Record<string, unknown>[]>
  ensureTable(table: string): Promise<void>
}

export function createDb(): DbClient {
  const endpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000'
  const region = process.env.DYNAMODB_REGION || 'us-east-1'
  const client = new DynamoDBClient({ endpoint, region })
  const doc = DynamoDBDocumentClient.from(client)

  return {
    async put(table, item) {
      await doc.send(new PutCommand({ TableName: table, Item: item }))
    },
    async get(table, id) {
      const res = await doc.send(new GetCommand({ TableName: table, Key: { id } }))
      return res.Item as Record<string, unknown> | undefined
    },
    async query(table, prefix) {
      const items: Record<string, unknown>[] = []
      let lastKey: Record<string, unknown> | undefined
      do {
        const res = await doc.send(new QueryCommand({
          TableName: table,
          KeyConditionExpression: 'begins_with(id, :p)',
          ExpressionAttributeValues: { ':p': prefix },
          ExclusiveStartKey: lastKey,
        }))
        if (res.Items) items.push(...res.Items as Record<string, unknown>[])
        lastKey = res.LastEvaluatedKey
      } while (lastKey)
      return items
    },
    async ensureTable(table) {
      try {
        await doc.send(new CreateTableCommand({
          TableName: table,
          AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
          KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
          BillingMode: 'PAY_PER_REQUEST',
        }))
        console.log(`created table: ${table}`)
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== 'ResourceInUseException') throw e
      }
    },
  }
}
