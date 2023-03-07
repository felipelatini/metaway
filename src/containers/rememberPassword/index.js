import "./style.css"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/requests"
import Input from "../../components/input"
import InputMasked from "../../components/inputMasked"
import Footer from "../../components/footer"
import Header from "../../components/header"
import image_loading from "../../assets/images/loading.gif"

const api = axios.create()

const RememberPassword = ({setTypeUser, user, width, height, setReturn, logoff}) => {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const [listUser, setListUser] = useState([])

  const [loading, setLoading] = useState("")
  const [message, setMessage] = useState("")
  
  useEffect(() => {
    /////
    // Begin - GET Auth
    /////
    let formData = new FormData();
    formData.append("username", "admin");
    formData.append("password", "12345678");
  
    let configA = {
      maxBodyLength: Infinity,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };

    api.post(BASE_URL + "auth/login", formData, configA)
    .then(function (response){
      let token = response.data.accessToken

      /////
      // Begin - GET Users
      ///// 
      let config = {
        maxBodyLength: Infinity,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${token}`
        }
      };

      setLoading("Pesquisando os dados dos usuários, Aguarde...")

      var data = JSON.stringify({
        "termo": ""
      });

      api.post(BASE_URL + "usuario/pesquisar", data, config)
      .then(function (responseU) {
        setListUser(responseU.data)
        setLoading("")
      })
      .catch(function (errorU) {      
        alert("Não foi possível localizar os usuários! ("+ errorU.response.status +")")
        setReturn()
        return        
      })
      /////
      // End - GET Users
      /////
    })
    .catch(function (error) {      
      if (error.response.status === 401){
        alert("Não foi possível localizar o token com os dados fornecidos! ("+ error.response.status +")")
        return
      }
      else if ((error.response.status === 403) || (error.response.status === 404)){
        alert("Não foi possível verificar o token! ("+ error.response.status +")")
        return
      }
    })
    /////
    // End - GET Auth
    /////

    document.getElementById("email_RememberPassword") && document.getElementById("email_RememberPassword").focus()
    document.getElementById("phone_RememberPassword") && document.getElementById("phone_RememberPassword").focus()
  }, [])

  const confirm = () => {
    if (!(validate())) { return }

    let listContainEmail = []
    { listUser.map(item => (
        (item.email === email) && listContainEmail.push(item)
      ))
    }

    let listContainPhone = []
    { listContainEmail.map(item => (
        String(item.telefone).replaceAll("-","").replaceAll("_","").replaceAll("(","").replaceAll(")","").replaceAll(" ","") === 
          (phone.replaceAll("-","").replaceAll("_","").replaceAll("(","").replaceAll(")","")).replaceAll(" ","") &&
            listContainPhone.push(item)
      ))
    }

    if (listContainPhone.length > 0) setMessage("O seu login é: "+ listContainPhone[0].username)
    else setMessage("Email e telefone não encontrados na base de dados!")
  }

  const selectedField = (event) => {    
  }

  const validate = () => {
    if (phone === ""){
      setLoading("")
      setMessage("É necessário informar o Telefone!")
      document.getElementById("phone_User") && document.getElementById("phone_User").focus()
      return false
    }
    else{
      let code = phone.replaceAll("(","").replaceAll(")","")
      if ((code.length !== 10) && (code.length !== 11)){
        setLoading("")
        setMessage("Telefone inválido, favor informar o correto!")
        document.getElementById("phone_User") && document.getElementById("phone_User").focus()
        return
      }      
    }

    if (email === ""){
      setLoading("")
      setMessage("É necessário informar o Email!")
      document.getElementById("email_User") && document.getElementById("email_User").focus()
      return false
    }
    else {
      if (!validateEmail()) {
        setLoading("")
        setMessage("Email inválido, favor informar o correto!")
        document.getElementById("email_User") && document.getElementById("email_User").focus()
        return false        
      }
    }

    return true
  }

  const validateEmail = () => {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  return(
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, minHeigth: height, minWidth: width, maxWidth: width}}>
      {/* Begin Header */}
      <div id="header_RememberPassword">
        <Header title="Relembrar" subTitle="Login" setTypeUser={setTypeUser} user={user} showMenu={false} logoff={logoff} />
      </div>
      {/* End Header */}

      { loading ?
          <>
            <div className="containerLoading_RememberPassword">
              <img src={image_loading} alt="Carregando..." />
              <label>{loading}</label>
            </div>                   
          </>
        :
          <>
            {/* Begin Body */}
            <div id="containerBody_RememberPassword">
              {/* Begin Fields */}
              <div id="conteinerFields_RememberPassword">
                { (width <= 350) ?
                  <>
                    <div className="containerFieldColumn_RememberPassword">
                      <div className="fieldFlex0_RememberPassword">
                        <InputMasked
                          name="phone_RememberPassword"
                          description="Telefone:"
                          planceHolder={""}
                          mask="(99)999999999"
                          value={phone || ""}
                          disabled={false}
                          require={true}
                          image={false}
                          typeImage={0}
                          onSelect={selectedField}
                          onChange={(event) => setPhone(event.target.value)} />            
                      </div>
                      <div className="fieldFlex1_RememberPassword">
                        <Input
                          type="email"
                          name="email_RememberPassword"
                          description="Email:"
                          planceHolder={""}
                          value={email || ""}
                          maxLength={80}
                          disabled={false}
                          require={true}
                          image={false}
                          typeImage={0}
                          onSelect={selectedField}
                          onChange={(event) => setEmail(event.target.value)} />            
                      </div>
                    </div>            
                  </>
                  : ((width >= 351) && (width < 500)) ?
                    <>
                      <div className="containerFieldRow_RememberPassword">
                        <div className="fieldFlex0_RememberPassword marginLeft10_RememberPassword maxWidth170_RememberPassword">
                          <InputMasked
                            name="phone_RememberPassword"
                            description="Telefone:"
                            planceHolder={""}
                            mask="(99)999999999"
                            value={phone || ""}
                            disabled={false}
                            require={true}
                            image={false}
                            typeImage={0}
                            onSelect={selectedField}
                            onChange={(event) => setPhone(event.target.value)} />            
                        </div>
                      </div>
                      <div className="containerFieldRow_RememberPassword">
                        <div className="fieldFlex1_RememberPassword">
                          <Input
                            type="email"
                            name="email_RememberPassword"
                            description="Email:"
                            planceHolder={""}
                            value={email || ""}
                            maxLength={80}
                            disabled={false}
                            require={true}
                            image={false}
                            typeImage={0}
                            onSelect={selectedField}
                            onChange={(event) => setEmail(event.target.value)} />            
                        </div>
                      </div>
                    </>
                    :
                    <>            
                      <div className="containerFieldRow_RememberPassword">
                        <div className="fieldFlex0_RememberPassword marginLeft10_RememberPassword maxWidth170_RememberPassword">
                          <InputMasked
                            name="phone_RememberPassword"
                            description="Telefone:"
                            planceHolder={""}
                            mask="(99)999999999"
                            value={phone || ""}
                            disabled={false}
                            require={true}
                            image={false}
                            typeImage={0}
                            onSelect={selectedField}
                            onChange={(event) => setPhone(event.target.value)} />            
                        </div>
                        <div className="fieldFlex1_RememberPassword marginLeft10_RememberPassword">
                          <Input
                            type="email"
                            name="email_RememberPassword"
                            description="Email:"
                            planceHolder={""}
                            value={email || ""}
                            maxLength={80}
                            disabled={false}
                            require={true}
                            image={false}
                            typeImage={0}
                            onSelect={selectedField}
                            onChange={(event) => setEmail(event.target.value)} />            
                        </div>
                      </div>
                    </>              
                }              

                { message && 
                  <div className="containerMessage_RememberPassword marginTop10_RememberPassword">
                    <label>{message}</label>
                  </div> 
                }

                <div id="buttons_RememberPassword">
                  <div id="buttonConfirm_RememberPassword" onClick={() => confirm()}>
                    <label>Recuperar</label>
                  </div>
                  <div id="buttonConfirmReturn_RememberPassword" onClick={() => setReturn()}>
                    <label>Retornar</label>
                  </div>
                </div>
              </div>
              {/* End Fields */}
            </div>
            {/* End Body */}

            {/* Begin Footer */}
            <div id="containerFooter_RememberPassword">
              <Footer />
            </div>
            {/* End Footer */}
          </>
        }
    </div>
  )
}

export default RememberPassword