import "./style.css"
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { BASE_URL } from "../../utils/requests"
import Input from "../../components/input"
import image_logo from "../../assets/images/logo.png"
import image_loading from "../../assets/images/loading.gif";

const api = axios.create({
  baseURL: "https://localhost:5001/api/",
  headers: {                
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json;charset=utf-8"
  }
})

const Login = ({setTypeUser, setShowLogin, logon}) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    document.getElementById("username_Login") && document.getElementById("username_Login").focus()
  }, [])

  const authenticate = async() => {
    if (!(validate())) return

    setLoading("Efetuando o login, Aguarde...")
    setError("")

    ////////
    /// Begin - GET User
    //////// 
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
  
    var config = {
      maxBodyLength: Infinity,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };

    api.post(BASE_URL + "auth/login", formData, config)
    .then(function (response){   
      var typeUser = 2
      { response.data.tipos.map(type => (
          (type == "ROLE_ADMIN") ? typeUser = 1 : ""
        ))
      }

      ///
      // TypeUser: 1 - Admin 2 - User
      ///
      logon(JSON.parse("{\"id\":"+ response.data.id +",\"username\":\""+ username +"\",\"password\":\""+ password +"\",\"token\":\""+ response.data.accessToken +"\",\"typeuser\": "+ typeUser +"}"))
    })
    .catch(function (error) {      
      if (error.response.status === 401){
        setLoading("")
        setError("Não foi possível localizar o usuário com os dados fornecidos! ("+ error.response.status +")")        
      }
      else if ((error.response.status === 403) || (error.response.status === 404)){
        setLoading("")
        setError("Não foi possível verificar o usuário! ("+ error.response.status +")")        
      }
    })
    ////////
    /// End - GET User
    //////// 
  }

  const callNewUser = () => {
    setShowLogin(false)
    setTypeUser(3)
    navigate("/user/0")
  }

  const callRememberPasswork = () => {
    setShowLogin(false)
    navigate("/rememberPassword")
  }

  const navigate = useNavigate()

  const selectedField = (event) => {
  }

  function validate() {
    if (username === ""){
      setError("É necessário informar o Usuário!")
      return false
    }

    if (password === ""){
      setError("É necessário informar a Senha!")
      return false
    }

    return true
  }  

  return(
    <div id="Login">
      <div id="container_Login">
        <div id="containerLogo_Login">
          <img id="logo_Login" src={image_logo} alt="Logo" />
        </div>

        { loading ?
            <>
              <div className="containerMessage_Login">
                <img src={image_loading} alt="Carregando..." />
                <label>{loading}</label>
              </div>
            </>
          :
            <>
              <div className="input_Login">
                <Input
                  type="text"
                  name="username_Login"
                  description={""}
                  planceHolder="Usuário"
                  value={username}
                  maxLength={8}
                  disabled={false}
                  require={true}
                  image={true}
                  typeImage={2}
                  onSelect={selectedField}
                  onChange={(event) => setUsername(event.target.value)} />
              </div>
              <div className="input_Login marginTop10_Login">
                <Input
                  type="password"
                  name="password_Login"
                  description={""}
                  planceHolder="Senha"
                  value={password}
                  maxLength={8}
                  disabled={false}
                  require={true}
                  image={true}
                  typeImage={1}
                  onSelect={selectedField}
                  onChange={(event) => setPassword(event.target.value)} />
              </div>

              { error && 
                <div className="containerMessage_Login marginTop10_Login">
                  <label>{error}</label>
                </div> 
              }

              <div id="button_Login" onClick={authenticate}>
                <label>Entrar</label>
              </div>

              <div id="newUser_Login">
                <label onClick={() => callNewUser()}>Novo usuário?</label>
              </div>

              <div id="newUser_Login">
                <label onClick={() => callRememberPasswork()}>Esqueceu o login?</label>
              </div>                
            </>
          }
      </div>
    </div>
  )
}

export default Login