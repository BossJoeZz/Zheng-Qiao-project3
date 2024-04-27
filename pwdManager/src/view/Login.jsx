import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Form, Input, message } from 'antd';
import { Link } from "react-router-dom";
import Nav from "../Component/Nav.jsx";

function Login() {
    const navigate = useNavigate();
    const [usernameState, setUsernameState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    async function onSubmit() {
        try {
            await axios.post('/api/users/login', {
                username: usernameState,
                password: passwordState,
            });
            navigate('/pwd');
        } catch (error) {
            message.error(error.response.data);
        }
    }

    function updatePassword(event) {
        setPasswordState(event.target.value);
    }
    function updateUsername(event) {
        setUsernameState(event.target.value);
    }
    return (
        <>
            <Nav />
            <div>
                <h1>Login Page</h1>
                <div>
                    <Form>
                        <Form.Item label="Username">
                            <Input value={usernameState} onChange={updateUsername} />
                        </Form.Item>
                        <Form.Item label="Password">
                            <Input.Password value={passwordState} onChange={updatePassword} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={onSubmit}>Submit</Button>
                        </Form.Item>
                    </Form>
                </div>
                <div>
                    <Button type="primary">
                        <Link to="/register">Register</Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

export default Login;
