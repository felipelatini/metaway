import "./style.css"
import React, { useState, useEffect } from "react"
import axios from "axios"

const api = axios.create({
  baseURL: "https://localhost:5001/api/",
  headers: {                
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json;charset=utf-8"
  }
})

const menu = ({jsonLogin, logoff}) => {
  return(
    <div>        
    </div>
  )
}

export default menu