import './global.css';
import { ImageProvider } from './contexts/ImageContext';

export const metadata = {
  title: 'Image Transformation Service',
  description: 'Apply filters and transformations to your images',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ImageProvider>
          {children}
        </ImageProvider>
      </body>
    </html>
  )
}
