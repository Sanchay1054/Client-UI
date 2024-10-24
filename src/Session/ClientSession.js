import { createContext, react, useState, useEffect} from "react";


export const ClientSession = createContext();
const SESSION_STORAGE_KEY = 'chatbot-session';
  
export const SessionProvider = ({children}) => {
    const [sessionData,setSessionData] = useState(() => {
        const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
        return savedSession
          ? JSON.parse(savedSession)
          : {
              email:"",
              clientId:""
            };
      });
      
    useEffect(() => {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    }, [sessionData]);

    return(
        <ClientSession.Provider value={{sessionData, setSessionData}}>
            {children}
        </ClientSession.Provider>
    );
}
