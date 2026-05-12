import { useState, useEffect } from 'react'

function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast toast-${type} ${visible ? 'toast-enter' : 'toast-exit'}`}>
      <span className="toast-icon">{type === 'success' ? 'OK' : '!'}</span>
      <span className="toast-msg">{message}</span>
      <button className="toast-close" onClick={onClose}>
        &times;
      </button>
    </div>
  )
}

export default Toast
