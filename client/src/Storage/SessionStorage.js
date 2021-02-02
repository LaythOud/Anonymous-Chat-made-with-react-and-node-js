import {useEffect , useState} from 'react'

const PREFIX = "Anonymous-Chat-"

export default function SessionStorage(key , initialValue ) {
    const  prefixedkey = PREFIX + key
    const [value , setValue] = useState(() =>{
        const idvalue = window.sessionStorage.getItem(prefixedkey)
        if(idvalue != null) return (idvalue)
        if(typeof initialValue === 'function')
            return initialValue()
        else   
            return initialValue
    })

    useEffect(() => {
        window.sessionStorage.setItem(prefixedkey , (value))
    } , [prefixedkey , value])

    return [value , setValue]
}