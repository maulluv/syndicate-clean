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

export function ViberIcon({ size = 22 }) {
  return (
    <svg {...base(size)} fill="currentColor">
      {/*
        Слухавка всередині — не білий колір, а справжня дірка в бульбашці
        (fillRule="evenodd"). Це важливо: іконка живе і на кольоровому кружечку
        в модалці, і темною на світлому футері. Білий колір у другому випадку
        просто зник би, лишивши суцільну пляму.
      */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.2c-3.1 0-5.4.6-6.9 1.9C3.5 5.5 2.8 7.7 2.8 10.6c0 2.4.5 4.3 1.5 5.7.5.7 1.1 1.3 1.9 1.7v3.1c0 .6.7.9 1.1.5l2.4-2.3c.7.1 1.5.1 2.3.1 3.1 0 5.4-.6 6.9-1.9 1.6-1.4 2.3-3.6 2.3-6.5 0-2.9-.7-5.1-2.3-6.5C17.4 2.8 15.1 2.2 12 2.2Zm-2.94 4.5c-.3-.18-.68-.1-.9.18l-.72.94c-.35.46-.38 1.09-.07 1.58a11.6 11.6 0 0 0 2.2 2.55 11.6 11.6 0 0 0 2.85 1.79c.54.24 1.17.1 1.56-.34l.79-.88c.24-.27.24-.67 0-.94l-1.5-1.24c-.28-.23-.7-.19-.94.08l-.42.48a8.3 8.3 0 0 1-1.79-1.66l.5-.4c.29-.23.34-.64.13-.93L9.06 6.7Z"
      />
    </svg>
  )
}

export function WhatsAppIcon({ size = 22 }) {
  return (
    <svg {...base(size)} fill="currentColor">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.16-1.35a9.92 9.92 0 0 0 4.88 1.27h.01c5.5 0 9.96-4.46 9.96-9.96A9.9 9.9 0 0 0 19.1 4.9 9.9 9.9 0 0 0 12.04 2Zm0 1.82c2.17 0 4.21.85 5.75 2.38a8.08 8.08 0 0 1 2.38 5.76c0 4.5-3.66 8.14-8.14 8.14a8.2 8.2 0 0 1-4.13-1.12l-.3-.18-3.06.8.82-2.99-.2-.31a8.1 8.1 0 0 1-1.27-4.34c0-4.49 3.65-8.14 8.15-8.14Z" />
      {/* Слухавка */}
      <path d="M9.5 7.13c-.19-.42-.38-.43-.56-.44h-.48c-.16 0-.43.06-.66.3-.22.25-.86.85-.86 2.06s.88 2.39 1 2.56c.13.16 1.72 2.75 4.24 3.75 2.09.82 2.52.66 2.97.62.46-.04 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.46-.29-.25-.12-1.47-.72-1.7-.8-.22-.09-.39-.13-.55.12-.17.25-.64.8-.78.97-.15.16-.29.19-.53.06-.25-.12-1.05-.38-2-1.23a7.5 7.5 0 0 1-1.38-1.72c-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.16.17-.27.25-.45.09-.16.04-.31-.02-.44-.06-.12-.55-1.34-.78-1.82Z" />
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

export function PhoneIcon({ size = 22 }) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth="1.6">
      <path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
    </svg>
  )
}

export function CheckIcon({ size = 20 }) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth="1.8">
      <path d="m4 12.5 5 5 11-11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Щит із галочкою — безпека засобів */
export function ShieldIcon({ size = 20 }) {
  return (
    <svg {...base(size)} stroke="currentColor" strokeWidth="1.6">
      <path
        d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9.5 4.1-1.9 7-5.3 7-9.5V6l-7-3Z"
        strokeLinejoin="round"
      />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

