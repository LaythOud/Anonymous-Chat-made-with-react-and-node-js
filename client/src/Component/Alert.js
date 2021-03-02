import React from 'react';

export default function Alert(props) {
// componetnts to handel alert message
    const handleX =  () => {
        props.setMessage("")
    }

    return(
        <div className="alert fadeIn first">
            <span className="closebtn" onClick={handleX}>&times;</span>
            {props.message}
        </div>
    )
}