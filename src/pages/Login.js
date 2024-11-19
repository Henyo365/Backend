import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Login() {

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);  // Nuevo estado para manejar el botón de carga
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;

        if (!email || !password) {
            return handleError('Email and password are required');
        }

        setIsLoading(true);  // Activamos el estado de carga para deshabilitar el botón

        try {
            const url = "https://frotned-production.up.railway.app/auth/login";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error, email } = result;

            setIsLoading(false);  // Terminamos el proceso de carga

            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                localStorage.setItem('loggedInEmail', email);
                setTimeout(() => {
                    navigate('/home');
                }, 1000);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }

            console.log(result);
        } catch (err) {
            setIsLoading(false);  // En caso de error, también deshabilitamos la carga
            handleError(err);
        }
    };

    return (
        <div className='container'>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={loginInfo.email}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={loginInfo.password}
                    />
                </div>
                <button
                    type='submit'
                    disabled={isLoading}  // Deshabilitamos el botón cuando está cargando
                    style={{
                        backgroundColor: isLoading ? '#ccc' : '#007bff',  // Cambia el color cuando está cargando
                        cursor: isLoading ? 'not-allowed' : 'pointer'  // Cambia el cursor cuando está cargando
                    }}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
                <span>Doesn't have an account? 
                    <Link to="/signup">Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;
