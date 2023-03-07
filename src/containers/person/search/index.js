import "./style.css"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../../utils/requests"
import Input from "../../../components/input"
import Footer from "../../../components/footer"
import Header from "../../../components/header"
import image_select from "../../../assets/images/buttons/select.png"
import image_delete from "../../../assets/images/buttons/delete.png"

const api = axios.create()

const SearchPerson = ({setTypeUser, user, setReturn, width, height, logoff}) => {
  const [listPerson, setListPerson] = useState([])

  const [listFilter, setListFilter] = useState([])
  const [filter, setFilter] = useState("")
  const [firstAcess, setFirstAcess] = useState(true)

  useEffect(() => {
    if (firstAcess){
      /////
      // Begin - GET People
      /////
      let config = {
        maxBodyLength: Infinity,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${user.token}`
        }
      };

      var data = JSON.stringify({
        "nome": ""
      });    

      api.post(BASE_URL + "pessoa/pesquisar", data, config)
      .then(function (response){
        setListPerson([])

        let list = []
        response.data &&
          response.data.map(item => (
            list.push(item)
        ))

        setListPerson(list)
        setListFilter(list)
      })
      .catch(function (error) {      
        if (error.response.status === 401){
          alert("Não foi possível pesquisar as pessoas com os dados fornecidos! ("+ error.response.status +")")
          setReturn()
          return
        }
        else{
          alert("Não foi possível pesquisar as pessoas!!! ("+ error.response.status +")")
          setReturn()
          return
        }
      })
      /////
      // End - GET Data People
      /////
      
      setFirstAcess(false)
    }

    if (filter !== ""){
      let lstFilter = []
      { listPerson.map(item => (
          item.nome.toUpperCase().includes(filter.toUpperCase()) && lstFilter.push(item)
        ))
      }
      setListFilter(lstFilter)
    }
    else setListFilter(listPerson)

    document.getElementById("filter_SearchPerson") && document.getElementById("filter_SearchPerson").focus()
  }, [filter])

  const callNewPerson = () => {
    navigate("/person/0");
  }

  const deletePerson = (person) => {
    let config = {
      maxBodyLength: Infinity,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${user.token}`
      }
    };

    api.delete(BASE_URL + "pessoa/remover/"+ person.id, config)
    .then(function (response) {
      let list = []
      listPerson &&
        listPerson.map(item => (
          (item.id !== person.id) && list.push(item)          
      ))      
      setListPerson(list)
    })
    .catch(function (error) {      
      alert("Não foi possível excluir a pessoa! ("+ error.response.status +")")
    })
  }

  const containerItem = (item) => {
    return (
      <div key={"item"+ item.id}>
        { (width >= 500) ?
            <div className="itemGreater500_SearchPerson">
              <div className="cpf_SearchPerson">
                <label>{item.cpf}</label>
              </div>
              <div className="name_SearchPerson">
                <label>{item.nome}</label>
              </div>
              <div className="buttonItem_SearchPerson" onClick={() => selectPerson(item)}>
                <img className="buttonItemSelect_SearchPerson" src={image_select} alt="Selecionar" />
              </div>
              <div className="buttonItem_SearchPerson" onClick={() => deletePerson(item)}>
                <img className="buttonItemDelete_SearchPerson" src={image_delete} alt="Excluir" />
              </div>
            </div>
          :
            <div className="itemLess500_SearchPerson">
              <div className="itemColumn1_SearchPerson">
                <div className="cpf_SearchPerson">
                  <label>{item.cpf}</label>
                </div>
                <div className="name_SearchPerson marginLeft10_SearchPerson">
                  <label>{item.nome}</label>
                </div>
              </div>
              <div className="itemRow1_SearchPerson marginTop10_SearchPerson">
                <div className="buttonItem_SearchPerson" onClick={() => selectPerson(item)}>
                  <img className="buttonItemSelect_SearchPerson" src={image_select} alt="Selecionar" />
                </div>
                <div className="buttonItem_SearchPerson" onClick={() => deletePerson(item)}>
                  <img className="buttonItemDelete_SearchPerson" src={image_delete} alt="Excluir" />
                </div>
              </div>
            </div>
        }
      </div>
    )
  }

  const navigate = useNavigate()

  const selectedField = (event) => {
  }

  const selectPerson = (person) => {
    navigate("/person/"+ person.id);    
  }

  return(
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, minHeight: height}}>
      {/* Begin Header */}
      <div id="header_Person">
        <Header title="Lista" subTitle="Pessoas" user={user} showMenu={true} setTypeUser={setTypeUser} logoff={logoff}/>
      </div>
      {/* End Header */}

      {/* Begin Body */}
      <div id="containerBody_SearchPerson">
        <div id="itens_SearchPerson">
          <div>
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
              <div id={(width >= 500) ? "titlesRow_SearchPerson" :  "titlesColumn_SearchPerson"}  >
                <div id="cpfTitle_SearchPerson">
                  <label id="textTitle_SearchPerson">CPF</label>
                </div>
                <div className={(width >= 500) ? "nameTitle_SearchPerson" : "nameTitle_SearchPerson marginLeft10_SearchPerson"}>
                  <label id="textTitle_SearchPerson">Nome</label>
                </div>
              </div>

              { listFilter.map(item => (
                  containerItem(item) 
                ))
              }
            </>
          }

          { listFilter.length === 0 && 
            <div id="containerNoRegistry_SearchPerson">
              <label>
                { filter !== "" ? "Nenhuma pessoa encontrada com o filtro digitado \""+ filter +"\"!" : "Nenhuma pessoa encontrada!" }
              </label>
            </div>
          }
        </div>

        <div id={(width >= 500) ? "buttonsRow_SearchPerson" : "buttonsColumn_SearchPerson"}>
          <div className="containerButton_SearchPerson">
            <div id="buttonNew_SearchPerson" onClick={() => callNewPerson()}>
              <label>Novo</label>
            </div>
          </div>
          <div className="containerButton_SearchPerson">
            <div id="buttonReturn_SearchPerson" onClick={() => setReturn()}>
              <label>Retornar</label>
            </div>
          </div>
        </div>              
      </div>
      {/* End Body */}

      {/* Begin Footer */}
      <div id="footer_SearchPerson">
        <Footer />
      </div>
      {/* End Footer */}
    </div>
  )
}

export default SearchPerson