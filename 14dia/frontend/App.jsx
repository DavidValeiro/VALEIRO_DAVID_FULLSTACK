import {useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/login.jsx';
import Register from './components/register.jsx';

function App() {
    const location = useLocation();

    if (localStorage.getItem('token')){
        if (location.pathname === '/login' || location.pathname === '/register') {
            window.location.href = '/';
        }
    }else {
        if (location.pathname !== '/login' && location.pathname !== '/register') {
            window.location.href = '/login';
        }
    }


    return (
        <>
                    <BrowserRouter>
                    <div>
                        <nav>
                            <ul>
                                <li><a href="/">Home</a></li>
                                <li><a href="/login">Login</a></li>
                                <li><a href="/register">Register</a></li>
                            </ul>
                        </nav>

                        <Routes>
                            <Route path="/" element={<h1>Welcome to the App</h1>} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Routes>
                    </div>
                    </BrowserRouter>
        </>
    );
}
