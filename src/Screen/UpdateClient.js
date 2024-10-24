import { React, useState, useEffect, useRef} from 'react';
import styles from '../Styles/UpdateClient.module.css';
import axios from 'axios';

const UpdateClient = () => {
    const [formdata, setformdata] = useState({
        company:"",
        branch:"",
        department:"",
        name:"",
        email:"",
        phonenumber:"",
        password:"",
        clientId:"",
        status:"",
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
    const [client,setClient] = useState([]);

    const [error, setError] = useState("");
    const [branchName,setBranchName] = useState("");
    const [selectDept,setSelectDept] = useState(true);
    const statusRef = useRef(null);

    //Fetching the Company, Branch, Department data from database
    const fetchData = async () => {
        try
        {
        await  axios.get("http://localhost:5000/clientdepartment").then((res)=>{
            console.log(res.data);
            if(res.data.status==="not fetched")
            {
                setError("Check your Connection");
                return ;
            }
            setDepartment(res.data.details.sort());
            //setformdata({department:res.data.details[0].id})
            setformdata({
                company:"",
                branch:"",
                department:res.data.details[0].id,
                name:"",
                email:"",
                phonenumber:"" ,
                password:"",
                clientId:"",
                status:"",
            });
        }).catch((err)=>{
            console.log(err.message);
        setError("Check your connection")
        return ;
        });
        await axios.post("http://localhost:5000/clientdetails").then((res)=>{
            console.log(res.data);
            if(res.data.status==="not available")
            {
                setError("Check your Connection");
                return ;
            }
            setClient(res.data.client);
            setformdata({
                ...formdata,clientId:res.data.client[0][0] ? res.data.client[0][0] : "0",
            })
        }).catch((err)=>{
            console.log(err.message);
        })

        //const companyData = ["Company1","Company2","Company3"];
        //const branchData = ["Branch1","Branch2"];
        //const departmentData = ["Department1","Department2"];
        //setCompany(companyData);
        //setBranch(branchData);
        //setDepartment(departmentData);
        setloading(false);
    }
    catch(err)
    {
        console.log(err.message);
        setError("Check your connection")
    }
        //setloading(false);
    }

    const renderList = (list,name) =>{
        return(
            <select name={name} ref={deptInput} onChange={(e)=>{formUpdate(name,e.target.value);console.log(e.target.value);setSelectDept(false)}}>
                {list.map((m,index)=>(<option value={m.id} key={index}>{m.id+" "+m.name}</option>))}
            </select>
        )
    }
    const renderClient = (list,name) =>{
        return(
            <select name={name} onChange={(e)=>{formUpdate("clientId",e.target.value);console.log(e.target.value);}}>
                {client.map((m,index)=>(<option value={m[0]} key={index}>{m[0]+" "+m[1]}</option>))}
            </select>
        )
    }

    const fetchDetail = async () => {
        await axios.post("http://localhost:5000/clientdetail",{clientId:formdata.clientId}).then((res)=>{
            if(res.data.status=="available")
            {
                setformdata({
                    name:res.data.detail[1],
                    email:res.data.detail[2],
                    phonenumber:res.data.detail[3],
                    password:res.data.detail[4],
                    status:res.data.detail[6],
                    clientId:formdata.clientId,
                    department:department[0].id,
                });
                statusRef.current.value = res.data.detail[6];
                deptInput.current.value = department[0].id;
                setBranchName("Again Select the Branch with id "+res.data.detail[5]);
            }
        }).catch((err)=>{
            console.log(err.message);
            setError("Check your Connection");
        })
    }

    const submit = (e) => {
        if(formdata.phonenumber.length<10)
        {
            phoneInput.current.focus();
            return;
        }
        if(formdata.department==0)
        {
            e.preventDefault();
            return ;
        }
        // if(selectDept)
        // {
        //     deptInput.current.focus();
        //     e.preventDefault();
        //     return;
        // }
        //console.log(statusRef.current.value);
        //setformdata({...formdata,status:statusRef.current.value});
        e.preventDefault();
        console.log(formdata);
        axios.post("http://localhost:5000/updateclient",formdata,{headers:{"content-type":"application/json"}}).then((res)=>{
            console.log(res.data)
            setBranchName("Successfully Updated");
            setformdata({
                name:"",
                email:"",
                clientId:formdata.clientId,
                department:formdata.department,
                password:"",
                phonenumber:"",
                status:formdata.status,
            })
        }).catch((err)=>{
            console.log(err.message);
            setBranchName("Check your Internet Connection");
        });
        
        setSelectDept(true);
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
                <div style={{marginBottom:'70px'}}><p className={styles.main_header}>Update Clients</p></div>
                <p className={styles.head}>Select a Client</p>
                    <p className={styles.head}>Client details</p>
                    {renderClient(client,"clientId")}
                    <button type="button" className={styles.button} onClick={()=>{fetchDetail()}}>Get Details</button>
                    <form>
                    {/* <p>Company<br/>
                    {renderList(company,"company")}</p>
                    <p>Branch<br/>
                    {renderList(branch,"branch")}
                    </p> */}
                    <p style={{color:'#EEE'}}>Department<br/>
                    {renderList(department,"department")}</p>
                    </form>
                    {error}{branchName}
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
                    <p>Status<br/>
                    <select name="status" ref={statusRef} onChange={(e)=>{formUpdate("status",e.target.value)}}><option value={"yes"}>yes</option><option value={"no"}>no</option></select></p>
                    <div><button value="submit" className={styles.button} onClick={submit}>Register </button></div>
                    </form>
                </div>
            </div>}
        </div>
    )
}

export default UpdateClient;
