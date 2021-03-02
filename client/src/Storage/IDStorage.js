/*
    modify local storage for user ID
*/
import {useEffect , useState} from 'react'

const PREFIX = "Anonymous-Chat-"

export default function IDStorage(key , initialValue ) {
    const  prefixedkey = PREFIX + key
    const [value , setValue] = useState(() =>{
        const idvalue = localStorage.getItem(prefixedkey)
        if(idvalue != null) return (idvalue)
        if(typeof initialValue === 'function')
            return initialValue()
        else   
            return initialValue
    })

    useEffect(() => {
        localStorage.setItem(prefixedkey , (value))
    } , [prefixedkey , value])

    return [value , setValue]
}
