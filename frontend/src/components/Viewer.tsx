import Tile from './Tiles'
import type { QRow } from '../types'
import { decodeState, getGraphTransitions, getOptimalAction } from '../utils'

interface ViewerProps {
  qTable: QRow[]
  graphRow: QRow
  setGraphRow: (row: QRow) => void
}

export default function Viewer({ qTable, graphRow, setGraphRow }: ViewerProps) {
  const graphData = getGraphTransitions(graphRow, qTable)
  const graphCounts = decodeState(graphRow.state)

  return (
    <div style={{ width: '100%', maxWidth: '900px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => {
            const randomRow = qTable[Math.floor(Math.random() * qTable.length)]
            setGraphRow(randomRow)
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Random State
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          background: '#f1f5f9',
          padding: '30px',
          borderRadius: '16px',
          border: '2px dashed #cbd5e1',
        }}
      >
        {/* Current Node */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{ fontSize: '14px', color: '#64748b', marginBottom: '6px' }}
          >
            <strong>State ID: </strong>
            {graphRow.state}
          </div>
          <div
            style={{
              display: 'flex',
              gap: '6px',
              background: '#1e293b',
              padding: '15px 25px',
              borderRadius: '10px',
              justifyContent: 'center',
            }}
          >
            {graphCounts.flatMap((count, i) =>
              Array.from({ length: count }).map((_, copyIndex) => (
                <Tile key={`${i}-${copyIndex}`} id={`${i + 1}m`} size="45px" />
              ))
            )}
          </div>
        </div>

        {/* Optimal Action */}
        <div
          style={{
            background: '#e0f2fe',
            border: '1px solid #bae6fd',
            padding: '12px 24px',
            borderRadius: '8px',
            color: '#0369a1',
          }}
        >
          {graphData.bestAction !== -1 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>Optimal discard: </span>
              <Tile id={`${graphData.bestAction + 1}m`} size="40px" />
              <span>
                (Expected turns:{' '}
                {(
                  11 - graphRow[`action_${graphData.bestAction}` as keyof QRow]
                ).toFixed(4)}
                )
              </span>
            </div>
          ) : (
            <strong>Terminal state</strong>
          )}
        </div>

        {/* Next draws */}
        <div style={{ width: '100%' }}>
          <div
            style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}
          >
            <strong>Possible draws</strong>
            <p style={{ fontSize: '12px', margin: '4px 0 0 0' }}>
              Click to travel to state
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '12px',
              width: '100%',
            }}
          >
            {graphData.transitions.map((trans, idx) => {
              const nextBestAction = getOptimalAction(
                trans.nextRow,
                decodeState(trans.nextRow.state)
              )
              const nextExpectedTurns =
                nextBestAction !== -1
                  ? 11 - trans.nextRow[`action_${nextBestAction}` as keyof QRow]
                  : 0

              return (
                <div
                  key={idx}
                  onClick={() => setGraphRow(trans.nextRow)}
                  style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#007bff'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      Draw:
                    </span>
                    <Tile id={`${trans.drawTileIndex + 1}m`} size="35px" />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      ID: {trans.nextRow.state}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#334155',
                      }}
                    >
                      EV: {nextExpectedTurns.toFixed(4)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
