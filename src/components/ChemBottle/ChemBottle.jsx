/**
 * ChemBottle — стилізований флакон-ілюстрація (тимчасова заглушка замість фото).
 * Колір рідини задається пропом color. Щоб замінити на реальні фото —
 * використай <img> замість цього компонента у ChemistryCard.
 *
 * @param {string} color - колір рідини
 * @param {string} uid - унікальний id (для clipPath/gradient)
 */
export default function ChemBottle({ color = '#c9a86a', uid = 'x' }) {
  const clip = `bottle-clip-${uid}`
  const grad = `bottle-grad-${uid}`

  return (
    <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <defs>
        <clipPath id={clip}>
          <rect x="44" y="66" width="80" height="120" rx="16" />
        </clipPath>
        <linearGradient id={grad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.95" />
          <stop offset="1" stopColor={color} stopOpacity="0.65" />
        </linearGradient>
      </defs>

      {/* Розпилювач */}
      <rect x="66" y="30" width="36" height="26" rx="6" fill="rgba(244,239,230,0.14)" stroke="rgba(244,239,230,0.28)" />
      <rect x="46" y="36" width="22" height="9" rx="3" fill="rgba(244,239,230,0.14)" stroke="rgba(244,239,230,0.28)" />
      <path d="M70 56c-2 6-6 8-6 12" stroke="rgba(244,239,230,0.28)" strokeWidth="2" strokeLinecap="round" />
      {/* Шийка */}
      <rect x="72" y="54" width="24" height="16" fill="rgba(244,239,230,0.1)" stroke="rgba(244,239,230,0.24)" />

      {/* Скляний корпус */}
      <rect x="44" y="66" width="80" height="120" rx="16" fill="rgba(244,239,230,0.06)" stroke="rgba(244,239,230,0.22)" />

      {/* Рідина */}
      <g clipPath={`url(#${clip})`}>
        <rect x="44" y="112" width="80" height="74" fill={`url(#${grad})`} />
        <ellipse cx="84" cy="112" rx="40" ry="6" fill={color} opacity="0.9" />
      </g>

      {/* Етикетка */}
      <rect x="56" y="92" width="56" height="42" rx="6" fill="rgba(14,14,16,0.35)" stroke="rgba(244,239,230,0.18)" />
      <rect x="64" y="102" width="40" height="4" rx="2" fill={color} opacity="0.8" />
      <rect x="64" y="112" width="30" height="3" rx="1.5" fill="rgba(244,239,230,0.3)" />
      <rect x="64" y="120" width="34" height="3" rx="1.5" fill="rgba(244,239,230,0.22)" />

      {/* Відблиск */}
      <rect x="53" y="74" width="8" height="104" rx="4" fill="rgba(244,239,230,0.14)" />
    </svg>
  )
}
