import React,{ useContext, useState } from 'react'
import UserContext from '../context/userContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios'

function LogOutButton() {
    const { ready, user, setUser } = useContext(UserContext);
    const [redirect,setRedirect] = useState(null)
    async function logout(){
        await axios.post('/logout')
        setUser(null)
        setRedirect('/')
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'}/>;
    }
    if (!ready) {
        return "Loading....";
    }
    if(redirect){
        return <Navigate to={redirect}/>
    }
  return (
    <div className='text-center max-w-lg mx-auto'>
            Logged in as {user.name} ({user.email})<br/>
            <button onClick={logout} className='bg-black text-white rounded-2xl p-2 w-full max-w-sm mt-2 hover:bg-gray-500 transition hover:scale-105 hover:delay-50'>Logout</button>
        </div>
  )
}

export default LogOutButton