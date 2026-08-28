import {
  TelegramIcon,
  ViberIcon,
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
} from '@/components/icons'
import { SOCIAL } from './site'

/**
 * Єдиний список каналів звʼязку для всього сайту.
 *
 * Раніше цей перелік лежав окремо в трьох місцях — у футері, в модалці
 * «Замовити» і на сторінці «Контакти». Додати новий месенджер означало
 * не забути про кожне з них, а підписи вже встигли розійтися між собою.
 * Тепер список один, а сторінки лише вирішують, як його показати.
 *
 * Порядок тут = порядок на сайті. Зверху найпопулярніші в Україні.
 *
 * Icon — це сам компонент, а не готова іконка: розмір вибирає та сторінка,
 * що малює (у футері дрібніші, у модалці більші).
 *
 * accent — фірмовий колір месенджера для кружечка під іконкою.
 *
 * hint тримаємо коротким — до ~18 символів. На телефоні довший підпис
 * переноситься на другий рядок, і кожен рядок каналу стає вищим; на пʼяти
 * каналах це помітно розтягує модалку.
 *
 * Посилання беруться з SOCIAL у site.js. Порожнє посилання не ховає канал:
 * кнопка лишається на місці, але неактивна, з підписом «Скоро».
 */
export const CONTACT_CHANNELS = [
  {
    key: 'telegram',
    label: 'Telegram',
    hint: 'Швидка відповідь',
    Icon: TelegramIcon,
    href: SOCIAL.telegram,
    accent: '#2aabee',
  },
  {
    key: 'viber',
    label: 'Viber',
    hint: 'Дзвінок або чат',
    Icon: ViberIcon,
    href: SOCIAL.viber,
    accent: '#7360f2',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    hint: 'Чат за номером',
    Icon: WhatsAppIcon,
    href: SOCIAL.whatsapp,
    accent: '#25d366',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    hint: 'Messenger',
    Icon: FacebookIcon,
    href: SOCIAL.facebook,
    accent: '#1877f2',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    hint: 'Напишіть у Direct',
    Icon: InstagramIcon,
    href: SOCIAL.instagram,
    accent: '#d6249f',
  },
]

/** Підпис під назвою каналу: у неактивного замість підказки — «Скоро». */
export const channelHint = (channel) =>
  channel.href ? channel.hint : 'Скоро зʼявиться'
