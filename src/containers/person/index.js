import "./style.css"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { BASE_URL } from "../../utils/requests"
import Input from "../../components/input"
import InputMasked from "../../components/inputMasked"
import Footer from "../../components/footer"
import Header from "../../components/header"
import image_loading from "../../assets/images/loading.gif"
import SearchContact from "../contact/search"

const api = axios.create()

const Person = ({setTypeUser, user, setReturn, width, height, logoff}) => {
  const { code } = useParams()

  const [codePerson, setCodePerson] = useState("")
  const [cpf, setCpf] = useState("")
  const [name, setName] = useState("")

  const [releaseAddress, setReleaseAddress] = useState(false)
  const [cepSelected, setCepSelected] = useState(false)

  const [codeAddress, setCodeAddress] = useState("")  
  const [cep, setCep] = useState("")
  const [address, setAddress] = useState("")  
  const [numberAddress, setNumberAddress] = useState("")  
  const [neighborhood, setNeighborhood] = useState("")  
  const [city, setCity] = useState("")  
  const [uf, setUf] = useState("")  
  const [country, setCountry] = useState("")  

  const [codePhoto, setCodePhoto] = useState("")
  const [namePhoto, setNamePhoto] = useState("")
  const [typePhoto, setTypePhoto] = useState("")
  const [pathPhoto, setPathPhoto] = useState("")

  const [loading, setLoading] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    ////
    // if code isn't numeric return to list people
    ////
    if (isNaN(code)) {
      alert("Código da pessoa inválido, retornando ao menu.")
      navigate("/person")
      return
    }
    else setCodePerson(parseFloat(code))  

    ////
    // if code equal 0 then new person
    // if don't have person with code return to list people
    ////
    if (code !== "0"){
      /////
      // Begin - GET Data Person
      /////      
      let config = {
        maxBodyLength: Infinity,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${user.token}`
        }
      };

      setLoading("Pesquisando os dados da pessoa, Aguarde...")

      api.get(BASE_URL + "pessoa/buscar/"+ code, config)
      .then(function (response){        
        setCpf(response.data.object.cpf.replaceAll(".","").replaceAll("-",""))
        setName(response.data.object.nome)

        setCodeAddress(response.data.object.endereco.id)
        setAddress(response.data.object.endereco.logradouro)
        setNumberAddress(parseInt(response.data.object.endereco.numero))
        setCep(response.data.object.endereco.cep.replaceAll(".","").replaceAll("-",""))
        setNeighborhood(response.data.object.endereco.bairro)
        setCity(response.data.object.endereco.cidade)
        setUf(response.data.object.endereco.estado)
        setCountry(response.data.object.endereco.pais)

        if (response.data.object.foto !== null){
          setCodePhoto(response.data.object.foto.id)
          setNamePhoto(response.data.object.foto.name)
          setTypePhoto(response.data.object.foto.type)

          /////
          /// BEGIN - Get path photo
          /////
          config = {
           maxBodyLength: Infinity,
            headers: { 
              'Access-Control-Allow-Origin': '*',
              'Authorization': `Bearer ${user.token}`
            },
            responseType: 'arraybuffer'
          };

          api.get(BASE_URL + "foto/download/"+ code, config)
          .then(function (responseD) {
            let blob = new Blob(
              [responseD.data], 
              {type: responseD.headers['content-type']}
            )
            let imgUrl = URL.createObjectURL(blob)
            setPathPhoto(imgUrl)
          })
          .catch(function (errorD) {      
            alert("Teste Erro")

            setLoading("")
            setMessage("Não foi possível carregar a foto da pessoa! ("+ errorD.response.status+")")
            return
          })
          /////
          /// END - Get path photo
          /////          
        }

        setLoading("")
      })
      .catch(function (error) {      
        if (error.response.status === 400){
          alert("Não foi possível localizar a pessoa com o id fornecido ("+ code +")! ("+ error.response.status +")")
          setReturn()
          return
        }
        else{
          alert("Não foi possível verificar a pessoa ("+ code +")! ("+ error.response.status +")")
          setReturn()
          return
        }
      })
      /////
      // End - GET Data Person
      /////    
    } 
    else setLoading("")

    document.getElementById("name_Person") && document.getElementById("name_Person").focus()
    document.getElementById("cpf_Person") && document.getElementById("cpf_Person").focus()
  }, [])

  const clearCep = () => {
    setReleaseAddress(false)
    
    setCep("")
    setAddress("")
    setNumberAddress("")
    setNeighborhood("")
    setCity("")
    setUf("")
    setCountry("")
   
    setCepSelected(false)
    setMessage("")

    document.getElementById("name_Person") && document.getElementById("name_Person").focus()
    document.getElementById("cep_Person") && document.getElementById("cep_Person").focus()
  }    

  const confirm = () => {
    if (!(validate())) { return }
    
    /////
    // Begin - INSERT or UPDATE person
    /////
    let formatCpf = cpf.replaceAll(".","").replaceAll("-","")
    formatCpf = formatCpf.substr(0,3) + "." + formatCpf.substr(4,3) + "." + formatCpf.substr(6,3) + "-" + formatCpf.substr(9,2)

    let formatCep = cep.replaceAll(".","").replaceAll("-","")
    formatCep = formatCep.substr(0,5) + "-" + formatCep.substr(5,3)

    let data = "{"
    if (codePerson !== 0) data += "\"id\": "+ codePerson + ","
    data += "\"cpf\":\""+ formatCpf +"\",\"nome\":\""+ name +"\""

    data += ",\"endereco\":{"
    if (codeAddress !== "") data += "\"id\": "+ codeAddress + ","
    data += "\"cep\":\""+ formatCep +"\",\"logradouro\":\""+ address +"\",\"numero\":"+ String(numberAddress).replaceAll("_","") +
    ",\"bairro\":\""+ neighborhood + "\",\"cidade\":\""+ city + "\",\"estado\":\""+ uf +"\",\"pais\":\""+ country + "\"}"
  
    if (codePhoto !== "")
      data += ",\"foto\":{\"id\":\""+ codePhoto +"\",\"name\":\""+ namePhoto +"\",\"type\":\""+ typePhoto + "\"}"

    data += "}"

    let config = {
      maxBodyLength: Infinity,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${user.token}`
      }
    };
    
    setLoading((codePerson === 0) ? "Inserindo a pessoa, Aguarde...." : "Alterando a pessoa, Aguarde....")

    api.post(BASE_URL + "pessoa/salvar", data, config)
    .then(function (response) {
      setCodePerson(response.data.object.id)
      setLoading("")

      setMessage((codePerson === 0) ? "Pessoa inserida com sucesso!!!" : "Pessoa alterada com sucesso!!!")
      
    })
    .catch(function (error) {
      setLoading("")
      setMessage((codePerson === 0) ? "Não foi possível inserir os dados da Pessoa! ("+ error.response.status + ")" : "Não foi possível alterar os dados da Pessoa! ("+ error.response.status + ")")
    })
    /////
    // End - INSERT or UPDATE person
    /////
  }

  const handleFile = (e) => {
    const _file = e.target.files[0];
    sendPhoto(_file)
  }

  const searchCep = () => {
    if (cep === ""){
      setMessage("É necessário informar o CEP!")
      document.getElementById("cep_User") && document.getElementById("cep_User").focus()
      return false
    }
    else{
      let codeField = cep.replaceAll("-","").replaceAll(".","")
      if (codeField.length !== 8){
        setMessage("CEP inválido, favor informar o correto!")
        document.getElementById("cep_User") && document.getElementById("cep_User").focus()
        return
      }
    } 

    setLoading("Buscando o CEP, Aguarde...")
    setMessage("")

    const apiCEP = axios.create({
      baseURL: "https://viacep.com.br/ws/",
      'Access-Control-Allow-Origin': '*'
    })

    apiCEP.get(cep + "/json/")
    .then((response) => {     
      if (response.data.erro !== true) {
        if ((response.data.logradouro === "") && (response.data.bairro === "")) {          
          setReleaseAddress(true)
          document.getElementById("address_Person") && document.getElementById("address_Person").focus()
        }                
        else {
          setReleaseAddress(false)
          document.getElementById("numberAddress_Person") && document.getElementById("numberAddress_Person").focus()
        }
              
        setAddress(response.data.logradouro)
        setNeighborhood(response.data.bairro)
        setCity(response.data.localidade)
        setUf(response.data.uf)
        setCountry("BR")

        setCepSelected(true)
      } 
      else
      {
        setMessage("CEP não encontrado.")

        setAddress("")
        setNeighborhood("")
        setCity("")
        setUf("")
      }
    })
    .catch(() => 
    { 
      setMessage("Não foi possível obter CEP.")

      setAddress("")
      setNeighborhood("")
      setCity("")
      setUf("")
    })
    .finally(() => { setLoading("") })
  }

  const navigate = useNavigate()

  const selectedField = (event) => {    
  }

  const sendPhoto = async(e) => {
    /////
    // Begin - Upload photo
    /////
    const formData = new FormData();
    formData.append("id", codePerson);
    formData.append("foto", e);

    let config = {
      maxBodyLength: Infinity,
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${user.token}`
      }
    };

    setMessage("Inserindo a foto da Pessoa, Aguarde...")

    api.post(BASE_URL + "foto/upload/"+ codePerson, formData, config)
    .then(function (response) {
      setCodePhoto(response.data.object.id)
      setNamePhoto(response.data.object.name)
      setTypePhoto(response.data.object.type)
    
      /////
      /// BEGIN - Get path photo
      /////
      config = {
        maxBodyLength: Infinity,
        headers: { 
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${user.token}`
        },
        responseType: 'arraybuffer'
      };

      api.get(BASE_URL + "foto/download/"+ codePerson, config)
      .then(function (responseD){
        let blob = new Blob(
          [responseD.data], 
          {type: responseD.headers['content-type']}
        )
        let imgUrl = URL.createObjectURL(blob)
        setPathPhoto(imgUrl)
      })
      .catch(function (errorD) {      
        setLoading("")
        setMessage("Foto inserida com sucesso, mas não foi possível carregar a foto da pessoa! ("+ errorD.response.status+")")
        return
      })
      /////
      /// END - Get path photo
      /////

      setLoading("")
      setMessage("Foto inserida com sucesso!!!")
    })
    .catch(function (error) {      
      setLoading("")
      setMessage("Não foi possível inserir a foto da pessoa! ("+ error.response.status+")")
    })
    /////
    // End - UPLOAD photo
    /////
  }

  const validate = () => {
    if (cpf === ""){
      setMessage("É necessário informar o CPF!")
      document.getElementById("cpf_Person") && document.getElementById("cpf_Person").focus()
      return false
    }
    else {
      let code = cpf.replaceAll(".","").replaceAll("-","")
      if (code.length !== 11){        
        setMessage("CPF inválido, favor informar 11 caracteres!")
        document.getElementById("cpf_Person") && document.getElementById("cpf_Person").focus()
        return
      }
    }

    if (name === ""){
      setMessage("É necessário informar o Nome!")
      document.getElementById("name_Person") && document.getElementById("name_Person").focus()
      return false
    }
    else {
      if (name.length < 2){
        setMessage("Nome inválido, favor informar ao menos 2 caracteres!")
        document.getElementById("name_Person") && document.getElementById("name_Person").focus()
        return
      }
    }

    if (cep === ""){
      setMessage("É necessário informar o CEP!")
      document.getElementById("cep_Person") && document.getElementById("cep_Person").focus()
      return false
    }
    else{
      let code = cep.replaceAll("-","").replaceAll(".","")
      if (code.length !== 8){
        setMessage("CEP inválido, favor informar 8 caracteres!")
        document.getElementById("cep_Person") && document.getElementById("cep_Person").focus()
        return
      }
    }

    if (address === ""){
      if (releaseAddress){
        setMessage("É necessário informar o endereço!") 
        document.getElementById("address_User") && document.getElementById("address_User").focus()
        return
      }
      else{
        setMessage("Endereço não fornecido, por favor consulte o CEP!")
        document.getElementById("cep_Person") && document.getElementById("cep_Person").focus()
        return
      }      
    }

    if (numberAddress === ""){
      setMessage("É necessário informar o número do endereço!")
      document.getElementById("numberAddress_User") && document.getElementById("numberAddress_User").focus()
      return
    }

    if (neighborhood === ""){
      if (releaseAddress){
        setMessage("É necessário informar o bairro!") 
        document.getElementById("neighborhood_User") && document.getElementById("neighborhood_User").focus()
        return
      }
      else{
        setMessage("Bairro não fonecido, por favor consulte o CEP!") 
        document.getElementById("cep_Person") && document.getElementById("cep_Person").focus()
        return
      }      
    }

    if (city === ""){
      setMessage("Cidade não fonecida, por favor consulte o CEP!") 
      document.getElementById("cep_Person") && document.getElementById("cep_Person").focus()
      return    
    }

    if (uf === ""){
      setMessage("Estado não fornecido, por favor consulte o CEP!")
      document.getElementById("cep_Person") && document.getElementById("cep_Person").focus()
      return    
    }

    if (country === ""){
      setMessage("Pais não fonecido, por favor consulte o CEP!") 
      document.getElementById("cep_Person") && document.getElementById("cep_Person").focus()
      return    
    }

    return true
  }

  return(
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, minHeigth: height, minWidth: width, maxWidth: width}}>
      {/* Begin Header */}
      <div id="header_Person">
        <Header title="Cadastro" subTitle="Pessoa" user={user} showMenu={true} setTypeUser={setTypeUser} logoff={logoff} />
      </div>
      {/* End Header */}

      { loading ?
          <>
            <div className="containerLoading_Person">
              <img src={image_loading} alt="Carregando..." />
              <label>{loading}</label>
            </div>                   
          </>
        :
          <>
            {/* Begin Body */}
            <div id="containerBody_Person">
              { (codePerson !== 0) &&
                <div style={{ display: "flex", flexGrow: 0, justifyContent: "center", marginTop: 10, borderRadius: 10 }}>
                  <Input 
                    type="file"
                    name="filePhoto_Person"
                    title={""}
                    planceHolder={""}
                    maxLength={255}
                    disabled={false}
                    require={false}
                    image={true}
                    typeImage={1}
                    accept=".jpg,.jpeg,.png,.bmp"
                    pathPhoto={pathPhoto}
                    onChange={handleFile} />
                </div>
              }

              {/* Begin Fields */}
              <div id="conteinerFields_Person">
                <div className={(width < 400) ? "containerFieldColumn_Person" : "containerFieldRow_Person"}>
                  <div className={(width < 400) ? "fieldFlex1_Person" : "fieldFlex0_User maxWidth170_Person"}>
                    <InputMasked
                      name="cpf_Person"
                      description="CPF:"
                      planceHolder={""}
                      mask="999.999.999-99"
                      value={cpf}
                      disabled={false}
                      require={true}
                      image={false}
                      typeImage={0}
                      onSelect={selectedField}
                      onChange={(event) => setCpf(event.target.value)} />
                  </div>
                  <div className={(width < 400) ? "fieldFlex1_Person marginTop10_Person" : "fieldFlex1_User marginLeft10_Person"}>
                    <Input
                      type="text"
                      name="name_Person"
                      description="Nome:"
                      planceHolder={""}
                      value={name}
                      maxLength={80}
                      disabled={false}
                      require={true}
                      image={false}
                      typeImage={0}
                      onSelect={selectedField}
                      onChange={(event) => setName(event.target.value)} />
                  </div>
                </div>

                <div className={(width < 400) ? "containerFieldColumn_Person" : "containerFieldRow_Person"}>
                  <div className={(width < 400) ? "fieldFlex1_Person" : "fieldFlex0_User maxWidth190_Person"}>
                    <InputMasked
                      name="cep_Person"
                      description="CEP:"
                      planceHolder={""}
                      mask="99999-999"
                      value={cep}
                      disabled={cepSelected ? true : false}
                      require={true}
                      image={true}
                      typeImage={3}
                      onSelect={selectedField}
                      setSearch={searchCep}
                      setClean={clearCep}
                      onChange={(event) => setCep(event.target.value)} />
                  </div>
                  <div className={(width < 400) ? "fieldFlex1_Person marginTop10_Person" : "fieldFlex1_User marginLeft10_Person"}>
                    <Input
                      type="text"
                      name="address_Person"
                      description="Logradouro:"
                      planceHolder={""}
                      value={address}
                      maxLength={120}
                      disabled={(!releaseAddress) ? true : false}
                      require={true}
                      image={false}
                      typeImage={0}
                      onSelect={selectedField}
                      onChange={(event) => setAddress(event.target.value)} />
                  </div>
                </div>

                <div className={(width < 400) ? "containerFieldColumn_Person" : "containerFieldRow_Person"}>
                  <div className={(width < 400) ? "fieldFlex1_Person" : "fieldFlex0_User maxWidth170_Person"}>
                    <InputMasked
                      name="numberAddress_Person"
                      description="Número:"
                      planceHolder={""}
                      mask="9999"
                      value={numberAddress}
                      disabled={false}
                      require={true}
                      image={false}
                      typeImage={0}
                      onSelect={selectedField}
                      onChange={(event) => setNumberAddress(event.target.value)} />
                  </div>
                  <div className={(width < 400) ? "fieldFlex1_Person marginTop10_Person" : "fieldFlex1_User marginLeft10_Person"}>
                    <Input
                      type="text"
                      name="neighborhood_Person"
                      description="Bairro:"
                      planceHolder={""}
                      value={neighborhood}
                      maxLength={120}
                      disabled={(!releaseAddress) ? true : false}
                      require={true}
                      image={false}
                      typeImage={0}
                      onSelect={selectedField}
                      onChange={(event) => setNeighborhood(event.target.value)} />
                  </div>
                </div>

                <div className={(width < 400) ? "containerFieldColumn_Person" : "containerFieldRow_Person"}>
                  <div className={(width < 400) ? "fieldFlex1_Person" : "fieldFlex1_Person"}>
                    <Input
                      type="text"
                      name="city_Person"
                      description="Cidade:"
                      planceHolder={""}
                      value={city}
                      maxLength={120}
                      disabled={true}
                      require={true}
                      image={false}
                      typeImage={0}
                      onSelect={selectedField}
                      onChange={(event) => setCity(event.target.value)} />
                  </div>
                  <div className={(width < 400) ? "fieldFlex1_Person marginTop10_Person" : "fieldFlex0_Person maxWidth170_Person marginLeft10_Person"}>
                    <Input
                      type="text"
                      name="uf_Person"
                      description="Estado:"
                      planceHolder={""}
                      value={uf}
                      maxLength={2}
                      disabled={true}
                      require={true}
                      image={false}
                      typeImage={0}
                      onSelect={selectedField}
                      onChange={(event) => setUf(event.target.value)} />
                  </div>
                </div>

                { message && 
                  <div className="containerMessage_Person marginTop10_Person">
                    <label>{message}</label>
                  </div> 
                }

                <div id="buttons_Person">
                  <div id="buttonRed_Person" onClick={() => confirm()}>
                    <label>Salvar</label>
                  </div>
                  <div className="buttonBlack_Person marginLeft5_Person" onClick={() => setReturn()}>
                    <label>Retornar</label>
                  </div>
                </div>

                { (codePerson !== 0) &&                                                                              
                  <SearchContact user={user} person={{id: codePerson}} width={width} height={height} />
                }
              </div>
              {/* End Fields */}
            </div>
            {/* End Body */}

            {/* Begin Footer */}
            <div id="footer_Person">
              <Footer />
            </div>
            {/* End Footer */}
          </>
        }
    </div>
  )
}

export default Person