import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; 

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    async function registerUser(e) {
        e.preventDefault();

        try {
            const response = await axios.put('/register', {
                name,
                email,
                pass
            });
            alert("Registeration Succesful Now you can login")
            setName('')
            setEmail('')
            setPass('')
            navigate('/login')
        } catch (error) {
            if (error.response) {
                navigate('/error', { state: { message: error.response.data.message } });
            } else {
                navigate('/error', { state: { message: 'An error occurred. Please try again.' } });
            }
        }
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text" placeholder="John Doe"
                        value={name}
                        onChange={e => setName(e.target.value)} />
                    <input type="email" placeholder="your@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="password"
                        value={pass}
                        onChange={e => setPass(e.target.value)} />
                    <button className="bg-black text-white rounded-2xl p-2 w-full">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Have an Account?
                        <Link className="underline text-black hover:text-gray-700" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
