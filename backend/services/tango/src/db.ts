import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, CreateTableCommand, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'

const endpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000'
const region = process.env.DYNAMODB_REGION || 'us-east-1'
const client = new DynamoDBClient({ endpoint, region })
const doc = DynamoDBDocumentClient.from(client)

const PUZZLES_TABLE = 'tango-puzzles'
const PROGRESS_TABLE = 'tango-progress'

async function ensure(table: string) {
  try {
    await doc.send(new CreateTableCommand({
      TableName: table, AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }], BillingMode: 'PAY_PER_REQUEST',
    }))
    console.log(`created table: ${table}`)
  } catch (e: unknown) { if (e instanceof Error && e.name !== 'ResourceInUseException') throw e }
}

export async function ensureTables() { await ensure(PUZZLES_TABLE); await ensure(PROGRESS_TABLE) }
export async function putPuzzle(puzzle: { id: string; data: unknown; solution: unknown; difficulty: string }) {
  await doc.send(new PutCommand({ TableName: PUZZLES_TABLE, Item: { ...puzzle, createdAt: new Date().toISOString() } }))
}
export async function getPuzzle(id: string) { const r = await doc.send(new GetCommand({ TableName: PUZZLES_TABLE, Key: { id } })); return r.Item }
export async function getRandomPuzzle(difficulty?: string) {
  const all: unknown[] = []; let lk: Record<string, unknown> | undefined
  do { const r = await doc.send(new QueryCommand({ TableName: PUZZLES_TABLE, KeyConditionExpression: 'begins_with(id, :p)', ExpressionAttributeValues: { ':p': 'puzzle_' }, ExclusiveStartKey: lk })); if (r.Items) all.push(...r.Items); lk = r.LastEvaluatedKey } while (lk)
  let f = all as Array<Record<string, unknown>>
  if (difficulty) f = f.filter(p => p.difficulty === difficulty)
  return f.length ? f[Math.floor(Math.random() * f.length)] : null
}
export async function saveProgress(userId: string, puzzleId: string, state: unknown, solved: boolean) {
  await doc.send(new PutCommand({ TableName: PROGRESS_TABLE, Item: { id: `${userId}#${puzzleId}`, userId, puzzleId, state, solved, updatedAt: new Date().toISOString() } }))
}
export async function getProgress(userId: string, puzzleId: string) { const r = await doc.send(new GetCommand({ TableName: PROGRESS_TABLE, Key: { id: `${userId}#${puzzleId}` } })); return r.Item }
