import ReactDOM from 'react-dom/client'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import Login from './view/Login.jsx'
import Register from './view/Register.jsx'
import PwdManager from "./view/PwdManager.jsx";
import {Welcome} from "./view/Welcome.jsx";


const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: '/',
        element: <Welcome/>
    },
    {
        path: '/pwd',
        element: <PwdManager/>
    }
])


ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <RouterProvider router={router}/></>
)
