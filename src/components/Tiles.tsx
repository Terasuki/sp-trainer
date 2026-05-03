export default function Tile({
  id,
  size = '40px',
  onClick,
}: {
  id: string
  size?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-block',
        position: 'relative',
        width: size,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <img
        src="/assets/tiles/regular/front.svg"
        alt=""
        style={{ width: size, height: 'auto', display: 'block' }}
      />
      <img
        src={`/assets/tiles/regular/${id}.svg`}
        alt={id}
        style={{
          width: size,
          height: 'auto',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  )
}
