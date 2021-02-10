import React , { useContext } from 'react'
import Peer from 'peerjs'

const PeerContext = React.createContext()

export function usePeer(){
    return useContext(PeerContext)
}

export  function PeerProvider({children}) {
   
    const myPeer = new Peer(undefined )

    return (
        <PeerContext.Provider value={myPeer}>
            {children}
        </PeerContext.Provider>
    )
}
