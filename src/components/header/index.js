import "./style.css"
import React from "react"
import { useNavigate } from "react-router-dom"
import image_logo from "../../assets/images/logo.png"

const Header = ({title, subTitle, user, showMenu, setTypeUser, logoff}) => {  
  const callHome = () => {
    navigate("/");
  }

  const callMyData = () => {
    setTypeUser(1)
    navigate("/user/"+ user.id);
  }

  const callPeople = () => {    
    navigate("/person");
  }

  const callUsers = () => {    
    if (user.typeuser !== 1){
      alert("Você não tem permissão para acessar o cadastro de usuários!");
      return
    }

    navigate("/user");
  }

  const navigate = useNavigate()

  return(
    <div id="Header">
      <div id="containerHeader_Header">
        <div id="vazioHeader_Header">
          <label>{" "}</label>
        </div>        
        <div id="containerDescricao">
          { title && subTitle &&
            <>
              <label className="titleBlack_Header">{title}</label>
              <label className="titleRed_Header">{subTitle}</label>
            </>
          }
          { title && !subTitle &&
            <label className="titleRed_Header">{title}</label>
          }
        </div>
        <div id="containerLogo_Header">
          <img src={image_logo} alt="logo" />
        </div>
      </div>
    
      { showMenu &&
        <div id="containerMenu_Header">
          <div className="menu_Header" onClick={() => callHome()}>
            <label className="title_Menu">Home</label>
          </div>
          <div className="menu_Header" onClick={() => callMyData()}>
            <label className="title_Menu">Meus Dados</label>
          </div>
          <div className="menu_Header" onClick={() => callUsers()}>
            <label className="title_Menu">Usuários</label>
          </div>
          <div className="menu_Header" onClick={() => callPeople()}>
            <label className="title_Menu">Pessoas</label>
          </div>
          <div className="menu_Header" onClick={() => logoff()}>
            <label className="title_Menu">Sair</label>
          </div>
        </div>
      }

      { !showMenu && <div id="endBarRed_Header" /> }

      <div id="endBarBlack_Header" />
    </div>
  )
}

export default Header