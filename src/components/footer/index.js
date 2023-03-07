import "./style.css"
import React from "react"
import axios from "axios"

const footer = ({jsonLogin, logoff}) => {
  return(
    <div style={{ boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "rgb(26, 26, 26)", height: 30 }}>
        <label style={{ color: "white", fontWeight: 600, fontSize: 12 }}>© 2023 Metaway, all rights reserved</label>
      </div> 
      <div style={{ backgroundColor: "rgb(172, 28, 7)", height: 5 }}></div>      
    </div>
  )
}

export default footer