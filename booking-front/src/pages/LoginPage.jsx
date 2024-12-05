import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUser } = useContext(UserContext);

    async function handleLoginSubmit(ev) {
        ev.preventDefault();
        try {
            const response = await axios.post('/login', { email, password });

            if (response.data && response.data.user) {
                console.log("User from response:", response.data.user);
                setUser(response.data.user);
                alert(response.data.message);

                const token = response.data.token;
                console.log(token);
                localStorage.setItem('token', token);

                setRedirect(true);
            }
        } catch (e) {
            alert(e.response?.data?.error || e.message || 'Login failed');
        }
    }
    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                <form onSubmit={handleLoginSubmit} className="max-w-md mx-auto">
                    <input
                        value={email}
                        onChange={ev => setEmail(ev.target.value)}
                        type="email"
                        placeholder="your@email.com"
                    />
                    <input
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                        type="password"
                        placeholder="password"
                    />
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">Don't have an account yet?
                        <Link className="underline text-black" to={'/register'}> Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
