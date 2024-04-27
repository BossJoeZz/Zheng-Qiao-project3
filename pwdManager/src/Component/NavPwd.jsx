import {Button, Dropdown, Space, Avatar} from 'antd';
import axios from 'axios';
import {useNavigate} from 'react-router';


const NavPwd = () => {

    const navigate = useNavigate()
    const handleLogout = async () => {
        await axios.get('/logout');
        navigate('/');
    };


    const items = [
        {
            label: (
                <Button onClick={handleLogout}>Logout</Button>
            ),
            key: '0',
        },
    ];

    return (
        <div className="navbar">
            <h1>Password Management Page </h1>
            <nav>
                <Dropdown
                    menu={{
                        items,
                    }}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space size={16} wrap>
                            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                        </Space>
                    </a>
                </Dropdown>
            </nav>
        </div>
    );
}

export default NavPwd
