import { useEffect, useState } from 'react'
import { genericRequest } from '@/components/utility/request_helper'
import { useRouter } from 'next/router';
import { GOOGLE_LOGIN_KEY } from '@/components/utility/gLogin';
import Layout from '@/components/utility/layout';
import { motion } from "framer-motion";
import { Box } from '@mui/system';
import { Button, Divider, TextField } from '@mui/material';

export default function Login() {
    const [redirectUrl, setRedirectUrl] = useState("/conversations")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ passwordConfirm, setPasswordConfirm ] = useState("")
    const [ firstName, setFirstName ] = useState("")
    const [ lastName, setLastName ] = useState("")
    const [ displaySignup, setDisplaySignup ] = useState(false)
    const router = useRouter()
    
    const handleGoogle = (resp) => {
        var auth_data = {
            "token": resp.credential
        }

        genericRequest("/auth/google", "POST", JSON.stringify(auth_data), (data, status) => {
            if (status === 200) {
                router.push(redirectUrl)
            } else if (status === 401) {
                console.log("Failed")
            }
        }, { "Content-Type": "application/json" })
    }

    const handleSignin = () => {
        const data = {
            "email": email,
            "password": password
        }

        genericRequest("/login", "POST", JSON.stringify(data), (data, status) => {
            if (status === 200) {
                router.push(redirectUrl)
            } else if (status === 401) {
                // raise some kind of thing here
                console.log("failed")
            }
        }, { "Content-Type": "application/json" })
    }

    const handleSignup = () => {
        const data = {
            "email": email,
            "password": password,
            "first_name": firstName,
            "last_name": lastName,
            "role": "user"
        }

        genericRequest("/users", "POST", JSON.stringify(data), (data, status) => {
            if (status === 200) {
                router.push(redirectUrl)
            } else if (status === 401) {
                // raise some kind of thing here
                console.log("failed")
            }
        }, { "Content-Type": "application/json" })
    }

    useEffect(() => {
        if (window.google) {
            /* global google */
            google.accounts.id.initialize({
                client_id: GOOGLE_LOGIN_KEY,
                callback: handleGoogle,
            });

            google.accounts.id.renderButton(document.getElementById("gLogin"), {
                // type: "icon",
                theme: "outlined",
                size: "large",
                shape: "circle",
            });
        }

        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });

        let bot_code = params.bot_code
        if (bot_code !== null) {
            setRedirectUrl(`/bots?bot_code=${bot_code}`)
        }
    }, [handleGoogle])

    const signUpDisabled = () => {
        if ( firstName !== "" &&
            lastName !== "" &&
            email != "" &&
            password !== "" &&
            passwordConfirm !== "" &&
            password === passwordConfirm
        ) {
            return false
        }

        return true
    }

    const renderLogin = () => {
        return (
            <>
                <Box sx={{ width: "100%", flexWrap: "wrap", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <TextField value={email} onChange={(ev) => {setEmail(ev.target.value)}} label="E-Mail" sx={{width: "90%"}}></TextField>
                    <TextField value={password} onChange={(ev) => {setPassword(ev.target.value)}} label="Password" type="password" sx={{width: "90%", marginTop: "8px"}}></TextField>
                </Box>
                <Box sx={{width: "100%", flexWrap: "wrap", display: "flex", alignItems: "center", justifyContent: "Center"}}>
                    <Button onClick={() => {handleSignin()}} variant="contained" sx={{marginTop: "16px", width: "60%"}}>Sign-In</Button>
                    <Button variant="outlined" sx={{marginTop: "16px", width: "60%"}} onClick={() => {setDisplaySignup(true); setEmail(""); setPassword("")}}>Sign-Up</Button>
                </Box>
            </>
        )
    }

    const renderSignup = () => {
        return (
            <>
                <Box sx={{ width: "100%", flexWrap: "wrap", display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <TextField value={email} onChange={(ev) => {setEmail(ev.target.value)}} label="E-Mail" sx={{width: "90%"}}></TextField>
                    <TextField value={firstName} onChange={(ev) => {setFirstName(ev.target.value)}} label="First Name" sx={{width: "90%", marginTop: "8px"}}></TextField>
                    <TextField value={lastName} onChange={(ev) => {setLastName(ev.target.value)}} label="Last Name" sx={{width: "90%", marginTop: "8px"}}></TextField>
                    <TextField value={password} onChange={(ev) => {setPassword(ev.target.value)}} label="Password" type="password" sx={{width: "90%", marginTop: "8px"}}></TextField>
                    <TextField value={passwordConfirm} onChange={(ev) => {setPasswordConfirm(ev.target.value)}} label="Confirm Password" type="password" sx={{width: "90%", marginTop: "8px"}}></TextField>
                </Box>
                <Box sx={{width: "100%", flexWrap: "wrap", display: "flex", alignItems: "center", justifyContent: "Center"}}>
                    <Button disabled={signUpDisabled()} onClick={() => {handleSignup()}} variant="contained" sx={{marginTop: "16px", width: "60%"}}>Sign-Up</Button>
                    <Button onClick={() => {setDisplaySignup(false); setEmail(""); setPassword("")}} variant="outlined" sx={{marginTop: "16px", width: "60%"}}>Back to Sign-in</Button>
                </Box>
            </>
        )
    }


    return (
        <Layout>
            <Box style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Box style={{ width: "100%" }}>
                    <Box sx={{alignContent: "center", justifyContent: "center"}}>
                        <Box sx={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <img className="logo" alt="Glyph Logo" src={"/dark_vertical.png"} style={{ width: "50%", marginBottom: "8px" }} />
                        </Box>
                        {displaySignup ? renderSignup() : renderLogin()}
                        <Divider sx={{marginTop: "16px"}} variant="middle" >OR</Divider>
                        <div style={{ marginTop: "16px", width: "100%", display: "flex", justifyContent: "center" }} id="gLogin" />
                    </Box>
                </Box>
            </Box>
        </Layout>
    )
}