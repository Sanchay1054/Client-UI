import {react, useState, React, useRef, useContext, useEffect, createContext} from "react";
import styles from '../Styles/ClientChat.module.css';
import { ClientSession } from "../Session/ClientSession";
import { useNavigate } from "react-router-dom";
import Navbar from '../Components/ClientChat/Navbar';
import client from '../Components/ClientChat/person-1824144_640.png'
import { Form } from "react-bootstrap";
import axios from "axios";
import {messagecontext} from '../Components/ClientChat/ChatContext';


const ClientChat = () =>{

    // const [message,setMessage] = useState([/*{id:1,question:"",answer:"How can I help you?"}*/]);
    const {message, setMessage, start, setStart} = useContext(messagecontext);
    //let id = 1;
    const [id,setId] = useState(0);
    const {sessionData} = useContext(ClientSession);
    const navigate = useNavigate();
    const [showHistory, setShowHistory] = useState(false);
    //const [start,setStart] = useState(true);

    const ref = useRef(null);
    const question = useRef(null);


    const render = () => {
        if(start)
        {
            //setMessage([]);
            console.log(id);
            return(<div className={styles.initialcontent}><img src={client} alt="Client" className={styles.image}/><p>How can I Help You?</p></div>)
        }
        return(
            <div ref={ref}>
                {message.map((m,index)=>(<div key={m.id}>
                    <div className={styles.chatuser}>
                        <div className={styles.user}>
                            {m.question}
                        </div>
                    </div>
                    <div className={styles.chatbot}>
                        <div className={styles.bot}>
                            {m.answer}
                        </div>
                    </div>
                </div>))}
                
            </div>
        )

    }

    useEffect(()=>{
        //sessionData.email = "";
        //console.log(sessionData);
        if(sessionData.email==="" || !sessionData || !sessionData.email)
        {
            navigate("/loginclient");
        }
        if(ref.current)
        {
            ref.current.scrollIntoView({block:'end',inline:'nearest',behavior:'smooth'});
        }
    })

    const response = async () => {
        //console.log(question.current.value+" "+sessionData.clientId);
        if(question.current.value=="")
        {
            return ;
        }
        //id++;
        setId(id+1);
        setStart(false);
        setMessage([...message,{id:id,question:question.current.value,answer:"Loading..."}]);
        try{
            await axios.post("http://localhost:5000/chat",{clientId:sessionData.clientId,question:question.current.value}).then((res)=>{if(res.data.status=="response sent"){
            //setMessage(message.pop())
            setMessage([...message,{id:id,question:question.current.value,answer:res.data.answer}]);
            question.current.value = "";
            console.log(message);

        }
        else
            {
                throw new Error("Please try again");
            }});
        }
        catch(err)
        {
            console.log(err.message);
            setMessage([...message,{id:id,question:question.current.value,answer:err.message}]);
        }
        
        
    }
    return(
        <div className={styles.container}>
            {showHistory ? <div></div> : <div className={styles.chathistory}><Navbar/></div>}
            <div className={styles.chatscreen}>
            {/* <div className={styles.showhistory}><button type="button" className={styles.button} onClick={()=>{setShowHistory(!showHistory)}}>Show History</button></div> */}
                <div className={styles.chat} >{render()}</div>
                <form className={styles.chatinputcontent}>
                    <Form.Control as="textarea" rows={2} className={styles.input} ref={question} />
                    <button type="button" className={styles.button} onClick={response}>Send</button>
                </form>
            </div>
        </div>
    )
}


export default ClientChat;