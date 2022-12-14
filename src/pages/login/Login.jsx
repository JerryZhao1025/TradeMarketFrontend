import React from 'react'
import { useState, useEffect } from "react";
import { Box, Grid, Paper, Avatar, TextField, Button, Typography, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../../redux/userRedux';
import { useDispatch } from 'react-redux';
import { BACKEDN_API } from '../../constant';


export default function Login({ handleChange }) {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    let navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();

        // 远帆之前的代码
        // axios.post(`${BACKEDN_API}/login`, {
        //     username: username,
        //     password: password
        // }).then(res => {
        //     const loginUser = res.data;
        //     dispatch(setUser(loginUser));
        //     localStorage.setItem('token', loginUser.accessToken);
        //     localStorage.setItem('userId', loginUser._id);
        //     localStorage.setItem('currentUser', loginUser.username);
        //     navigate("/")
        // }).catch(err => {
        //     window.alert(err.response.data)
        // })

        const data = {
            username: username,
            password: password,
        }

        // sign in 的 input data就是上面定义的data本身（username & password），此函数会被调用一次
        function signin (inputdata) { 
            const signinUrl = "/signin";
            return fetch(signinUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                // 给后端正儿八经的数据传输内容，放在httpRequest的body里
                body: JSON.stringify(inputdata),
            })
            // 老鸟注释：fetch的返回值本身是promise，但等promise到的时候(若无异常，call then，有异常 call catch)
            // 若走的是then，response将会包含后端给的返回值，which should include token
            .then(function(response) {
                if (response.status < 200 || response.status >= 300) {
                    throw Error("Fail to sign in");
                }
                return response.json();
            })
            .then((data) => {    
                // 注意：这个then之后的处理取决于后端返回的具体内容           
                const token = data['token'];
                if (token === undefined) {
                    throw Error("We don't get token");
                }
                // TODO: if it is valid, store the token from response to localstorage
                // TODO: need to solve the problem that localstoreage will bve removed wieh we redirect / navigate to new page
                localStorage.setItem('token', token);
                navigate("/");
            })
            .catch((err) => {
                console.log(err);
                window.alert('Sign in failed');
            });
        };

        signin(data) // promise 携带的参数是 response
    };

    const paperStyle = { padding: 20, height: '73vh', width: 300, margin: "30px auto" }
    const avatarStyle = { backgroundColor: '#1bbd7e' }
    const btnstyle = { margin: '8px 0' }
    return (
        <Grid>
            <Paper style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
                    <h2>Sign In</h2>
                </Grid>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 1 }}
                >
                    <TextField name='username' label='Username' placeholder='Enter username' fullWidth required value={username}
                            onChange={e => setUserName(e.target.value)} />
                    <TextField name='password' label='Password' placeholder='Enter password' type='password' fullWidth required value={password}
                            onChange={e => setPassword(e.target.value)}/>
                    <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Sign in</Button>
                    <Typography >
                        <Link href="tmp/TradeMarketFrontend/src/pages/login/Login#" >
                            Forgot password ?
                        </Link>
                    </Typography>
                    <Typography > Do you have an account ?
                        <Link component="button" onClick={() => navigate("/signup")} >
                            Sign Up
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Grid>
    )
}