import { useState, useEffect } from 'react'
import Tile from './components/Tiles'
import type { QRow } from './types'

function App() {
  const [qTable, setQTable] = useState<QRow[]>([])
  const [currentRow, setCurrentRow] = useState<QRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetch('q_values.json')
      .then((res) => res.json())
      .then((data) => {
        setQTable(data)
        setLoading(false)
        setCurrentRow(data[Math.floor(Math.random() * data.length)])
      })
  }, [])

  const decodeState = (stateValue: number): number[] => {
    let temp = stateValue
    const countVector = []
    for (let i = 0; i < 9; i++) {
      countVector.push(temp % 5)
      temp = Math.floor(temp / 5)
    }
    return countVector
  }

  const pickRandomValidHand = () => {
    const randomIndex = Math.floor(Math.random() * qTable.length)
    setCurrentRow(qTable[randomIndex])
    setShowResults(false)
  }

  if (loading || !currentRow) return <div>Loading...</div>

  const counts = decodeState(currentRow.state)

  const sortedIndices = Array.from({ length: 9 })
    .map((_, i) => i)
    .sort((a, b) => {
      const valA = currentRow[`action_${a}` as keyof QRow]
      const valB = currentRow[`action_${b}` as keyof QRow]
      return valB - valA
    })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        fontFamily: 'system-ui',
        textAlign: 'center',
        boxSizing: 'border-box',
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
          marginBottom: '30px',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        New Hand
      </button>

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
          maxWidth: '600px',
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
              onClick={() => setShowResults(true)}
            />
          ))
        )}
      </div>

      {showResults ? (
        <div>
          <table>
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
                if (actionValue < -50) return null

                return (
                  <tr key={i}>
                    <td>
                      <Tile id={`${i + 1}m`} size="45px" />
                    </td>
                    <td style={{ fontWeight: 'bold' }}>
                      {(10 - actionValue).toFixed(2)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ color: '#999', fontStyle: 'italic' }}>Your turn!</div>
      )}
    </div>
  )
}

export default App
