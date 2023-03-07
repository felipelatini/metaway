import "./style.css"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { BASE_URL } from "../../../utils/requests"
import Header from "../../../components/header"
import image_select from "../../../assets/images/buttons/select.png"
import image_delete from "../../../assets/images/buttons/delete.png"
import image_loading from "../../../assets/images/loading.gif"
import Contact from ".."

const api = axios.create()

const SearchContact = ({user, person, width}) => {
  const [contact, setContact] = useState({})
  const [listContact, setListContact] = useState([])

  const [loading, setLoading] = useState("")
  const [message, setMessage] = useState("")

  const [showRegister, setShowRegister] = useState(false)
  const [update, setUpdate] = useState(0)

  useEffect(() => {
    /////
    // Begin - GET Contacts
    /////
    let config = {
      maxBodyLength: Infinity,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${user.token}`
      }
    };

    api.get(BASE_URL + "contato/listar/"+ person.id, config)
    .then(function (response) {      
      setListContact([])

      let list = []
      response.data &&
        response.data.map(item => (
          list.push(item)
      ))

      setListContact(list)
    })
    .catch(function (error) {      
      if (error.response.status === 401){
        setLoading("")
        setMessage("Não foi possível pesquisar os usuários com os dados fornecidos! ("+ error.response.status +")")
        return
      }
      else if ((error.response.status === 403) || (error.response.status === 404)){
        setLoading("")
        setMessage("Não foi possível pesquisar os usuário! ("+ error.response.status+")")
        return
      }
    })
    /////
    // End - GET Data Contacts
    /////    
  }, [update])

  const callNewContact = () => {
    setContact(JSON.parse("{\"id\": 0}"))
    setShowRegister(true)
  }

  const confirmContact = () => {
    setUpdate(update + 1)
    setShowRegister(false)
  }

  const deleteContact = (contact) => {
    let config = {
      maxBodyLength: Infinity,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${user.token}`
      }
    };

    api.delete(BASE_URL + "contato/remover/"+ contact.id, config)
    .then(function (response) {
      let list = []
      listContact &&
        listContact.map(item => (
          (item.id !== contact.id) && list.push(item)          
      ))      
      setListContact(list)
    })
    .catch(function (error) {      
      alert("Não foi possível excluir o contato! ("+ error.response.status +")")
    })
  }  

  const containerItem = (item) => {
    return (
      <div key={"item"+ item.id}>
        { (width >= 660) ?
            <div className="itemGreater500_SearchContact">
              <div className="type_SearchContact">
                <label>{item.tag}</label>
              </div>              
              <div className="type_SearchContact">
                <label>{item.tipoContato}</label>
              </div>
              <div className="contact_SearchContact">
                <label>                                    
                  { ((item.tipoContato === "CELULAR") || (item.tipoContato === "TELEFONE")) ? item.telefone : item.email }
                </label>
              </div>
              <div className="buttonItem_SearchContact" onClick={() => selectContact(item)}>
                <img className="buttonItemSelect_SearchContact" src={image_select} alt="Selecionar" />
              </div>
              <div className="buttonItem_SearchContact" onClick={() => deleteContact(item)}>
                <img className="buttonItemDelete_SearchContact" src={image_delete} alt="Excluir" />
              </div>
            </div>
          :
            <div className="itemLess500_SearchContact">
              <div className="itemColumn1_SearchContact">
                <div className="type_SearchContact">
                  <label>{item.tag}</label>
                </div>                
                <div className="contact_SearchContact marginLeft10_SearchContact">
                  <label>{item.tipoContato}</label>
                </div>               
                <div className="contact_SearchContact marginLeft10_SearchContact">
                    { ((item.tipoContato === "CELULAR") || (item.tipoContato === "TELEFONE")) ? item.telefone : item.email }
                </div>
              </div>
              <div className="itemRow1_SearchContact marginTop10_SearchContact">
                <div className="buttonItem_SearchContact" onClick={() => selectContact(item)}>
                  <img className="buttonItemSelect_SearchContact" src={image_select} alt="Selecionar" />
                </div>
                <div className="buttonItem_SearchContact" onClick={() => deleteContact(item)}>
                  <img className="buttonItemDelete_SearchContact" src={image_delete} alt="Excluir" />
                </div>
              </div>
            </div>
        }
      </div>
    )
  }

  const returnSeachContact = () => {
    setContact({})
    setShowRegister(false)
  }

  const selectContact = (contact) => {
    setContact(contact)
    setShowRegister(true)
  }

  return(
    <div id="SearchContact">
      {/* Begin Header */}
      <div id="header_SearchContact">
        <Header title={(!showRegister) ? "Lista" : "Cadastro"} subTitle={(!showRegister) ? "Contatos" : "Contato"} />
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
            <div id="containerBody_SearchContact">
              { !showRegister &&
                <>
                  <div id={(width >= 660) ? "titlesRow_SearchContact" :  "titlesColumn_SearchContact"}  >
                    <div id="tagTitle_SearchContact">
                      <label id="tagTitle_SearchContact">Tag</label>
                    </div>
                    <div className={(width >= 660) ? "typeTitle_SearchContact marginTop10_SearchContact" : "typeTitle_SearchContact"}>
                      <label id="textTitle_SearchContact">Tipo</label>
                    </div>
                    <div className={(width >= 660) ? "contactTitle_SearchContact marginTop10_SearchContact" : "contactTitle_SearchContact marginLeft10_SearchContact"}>
                      <label id="textTitle_SearchContact">Contato</label>
                    </div>
                  </div>

                  <div id="itens_SearchContact">
                    { listContact.map(item => (
                        containerItem(item) 
                      ))
                    }
                  </div>

                  { message && 
                    <div className="containerMessage_SearchContact marginTop10_SearchContact">
                      <label>{message}</label>
                    </div> 
                  }

                  <div id={(width >= 500) ? "buttonsRow_SearchContact" : "buttonsColumn_SearchContact"}>
                    <div className="containerButton_SearchContact">
                      <div id="buttonNew_SearchContact" onClick={() => callNewContact()}>
                        <label>Novo</label>
                      </div>
                    </div>
                  </div>
                </>
              }

              { showRegister &&
                <Contact user={user} person={person} contact={contact} setConfirm={confirmContact} setReturn={returnSeachContact} width={width} />
              }
            </div>
            {/* End Body */}
          </>
      }
    </div>
  )
}

export default SearchContact