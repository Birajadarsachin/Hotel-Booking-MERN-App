import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios"; 
import UserContext from "../context/userContext";

export default function LoginPage(){
    const [email,setEmail] = useState('')
    const [pass,setPass] = useState('')
    const [redirect,setRedirect] = useState(false)
    const {setUser} = useContext(UserContext)
    async function loginUser(e){
        e.preventDefault()
        try {
            const {data} = await axios.post('/login', {
                email,
                pass
            },{withCredentials:true});
            setUser(data)
            alert('Login successful');
            setRedirect(true)
            setEmail('')
            setPass('')
        } catch (error) {
            alert('Window Failed')
        }
    }
    if(redirect){
        return <Navigate to='/' />
    }
    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form className="max-w-md mx-auto" onSubmit={loginUser}>
                    <input type="email" placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}/>
                    <input type="password" placeholder="password" 
                    value={pass}
                    onChange={e => setPass(e.target.value)}/>
                    <button className="bg-black text-white rounded-2xl p-2 w-full">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account yet? <Link className="underline text-black hover:text-gray-700" to={'/register'}>Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}