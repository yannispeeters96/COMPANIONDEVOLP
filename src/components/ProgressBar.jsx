export default function ProgressBar({ value }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0))
  return (
    <div className="progress-track" aria-label={`${clamped}% voltooid`}>
      <div className="progress-fill" style={{ width: `${clamped}%` }} />
    </div>
  )
}
