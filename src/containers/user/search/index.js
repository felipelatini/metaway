import "./style.css"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../../utils/requests"
import Input from "../../../components/input"
import Footer from "../../../components/footer"
import Header from "../../../components/header"
import image_select from "../../../assets/images/buttons/select.png"

const api = axios.create()

const SearchUser = ({setTypeUser, user, setReturn, width, height, logoff}) => {
  const [listUser, setListUser] = useState([])

  const [listFilter, setListFilter] = useState([])
  const [filter, setFilter] = useState("")
  const [firstAcess, setFirstAcess] = useState(true)

  useEffect(() => {
    if (firstAcess){    
      /////
      // Begin - GET Users
      /////
      let response = {ok: false, error: ""}
  
      let config = {
        maxBodyLength: Infinity,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${user.token}`
        }
      };

      var data = JSON.stringify({
        "termo": ""
      });    

      api.post(BASE_URL + "usuario/pesquisar", data, config)
      .then(function (response) {      
        response.ok = true
        response.error = ""

        setListUser([])

        let list = []
        response.data &&
          response.data.map(item => (
            list.push(item)
        ))

        setListUser(list)
        setListFilter(list)
      })
      .catch(function (error) {      
        if (error.response.status === 401){
          response.ok = false
          response.error = "Não foi possível pesquisar os usuários com os dados fornecidos!"

          alert(response.error)
          setReturn()
          return
        }
        else if ((error.response.status === 403) || (error.response.status === 404)){
          response.ok = false
          response.error = "Não foi possível pesquisar os usuário!!!"

          alert(response.error)
          setReturn()
          return
        }
      })
      /////
      // End - GET Data User
      /////

      setFirstAcess(false)
    }

    if (filter !== ""){
      let lstFilter = []
      { listUser.map(item => (
          item.nome.toUpperCase().includes(filter.toUpperCase()) && lstFilter.push(item)
        ))
      }
      setListFilter(lstFilter)  
    }
    else setListFilter(listUser)

    document.getElementById("filter_SearchUser") && document.getElementById("filter_SearchUser").focus()    
  }, [filter])

  const containerItem = (item) => {
    return (
      <>
        { (width >= 500) ?
            <div key={item.id} className="itemGreater500_SearchUser">
              <div className="cpf_SearchUser">
                <label>{item.cpf}</label>
              </div>
              <div className="name_SearchUser">
                <label>{item.nome}</label>
              </div>
              <div className="buttonItem_SearchUser" onClick={() => selectUser(item)}>
                <img src={image_select} alt="Selecionar" />
              </div>
            </div>
          :
            <div key={item.id} className="itemLess500_SearchUser">
              <div className="itemColumn1_SearchUser">
                <div className="cpf_SearchUser">
                  <label>{item.cpf}</label>
                </div>
                <div className="name_SearchUser marginLeft10_SearchUser">
                  <label>{item.nome}</label>
                </div>
              </div>
              <div className="itemColumn0_SearchUser">
                <div className="buttonItem_SearchUser" onClick={() => selectUser(item)}>
                  <img src={image_select} alt="Selecionar" />
                </div>
              </div>
            </div>
        }
      </>
    )
  }

  const navigate = useNavigate()

  const selectUser = (user) => {
    setTypeUser(2)
    navigate("/user/"+ user.id);    
  }

  const selectedField = (event) => {    
  }

  return(
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, minHeight: height}}>
      {/* Begin Header */}
      <div id="header_SearchUser">
        <Header title="Lista" subTitle="Usuários" user={user} showMenu={false} setTypeUser={setTypeUser} logoff={logoff} />
      </div>
      {/* End Header */}

      {/* Begin Body */}
      <div id="containerBody_SearchUser">
        <div id="itens_SearchUser">
          <div>
            <Input
              type="text"
              name="filter_SearchUser"
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
              <div id={(width >= 500) ? "titlesRow_SearchUser" : "titlesColumn_SearchUser"}>
                <div id="cpfTitle_SearchUser">
                  <label id="textTitle_SearchUser">CPF</label>
                </div>
                <div className={(width >= 500) ? "nameTitle_SearchUser" : "nameTitle_SearchUser marginLeft10_SearchUser"}>
                  <label id="textTitle_SearchUser">Nome</label>
                </div>
              </div>

              { listFilter.map(item => (
                  containerItem(item) 
                ))
              }            
            </>
          }

          { listFilter.length === 0 && 
            <div id="containerNoRegistry_SearchUser">
              <label>
                { filter !== "" ? "Nenhum usuário encontrado com o filtro digitado \""+ filter +"\"!" : "Nenhum usuário encontrado!" }
              </label>
            </div>
          }
        </div>

        <div id="buttons_SearchUser">
          <div id="button_SearchUser" onClick={() => setReturn()}>
            <label>Retornar</label>
          </div>
        </div>
      </div>
      {/* End Body */}

      {/* Begin Footer */}
      <div id="footer_SearchUser">
        <Footer />
      </div>
      {/* End Footer */}
    </div>
  )
}

export default SearchUser