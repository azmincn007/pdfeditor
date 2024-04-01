
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Landing from "./Landing";
import Signup from './authentication/Signup';
import LoginPage from './authentication/LoginPage';
import { createContext, useState } from 'react';

const LoginContext=createContext()
const NameContext=createContext()



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
 
  return (
  
  <div>
    <NameContext.Provider value={[userName,setUserName]}>
    <LoginContext.Provider value={[isLoggedIn,setIsLoggedIn]}>
    <BrowserRouter>
   <Routes>
    <Route path='/' element={<Landing/>}></Route>
    <Route path='/signup' element={<Signup/>}></Route>
    <Route path='/login' element={<LoginPage/>}></Route>
    
   </Routes></BrowserRouter>
    </LoginContext.Provider>
    </NameContext.Provider>
   
  
  </div>
  );
}

export default App;
export{LoginContext,NameContext}
