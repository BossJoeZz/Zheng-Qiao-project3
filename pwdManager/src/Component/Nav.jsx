import '../css/Nav.css'
import {Layout, Menu} from "antd";
import {useLocation, useNavigate} from "react-router";

const menuItems = [
    {label: "Home", key: "/"},
    {label: "Login", key: "/login"},
    {label: "Register", key: "/Register"},
];

const Nav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <Layout>
            <div className="demo-logo"/>
            <Menu
                theme="light"
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={(item) => {
                    navigate(item.key);
                }}
            />
        </Layout>
    );
    // return (
    //     <div className="navbar">
    //         <h1>Welcome </h1>
    //         <nav>
    //             <ul>
    //                 <li><a href="/">Home</a></li>
    //                 <li><a href="/login">Login</a></li>
    //                 <li><a href="/register">Register</a></li>
    //             </ul>
    //         </nav>
    //     </div>
    // );
}

export default Nav
