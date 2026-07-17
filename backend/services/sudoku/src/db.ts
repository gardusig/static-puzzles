import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, CreateTableCommand, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'

const endpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000'
const region = process.env.DYNAMODB_REGION || 'us-east-1'
const client = new DynamoDBClient({ endpoint, region })
const doc = DynamoDBDocumentClient.from(client)

export const TABLES = {
  puzzles: 'sudoku-puzzles',
  progress: 'sudoku-progress',
} as const

export async function ensureTables() {
  for (const table of Object.values(TABLES)) {
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
  }
}

export async function putPuzzle(puzzle: { id: string; data: unknown; solution: unknown; difficulty: string }) {
  await doc.send(new PutCommand({
    TableName: TABLES.puzzles,
    Item: { ...puzzle, createdAt: new Date().toISOString() },
  }))
}

export async function getPuzzle(id: string) {
  const res = await doc.send(new GetCommand({ TableName: TABLES.puzzles, Key: { id } }))
  return res.Item as Record<string, unknown> | undefined
}

export async function getRandomPuzzle(difficulty?: string) {
  const all = await getAllPuzzles()
  let filtered = all
  if (difficulty) filtered = all.filter(p => p.difficulty === difficulty)
  if (filtered.length === 0) return null
  return filtered[Math.floor(Math.random() * filtered.length)]
}

async function getAllPuzzles(): Promise<Record<string, unknown>[]> {
  const items: Record<string, unknown>[] = []
  let lastKey: Record<string, unknown> | undefined
  do {
    const res = await doc.send(new QueryCommand({
      TableName: TABLES.puzzles,
      KeyConditionExpression: 'begins_with(id, :p)',
      ExpressionAttributeValues: { ':p': 'puzzle_' },
      ExclusiveStartKey: lastKey,
    }))
    if (res.Items) items.push(...res.Items as Record<string, unknown>[])
    lastKey = res.LastEvaluatedKey
  } while (lastKey)
  return items
}

export async function saveProgress(userId: string, puzzleId: string, state: unknown, solved: boolean) {
  await doc.send(new PutCommand({
    TableName: TABLES.progress,
    Item: {
      id: `${userId}#${puzzleId}`,
      userId, puzzleId, state, solved,
      updatedAt: new Date().toISOString(),
    },
  }))
}

export async function getProgress(userId: string, puzzleId: string) {
  const res = await doc.send(new GetCommand({
    TableName: TABLES.progress,
    Key: { id: `${userId}#${puzzleId}` },
  }))
  return res.Item as Record<string, unknown> | undefined
}
