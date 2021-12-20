import React, { useRef, useState, useEffect } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { getuser } from '../config/Myservice'
export default function Login() {
    const user = useRef(null);
    const pass = useRef(null);
    const navigate = useNavigate();
    const [open, setOpen] = useState({ err: false, msg: "" })
    useEffect(() => {
        if (sessionStorage.getItem('user') != undefined) {
            sessionStorage.removeItem('user')
        }
    }, [])
    const validator = (event) => {
        event.preventDefault();
        setOpen({ err: false, msg: "" })
        getuser({ user: user.current.value, pass: pass.current.value }).then(res => {
            if (!res.data.err) {
                sessionStorage.setItem("user", JSON.stringify(res.data.user));
                setOpen({ err: true, msg: res.data.msg })
                setInterval(() => {
                    navigate('/post')
                }, 1000);
            }
            if (res.data.err) {
                setOpen(res.data)

            }
        })
    }
    return (
        <div className='bg ' >

            <Form className='f' onSubmit={validator} >
                {open.err &&
                    <Alert variant="info" onClose={() => setOpen({ msg: "", err: false })} dismissible>
                        <Alert.Heading>{open.msg}</Alert.Heading>
                    </Alert>

                }
                <h1 className='logo'>Instagram</h1>
                <Form.Floating className="my-3">
                    <Form.Control
                        type="text"
                        placeholder="paras72727"
                        ref={user}
                    />
                    <label>user Id</label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        ref={pass}
                    />
                    <label>Password</label>
                </Form.Floating>
                <Button className="bt" type="submit">
                    Log In
                </Button>
            </Form>
            <h6>Don't have account <Link to="/sign">sign up</Link></h6>

        </div>
    )
}
