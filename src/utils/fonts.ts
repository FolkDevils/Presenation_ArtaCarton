import { Barlow, Abril_Fatface } from 'next/font/google';

export const barlow = Barlow({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-barlow',
  weight: ['100', '200', '300', '400', '500', '600', '700'],
});

export const abrilFatface = Abril_Fatface({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-abril-fatface',
}); 