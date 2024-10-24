import {React, useContext, useState} from "react";
import styles from '../Styles/LoginClient.module.css';
import { Link, redirect } from "react-router-dom";
import {ClientSession} from '../Session/ClientSession';
import {useNavigate} from 'react-router-dom';
import axios from "axios";

const LoginClient = () => {

    const {sessionData, setSessionData} = useContext(ClientSession);
    const navigate = useNavigate();

    const [showPassword,setShowPassword] = useState(false);
    const [error,setError] = useState("");
    const [formData, setFormData] = useState({
        email:"",
        password:""
    });

    const formUpdate = (name,value) => {
        setFormData({
            ...formData,
            [name]:value!==undefined ? value : ""
        })
    }

    const submit = (e) => {
        e.preventDefault();
        if(formData.email==="" || !formData.email.endsWith(".com") || !formData.email.includes("@"))
        {
            setError("Fill the email correctly");
            return;
        }
        else if(formData.password==="")
        {
            setError("Fill the password correctly");
            return ;
        }
        setError("");
        
        //console.log(sessionData);
            axios.post("http://localhost:5000/login",{email:formData.email,password:formData.password},{headers:{"Content-Type":"application/json"}}).then((res)=>{
            if(res.data.status=="yes")
            {
                setSessionData({email:formData.email,clientId:res.data.clientId,name:res.data.name,branch:res.data.branchId});
                navigate("/client");
            }
            else
            {
                setError("Client does not exist");
            }
            }).catch((err)=>
            {
            console.log(err.message);
            setError("Check your Internet Connection");
            return ;
            });
        //navigate("/client");
        return ;
    }

    return(
        <div className={styles.container}>
            <div className={styles.screen}>
                <p className={styles.head}>Client Login</p>
                <div className={styles.content}>
                    <form>
                        <p>Email<br/>
                        <input type="email" value={formData.email} onChange={(e)=>{formUpdate("email",e.target.value)}} required/></p>
                        <p>Password<br/>
                        <input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e)=>{formUpdate("password",e.target.value)}} required/><button type="button" className={styles.showpassword} onClick={()=>{setShowPassword(!showPassword)}}>{showPassword ? "Hide" : "Show"}</button></p>
                        <p style={{padding:'0px',margin:'0px',color:'red',fontWeight:'600'}}>{error!=="" ? error : <br/>}</p>
                        <div className={styles.loginfooter}><Link to="/registerclient"><p className={styles.link}></p></Link>
                        <Link><p className={styles.link}>Forget Password?</p></Link>
                        </div>
                        <button className={styles.button} value="submit" onClick={(e)=>{submit(e)}}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginClient;