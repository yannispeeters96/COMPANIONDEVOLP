import { useState } from 'react'
import { getBonBazaarMascot } from '../lib/mascot-loader'

export default function CanonWolf({
  view = 'front',
  className = '',
  decorative = false,
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        className={`canon-wolf-error ${className}`.trim()}
        role="alert"
        title="Approved BonBazaar canon asset could not be loaded."
      >
        CANON WOLF MISSING
      </span>
    )
  }

  const mascot = getBonBazaarMascot(view)

  return (
    <img
      className={className}
      src={mascot.image}
      alt={decorative ? '' : mascot.name}
      aria-hidden={decorative ? 'true' : undefined}
      draggable="false"
      onError={() => setFailed(true)}
    />
  )
}