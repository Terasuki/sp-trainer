import { useState, useEffect } from 'react'
import Tile from './components/Tiles'
import type { QRow } from './types'

function App() {
  const [qTable, setQTable] = useState<QRow[]>([])
  const [currentRow, setCurrentRow] = useState<QRow | null>(null)
  const [loading, setLoading] = useState(true)

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
  }

  if (loading || !currentRow) return <div>Loading...</div>

  const counts = decodeState(currentRow.state)

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <button
        onClick={pickRandomValidHand}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        New Hand
      </button>

      <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        <strong>State ID:</strong> {currentRow.state} |<strong> Counts:</strong>{' '}
        [{counts.join(', ')}]
      </div>

      <div
        style={{
          display: 'flex',
          gap: '4px',
          padding: '30px',
          background: '#2c3e50',
          borderRadius: '12px',
          minHeight: '120px',
          alignItems: 'flex-start',
        }}
      >
        {counts.flatMap((count, i) =>
          Array.from({ length: count }).map((_, copyIndex) => (
            <Tile key={`${i}-${copyIndex}`} id={`${i + 1}m`} size="60px" />
          ))
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd' }}>Action</th>
              <th style={{ borderBottom: '1px solid #ddd' }}>
                Expected number of turns
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 9 }).map((_, i) => (
              <tr key={i}>
                <td style={{ padding: '4px 0' }}>Tile {i + 1}</td>
                <td>{10 - currentRow[`action_${i}`]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
