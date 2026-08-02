/**
 * Єдиний набір SVG-іконок сайту. Імпортуй потрібну:
 *   import { InstagramIcon, TelegramIcon } from '@/components/icons'
 * Усі іконки успадковують колір через currentColor і розмір через size.
 */

const base = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
})

export function InstagramIcon({ size = 22 }) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function TelegramIcon({ size = 22 }) {
  return (
    <svg {...base(size)} fill="currentColor">
      <path d="M21.94 4.3 2.9 11.64c-1.1.44-1.1 1.06-.2 1.34l4.88 1.52 1.86 5.7c.24.66.12.92.8.92.53 0 .76-.24 1.05-.53l2.35-2.28 4.9 3.62c.9.5 1.55.24 1.78-.83l3.2-15.08c.33-1.32-.5-1.9-1.58-1.42Z" />
    </svg>
  )
}

export function FacebookIcon({ size = 22 }) {
  return (
    <svg {...base(size)} fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.9 3.77-3.9 1.1 0 2.24.19 2.24.19v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  )
}

export function ArrowRightIcon({ size = 18 }) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CloseIcon({ size = 22 }) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth="1.6">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  )
}

export function PlayIcon({ size = 20 }) {
  return (
    <svg {...base(size)} fill="currentColor">
      <path d="M8 5v14l11-7L8 5Z" />
    </svg>
  )
}

export function PhoneIcon({ size = 22 }) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth="1.6">
      <path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
    </svg>
  )
}

export function MailIcon({ size = 22 }) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 5 8-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
