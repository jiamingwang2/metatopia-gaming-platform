import React from 'react'
import { Toaster } from 'sonner'

const Toast: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'rgb(17, 24, 39)', // bg-gray-900
          border: '1px solid rgb(55, 65, 81)', // border-gray-700
          color: 'white',
        },
        className: 'font-tech',
        duration: 4000,
      }}
    />
  )
}

export default Toast