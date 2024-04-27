import axios from 'axios';
import { useState } from 'react';
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router";
import Nav from "../Component/Nav.jsx";

function Register() {
    const [usernameState, setUsernameState] = useState('');
    const [passwordState, setPasswordState] = useState('');
    const [verifyPasswordState, setVerifyPasswordState] = useState('');
    const navigate = useNavigate();

    async function onSubmit() {
        // verify password
        if (verifyPasswordState !== passwordState) {
            message.error('Please verify passwords are the same :)');
            return;
        }
        try {
            await axios.post('/api/users/register', {
                username: usernameState,
                password: passwordState,
            });
            try {
                await axios.post('/api/users/login', {
                    username: usernameState,
                    password: passwordState,
                });
                navigate('/pwd');
            } catch (e) {
                console.log(e);
            }
            message.success('Registration successful!');
            setPasswordState('');
            setUsernameState('');
            setVerifyPasswordState('');
        } catch (error) {
            message.error(error.response.data);
        }
    }

    function updatePassword(event) {
        setPasswordState(event.target.value);
    }

    function updateVerifyPassword(event) {
        setVerifyPasswordState(event.target.value);
    }

    function updateUsername(event) {
        setUsernameState(event.target.value);
    }

    return (
        <div>
            <Nav />

            <h1>Register Page</h1>
            <Form>
                <Form.Item label="Username">
                    <Input value={usernameState} onChange={updateUsername} />
                </Form.Item>
                <Form.Item label="Password">
                    <Input.Password value={passwordState} onChange={updatePassword} />
                </Form.Item>
                <Form.Item label="Password">
                    <Input.Password value={verifyPasswordState} onChange={updateVerifyPassword} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={onSubmit}>Submit</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default Register;
