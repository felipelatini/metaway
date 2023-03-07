import "./style.css"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { BASE_URL } from "../../utils/requests"
import Input from "../../components/input"
import Footer from "../../components/footer"
import Header from "../../components/header"
import image_loading from "../../assets/images/loading.gif"
import image_nostar from "../../assets/images/no_star.png"
import image_star from "../../assets/images/star.png"

const api = axios.create()

const Home = ({setTypeUser, user, width, height, logoff}) => {
  const [listContact, setListContact] = useState([])
  const [listContactFavorite, setListContactFavorite] = useState([])

  const [listFilter, setListFilter] = useState([])
  const [filter, setFilter] = useState("")
  const [firstAcess, setFirstAcess] = useState(true)

  const [loading, setLoading] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (firstAcess){
      let lstFavorite = []      
      let lstContact = []
      let lstPerson = []

      /////
      // Begin - GET Verify contacts favorite
      /////
      let config = {
        maxBodyLength: Infinity,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${user.token}`
        }
      };

      api.get(BASE_URL + "favorito/pesquisar", config)
      .then(function (response){
        lstFavorite = response.data        

        /////
        // Begin - GET Contacts
        /////
        var data = JSON.stringify({
          "termo": ""
        });    

        api.post(BASE_URL + "contato/pesquisar", data, config)
        .then(function (responseU){
          lstContact = responseU.data

          for(let i = 0; i < lstContact.length; i++){
            let exist = false

            for(let i2 = 0; i2 < lstPerson.length; i2++){
              if (lstPerson[i2].id === lstContact[i].pessoa.id) { 
                lstPerson[i2].contatos.push(lstContact[i])
                exist = true  
              }
            }

            if (!exist){
              lstPerson.push({ id: lstContact[i].pessoa.id, nome: lstContact[i].pessoa.nome, contatos: [ lstContact[i] ] })
            }            
          }

          for(let i = 0; i < lstPerson.length; i++){
            for(let i2 = 0; i2 < lstPerson[i].contatos.length; i2++){
              for(let i3 = 0; i3 < lstFavorite.length; i3++){
                if (lstFavorite[i3].id === lstPerson[i].contatos[i2].id) lstPerson[i].contatos[i2].favorito = true                
              }
            }
          }          

          for(let i = 0; i < lstPerson.length; i++){
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

            api.get(BASE_URL + "foto/download/"+ lstPerson[i].id, config)
            .then(function (responseD) {
               let blob = new Blob(
                 [responseD.data], 
                 {type: responseD.headers['content-type']}
               )
               let imgUrl = URL.createObjectURL(blob)
               lstPerson[i].path_photo = imgUrl

               setListContact(lstPerson)
               setListFilter(lstPerson)
             })
             .catch(function () {

            })
            /////
            /// END - Get path photo
            /////
          }

          setListContactFavorite(lstFavorite)
        })
        .catch(function (error) {      
          if (error.response.status === 401){
            setLoading("")
            setMessage("Não foi possível pesquisar os contatos com os dados fornecidos! ("+ error.response.status +")")
            return
          }
          else{
            setLoading("")
            setMessage("Não foi possível pesquisar os contatos! ("+ error.response.status +")")
            return
          }
        })
        /////
        // End - GET Data Contacts
        /////
      })
      .catch(function (error) {      
        if (error.response.status === 401){
          setLoading("")
          setMessage("Não foi possível verificar o favorito com os dados fornecidos! ("+ error.response.status +")")
          return
        }
        else{
          setLoading("")
          setMessage("Não foi possível verificar o favorito! ("+ error.response.status +")")
          return
        }
      })
      /////
      // End - GET Verify contacts favorite
      /////
    
      setFirstAcess(false)
    }

    if (filter !== ""){
      let lstFilter = []
      { listContact.map(item => (
          item.nome.toUpperCase().includes(filter.toUpperCase()) && lstFilter.push(item)
        ))
      }
      setListFilter(lstFilter)
    }
    else setListFilter(listContact)

    document.getElementById("filter_Home") && document.getElementById("filter_Home").focus()
  }, [filter])

  const callFavorite = (item) => {
    var haveFavorite = false

    for(let i = 0; i < listContactFavorite.length; i++){
      if (item.id === listContactFavorite[i].id) haveFavorite = true
    }

    if (haveFavorite){
      /////
      // Begin - DELETE Favorite contact
      ///// 
      let config = {
        maxBodyLength: Infinity,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${user.token}`
        }
      };

      setLoading("Retirando o favorito do contato, Aguarde...")

      api.delete(BASE_URL + "favorito/remover/"+ item.id, config)
      .then(function (response) {
        /////
        // Begin - POST Favorite contact
        ///// 
        let config = {
          maxBodyLength: Infinity,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${user.token}`
          }
        };

        setLoading("Colocando o contato como favorito, Aguarde...")

        var data = JSON.stringify(item)

        api.post(BASE_URL + "favorito/salvar", data, config)
        .then(function (response) {      
          setLoading("")
          setMessage("Contato como favorito com sucesso!")

          // for(let i = 0; i < listContact.length; i++){
          //   for(let i2 = 0; i2 < listContact[i].contatos.length; i++)
          //   {
          //     if (listContact[i].contatos[i2].id === item.id) {
          //       alert("Teste")
          //       listContact[i].contatos[i2].item.favorito = true;
          //     }
              
          //   }
          // }

          // for(let i = 0; i < listFilter.length; i++){
          //   for(let i2 = 0; i2 < listFilter[i].contatos.length; i++){
          //     if (listFilter[i].contatos[i2].id === item.id) listFilter[i].contatos[i2].item.favorito = true;
          //   }
          // }
        })
        .catch(function (error) {      
          setLoading("")
          setMessage("Não foi possível coloar o contato como favorito ("+ item.id +")! ("+ error.response.status +")")
          return      
        })
        ///
        ///End - POST Favorite contact
        ///
      })
      .catch(function (error) {      
        setLoading("")
        setMessage("Não foi possível retirar o favorito do contato ("+ item.id +")! ("+ error.response.status +")")
        return      
      })
      ///
      ///End - DELETE Favorite contact
      ///
    }
    else{
      /////
      // Begin - POST Favorite contact
      ///// 
      let config = {
        maxBodyLength: Infinity,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${user.token}`
        }
      };

      setLoading("Colocando o contato como favorito, Aguarde...")

      var data = JSON.stringify(item)

      api.post(BASE_URL + "favorito/salvar", data, config)
      .then(function (response) {      
        setLoading("")
        setMessage("Contato como favorito com sucesso!")
        
        for(let i = 0; i < listContact.length; i++){
          for(let i2 = 0; i2 < listContact[i].contatos.length; i2++){
            if (listContact[i].contatos[i2].id === item.id) listContact[i].contatos[i2].favorito = true;
          }
        }

        for(let i = 0; i < listFilter.length; i++){
          for(let i2 = 0; i2 < listFilter[i].contatos.length; i2++){
            if (listFilter[i].contatos[i2].id === item.id) listFilter[i].contatos[i2].favorito = true;
          }
        }
      })
      .catch(function (error) {      
        setLoading("")
        setMessage("Não foi possível coloar o contato como favorito ("+ item.id +")! ("+ error.response.status +")")
        return      
      })
      /////
      // End - POST Favorite contact
      /////
    }
  }

  const callNoFavorite = (item) => {
    /////
    // Begin - DELETE Favorite contact
    ///// 
    let config = {
      maxBodyLength: Infinity,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${user.token}`
      }
    };

    setLoading("Retirando o favorito da contato, Aguarde...")

    api.delete(BASE_URL + "favorito/remover/"+ item.id, config)
    .then(function (response) {          
      setLoading("")
      setMessage("Favorito retirado do contato com sucesso!")

      for(let i = 0; i < listContact.length; i++){
        for(let i2 = 0; i2 < listContact[i].contatos.length; i2++){
          if (listContact[i].contatos[i2].id === item.id) listContact[i].contatos[i2].favorito = false;
        }
      }

      for(let i = 0; i < listFilter.length; i++){
        for(let i2 = 0; i2 < listFilter[i].contatos.length; i2++){
          if (listFilter[i].contatos[i2].id === item.id) listFilter[i].contatos[i2].favorito = false;
        }
      }
    })
    .catch(function (error) {      
      setLoading("")
      setMessage("Não foi possível retirar o favorito do contato ("+ item.id +")! ("+ error.response.status +")")
      return      
    })
    /////
    // End - DELETE Favorite contact
    /////
  }

  const containerCapa = (capa) => {
    return (
      <div key={"capa"+ capa.id} className="capa_Home">
        <div className="capaClient_Home">
          <img src={capa.path_photo} alt="Sem Foto" className="capaPhotoClient_Home"/>
          <div className="capaNameClient_Home">
            <label className="capaNameClient_Home">{capa.nome}</label>
          </div>
        </div>
        
        { capa.contatos.map(item => (
            containerItem(item) 
          ))
        }
      </div>
    )
  }

  const containerItem = (item) => {
    return (    
      <div key={"item"+ item.id}>
        { (width >= 660) ?
            <div className="itemGreater500_Home">
              <div className="type_Home" onClick={item.favorito ? (() => callNoFavorite(item)) : (() => callFavorite(item)) }>
                <label> { item.favorito ? <img src={image_star} alt="Favorito" /> : <img src={image_nostar} alt="Sem Favorito" />  }</label>
              </div>
              <div className="type_Home">
                <label>{item.tipoContato}</label>
              </div>
              <div className="type_Home">
                <label>{item.tipoContato}</label>
              </div>
              <div className="contact_Home">
                <label>                                    
                  { ((item.tipoContato === "CELULAR") || (item.tipoContato === "TELEFONE")) ? item.telefone : item.email }
                </label>
              </div>
            </div>
          :
            <div className="itemLess500_Home">
              <div className="itemColumn1_Home">
                <div className="type_Home">
                  <label> { item.favorito ? <img src={image_star} alt="Favorito" /> : <img src={image_nostar} alt="Sem Favorito" />  }</label>
                </div>                

                <div className="type_Home">
                  <label>{item.tag}</label>
                </div>                
                <div className="contact_Home marginLeft10_Home">
                  <label>{item.tipoContato}</label>
                </div>               
                <div className="contact_Home marginLeft10_Home">
                    { ((item.tipoContato === "CELULAR") || (item.tipoContato === "TELEFONE")) ? item.telefone : item.email }
                </div>
              </div>
            </div>
        }
      </div>
    )
  }

  const selectedField = (event) => {
  }

  return(
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, minHeigth: height}}>
      {/* Begin Header */}
      <div id="header_Home">
        <Header title="Home" user={user} showMenu={true} setTypeUser={setTypeUser} logoff={logoff} />
      </div>
      {/* End Header */}

      { loading ?
          <>
            <div className="containerLoading_Home">
              <img src={image_loading} alt="Carregando..." />
              <label>{loading}</label>
            </div>                   
          </>
        :
          <>
            {/* Begin Body */}
            <div id="containerBody_Home">
              <div id="itens_SearchPerson">
                <div id="filter_Home">
                  <Input
                    type="text"
                    name="filter_SearchPerson"
                    description="Filtro:"
                    planceHolder={""}
                    value={filter || ""}
                    maxLength={80}
                    disabled={false}
                    require={false}
                    image={false}
                    typeImage={0}
                    onSelect={selectedField}
                    onChange={(event) => setFilter(event.target.value)} />
                </div>

                { listFilter.length > 0 && 
                  <>
                    { listFilter.map(item => (
                        containerCapa(item) 
                      ))
                    }
                  </>
                }

                { listFilter.length === 0 && 
                  <div id="containerNoRegistry_Home">
                    <label>
                      { filter !== "" ? "Nenhuma pessoa encontrada com o filtro digitado \""+ filter +"\"!" : "Nenhuma pessoa encontrada!" }
                    </label>
                  </div>
                }
              </div>

              { message && 
                <div className="containerMessage_Home marginBottom10_Home">
                  <label>{message}</label>
                </div> 
              }
            </div>
            {/* End Body */}

            {/* Begin Footer */}
            <div id="footer_Home">
              <Footer />
            </div>
            {/* End Footer */}
          </>
      }
    </div>
  )
}

export default Home