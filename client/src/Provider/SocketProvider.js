import React , { useContext} from 'react'

const SocketContext = React.createContext()

export function useSocket(){
    return useContext(SocketContext)
}

export  function SocketProvider({ children}) {
    const socket_protocol = window.location.protocol === 'https' ? 'wss' :'ws'
    const socket_port = ':5000'
    const socket = new WebSocket( socket_protocol + '://' + window.location.hostname + socket_port)
    
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}
