import "./style.css"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { BASE_URL } from "../../utils/requests"
import DateTimePicker from "../../components/dateTimePicker"
import Input from "../../components/input"
import InputMasked from "../../components/inputMasked"
import Select from "../../components/select"
import Footer from "../../components/footer"
import Header from "../../components/header"
import image_loading from "../../assets/images/loading.gif"

const api = axios.create()

const User = ({user, setTypeUser, typeUser, setReturn, setReturnUser, logon, width, height, logoff}) => {
  const { code } = useParams()

  const [codeUser, setCodeUser] = useState("")
  const [cpf, setCpf] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [userName, setUserName] = useState("")
  const [type, setType] = useState(2)

  const [passwordNew, setPasswordNew] = useState("")
  const [passwordOld, setPasswordOld] = useState("")

  const [loading, setLoading] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    ////
    // if code isn't numeric return to list users
    ////
    if (isNaN(code)) {
      alert("Código o usuário inválido, retornando ao menu.")
      if (user === {}) navigate("/"); else navigate("/person")      
      return
    }
    else setCodeUser(parseFloat(code))  

    ////
    // if code equal 0 then new user
    // if don't have user with code return to list users
    ////
    if (code !== "0"){
      /////
      // Begin - GET Data User
      ///// 
      let config = {
        maxBodyLength: Infinity,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${user.token}`
        }
      };

      setLoading("Pesquisando os dados do usuário, Aguarde...")

      api.get(BASE_URL + "usuario/buscar/"+ code, config)
      .then(function (response) {      
        setCpf(response.data.object.usuario.cpf.replaceAll(".","").replaceAll("-",""))

        var sDateBirth = new Date(response.data.object.usuario.dataNascimento + "T00:00:00-03:00");
        setBirthDate(sDateBirth)              

        setEmail(response.data.object.usuario.email)
        setName(response.data.object.usuario.nome)
        setPhone(response.data.object.usuario.telefone.replaceAll(" ",""))
        setUserName(response.data.object.usuario.username)

        setLoading("")
      })
      .catch(function (error) {      
        if (error.response.status === 400){
          alert("Não foi possível localizar o usuário com o id fornecido ("+ code +")! ("+ error.response.status +")")
          setReturn()
          return
        }
        else{
          alert("Não foi possível verificar o usuário ("+ code +")! ("+ error.response.status +")")
          setReturn()
          return
        }
      })
      /////
      // End - GET Data Person
      /////
    }
    else setLoading("")

    document.getElementById("name_User") && document.getElementById("name_User").focus()
    document.getElementById("cpf_User") && document.getElementById("cpf_User").focus()
  }, [])

  const confirm = () => {
    if (!(validate())) { return }

    if (codeUser === 0){
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
        // Begin - INSERT user
        /////    
        let formatCpf = cpf.replaceAll(".","").replaceAll("-","")
        formatCpf = formatCpf.substr(0,3) + "." + formatCpf.substr(4,3) + "." + formatCpf.substr(6,3) + "-" + formatCpf.substr(9,2)

        var formatDateB     = birthDate.toLocaleString()
        var formatDateBirth = String(formatDateB).substr(6,4) + "-" + String(formatDateB).substr(3,2) + "-" + String(formatDateB).substr(0,2);

        var aFormatPhone    = phone.replaceAll("_","").split(")")
        var formatPhone     = aFormatPhone[0] + ") " + aFormatPhone[1]

        let data = "{"

        if (type === 2) data += "\"tipos\": [\"ROLE_USER\"]"
        else data += "\"tipos\": [\"ROLE_ADMIN\"]"
        
        data += ",\"usuario\":{"
        data += "\"cpf\":\""+ formatCpf +"\",\"nome\":\""+ name +"\",\"dataNascimento\":\""+ formatDateBirth +"\""+
        ",\"telefone\":\""+ formatPhone +"\",\"email\":\""+ email +"\",\"username\":\""+ userName + "\",\"password\":\""+ password +"\"}}"

        let config = {
          maxBodyLength: Infinity,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${token}`
          }
        };

        setLoading("Inserindo o usuário, Aguarde....")

        api.post(BASE_URL + "usuario/salvar", data, config)
        .then(function (responseU) {
          ///
          // BEGIN - Get Token
          ///
          formData = new FormData();
          formData.append("username", userName);
          formData.append("password", password);
        
          configA = {
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
            logon(JSON.parse("{\"id\":"+ response.data.id +",\"username\":\""+ userName +"\",\"password\":\""+ password +"\",\"token\":\""+ response.data.accessToken +"\",\"typeuser\": "+ typeUser +"}"))
          })
          .catch(function (error) {      
            alert("Usuário inserido com sucesso! Não foi possível realizar o login automatico. ("+ error.response.status +")")
            setReturn()
          })
          ///
          // END - Get Token          
          ///
        })
        .catch(function (errorU) {
          setLoading("")
          setMessage("Não foi possível inserir os dados do Usuário! ("+ errorU.response.status + ")")
        })
        /////
        // End - INSERT user
        /////
      })
      .catch(function (error) {      
        if (error.response.status === 401){
          setLoading("")
          setMessage("Não foi possível localizar o token com os dados fornecidos! ("+ error.response.status +")")          
          return
        }
        else if ((error.response.status === 403) || (error.response.status === 404)){
          setLoading("")
          setMessage("Não foi possível verificar o token! ("+ error.response.status +")")          
          return
        }
      })
      /////
      // End - GET Auth
      /////
    } 
    else {      
      /////
      // Begin - UPDATE user
      /////    
      let formatCpf = cpf.replaceAll(".","").replaceAll("-","")
      formatCpf = formatCpf.substr(0,3) + "." + formatCpf.substr(4,3) + "." + formatCpf.substr(6,3) + "-" + formatCpf.substr(9,2)

      var formatDateB     = birthDate.toLocaleString()
      var formatDateBirth = String(formatDateB).substr(6,4) + "-" + String(formatDateB).substr(3,2) + "-" + String(formatDateB).substr(0,2);

      var aFormatPhone    = phone.replaceAll("_","").split(")")
      var formatPhone     = aFormatPhone[0] + ") " + aFormatPhone[1]
      formatPhone         = formatPhone.replaceAll("  "," ")

      let data = "{\"usuario\":{\"id\": "+ codeUser + ",\"cpf\":\""+ formatCpf +"\",\"nome\":\""+ name +"\"" +
      ",\"dataNascimento\":\""+ formatDateBirth +"\",\"telefone\":\""+ formatPhone +"\",\"email\":\""+ email +"\"" +
      ",\"username\":\""+ userName + "\"}}"

      let config = {
        maxBodyLength: Infinity,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${user.token}`
        }
      };

      setLoading("Alterando o usuário, Aguarde....")

      api.put(BASE_URL + "usuario/atualizar", data, config)
      .then(function (response) {
        setCodeUser(response.data.object.usuario.id)
        setLoading("")      
        setMessage("Pessoa alterada com sucesso!!!")
      })
      .catch(function (error) {
        setLoading("")
        setMessage("Não foi possível alterar os dados do Usuário! ("+ error.response.status + ")")
      })
      /////
      // End - UPDATE user
      /////
    }
  }

  const navigate = useNavigate()

  const selectedField = (event) => {    
  }

  const updatePassword = () => {
    setLoading("")
    setMessage("")

    if (!(validatePasswordOld())) { return }

    if (passwordOld === ""){
      setLoading("")
      setMessage("É necessário informar a senha antiga!")
      document.getElementById("passwordOld_User") && document.getElementById("passwordOld_User").focus()
      return false
    }

    /////
    // Begin - UPDATE Password
    /////
    var data = JSON.stringify({
      "newPassword": ""+ passwordNew +"",
      "password": ""+ passwordOld +"",
      "username": ""+ userName +""
    });

    let config = {
      maxBodyLength: Infinity,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${user.token}`
      }
    };

    api.post(BASE_URL + "usuario/alterarSenha", data, config)
    .then(function (response) {
      if (code === user.id) user.password = passwordNew
      setLoading("")
      setMessage("Senha do usuário alterada com sucesso!!!")
    })
    .catch(function (error) {      
      if (error.response.status === 401){
        setLoading("")
        setMessage("Não foi possível obter o Token! ("+ error.response.status +")")
        return
      }
      else if (error.response.status === 400){
        setLoading("")
        setMessage("Senha antiga não inválida! ("+ error.response.status +")")        
        return          
      }
      else if (((error.response.status === 403) || (error.response.status === 404)) || (error.response.status === 500)){
        setLoading("")
        setMessage("Não foi possível alterar a senha do usuário! ("+ error.response.status +")")        
        return
      }
    })
    /////
    // End - UPDATE user
    /////
  }

  const validate = () => {
    if (cpf === ""){
      setLoading("")
      setMessage("É necessário informar o CPF!")
      document.getElementById("cpf_User") && document.getElementById("cpf_User").focus()
      return false
    }
    else {
      let code = cpf.replaceAll(".","").replaceAll("-","").replaceAll("_","")
      if (code.length !== 11){        
        setLoading("")
        setMessage("CPF inválido, favor informar o correto!")
        document.getElementById("cpf_User") && document.getElementById("cpf_User").focus()
        return
      }
    }

    if (name === ""){
      setLoading("")
      setMessage("É necessário informar o Nome!")
      document.getElementById("name_User") && document.getElementById("name_User").focus()
      return false
    }
    else {
      if (name.length < 2){
        setLoading("")
        setMessage("Nome inválido, favor informar ao menos 2 caracteres!")
        document.getElementById("name_User") && document.getElementById("name_User").focus()
        return
      }
    }

    if (birthDate === ""){
      setLoading("")
      setMessage("É necessário informar a Data do Aniversário!")
      document.getElementById("birthDate_User") && document.getElementById("birthDate_User").focus()
      return false
    }

    if (phone === ""){
      setLoading("")
      setMessage("É necessário informar o Telefone!")
      document.getElementById("phone_User") && document.getElementById("phone_User").focus()
      return false
    }
    else{
      let code = phone.replaceAll("(","").replaceAll(")","").replaceAll("_","")
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

    if (userName === ""){
      setLoading("")
      setMessage("É necessário informar o Login!")
      document.getElementById("username_User") && document.getElementById("username_User").focus()
      return false
    }

    if (codeUser === 0){
      if (password === ""){
        document.getElementById("password_User") && document.getElementById("password_User").focus()
        return false        
      }

      return validatePasswordNew()
    }

    return true
  }

  const validateEmail = () => {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const validatePasswordNew = () => {
    if(password.length < 8)
    {
      setLoading("")
      setMessage("A Senha deve conter no minímo 8 digitos!");
      document.getElementById("password_User") && document.getElementById("password_User").focus()
      return false;
    }
    else
    {     
      // if dotn have caracter
      const regexStringLowerCase = /[a-z]/;    
      const regexStringUpperCase = /[A-Z]/;
      if ((!regexStringLowerCase.test(password)) && (!regexStringUpperCase.test(password))){
        setLoading("")
        setMessage("A Senha deve possuir ao menos um caracter!")
        document.getElementById("password_User") && document.getElementById("password_User").focus()
        return false
      }

      // if dotn have number
      const regexStringNumeric = /[0-9]/;
      if (!regexStringNumeric.test(password)){
        setLoading("")
        setMessage("A Senha deve possuir ao menos um número!")
        document.getElementById("password_User") && document.getElementById("password_User").focus()
        return false
      }
      
      return true
    }
  }

  const validatePasswordOld = () => {
    if(passwordNew.length < 8)
    {
      setLoading("")
      setMessage("A Senha nova deve conter no minímo 8 digitos!");
      document.getElementById("passwordNew_User") && document.getElementById("passwordNew_User").focus()
      return false;
    }
    else
    {     
      // if dotn have caracter
      const regexStringLowerCase = /[a-z]/;    
      const regexStringUpperCase = /[A-Z]/;
      if ((!regexStringLowerCase.test(passwordNew)) && (!regexStringUpperCase.test(passwordNew))){
        setLoading("")
        setMessage("A Senha nova deve possuir ao menos um caracter!")
        document.getElementById("passwordNew_User") && document.getElementById("passwordNew_User").focus()
        return false
      }

      // if dotn have number
      const regexStringNumeric = /[0-9]/;
      if (!regexStringNumeric.test(passwordNew)){
        setLoading("")
        setMessage("A Senha nova deve possuir ao menos um número!")
        document.getElementById("passwordNew_User") && document.getElementById("passwordNew_User").focus()
        return false
      }
      
      return true
    }
  }

  return(
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, minHeigth: height, minWidth: width, maxWidth: width}}>
      {/* Begin Header */}
      <div id="header_User">
        { (codeUser === 0) ?
            <>
              <Header title="Cadastro" subTitle="Usuário" setTypeUser={setTypeUser} user={user} showMenu={false} logoff={logoff} />
            </>
          :
            <>
              { (typeUser === 1) ? <Header title="Meus" subTitle="Dados" setTypeUser={setTypeUser} user={user} showMenu={true} logoff={logoff} /> 
                : <Header title="Cadastro" subTitle="Usuário" setTypeUser={setTypeUser} user={user} showMenu={true} logoff={logoff} /> }
            </>
        }
      </div>        
      {/* End Header */}

      { loading ?
          <>
            <div className="containerLoading_User">
              <img src={image_loading} alt="Carregando..." />
              <label>{loading}</label>
            </div>                   
          </>
        :
          <>
            {/* Begin Body */}
            <div id="containerBody_User">
              {/* Begin Fields */}
              <div id="conteinerFields_User">
                <div className={(width < 400) ? "containerFieldColumn_User" : "containerFieldRow_User"}>
                  <div className={(width < 400) ? "fieldFlex1_User" : "fieldFlex0_User"}>
                    <InputMasked
                      name="cpf_User"
                      description="CPF:"
                      planceHolder={""}
                      mask="999.999.999-99"
                      value={cpf || ""}
                      disabled={false}
                      require={true}
                      image={false}
                      typeImage={0}
                      onSelect={selectedField}
                      onChange={(event) => setCpf(event.target.value)} />
                  </div>
                  <div className={(width < 400) ? "fieldFlex1_User" : "fieldFlex1_User marginLeft10_User"}>
                    <Input
                      type="text"
                      name="name_User"
                      description="Nome:"
                      planceHolder={""}
                      value={name || ""}
                      maxLength={80}
                      disabled={false}
                      require={true}
                      image={false}
                      typeImage={0}
                      onSelect={selectedField}
                      onChange={(event) => setName(event.target.value)} />            
                  </div>
                </div>

                { (width <= 350) ?
                  <>
                    <div className="containerFieldColumn_User">
                      <div className="fieldFlex0_User">
                        <DateTimePicker
                          name="birthDate_User"
                          description="Data Aniversário:"
                          planceHolder={""}
                          value={birthDate || ""}
                          require={true}
                          onSelect={selectedField}
                          onChange={(event) => setBirthDate(event)}
                          interval={false} />            
                      </div>
                      <div className="fieldFlex0_User">
                        <InputMasked
                          name="phone_User"
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
                      <div className="fieldFlex1_User">
                        <Input
                          type="email"
                          name="email_User"
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
                      <div className="containerFieldRow_User">
                        <div className="fieldFlex0_User maxWidth170_User">
                          <DateTimePicker
                            name="birthDate_User"
                            description="Data Aniversário:"
                            planceHolder={""}
                            value={birthDate || ""}
                            require={true}
                            onSelect={selectedField}
                            onChange={(event) => setBirthDate(event)}
                            interval={false} />            
                        </div>
                        <div className="fieldFlex0_User marginLeft10_User maxWidth170_User">
                          <InputMasked
                            name="phone_User"
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
                      <div className="containerFieldRow_User">
                        <div className="fieldFlex1_User">
                          <Input
                            type="email"
                            name="email_User"
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
                      <div className="containerFieldRow_User">
                        <div className="fieldFlex0_User maxWidth170_User">
                          <DateTimePicker
                            name="birthDate_User"
                            description="Data Aniversário:"
                            planceHolder={""}
                            value={birthDate || ""}
                            require={true}
                            onSelect={selectedField}
                            onChange={(event) => setBirthDate(event)}
                            interval={false} />            
                        </div>
                        <div className="fieldFlex0_User marginLeft10_User maxWidth170_User">
                          <InputMasked
                            name="phone_User"
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
                        <div className="fieldFlex1_User marginLeft10_User">
                          <Input
                            type="email"
                            name="email_User"
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
                
                { (codeUser === 0) &&
                  <div className={"containerFieldRow_User"}>
                    <Select
                      name="type_User"
                      description="Tipo de Acesso:"
                      value={type}
                      disabled={false}
                      require={true}
                      options={JSON.parse("{\"RESULTADO\": [{\"ID\": 1, \"VALOR\": \"Administrador\"}, {\"ID\": 2, \"VALOR\": \"Usuário\"}]}")}
                      onSelect={selectedField}
                      set={setType} />  
                  </div>
                }

                { (codeUser === 0) ?
                    <div className={(width <= 350) ? "containerFieldColumn_User" : "containerFieldRow_User"}>
                      <div className="fieldFlex1_User">
                        <Input
                          type="text"
                          name="username_User"
                          description="User:"
                          planceHolder={""}
                          value={userName || ""}
                          maxLength={8}
                          disabled={false}
                          require={true}
                          image={false}
                          typeImage={0}
                          onSelect={selectedField}
                          onChange={(event) => setUserName(event.target.value)} />
                      </div>
                      <div className={(width <= 350) ? "fieldFlex1_User" : "fieldFlex1_NewUser marginLeft10_User"}>
                        <Input
                          type="text"
                          name="password_User"
                          description="Password:"
                          planceHolder={""}
                          value={password || ""}
                          maxLength={8}
                          disabled={false}
                          require={true}
                          image={false}
                          typeImage={0}
                          onSelect={selectedField}
                          onChange={(event) => setPassword(event.target.value)} />            
                      </div>
                    </div>
                  :
                    <>
                      <div className="containerFieldColumn_User">
                        <div className="fieldFlex1_User">
                          <Input
                            type="text"
                            name="username_User"
                            description="Login:"
                            planceHolder={""}
                            value={userName || ""}
                            maxLength={8}
                            disabled={false}
                            require={true}
                            image={false}
                            typeImage={0}
                            onSelect={selectedField}
                            onChange={(event) => setUserName(event.target.value)} />
                        </div>
                      </div>

                      <div id="spacePassword_User" />

                      <div className={(width < 400) ? "containerFieldColumn_User alignPassword_User marginPassword_User" : "containerFieldRow_User marginPassword_User"}>
                        <div className={(width < 400) ? "fieldFlex1_User" : "fieldFlex1_User"}>
                          <Input
                            type="text"
                            name="passwordOld_User"
                            description="Senha Antiga:"
                            planceHolder={""}
                            value={passwordOld || ""}
                            maxLength={8}
                            disabled={false}
                            require={true}
                            image={false}
                            typeImage={0}
                            onSelect={selectedField}
                            onChange={(event) => setPasswordOld(event.target.value)} />   
                        </div>
                        <div className={(width < 400) ? "fieldFlex1_User" : "fieldFlex1_User marginLeft10_User"}>
                          <Input
                            type="text"
                            name="passwordOld_User"
                            description="Senha Antigo:"
                            planceHolder={""}
                            value={passwordNew || ""}
                            maxLength={8}
                            disabled={false}
                            require={true}
                            image={false}
                            typeImage={0}
                            onSelect={selectedField}
                            onChange={(event) => setPasswordNew(event.target.value)} />
                        </div>
                        <div className={(width < 400) ? "fieldFlex0_User buttonAlterPassword_User" : "fieldFlex0_User buttonAlterPassword_User marginLeft10_User"}>
                          <div id="buttonConfirm_User" onClick={() => updatePassword()}>
                            <label>Alterar</label>
                          </div>
                        </div>
                      </div>                    
                    </>
                }          

                { message && 
                  <div className="containerMessage_User marginTop10_User">
                    <label>{message}</label>
                  </div> 
                }

                <div id="buttons_User">
                  <div id="buttonConfirm_User" onClick={() => confirm()}>
                    <label>Salvar</label>
                  </div>
                  <div id="buttonConfirmReturn_User" onClick={((typeUser === 1) || (typeUser === 3)) ? () => setReturn() : () => setReturnUser()}>
                    <label>Retornar</label>
                  </div>
                </div>
              </div>
              {/* End Fields */}
            </div>
            {/* End Body */}

            {/* Begin Footer */}
            <div id="containerFooter_User">
              <Footer />
            </div>
            {/* End Footer */}
          </>
        }
    </div>
  )
}

export default User