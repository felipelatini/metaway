import "./style.css"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/requests"
import Input from "../../components/input"
import InputMasked from "../../components/inputMasked"
import Select from "../../components/select"
import image_loading from "../../assets/images/loading.gif"

const api = axios.create()

const Contact = ({user, person, contact, setConfirm, setReturn, width}) => {
  const [codeContact, setCodeContact] = useState("")
  const [email, setEmail] = useState("")
  const [privateInfo, setPrivateInfo] = useState(2)
  const [tag, setTag] = useState("")
  const [phone, setPhone] = useState("")
  const [type, setType] = useState("0")

  const [loading, setLoading] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    ////
    // if code isn't numeric return to list contacts
    ////
    if (isNaN(contact.id)) {
      alert("Código do contato inválido, retornando ao menu.")
      setReturn()
      return
    }
    else setCodeContact(parseFloat(contact.id))

    if (contact.id !== 0){   
      if (contact.email != null) setEmail(contact.email); else setEmail("")
      if (contact.telefone != null) setPhone(contact.telefone.replaceAll(" ","")); else setPhone("")

      setTag(contact.tag)

      if (contact.privado) setPrivateInfo(1); 
      else setPrivateInfo(2)

      if (contact.tipoContato === "CELULAR") setType("1")
      else if (contact.tipoContato === "EMAIL") setType("2")
      else if (contact.tipoContato === "TELEFONE") setType("3")

      setLoading("")    
    }

    document.getElementById("privateInfo_Contact") && document.getElementById("privateInfo_Contact").focus()
    document.getElementById("tag_Contact") && document.getElementById("tag_Contact").focus()
  }, [])

  const confirm = () => {
    if (!(validate())) { return }
    
    /////
    // Begin - INSERT or UPDATE person
    /////
    let aFormatPhone    = phone.replaceAll("_","").split(")")
    let formatPhone     = aFormatPhone[0] + ") " + aFormatPhone[1]

    let data = "{\"pessoa\":{\"id\": "+ person.id + "},\"usuario\":{\"id\": "+ user.id + "},\"tag\": \""+ tag +"\""

    if (codeContact !== 0) data += ",\"id\": "+ codeContact
    if (email !== "") data += ",\"email\": \""+ email +"\""
    if (phone !== "") data += ",\"telefone\": \""+ formatPhone +"\""

    if (privateInfo === 1) data += ",\"privado\": \"true\""
    else data += ",\"privado\": \"false\""

    if (type === "1") data += ",\"tipoContato\": \"CELULAR\"}"
    else if (type === "2") data += ",\"tipoContato\": \"EMAIL\"}"
    else if (type === "3") data += ",\"tipoContato\": \"TELEFONE\"}"

    console.log(data)

    let config = {
      maxBodyLength: Infinity,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${user.token}`
      }
    };
    
    setLoading((codeContact === 0) ? "Inserindo a pessoa, Aguarde...." : "Alterando a pessoa, Aguarde....")

    api.post(BASE_URL + "contato/salvar", data, config)
    .then(function (response) {
      alert((codeContact === 0) ? "Contato inserido com sucesso!!!" : "Contato alterado com sucesso!!!")
      setConfirm(response.data.object)      
    })
    .catch(function (error) {
      setLoading("")
      setMessage((codeContact === 0) ? "Não foi possível inserir os dados do Contato! ("+ error.response.status + ")" : "Não foi possível alterar os dados do Contato! ("+ error.response.status + ")")
    })
    /////
    // End - INSERT or UPDATE contact
    /////
  }

  const selectedField = (event) => {    
  }

  const validate = () => {
    if (tag === ""){
      setMessage("É necessário informar a Tag!")
      document.getElementById("tag_Contact") && document.getElementById("tag_Contact").focus()
      return false
    }
    else {
      if (tag.length < 2){
        setMessage("Tag inválida, favor informar ao menos 2 caracteres!")
        document.getElementById("tag_Contact") && document.getElementById("tag_Contact").focus()
        return
      }
    }

    if (type === "0"){
      setMessage("É necessário informar o Tipo do Contato!")
      document.getElementById("type_Contact") && document.getElementById("type_Contact").focus()
      return false
    }

    // CELULAR
    if (type === "1"){
      if (phone === ""){
        setLoading("")
        setMessage("É necessário informar o Celular!")
        document.getElementById("phone_Contact") && document.getElementById("phone_Contact").focus()
        return false
      }
      else{
        let code = phone.replaceAll("(","").replaceAll(")","").replaceAll("_","")
        if (code.length !== 11){
          setLoading("")
          setMessage("Celular inválido, favor informar o correto!")
          document.getElementById("phone_Contact") && document.getElementById("phone_Contact").focus()
          return
        }      
      }
    }

    // EMAIL
    if (type === "2"){
      if (email === ""){
        setLoading("")
        setMessage("É necessário informar o Email!")
        document.getElementById("email_Contact") && document.getElementById("email_Contact").focus()
        return false
      }
      else {
        if (!validateEmail()) {
          setLoading("")
          setMessage("Email inválido, favor informar o correto!")
          document.getElementById("email_Contact") && document.getElementById("email_Contact").focus()
          return false        
        }
      }
    }

    // TELEFONE
    if (type === "3"){
      if (phone === ""){
        setLoading("")
        setMessage("É necessário informar o Telefone!")
        document.getElementById("phone_Contact") && document.getElementById("phone_Contact").focus()
        return false
      }
      else{
        let code = phone.replaceAll("(","").replaceAll(")","").replaceAll("_","")
        if (code.length !== 10){
          setLoading("")
          setMessage("Telefone inválido, favor informar o correto!")
          document.getElementById("phone_Contact") && document.getElementById("phone_Contact").focus()
          return
        }      
      }
    }

    return true
  }

  const validateEmail = () => {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
  }  

  return(
    <div id="Contact">
      { loading ?
          <>
            <div className="containerLoading_Contact">
              <img src={image_loading} alt="Carregando..." />
              <label>{loading}</label>
            </div>                   
          </>
        :
          <>
            {/* Begin Body */}
            <div id="containerBody_Contact">
              {/* Begin Fields */}
              <div id="conteinerFields_Contact">
                <div className={(width < 710) ? "containerFieldColumn_Contact" : "containerFieldRow_Contact"}>
                  <div className={(width < 710) ? "fieldFlex1_Contact" : "fieldFlex1_User"}>
                    <Input
                      type="text"
                      name="tag_Contact"
                      description="Tag:"
                      planceHolder={""}
                      value={tag}
                      maxLength={80}
                      disabled={false}
                      require={true}
                      image={false}
                      typeImage={0}
                      onSelect={selectedField}
                      onChange={(event) => setTag(event.target.value)} />
                  </div>
                  <div className={(width < 710) ? "fieldFlex1_Contact marginTop10_Contact" : "fieldFlex0_User maxWidth170_Contact marginLeft10_Contact"}>
                    <Select
                      name="privateInfo_Contact"
                      description="Privado:"
                      value={privateInfo}
                      disabled={false}
                      require={true}
                      options={JSON.parse("{\"RESULTADO\": [{\"ID\": 1, \"VALOR\": \"Sim\"}, {\"ID\": 2, \"VALOR\": \"Não\"}]}")}
                      onSelect={selectedField}
                      set={setPrivateInfo} /> 
                  </div>
                  <div className={(width < 710) ? "fieldFlex1_Contact marginTop10_Contact" : "fieldFlex0_User maxWidth170_Contact marginLeft10_Contact"}>
                    <Select
                      name="type_Contact"
                      description="Tipo Contato:"
                      value={type}
                      disabled={false}
                      require={true}
                      options={JSON.parse("{\"RESULTADO\": [{\"ID\": \"0\", \"VALOR\": \"Selecione...\"},{\"ID\": \"1\", \"VALOR\": \"CELULAR\"}, {\"ID\": \"2\", \"VALOR\": \"EMAIL\"}, {\"ID\": \"3\", \"VALOR\": \"TELEFONE\"}]}")}
                      onSelect={selectedField}
                      set={setType} />                    
                  </div>
                </div>

                <div className={(width < 400) ? "containerFieldColumn_Contact" : "containerFieldRow_Contact"}>
                  <div className={(width < 400) ? "fieldFlex1_Contact" : "fieldFlex1_User"}>
                    <Input
                      type="email"
                      name="email_Contact"
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
                  <div className={(width < 400) ? "fieldFlex1_Contact marginTop10_Contact" : "fieldFlex0_User maxWidth170_Contact marginLeft10_Contact"}>
                    <InputMasked
                      name="phone_Contact"
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

                { message && 
                  <div className="containerMessage_Contact marginTop10_Contact">
                    <label>{message}</label>
                  </div> 
                }

                <div id="buttons_Contact">
                  <div id="buttonConfirm_Contact" onClick={() => confirm()}>
                    <label>Salvar</label>
                  </div>
                  <div className="buttonConfirmReturn_Contact marginLeft5_Contact" onClick={() => setReturn()}>
                    <label>Retornar</label>
                  </div>
                </div>
              </div>
              {/* End Fields */}
            </div>
            {/* End Body */}
          </>
        }
    </div>
  )
}

export default Contact