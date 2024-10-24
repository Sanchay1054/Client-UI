from flask import Flask,request
import pymysql
from flask_cors import CORS
import json
import datetime

app = Flask(__name__)
CORS(app)

conn = pymysql.connect(host='localhost',user='root',password='password',db='client_ui')
cursor = conn.cursor()

@app.route("/",methods=["GET"])
def hello():
    cursor.execute("SELECT * FROM branch")
    branch = cursor.fetchall()
    return {'branch':branch}

@app.route("/login",methods=["POST"])
def login():
    try:
        data = json.loads(str(request.data,'utf-8'))
        #print(data,type(data),request.form)
        email = data['email']
        password = data['password']
        #print(request.form['email'])
        cursor.execute("SELECT * FROM client WHERE email='"+email+"' AND password='"+password+"'")
        client = cursor.fetchone()
        print(client)
        if client==None:
            return {"status":"no"}
        return {"status":"yes","clientId":client[0],"name":client[1],"email":client[2],"branchId":client[5]}
    except:
        return {"status":"Provide the details correctly"}

@app.route("/register",methods=["POST"])
def register():
    try:
        data = json.loads(str(request.data,'utf-8'))
        print(data)
        name = data['name']
        email = data['email']
        phoneNumber = data['phonenumber']
        password = data['password']
        department = data['department']
        cursor.execute("SELECT email from client WHERE email='"+email+"'")
        exist_email = cursor.fetchone()
        #print(exist_email)
        if exist_email!=None:
            return {"status":"Email already exists"}
        #cursor.execute("SELECT deptId FROM department WHERE name='"+branch+"'")
        #branchId = cursor.fetchall()[0][0]
        #print(branchId)
        cursor.execute("INSERT INTO client(name,email,phoneNumber,password,branchId,status) VALUES ('"+name+"','"+email+"','"+phoneNumber+"','"+password+"',"+department+",'yes');")
        conn.commit()
        cursor.execute("SELECT clientId FROM client WHERE email='"+email+"'")
        id = cursor.fetchall()[0][0]
        print(id)
        cursor.execute("Create Table client"+str(id)+"(clientId INTEGER PRIMARY KEY auto_increment, question varchar(100), answer varchar(200), querytime datetime);")
        conn.commit()
    except Exception as e:
        print(e)
        return {"status":"not registered"}
    return {"status":"registered"}

@app.route("/clientdepartment",methods=["POST","GET"])
def clientdepartment():
    try:
        cursor.execute("select * from company join branch using(compId) join department using(branchId);")
        data = cursor.fetchall()
        print(data)
        dept = []
        for i in data:
            dept.append({"id":i[4],"name":str(i[2]+" "+i[3]+" "+i[5])})
    except Exception as e:
        return {"status":"not fetched"}
    return {"status":"fetched","details":dept}

@app.route("/chat",methods=["POST"])
def chat():
    try:
        data = json.loads(str(request.data,'utf-8'))
        print(data,str(datetime.datetime.now())[:19])
        clientId = data["clientId"]
        question = data["question"]
        date = str(datetime.datetime.now())[:19]
        answer = "Answer of "+question
        cursor.execute("INSERT INTO client"+str(clientId)+" (question,answer,querytime) VALUES ('"+question+"','"+answer+"','"+date+"')")
        conn.commit()
    except Exception as e:
        print(e)
        return {"status":"Server Unavailable"}
    return {"status":"response sent","answer":answer}

@app.route("/history",methods=["POST"])
def history():
    try:
        data = json.loads(str(request.data,'utf-8'))
        clientId = data['clientId']
        print(data)
        date = []
        cursor.execute("SELECT distinct cast(querytime as date) AS date FROM client"+str(clientId)+";")
        dates = cursor.fetchall()
        datesdata = []
        for i in dates:
            datesdata.append(str(i[0]))
        #print(dates)
        historydata = []
        for i in range(len(datesdata)):
            cursor.execute("select question,answer from client"+str(clientId)+" where cast(querytime as date)='"+datesdata[i]+"' order by chatId limit 1")
            historydata.append((i,datesdata[i])+cursor.fetchone())
        print(historydata)
        historydata = historydata[::-1]
    except Exception as e:
        print("error",e)
        return {"status":"not available"}
    return {"status":"available","dates":historydata}

@app.route("/clienthistory",methods=["POST"])
def clientHistory():
    try:
        data = json.loads(str(request.data,'utf-8'))
        clientId = data['clientId']
        date = data['date']
        print(clientId,date)
        cursor.execute("SELECT question,answer FROM client"+str(clientId)+" where cast(querytime as date)='"+str(date)+"';")
        message = cursor.fetchall()
        messagehistory = []
        for i in range(len(message)):
            messagehistory.append({"id":i,"question":message[i][0],"answer":message[i][1]}) 
    except Exception as e:
        print("error",e)
        return {"status":"unavailable"}
    return {"status":"available","message":messagehistory}

@app.route("/clientdetails",methods=["POST"])
def clientDetails():
    try:
        cursor.execute("SELECT clientId, name FROM client;")
        data = cursor.fetchall()
        print(data)
    except Exception as e:
        print("error",e)
        return {"status":"not available"}
    return {"status":"available","client":data}

@app.route("/clientdetail",methods=["POST"])
def clientDetail():
    try:
        data = json.loads(str(request.data,'utf-8'))
        clientId = str(data['clientId'])
        cursor.execute("SELECT * FROM client WHERE clientId='"+clientId+"';")
        detail = cursor.fetchone()
        print(detail)
    except Exception as e:
        print("error",e)
        return {"status":"not available"}
    return {"status":"available","detail":detail}

@app.route("/updateclient",methods=["POST"])
def updateClient():
    try:
        data = json.loads(str(request.data,'utf-8'))
        clientId = str(data['clientId'])
        departmentId = str(data['department'])
        email = data['email']
        phoneNumber = data['phonenumber']
        password = data['password']
        name = data['name']
        status = data['status']
        print(clientId,status)
        cursor.execute("update client set name='"+name+"', email='"+email+"', phoneNumber='"+str(phoneNumber)+"', password='"+password+"', status='"+status+"', deptId='"+departmentId+"' where clientId='"+clientId+"';")
        conn.commit()
    except Exception as e:
        print("error",e)
        return {"status":"not available"}
    return {"status":"available"}

@app.route("/clientview",methods=["POST","GET"])
def clientView():
    try:
        cursor.execute("select * from client join department using(deptId) join branch using(branchId) join company using(compId) order by compId, branchId;")
        data = cursor.fetchall()
        print(data)
    except Exception as e:
        print("error",e)
        return {"status":"not available"}
    return {"status":"available","client":data}

if __name__=='__main__':
    app.run(port=5000)