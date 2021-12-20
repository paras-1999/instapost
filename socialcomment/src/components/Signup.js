import React, { useRef, useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { adduser } from '../config/Myservice'
const regForUser = RegExp(/^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/);
const regForPass = RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/);
const regForPhone = RegExp(/^[7-9][0-9]{9}$/);
export default function Signup() {
    const navigate = useNavigate()
    const user = useRef(null);
    const pass = useRef(null);
    const phone = useRef(null);
    const rpass = useRef(null);
    const [err, setErr] = useState({ msg: "", check: false })
    const validator = (event) => {
        event.preventDefault();
        setErr({ msg: "", check: false })
        if (!user.current.value || !regForUser.test(user.current.value)) {
            setErr({ msg: 'enter a Alpha-numeric ID (xyz123)', check: true })
        }
        else if (!phone.current.value || !regForPhone.test(phone.current.value)) {
            setErr({ msg: 'enter valid number', check: true })
        }
        else if (!pass.current.value || !regForPass.test(pass.current.value)) {
            setErr({ msg: '6-16 Digit Password Atleast One Uppercase Lowercase & Special Character', check: true })
        }
        else if (pass.current.value != rpass.current.value) {
            setErr({ msg: 'not match', check: true })
        }
        else {
            adduser({ user: user.current.value, phone: phone.current.value, pass: pass.current.value }).then(res => {
                alert(res.data)
            })
            navigate('/');
        }
    }
    return (
        <div className='bg'>

            <Form className='f' onSubmit={validator} >
                {err.check &&
                    <Alert variant="info" onClose={() => setErr({ msg: "", check: false })} dismissible>
                        <Alert.Heading>{err.msg}</Alert.Heading>
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
                        type="phone"
                        placeholder="9313490897"
                        ref={phone}
                    />
                    <label>Phone</label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        ref={pass}
                    />
                    <label>Password</label>
                </Form.Floating>
                <Form.Floating className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="R-Password"
                        ref={rpass}
                    />
                    <label>R-Password</label>
                </Form.Floating>
                <Button className="bt" type="submit">
                    Register
                </Button>
            </Form>


            <h6> already have account <Link to="/">Login</Link></h6>

        </div>
    )
}
