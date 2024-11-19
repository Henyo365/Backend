import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    
    if (!name || !email || !password) {
      return handleError('Name, email, and password are required');
    }
    
    setIsSubmitting(true); // Bloquea el botón mientras se envía la solicitud
    
    try {
      const url = 'https://frotned-production.up.railway.app/auth/signup';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      const { success, message, error, jwtToken, name: userName, email: userEmail } = result;

      if (success) {
        handleSuccess(message);
        
        // Guardar token e información del usuario
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', userName);
        localStorage.setItem('loggedInEmail', userEmail);

        // Redirigir automáticamente después del registro
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message);
    } finally {
      setIsSubmitting(false); // Restablece el botón al finalizar
    }
  };

  return (
    <div className="container">
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            autoFocus
            placeholder="Enter your name..."
            value={signupInfo.name}
          />
        </div>
        
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            placeholder="Enter your email..."
            value={signupInfo.email}
          />
        </div>
        
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your password..."
            value={signupInfo.password}
          />
        </div>

        {/* Bloquear el botón si isSubmitting es true */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#ccc' : '#007bff',  // Cambia el color a gris cuando está enviando
            cursor: isSubmitting ? 'not-allowed' : 'pointer',  // Cambia el cursor cuando está deshabilitado
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Signup'}
        </button>

        <span>
          Already have an account?
          <Link to="/login">Login</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Signup;

