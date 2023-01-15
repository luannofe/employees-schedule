import styles from './page.module.scss'
import {Roboto} from '@next/font/google'

export const roboto = Roboto({
  subsets: ['latin'],
  display: 'optional',
  weight: ['400', '500', '700', '900'],
  style: ['italic', 'normal']
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.className}>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={styles.body}>
        {children}
      </body>
    </html>
  )
}
