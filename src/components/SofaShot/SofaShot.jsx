/**
 * SofaShot — стилізований диван «до / після» (тимчасова заглушка замість фото).
 * state='before' — тьмяний із плямами; state='after' — чистий + акцентний колір і блиск.
 * Щоб замінити на реальні фото — використай <img> у ReviewCard / ReviewModal.
 *
 * @param {'before'|'after'} state
 * @param {string} tone - акцентний колір подушок для стану «після»
 */
export default function SofaShot({ state = 'after', tone = '#c9a86a' }) {
  const before = state === 'before'

  const body = before ? '#4c4842' : '#d8d2c6'
  const bodyDark = before ? '#3d3936' : '#c3bcae'
  const cushion = before ? '#57524b' : '#e7e1d6'
  const pillow = before ? '#615b53' : tone

  return (
    <svg viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      {/* Фон */}
      <rect width="240" height="160" fill={before ? '#2a2723' : '#f2ece0'} />

      {/* Спинка */}
      <rect x="34" y="34" width="172" height="58" rx="16" fill={body} />
      {/* Подушки спинки */}
      <rect x="54" y="40" width="60" height="44" rx="12" fill={cushion} />
      <rect x="126" y="40" width="60" height="44" rx="12" fill={cushion} />
      {/* Декоративні подушки */}
      <rect x="60" y="52" width="30" height="30" rx="8" fill={pillow} opacity={before ? 1 : 0.9} />
      <rect x="150" y="52" width="30" height="30" rx="8" fill={pillow} opacity={before ? 1 : 0.9} />

      {/* Підлокітники */}
      <rect x="22" y="60" width="28" height="62" rx="14" fill={body} />
      <rect x="190" y="60" width="28" height="62" rx="14" fill={body} />
      {/* Сидіння */}
      <rect x="30" y="78" width="180" height="46" rx="14" fill={bodyDark} />
      <rect x="56" y="82" width="58" height="30" rx="9" fill={cushion} />
      <rect x="126" y="82" width="58" height="30" rx="9" fill={cushion} />

      {/* Ніжки */}
      <rect x="46" y="122" width="9" height="16" rx="2" fill={before ? '#2f2b26' : '#8a7f6d'} />
      <rect x="185" y="122" width="9" height="16" rx="2" fill={before ? '#2f2b26' : '#8a7f6d'} />

      {/* Плями (тільки «до») */}
      {before && (
        <g fill="#211d19">
          <ellipse cx="82" cy="98" rx="13" ry="8" opacity="0.75" />
          <ellipse cx="150" cy="95" rx="9" ry="6" opacity="0.6" />
          <ellipse cx="120" cy="104" rx="7" ry="4" opacity="0.5" />
          <circle cx="98" cy="66" r="4" opacity="0.5" />
        </g>
      )}

      {/* Блиск (тільки «після») */}
      {!before && (
        <g fill={tone}>
          <path d="M198 30 q1 7 8 8 q-7 1 -8 8 q-1 -7 -8 -8 q7 -1 8 -8 Z" />
          <path d="M212 46 q0.6 4 4.5 4.5 q-4 0.6 -4.5 4.5 q-0.6 -4 -4.5 -4.5 q4 -0.6 4.5 -4.5 Z" opacity="0.8" />
        </g>
      )}
    </svg>
  )
}
