import React, { useState } from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
const Login2 = () => {

    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
    }
const [pswd,setPswd] = useState('');

    const [newUser, setNewUser] = useState(false);

    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        photo: '',
        email: '',
        password: '',
        error: '',
        success: false
    });

    //sign in with google
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    //
    const handleGoogleSignIn = () => {
        firebase.auth().signInWithPopup(googleProvider)
            .then(result => {
                const { displayName, photoURL, email } = result.user;
                const signedInUser = {
                    isSignedIn: true,
                    name: displayName,
                    photo: photoURL,
                    email: email
                }
                setUser(signedInUser);
                console.log(displayName, photoURL, email)
            })
            .catch(err => {
                console.log(err)
            })
        // console.log('signed in click')
    }


    // sign Out
    const handleSignOut = () => {
        firebase.auth().signOut()
            .then(res => {
                const signedoutuser = {
                    isSignedIn: false,
                    name: '',
                    photo: '',
                    email: ''
                };
                setUser(signedoutuser);
                console.log('sign out successful');
            }
            )
            .catch(err => { console.log(err) })
    }

    //update username
    const updateUserName = name => {
        const user = firebase.auth().currentUser;

        user.updateProfile({
            displayName: name,
            // photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(function () {
            console.log('user name updated')
            // Update successful.
        }).catch(function (error) {
            console.log(error)
            // An error happened.
        });
    }

    //
    const handleSubmit = (e) => {
        console.log(user.email, user.password);


        //create new user
        if (newUser && user.email && user.password && user.confirmpassword) {
            console.log('submitting..')

            firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
                .then((userCredential) => {
                    // Signed in 
                    // const user = userCredential.user;
                    const newUser = { ...user };
                    newUser.error = '';
                    newUser.success = true;
                    setUser(newUser)
                    updateUserName(newUser.name)
                    console.log(user)
                    // ...
                })
                .catch((error) => {
                    // var errorCode = error.code;
                    // var errorMessage = error.message;
                    // ..
                    const newUser = { ...user };
                    newUser.error = error.message;
                    newUser.success = false;
                    setUser(newUser)
                    console.log(error)
                });

        }
        //signIn with existing user
        if (!newUser && user.email && user.password) {
            firebase.auth().signInWithEmailAndPassword(user.email, user.password)
                .then((userCredential) => {
                    // Signed in 
                    // const user = userCredential.user;
                    const newUser = { ...user };
                    newUser.error = '';
                    newUser.success = true;
                    setUser(newUser)
                    console.log(user)
                    // ...
                })
                .catch((error) => {
                    // var errorCode = error.code;
                    // var errorMessage = error.message;
                    // ..
                    const newUser = { ...user };
                    newUser.error = error.message;
                    newUser.success = false;
                    setUser(newUser)
                    console.log(error)
                });

        }

        e.preventDefault();
        console.log('own submit clicked')
    }
    //
    const handleBlur = (evnt) => {
        let isFieldValid = false;
        // let pswd = 'd';
        if (evnt.target.name === 'email') {
            const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; //regex valid email pattern
            // re.test(evnt.target.value) ? console.log('valid email') : console.log('invalid email') //regex.test(whattoteststring) return true/false
            // console.log(evnt.target.value)
            // const isEmailValid = re.test(evnt.target.value);
            isFieldValid = re.test(evnt.target.value);
            // console.log(isEmailValid)
            isFieldValid ? console.log('email valid') : console.log('email is invalid');
        }
        if (evnt.target.name === 'password') {
            setPswd(evnt.target.value);
            // console.log(pswd,evnt.target.value);
            console.log('psw',evnt.target.value);
            const isPasswordValid = evnt.target.value.length > 6;
            console.log(isPasswordValid)
            const re = /\d{1}/;
            const passwordHasNumber = re.test(evnt.target.value);
            // console.log(isPasswordValid && passwordHasNumber);
            isFieldValid = isPasswordValid && passwordHasNumber;

            isFieldValid ? console.log('password valid') : console.log('password is invalid');
        }
        if (evnt.target.name === 'confirmpassword') {
            console.log('plpl',pswd)
            const passmatched = pswd === evnt.target.value;
            isFieldValid = passmatched;
            isFieldValid ? console.log('pswrd matched') : console.log('paswd not matched');
        }
        if (isFieldValid) {
            console.log('test conpasvalid',isFieldValid)
            //[...cart,newcart]
            const newUserInfo = { ...user }; //copy object
            newUserInfo[evnt.target.name] = evnt.target.value; //set object property
            setUser(newUserInfo)
        }
        console.log(evnt.target.name, evnt.target.value);
        // console.log(event.target.value)

    }
    // const testSubmit = (e) => {
    //     console.log('test form sumbitted ');
    //     console.log(user.email, user.password);
    //     e.preventDefault();
    // }

    return (
        <div>
            <Header></Header>

            {
                user.isSignedIn ? <button onClick={handleSignOut}>LogOut</button> : <button onClick={handleGoogleSignIn}>Google Sign In</button>
            }
            <br />


            {
                user.isSignedIn && <div>
                    <p>User Name: {user.name}</p>
                    <p>Photo: <img src={user.photo} alt="" /></p>
                    <p>Email: {user.email}</p>
                </div>

            }

            <div>
                <h1>Our own authentication system</h1>

                <div>
                    <p>Name:{user.name}</p>
                    <p>Email:{user.email}</p>
                    <p>Password:{user.password}</p>
                    <p>ConPassword:{user.confirmpassword}</p>
                </div>


                <input type='checkbox' name='newUser' onChange={() => setNewUser(!newUser)} />
                <label htmlFor="newUser">New User SignUP</label><br />


                <form onSubmit={handleSubmit}>
                    {newUser && <input type='text' placeholder='name' name='name' onBlur={handleBlur} />}<br />
                    <input type='text' onBlur={handleBlur} name='email' placeholder='email' required /><br />
                    <input type='password' onBlur={handleBlur} name='password' placeholder='password' required /><br />
                    <input type='submit' value={newUser ? 'SignUp' : 'SignIn'} />


                    {/* <button type='submit'>Submit</button> */}
                </form>

                <div>
                    <p style={{ color: 'red' }}>{user.error}</p>
                    {
                        user.success && <p style={{ color: 'green' }}> User {newUser ? 'created' : 'Logged In'} successfully</p>
                    }
                </div>

            </div>


            <div className='login-container'>
                {!newUser &&
                    <form onSubmit={handleSubmit} className='login-form'>
                        <div className='form-inside'>
                            <h2>Login</h2>
                            <input type='text' name="email" placeholder='Email' required onBlur={handleBlur} />
                            <input type='password' name="password" placeholder='Password' required onBlur={handleBlur} />
                            <input type="submit" value='Login' />
                            <p style={{ textAlign: 'center' }}>Dont' have an account? <span style={{ color: 'red' }} onClick={() => setNewUser(!newUser)}>Create an account</span></p>
                        </div>
                    </form>
                }

                {newUser &&
                    <form onSubmit={handleSubmit} className='login-form'>
                        <div className='form-inside'>
                            <h2>Create an account</h2>
                            <input name="name" placeholder='Name' onBlur={handleBlur}/>
                            <input name="email" placeholder='Email' required onBlur={handleBlur} />
                            <input type='password' name="password" placeholder='Password' required onBlur={handleBlur} />
                            <input type='password' name="confirmpassword" placeholder='Confirm Password' required onBlur={handleBlur} />
                            <input type="submit" value='Create an account' />
                            <p style={{ textAlign: 'center' }}>Already have an account? <span style={{ color: 'red' }} onClick={() => setNewUser(!newUser)}>Login</span></p>
                        </div>
                    </form>
                }








                <div className='google-signIn'>
                    <p>----------------Or---------------</p>
                    {
                        user.isSignedIn && <div>
                            <p>User Name: {user.name}</p>
                            <p>Photo: <img src={user.photo} alt="" /></p>
                            <p>Email: {user.email}</p>
                        </div>

                    }
                    <button onClick={handleGoogleSignIn}><FontAwesomeIcon icon={faGoogle} style={{ marginRight: '2rem' }} /><span >Continue with Google</span></button>


                </div>
            </div>

            <Footer></Footer>
        </div>
    );
};

export default Login2;