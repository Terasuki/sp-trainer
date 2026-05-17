import { useState } from 'react'
import Tile from './Tiles'
import type { QRow } from '../types'
import { decodeState, encodeState, DELTA } from '../utils'

interface TrainerProps {
  qTable: QRow[]
  currentRow: QRow
  setCurrentRow: (row: QRow) => void
}

export default function Trainer({
  qTable,
  currentRow,
  setCurrentRow,
}: TrainerProps) {
  const [showResults, setShowResults] = useState(false)
  const [selectedTile, setSelectedTile] = useState<number | null>(null)
  const [inputVector, setInputVector] = useState('')
  const [inputError, setInputError] = useState('')
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    totalEvLoss: 0,
  })

  const pickRandomValidHand = () => {
    const randomIndex = Math.floor(Math.random() * qTable.length)
    setCurrentRow(qTable[randomIndex])
    setShowResults(false)
    setSelectedTile(null)
  }

  const handleLoadVector = () => {
    if (inputVector.length !== 9) {
      setInputError('Vector must be exactly 9 digits.')
      return
    }

    const vector = inputVector.split('').map(Number)
    if (vector.some((count) => count > 4)) {
      setInputError('Individual tile counts cannot exceed 4.')
      return
    }

    const targetState = encodeState(vector)
    const foundRow = qTable.find((row) => row.state === targetState)

    if (foundRow) {
      setCurrentRow(foundRow)
      setShowResults(false)
      setSelectedTile(null)
      setInputError('')
    } else {
      setInputError('This specific hand/state does not exist in the Q-table.')
    }
  }

  const handleTileClick = (index: number) => {
    if (showResults) return

    const counts = decodeState(currentRow.state)
    let maxActionValue = -Infinity
    counts.forEach((count, i) => {
      if (count > 0) {
        const val = currentRow[`action_${i}` as keyof QRow]
        if (val > maxActionValue) maxActionValue = val
      }
    })
    const selectedValue = currentRow[`action_${index}` as keyof QRow]
    const loss = maxActionValue - selectedValue

    setStats((prev) => ({
      correct: loss <= DELTA ? prev.correct + 1 : prev.correct,
      incorrect: loss > DELTA ? prev.incorrect + 1 : prev.incorrect,
      totalEvLoss: prev.totalEvLoss + loss,
    }))

    setSelectedTile(index)
    setShowResults(true)
  }

  const counts = decodeState(currentRow.state)
  const sortedIndices = Array.from({ length: 9 })
    .map((_, i) => i)
    .sort((a, b) => {
      const valA = currentRow[`action_${a}` as keyof QRow]
      const valB = currentRow[`action_${b}` as keyof QRow]
      return valB - valA
    })

  return (
    <>
      <div
        style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #ddd',
          minWidth: '300px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            fontSize: '18px',
          }}
        >
          <span style={{ color: '#28a745' }}>
            <strong>Correct:</strong> {stats.correct}
          </span>
          <span style={{ color: '#dc3545' }}>
            <strong>Incorrect:</strong> {stats.incorrect}
          </span>
        </div>
        <div style={{ marginTop: '8px', color: '#6c757d', fontSize: '14px' }}>
          <strong>Total EV Loss:</strong> {stats.totalEvLoss.toFixed(4)} turns
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-start',
          marginBottom: '30px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={pickRandomValidHand}
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            height: '46px',
          }}
        >
          New Hand
        </button>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="e.g. 021320042"
              maxLength={9}
              value={inputVector}
              onChange={(e) =>
                setInputVector(e.target.value.replace(/\D/g, ''))
              }
              style={{
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '16px',
                width: '140px',
                height: '46px',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={handleLoadVector}
              style={{
                padding: '0 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 'bold',
                height: '46px',
              }}
            >
              Load Hand
            </button>
          </div>
          {inputError && (
            <span
              style={{
                color: '#dc3545',
                fontSize: '13px',
                marginTop: '6px',
                fontWeight: '500',
              }}
            >
              {inputError}
            </span>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        <strong>State ID:</strong> {currentRow.state} | <strong>Counts:</strong>{' '}
        [{counts.join(', ')}]
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          padding: '30px',
          background: '#2c3e50',
          borderRadius: '12px',
          minHeight: '120px',
          maxWidth: '1000px',
          width: '100%',
          alignItems: 'center',
          marginBottom: '40px',
        }}
      >
        {counts.flatMap((count, i) =>
          Array.from({ length: count }).map((_, copyIndex) => (
            <Tile
              key={`${i}-${copyIndex}`}
              id={`${i + 1}m`}
              size="60px"
              onClick={() => handleTileClick(i)}
            />
          ))
        )}
      </div>

      {showResults && selectedTile !== null ? (
        <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '2px solid #eee', padding: '10px' }}>
                Discard Tile
              </th>
              <th style={{ borderBottom: '2px solid #eee', padding: '10px' }}>
                Expected Turns
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedIndices.map((i) => {
              const actionValue = currentRow[`action_${i}` as keyof QRow]
              if (actionValue < -50 || counts[i] === 0) return null
              const isSelected = i === selectedTile

              return (
                <tr
                  key={i}
                  style={{
                    backgroundColor: isSelected ? '#9aa8c6' : 'transparent',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <td
                    style={{ padding: '8px', borderBottom: '1px solid #eee' }}
                  >
                    <Tile id={`${i + 1}m`} size="45px" />
                  </td>
                  <td
                    style={{
                      fontWeight: 'bold',
                      padding: '8px',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    {(11 - actionValue).toFixed(6)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <div style={{ color: '#999', fontStyle: 'italic' }}>Your turn!</div>
      )}
    </>
  )
}
