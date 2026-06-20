import { useState, useEffect } from 'react'
import Trainer from './components/Trainer'
import Viewer from './components/Viewer'
import type { QRow } from './types'

export default function App() {
  const [view, setView] = useState<'trainer' | 'viewer'>('trainer')
  const [qTable, setQTable] = useState<QRow[]>([])
  const [currentRow, setCurrentRow] = useState<QRow | null>(null)
  const [graphRow, setGraphRow] = useState<QRow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('q_values.json')
      .then((res) => res.json())
      .then((data: QRow[]) => {
        setQTable(data)
        setLoading(false)
        if (data.length > 0) {
          const randomRow = data[Math.floor(Math.random() * data.length)]
          setCurrentRow(randomRow)
          setGraphRow(randomRow)
        }
      })
      .catch((err) => console.error('Failed to load data:', err))
  }, [])

  if (loading || !currentRow || !graphRow) {
    return (
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          height: '100vh',
          fontFamily: 'system-ui',
        }}
      >
        Loading...
      </div>
    )
  }

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
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setView('trainer')}
          style={{
            padding: '10px 20px',
            backgroundColor: view === 'trainer' ? '#007bff' : '#e2e8f0',
            color: view === 'trainer' ? 'white' : '#334155',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Trainer
        </button>
        <button
          onClick={() => setView('viewer')}
          style={{
            padding: '10px 20px',
            backgroundColor: view === 'viewer' ? '#007bff' : '#e2e8f0',
            color: view === 'viewer' ? 'white' : '#334155',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Explorer
        </button>
      </div>

      {view === 'trainer' ? (
        <Trainer
          qTable={qTable}
          currentRow={currentRow}
          setCurrentRow={setCurrentRow}
        />
      ) : (
        <Viewer qTable={qTable} graphRow={graphRow} setGraphRow={setGraphRow} />
      )}
    </div>
  )
}
