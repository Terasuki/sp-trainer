import type { QRow } from './types'

export const DELTA = 0.01

export const decodeState = (stateValue: number): number[] => {
  let temp = stateValue
  const countVector = []
  for (let i = 0; i < 9; i++) {
    countVector.push(temp % 5)
    temp = Math.floor(temp / 5)
  }
  return countVector
}

export const encodeState = (vector: number[]): number => {
  return vector.reduce((acc, count, i) => acc + count * Math.pow(5, i), 0)
}

export const getOptimalAction = (row: QRow, counts: number[]): number => {
  let maxActionValue = -Infinity
  let bestAction = -1
  counts.forEach((count, i) => {
    if (count > 0) {
      const val = row[`action_${i}` as keyof QRow] as number
      if (val > maxActionValue) {
        maxActionValue = val
        bestAction = i
      }
    }
  })
  return bestAction
}

export const getGraphTransitions = (row: QRow, qTable: QRow[]) => {
  const counts = decodeState(row.state)
  const bestAction = getOptimalAction(row, counts)

  if (bestAction === -1) return { bestAction: -1, transitions: [] }

  const postDiscardCounts = [...counts]
  postDiscardCounts[bestAction]--
  const transitions = []

  for (let drawTileIndex = 0; drawTileIndex < 9; drawTileIndex++) {
    if (postDiscardCounts[drawTileIndex] < 4) {
      const nextCounts = [...postDiscardCounts]
      nextCounts[drawTileIndex]++

      const nextStateId = encodeState(nextCounts)
      const nextRow = qTable.find((r) => r.state === nextStateId)

      if (nextRow) {
        transitions.push({
          drawTileIndex,
          nextRow,
        })
      }
    }
  }

  return { bestAction, transitions }
}
