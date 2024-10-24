import react, { useContext, useEffect, useState } from 'react';
import { ClientSession } from '../../Session/ClientSession';
import styles from '../../Styles/Navbar.module.css';
import axios from 'axios';
import { messagecontext } from './ChatContext';
//import {context} from '../../Screen/ClientChat';

const Navbar = () => {

    const {sessionData,setSessionData} = useContext(ClientSession);
    const [history,setHistory] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("Loading");

    const {message,setMessage,setStart} = useContext(messagecontext);

    //const {setMessage} = useContext(context)

    //const {setMessage} = 

    const data = [{name:"Hello"}];

    const logout = () => {
        setSessionData({
            clientId:'1',
            email:'',
            name:'',
            branchId:''
        });
    }

    const showHistory = () => {
        return(
            <div>
                {history.map((m,i)=>(<div key={i} className={styles.content} onClick={()=>{fetchMessage(m[1])}}><div className={styles.datecontent}>{m[1]}</div><div className={styles.datecontent}>{m[2].length>12 ? m[2].substring(0,12) : m[2]}</div></div>))}
            </div>
        )
    }

    const loadHistory = async () => {
        try
        {
        await axios.post("http://localhost:5000/history",{clientId:sessionData.clientId}).then((res)=>{
            if(res.data.status=="available")
            {
            console.log(res.data);
            setHistory(res.data.dates);
            setLoading(false);
            console.log(history);
            }
        });
        }
        catch(err)
        {
            setHistory([]);
            setError("Check your Internet Connection");
            //setLoading(false);
            console.log(err.message);
        }
        setError("Check your Internet Connection");
    }

    const fetchMessage = async (date) => {
        console.log(date);
        try
        {
            await axios.post("http://localhost:5000/clienthistory",{clientId:sessionData.clientId,date:date}).then((res)=>{
                console.log(res.data);
                if(res.data.status=="available")
                {
                    setMessage(res.data.message);
                    setStart(false);
                }
                else
                {
                    setMessage({id:1,question:"",answer:"Server unavailable"})
                    setError("Check your Internet Connection")
                }
            })
        }
        catch(err)
        {
            console.log(err.message);
            setMessage({id:1,question:"",answer:"Check your Internet Connection"});
        }
        setStart(false);
    }

    useEffect(()=>{
        if(loading)
        {
            //setMessage({id:1,question:"Hello",answer:"Answer"})
            //setStart(true);
            loadHistory();
        }
    },)

    //setMessage({id:1,question:"Hello",answer:"Hello"})

    return(
        <div>
            <div className={styles.headercontent}>Client UI</div>
            <div className={styles.head}>Welcome {sessionData.name}</div>
            <div className={styles.buttoncontent}><button type="button" className={styles.button} onClick={()=>{logout()}}>Logout</button><button type="button" className={styles.button} onClick={()=>{loadHistory()}}>Reload</button></div>
            <div><p className={styles.header}>History</p><div className={styles.chat}>Scroll down to chat</div></div>
            <div className={styles.container}>
                {loading ? <p style={{marginLeft:'10px'}}>{error}</p> : showHistory()}
            </div>
        </div>
    );
}

export default Navbar;