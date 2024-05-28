import './App.css';

import Form from './components/Form';
//import UserHome from './components/UserHome';
//import AdminHome from './components/AdminHome';
import {BrowserRouter, Routes, Route} from 'react-router-dom'; 
import { useState } from 'react';
import Admin from './components/Admin';
import Mesero from './components/mesero';
import Cocina from './components/cocina';

function App() {
  const [user, setUser] = useState(null);
  return (  
    <BrowserRouter>
     {/* <Navigation/> */ } 
     <Routes>
        <Route index element={<Form callback={setUser}/>}></Route>
        <Route path='/admin' element={<Admin user={user}/>}></Route>
        <Route path='/mesero' element={<Mesero user={user}/>}></Route>
        <Route path='/cocina' element={<Cocina user={user}/>}></Route>

      </Routes>
    </BrowserRouter>
  )
}


// function Navigation(){
//   return <nav>
//     <ul>
//       <li>
//         <Link to="/userHome">userHome</Link>
//       </li>
//       <li>
//         <Link to="/adminHome">adminHome</Link>
//       </li>
//     </ul>
//   </nav>
// }

export default App;
