import { useState } from "react";
import { Router, useNavigate } from "react-router-dom"
import api from "../api"
import "./login.css"

function LoginForm() {
    const [ formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("sub work");
    setMessage('Вход');

    try {
        const res = await api.post("v1/auth/login", formData);

        setMessage("good");

        if (res.data.token) {
            localStorage.setItem("token", res.data.token);
        }

        navigate("/home");
    } catch (error) {
        if (error.response) {
        setMessage('error: ${error.response.data.message}');
    }
    }

}
return(
    <div className="registration">
        <h1>Вход</h1>
        <form onSubmit={handleSubmit} className="registrationField">
            <input type="email" name="email" onChange={handleChange} value={formData.email} />
            <input type="password" name="password" onChange={handleChange} value={formData.password} />
            <button type="submit">Войти</button>
            </form>
        <button id="noAcc">Нет аккаунта?</button>
    </div>
)
}
export default LoginForm;
