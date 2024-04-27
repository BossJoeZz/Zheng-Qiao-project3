import {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from "react-router";
import {Button, Input, message, Modal, Checkbox, InputNumber, List, Switch} from 'antd';
import NavPwd from "../Component/NavPwd.jsx";
import CopyToClipboard from 'react-copy-to-clipboard';
import '../css/PwdManager.css'

function PwdManager() {
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [pwd, setPwd] = useState('');
    const [alphabetChecked, setAlphabetChecked] = useState(false);
    const [numeralsChecked, setNumeralsChecked] = useState(false);
    const [symbolsChecked, setSymbolsChecked] = useState(false);
    const [username, setUsername] = useState('');
    const [length, setLength] = useState(8);
    const [pwdList, setPwdList] = useState([]);
    const [pwdSharedList, setPwdSharedList] = useState([]);
    const [shareUser, setShareUser] = useState('')
    const [receiver, setReceiver] = useState('')
    const [receiverFlag, setReceiverFlag] = useState(false)
    const [editingState, setEditingState] = useState({
        isEditing: false, editingPwdId: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    //below are for antd
    const [pwdVisible, setPwdVisible] = useState({});
    const [pwdSharedVisible, setPwdSharedVisible] = useState({});
    const [copied, setCopied] = useState(false);
    const [receiverModalOpen, setReceiverModalOpen] = useState(false)
    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        message.success('pwd copyed!')
    };
    const showReceiverModal = () => {
        setReceiverModalOpen(true);
    };

    const handleCheckboxChange = (e) => {
        const {name, checked} = e.target;
        switch (name) {
            case 'alphabet':
                setAlphabetChecked(checked);
                break;
            case 'numerals':
                setNumeralsChecked(checked);
                break;
            case 'symbols':
                setSymbolsChecked(checked);
                break;
            default:
                break;
        }
    };

    const SharePwd = () => {
        setIsModalOpen(true);
    };
    const handleInputChange = (e) => {
        setShareUser(e.target.value);
    };
    const handleOk = async () => {
        setIsModalOpen(false);
        await axios.get('/api/users/share/' + shareUser);
        message.success("successfully send the share request")
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onCancel = () => {
        setUrl('');
        setPwd('');
        setAlphabetChecked(false);
        setNumeralsChecked(false);
        setSymbolsChecked(false);
        setLength(8)
        setEditingState({
            isEditing: false, editingPwdId: '',
        });
    }
    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };
    const handlepwdChange = (e) => {
        setPwd(e.target.value);
    };

    async function getPwdList() {
        const response = await axios.get('/api/pwd');
        setPwdList(response.data);
    }

    async function isLoggedIn() {
        try {
            await axios.get('/api/users/loggedIn').then(async (response) => {
                const username = response.data.username;
                const receiver = response.data.receiver
                if (receiver !== '') {
                    await setReceiverFlag(true)
                }
                const shareduser = (response.data.shared)
                const SharedElement = []
                const sharedElementPromises = shareduser.map(async sharedUser => {
                    const sharedUserResponse = await axios.get(`/api/pwd/${sharedUser}`);
                    SharedElement.push(sharedUserResponse.data);
                });
                await setReceiver(receiver);
                await Promise.all(sharedElementPromises);
                if (SharedElement.length > 0) {
                    setPwdSharedList(SharedElement[0])
                }
                await setUsername(username);
            })
        } catch (e) {
            navigate('/')
        }
    }

    const clearReceiver = async () => {
        await axios.get('/api/users/sharedel');
        setReceiverFlag(false)
    }
    const addShareReceiver = async (receiver) => {
        await axios.post('/api/users/shareadd/' + receiver).then(async (res) => {
            message.info(res.data)
            await clearReceiver()
            await isLoggedIn()
        })
    }
    async function deletePwd(pwdId) {
        await axios.delete('/api/pwd/' + pwdId);
        await getPwdList();
        message.success('delete success')
    }

    const handleLengthChange = (e) => {
        setLength(parseInt(e));
    };
    const handleSubmit = async () => {
        if (!url.trim()) {
            message.error('input url');
            return;
        }

        let generatedpwd = '';
        if (!pwd.trim()) {
            if (!(alphabetChecked || numeralsChecked || symbolsChecked)) {
                message.error('Please select at least one character type');
                return;
            }

            const characters = [];
            if (alphabetChecked) characters.push('abcdefghijklmnopqrstuvwxyz');
            if (numeralsChecked) characters.push('0123456789');
            if (symbolsChecked) characters.push('!@#$%^&*()-_=+[]{}|;:,.<>?');

            let selectedCharacters = '';
            characters.forEach((chars) => {
                selectedCharacters += chars;
                generatedpwd += chars[Math.floor(Math.random() * chars.length)];
            });

            for (let i = generatedpwd.length; i < length; i++) {
                generatedpwd += selectedCharacters[Math.floor(Math.random() * selectedCharacters.length)];
            }
        }

        try {
            if (editingState.isEditing) {
                await axios.put('/api/pwd/' + editingState.editingPwdId, {
                    url: url, pwd: pwd || generatedpwd,
                });
            } else {
                await axios.post('/api/pwd', {
                    url: url, pwd: pwd || generatedpwd,
                });
            }
            setUrl('');
            setPwd('');
            setEditingState({
                isEditing: false, editingPwdId: '',
            });
            getPwdList()
            message.success('success add pwd')
        } catch (error) {
            message.error('Password storage failed');
        }
    };

    const onStart = () => {
        isLoggedIn().then(() => {
            getPwdList()
        })
    }
    useEffect(() => {
        onStart();
    }, []);

    function setEditingPwd(url, pwd, _id) {
        setUrl(url)
        setPwd(pwd)
        setEditingState({
            isEditing: true, editingPwdId: _id
        });
    }

    const pwdListElement = pwdList.map(item => ({
        key: item._id,
        title: `url: ${item.url} - pwd: ${pwdVisible[item._id] ? item.pwd : '******'} - owner: ${item.owner}`,
        actions: [<Switch
            key={`switch-${item._id}`}
            checked={pwdVisible[item._id]}
            onChange={(checked) => setPwdVisible({...pwdVisible, [item._id]: checked})}
        />, <CopyToClipboard key={`copy-${item._id}`} text={item.pwd} onCopy={handleCopy}>
            <Button>Copy!</Button>
        </CopyToClipboard>, <Button key={`delete-${item._id}`} onClick={() => deletePwd(item._id)}>delete</Button>,
            <Button key={`edit-${item._id}`}
                    onClick={() => setEditingPwd(item.url, item.pwd, item._id)}>edit</Button>,],
    }));
    const pwdSharedListElement = pwdSharedList.map(item => ({
        key: item._id,
        title: `url: ${item.url} - pwd: ${pwdSharedVisible[item._id] ? item.pwd : '******'} - owner: ${item.owner}`,
        actions: [<Switch
            key={`switch-shared-${item._id}`}
            checked={pwdSharedVisible[item._id]}
            onChange={(checked) => setPwdSharedVisible({...pwdSharedVisible, [item._id]: checked})}
        />, <CopyToClipboard key={`copy-shared-${item._id}`} text={item.pwd} onCopy={handleCopy}>
            <Button>Copy!</Button>
        </CopyToClipboard>,],
    }));
    return (<div className="container">
        <div className="header">
            <NavPwd/>

            <div className="row">
                <div>
                    <h2>Welcome {username}!!</h2>
                </div>
                <div className="actions">
                    <div>
                        <Button type="primary" onClick={SharePwd}>Share</Button>
                        <Modal title="Share to User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <Input placeholder="Input the share user name" value={shareUser}
                                   onChange={handleInputChange}/>
                        </Modal>
                    </div>
                </div>
                <Modal title="" open={receiverModalOpen} onOk={() => {
                    addShareReceiver(receiver)
                    setReceiverModalOpen(false)
                }} onCancel={() => {
                    clearReceiver()
                    setReceiverModalOpen(false)
                }}>
                    <p>there is a sharing user,want to accept?</p>
                </Modal>
                {receiverFlag && <Button type="primary" danger onClick={showReceiverModal}>
                    New Message
                </Button>}
            </div>
        </div>

        <div className="form-container">
            <div className="form-group">
                <label>URL:</label>
                <Input type="text" value={url} onChange={handleUrlChange}/>
            </div>
            <div className="form-group">
                <label>PASSWORD:</label>
                <Input.Password value={pwd} onChange={handlepwdChange}/>
            </div>
            <div className="form-group-a">
                <div className="form-group-aa">
                    <div>
                        <label>Character:</label>
                    </div>
                    <Checkbox name="alphabet" checked={alphabetChecked}
                              onChange={handleCheckboxChange}>alphabet</Checkbox>
                    <Checkbox name="numerals" checked={numeralsChecked}
                              onChange={handleCheckboxChange}>numerals</Checkbox>
                    <Checkbox name="symbols" checked={symbolsChecked}
                              onChange={handleCheckboxChange}>symbols</Checkbox>
                </div>
                <div className="form-group-aa">
                    <label>Password Length:</label>
                    <InputNumber value={length} min={4} max={50} onChange={handleLengthChange}/>
                </div>
            </div>
            <div className="form-group">
                <Button onClick={handleSubmit}>Submit</Button>
                <Button onClick={() => onCancel()}>Clear</Button>
            </div>
        </div>


        <div className="password-list">
            <h2>Password List</h2>
            <List itemLayout="horizontal" dataSource={pwdListElement}
                  renderItem={item => (<List.Item actions={item.actions}>
                      <List.Item.Meta title={item.title}/>
                  </List.Item>)}/>
        </div>

        <div className="share-list">
            <h2>Share List</h2>
            <List itemLayout="horizontal" dataSource={pwdSharedListElement}
                  renderItem={item => (<List.Item actions={item.actions}>
                      <List.Item.Meta title={item.title}/>
                  </List.Item>)}/>
        </div>
    </div>);
}

export default PwdManager;


