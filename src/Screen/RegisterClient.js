import { React, useState, useEffect, useRef} from 'react';
import styles from '../Styles/RegisterClient.module.css';
import axios from 'axios';

const RegisterClient = () => {
    const [formdata, setformdata] = useState({
        company:"",
        branch:"",
        department:"",
        name:"",
        email:"",
        phonenumber:"",
        password:""
    });
    const [loading,setloading] = useState(true);
    const formUpdate = (name,data) =>{
        //console.log(name,data);
        setformdata({
            ...formdata,
            [name]:data !== undefined ? data : "",
        })
        //console.log(formdata);
    }
    const [showPassword,SetShowPassword] = useState(false);
    const [company,setCompany] = useState([]);
    const [branch,setBranch] = useState([]);
    const [department,setDepartment] = useState([]);
    const phoneInput = useRef(null);
    const deptInput = useRef(null);

    //Fetching the Company, Branch, Department data from database
    const fetchData = async () => {
        await  axios.get("http://localhost:5000/clientdepartment").then((res)=>{
            console.log(res.data);
            setDepartment(res.data.details.sort());
            //setformdata({department:res.data.details[0].id})
            setformdata({
                company:"",
                branch:"",
                department:res.data.details[0].id,
                name:"",
                email:"",
                phonenumber:"" ,
                password:"" 
            });
        })
        //const companyData = ["Company1","Company2","Company3"];
        //const branchData = ["Branch1","Branch2"];
        //const departmentData = ["Department1","Department2"];
        //setCompany(companyData);
        //setBranch(branchData);
        //setDepartment(departmentData);
        
        setloading(false);
    }

    const renderList = (list,name) =>{
        return(
            <select name={name} ref={deptInput} onChange={(e)=>{formUpdate(name,e.target.value);console.log(e.target.value)}}>
                {list.map((m,index)=>(<option value={m.id} key={index}>{m.name}</option>))}
            </select>
        )
    }

    const submit = (e) => {
        if(formdata.phonenumber.length<10)
        {
            phoneInput.current.focus();
            return;
        }
        if(formdata.department==0)
        {

        }
        e.preventDefault();
        console.log(formdata);
        axios.post("http://localhost:5000/register",formdata,{headers:{"content-type":"application/json"}}).then((res)=>{
            console.log(res.data)
        });
    }

    useEffect(()=>{
        if(loading)
        {
            fetchData();
        }
    },[]);
    
    return(
        <div className={styles.container}>
            {loading ? <p>Loading...</p>: 
            <div className={styles.screen}>
                <div className={styles.content}>
                <div style={{marginBottom:'70px'}}><p className={styles.main_header}>Register Clients</p></div>
                    <p className={styles.head}>Client details</p>
                    <form>
                    {/* <p>Company<br/>
                    {renderList(company,"company")}</p>
                    <p>Branch<br/>
                    {renderList(branch,"branch")}
                    </p> */}
                    <p style={{color:'#EEE'}}>Department<br/>
                    {renderList(department,"department")}</p>
                    </form>
                </div>
                <div className={styles.content}>
                    <p className={styles.head}>Personal Details</p>
                    <form>
                    <p>Name<br/>
                    <input type="text" value={formdata.name} onChange={(e)=>{formUpdate("name",e.target.value)}} required/>
                    </p>
                    <p>Email<br/>
                    <input type="email" value={formdata.email} onChange={(e)=>{formUpdate("email",e.target.value)}} required/>
                    </p>
                    <p>Phone number<br/>
                    <input type="number" value={formdata.phonenumber} onChange={(e)=>{formUpdate("phonenumber",e.target.value)}} ref={phoneInput} min="1000000000" required/>
                    </p>
                    <p>Password<br/>
                    <input type={showPassword ? "text" : "password"} value={formdata.password} onChange={(e)=>{formUpdate("password",e.target.value)}} required/><button type="button" className={styles.showpassword} onClick={()=>{SetShowPassword(!showPassword)}}>{showPassword ? <p>Hide</p> : <p>Show</p>}</button></p>
                    <div><button value="submit" className={styles.button} onClick={submit}>Register </button></div>
                    </form>
                </div>
            </div>}
        </div>
    )
}

export default RegisterClient;
