import react, { createContext, useState } from 'react';

export const messagecontext = createContext();
export const ChatContext = ({children}) => {
    const [message,setMessage] = useState([]);
    const [start,setStart] = useState(true);
    return(
        <messagecontext.Provider value={{message,setMessage,start,setStart}}>
            {children}
        </messagecontext.Provider>
    );
}