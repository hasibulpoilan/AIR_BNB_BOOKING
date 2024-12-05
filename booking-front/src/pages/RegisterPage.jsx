import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function registerUser(ev){
        ev.preventDefault();
        
        axios.post('/register',{
            name,
            email,
            password,
        });
        alert('Registration successful. Now you can log in')
    }
    

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>

                <form className="max-w-md mx-auto" onSubmit={registerUser}>

                    <input
                        value={name}
                        onChange={ev => setName(ev.target.value)} type="text" placeholder="hasibul"
                    />
                    <input
                        onChange={ev => setEmail(ev.target.value)}
                        value={email}
                        type="email" placeholder="your@email.com"
                    />
                    <input
                        onChange={ev => setPassword(ev.target.value)}
                        value={password}
                        type="password" placeholder="password"
                    />

                    <button className="primary">Register</button>

                    <div className="text-center py-2 text-gray-500">Allready a member?
                        <Link className="underline text-black" to={'/login'}> Login</Link>
                    </div>

                </form>

            </div>
        </div>
    )
}