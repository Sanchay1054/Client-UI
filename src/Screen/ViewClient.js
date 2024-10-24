import rect ,{useEffect, useState} from 'react';
import styles from '../Styles/ViewClient.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewClient = () => {

    const [clients, setClients] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState("");
    const navigate = useNavigate();

    const fetchClients = async () => {
        await axios.get("http://localhost:5000/clientview").then((res)=>{
            console.log(res.data.client)
            if(res.data.status=="available")
            {
                setClients(res.data.client);
            }
            else
            {
                setError("Check your Connection");
            }
        }).catch((err)=>{
            console.log(err.message);
            setError("Check your Internet Connection");
        });
        setLoading(false);
    }

    const renderList = () => {
        //console.log(clients[0]);
        return(
            <div className={styles.detail}>
                {clients.map((m,i)=>(<div key={i} className={styles.client}><p className={styles.clientcontent}>Client Id: {m[3 ]}</p> <p>{m[4]}</p> <p>{m[5]}</p> <div>{m[6]}</div> <div>status: {m[8]}</div> <div>{m[11]}</div> <div>{m[10]}</div> <div>{m[9]}</div></div>))}
            </div>
        )
    }

    useEffect(()=>{
        if(loading)
        {
            fetchClients();
        }
    })

    return(
        <div className={styles.container}>
            <div className={styles.head}><div className={styles.header}>View Clients</div>
            <button className={styles.button} type="button" onClick={()=>{navigate("/registerclient")}}>Register a client</button></div>
            {/* <div className={styles.content}>{loading ? <p>Loading</p> : renderList()}</div> */}
            {renderList()}
        </div>
    )
}

export default ViewClient;