'use client'

import { useState, useEffect } from 'react'
import ChatWindow from './ChatWindow'

export default function ChatWindowManager() {
  const [showChat, setShowChat] = useState(false)
  
  // Handle global click to open chat
  useEffect(() => {
    const handleGlobalClick = () => {
      if (!showChat) {
        setShowChat(true)
      }
    }
    
    // Add click event listener to entire window
    window.addEventListener('click', handleGlobalClick)
    
    // Cleanup
    console.log(showChat)
    return () => {
      window.removeEventListener('click', handleGlobalClick)
    }
  }, [showChat])
  
  // Close the chat window
  const handleClose = (e) => {
    e.stopPropagation()
    setShowChat(false)
  }
  
  return (
    <>
      {showChat && <ChatWindow onClose={handleClose} />}
    </>
  )
}