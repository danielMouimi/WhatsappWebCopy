import { useState } from 'react';
import { useEffect } from 'react';


import Chat from './Chat';
import { Login } from './Login';


import { Routes, Route, BrowserRouter, Link } from "react-router-dom";





// import { auth } from './firebase';
// import { onAuthStateChanged } from 'firebase/auth';
import './index.css';


function App() {

  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //   });
  // },[])


  return (
    <>
    
      <BrowserRouter>

      {/* <div className='nav'>
        <Link to='/'>inicio</Link>


        {user ? (
          <>
            <p>Bienvenido, {user.displayName ? user.displayName:user.email.split('@')[0]}</p>
            <Link to='/login'>Cerrar Sesión</Link>
          </>
        ) : 
        <Link to='/login'>Login</Link>
        }

      </div> */}


        <Routes>

          <Route path='/' element={<Login/>}></Route>
          {/* <Route path='/login' element={<Login></Login>}/> */}
{/*           
          <Route element={<RutasPrivadas></RutasPrivadas>}>
              <Route path='/showPokemon' element={<ShowPokemon/>}></Route>
          </Route> */}


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
