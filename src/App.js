import "./style.css"
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import Contact from './containers/contact';
import Home from './containers/home';
import Login from './containers/login';
import MyData from './containers/myData';
import Person from './containers/person';
import RememberPassword from './containers/rememberPassword';
import SearchPerson from './containers/person/search';
import SearchUser from './containers/user/search';
import User from './containers/user';

const App = () => {
  const [typeUser, setTypeUser] = useState(0)

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState({})

  const [showLogin, setShowLogin] = useState(true)

  useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const logon = (user) => {    
    navigate("/")

    setUser(user)
    setAuthenticated(true)       
  }

  const logoff = () => {
    setUser({})    
    setAuthenticated(false)
    setShowLogin(true)
  }

  const returnLogin = () => {
    setShowLogin(true)
  }

  const returnUser = () => {
    navigate("/user");
  }

  const navigate = useNavigate()

  return (
    <div style={{display: "flex", flexDirection: "column", flexGrow: 1, boxSizing: "border-box", minHeight: height}} >
      { !authenticated &&
        <>
          { showLogin ?
              <Login setTypeUser={setTypeUser} setShowLogin={setShowLogin} logon={logon} />
            :
              <Routes>
                <Route path="user/:code" element={<User setTypeUser={setTypeUser} typeUser={typeUser} user={user} setReturn={() => returnLogin("/")} setReturnUser={() => returnUser()} logon={logon} width={width} height={height} logoff={logoff} />} />
                <Route path="rememberPassword/" element={<RememberPassword setTypeUser={setTypeUser} user={user} width={width} setReturn={() => returnLogin()} logoff={logoff} />} />
              </Routes>
          }
        </>
      } 

      { authenticated &&
        <>
          <Routes>
            <Route path="/" element={<Home setTypeUser={setTypeUser} user={user} width={width} height={height} logoff={logoff} />} />
            <Route path="*" element={<Home setTypeUser={setTypeUser} user={user} width={width} height={height} logoff={logoff} />} /> 

            <Route path="myData" element={<MyData modeSearch={false} setTypeUser={setTypeUser} user={user} width={width} height={height} setReturn={() => navigate("/")} logoff={logoff} />} />

            <Route path="person" element={<SearchPerson setTypeUser={setTypeUser} user={user} width={width} height={height} setReturn={() => navigate("/")} logoff={logoff} />} />
            <Route path="person/:code" element={<Person setTypeUser={setTypeUser} user={user} width={width} height={height} setReturn={() => navigate("/person")} logoff={logoff} />} />

            <Route path="user/" element={<SearchUser setTypeUser={setTypeUser} typeUser={typeUser} user={user} setReturn={() => navigate("/")} width={width} height={height} logoff={logoff} />} />
            <Route path="user/:code" element={<User typeUser={typeUser} user={user} width={width} height={height} setReturn={() => navigate("/")} setReturnUser={() => returnUser()} logoff={logoff} />} />
          </Routes>
        </>
      }
    </div>
  );
}

export default App;