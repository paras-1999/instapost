import React, { useEffect, useState, useRef } from 'react'
import { Navbar, Container, Button, Modal, Alert, Form, Card } from 'react-bootstrap'
import { getPost } from '../config/Myservice'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client';
const socket = io('http://localhost:3001')
export default function Post() {
    const cc = useRef(null);
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [post, setPost] = useState([]);
    const [user, setUser] = useState(null);
    const [precomments, setPrecomments] = useState(null);
    const [selectedPost, setSelectedPost] = useState(1)
    const [showcomment, setShowcomment] = useState(false)
    const title = useRef(null);
    const des = useRef(null);
    const [err, setErr] = useState({ msg: "", check: false })
    useEffect(() => {
        if (sessionStorage.getItem('user') != undefined) {
            let user = JSON.parse(sessionStorage.getItem('user'))
            setUser(user)
        }
        getPost().then(res => {
            setPost(res.data)
        })
        socket.on('displaypost', (update) => {
            setPost(update)
        })
        socket.on('refresh', (update) => {
            let id = selectedPost;
            setPost(update.data)
            console.log(update.cupdate.id, id)
            if (update.cupdate.id == selectedPost) {
                console.log("in")
                setPrecomments([...precomments, update.cupdate.comment])
            }
        })
    }, [])
    const validator = (event) => {
        event.preventDefault();
        setErr({ msg: "", check: false })
        if (!title.current.value) {
            setErr({ msg: 'enter a title', check: true })
        }
        else if (!des.current.value) {
            setErr({ msg: 'enter description', check: true })
        }
        else {
            let post = { by: user.user, title: title.current.value, description: des.current.value, comments: [] }
            socket.emit('addpost', post)
            setShow(false)
        }
    }
    const addcomment = (id) => {
        if (!cc.current.value) {
            alert('write something in comment field')
        }
        else {
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes();
            let data = { id: id, comment: { by: user.user, comment: cc.current.value, time: time } }
            socket.emit('addcomment', data)
            setShowcomment(false)
            alert('comment added')
        }
    }
    return (
        <div className='bg'>
            {user &&
                <>
                    <Navbar bg="light">
                        <Container>
                            <Navbar.Brand >
                                <h1 className='logo' style={{ fontSize: '35px' }}>Instagram( {user.user} )</h1>
                            </Navbar.Brand>
                        </Container>
                        <Button size="lg" onClick={() => setShow(true)} style={{ borderRadius: '50%', padding: '8px', background: "#f72585", margin: 'auto 10px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
                            </svg>
                        </Button>
                        <Button onClick={() => { navigate('/') }} size="lg" style={{ borderRadius: '50%', padding: '8px', background: "#f72585", margin: 'auto 10px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" />
                                <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                            </svg>
                        </Button>
                    </Navbar>
                    <Modal
                        show={show}
                        onHide={() => setShow(false)}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title className='logo'>Share Your Thought ( s )</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={validator} >
                                {err.check &&
                                    <Alert variant="warning" onClose={() => setErr({ msg: "", check: false })} dismissible>
                                        <Alert.Heading>{err.msg}</Alert.Heading>
                                    </Alert>

                                }
                                <Form.Floating className="my-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="title"
                                        ref={title}
                                    />
                                    <label>title</label>
                                </Form.Floating>
                                <Form.Floating className="mb-3">
                                    <Form.Control
                                        as="textarea"
                                        placeholder="description"
                                        style={{ height: '100px' }}
                                        ref={des}
                                    />
                                    <label>description</label>
                                </Form.Floating>
                                <Button className="bt" type="submit">
                                    Post
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    {post && post.map((val, i) =>
                        <Card border="light" className='mycard' key={i}>
                            <Card.Header><span className='avtar'>{val.by[0]}</span>{val.by}</Card.Header>
                            <Card.Img variant="top" src={`https://picsum.photos/350/?=${i}`} height='400px' />
                            <Card.Body>
                                <Card.Title>{val.title}</Card.Title>
                                <Card.Text>{val.description}</Card.Text>
                            </Card.Body>
                            <Card.Footer>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#E84855" className="bi bi-heart-fill" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                                </svg>
                                <svg onClick={() => { setSelectedPost(val._id); console.log(val._id); setPrecomments(val); setShowcomment(true) }} style={{ margin: "0 20px" }} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#35A7FF" className="bi bi-chat-fill" viewBox="0 0 16 16">
                                    <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-share-fill" viewBox="0 0 16 16">
                                    <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
                                </svg>
                            </Card.Footer>
                        </Card>
                    )}
                    {precomments &&
                        <Modal
                            show={showcomment}
                            onHide={() => setShowcomment(false)}
                            centered
                            size='lg'
                        >
                            <Modal.Header closeButton>
                                <Modal.Title className='logo'>Post By {user.user}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{ display: "flex" }}>
                                <div className='sep' >
                                    <Card.Img src={`https://picsum.photos/200/`} style={{ height: "340px" }} />
                                    <svg style={{ margin: "10px 10px" }} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#E84855" className="bi bi-heart-fill" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-share-fill" viewBox="0 0 16 16">
                                        <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
                                    </svg><br />
                                    <input id='com' type='text' ref={cc} placeholder="comment...." />
                                    <button id='combtn' onClick={() => addcomment(precomments._id)}><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-send" viewBox="0 0 16 16">
                                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                                    </svg></button>
                                </div>
                                <div className='sep' >
                                    <ul>
                                        {precomments.comments.map((val, i) => {
                                            return (<li key={i}><h5>{val.by}</h5>{val.comment}<h6 style={{ textAlign: 'right' }}>{val.time}</h6></li>)
                                        })}
                                    </ul>
                                </div>

                            </Modal.Body>
                        </Modal>
                    }

                </>}


        </div>
    )
}
// {abc.map((val, i) =>
//     <Card style={{ width: '18rem' }} key={i}>

//         <Card.Body>


//             <Form.Floating className="my-3">
//                 <Form.Control
//                     type="text"
//                     placeholder="title"
//                     onChange={(e) => handlechange(e)}
//                 />
//                 <label>title</label>
//             </Form.Floating>

//             <Button variant="primary" onClick={() => { checker() }}>Go somewhere</Button>
//         </Card.Body>
//     </Card>

// )}
    // const checker = () => {
    //     alert(xyz + "here")
    // }
    // function handlechange(e) {
    //     console.log(e.target.value)
    //     xyz = e.target.value
    // }