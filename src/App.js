import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input} from '@material-ui/core';
import ImageUpload from './ImageUpload';
import {Link} from 'react-router-dom';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const[open, setOpen] = useState(false);
  const[openSignIn, setOpenSignIn] = useState(false);
  const[email, setEmail] = useState('');
  const[username, setUsername] = useState('');
  const[password, setPassword] = useState('');
  const[user, setUser] = useState(null);  

  const [posts, setPosts] = useState([]);
 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        // user has logged in..
        console.log(authUser);
        setUser(authUser);
      }else{
        // user has logged out..
        setUser(null);
      }
    })
    return () => {
      // perform some cleanup actions
      unsubscribe(); 
    }

  }, [user, username]);

  // useEffect: Runs a piece of code based on a specific condition
  useEffect(() =>{
    // this is where the code run
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot =>{

      // every time a new post is added, this code fires...
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    setOpen(false);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))
  }

  const signIn = (event) => {
    event.preventDefault();

    auth  
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }


  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              {/* <Link to='/' className='navbar-logo' >
                    CRIME-REG <i className='fab fa-typo3'/>
              </Link> */}
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>Sign Up</Button>   
          </form>     
        </div>
        
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signin">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>Sign In</Button>   
          </form>     
        </div>
        
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (               
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div  className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign-In</Button>
            <Button onClick={() => setOpen(true)}>Sign-Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
            <Post key ={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app__postsRight">
          <h4>Right side Div...</h4>
            <p> JDS leader HD Kumaraswamy on rumours of the party's merger with BJP</p>
            <p>"Our party is not going to merge with any other national or regional party."</p>
            <p>12:37 PM</p>
            <p>Russia Deputy Envoy Roman N. Babushkin on cooperation between India and Russia regarding Afghanistan peace process</p>
            <p>We're maintaining a close dialogue on Afghanistan...We have the Moscow platform for same. Then, we have of course bilateral consultations with India on Afghanistan</p>
            <p>12:20 PM</p>
            <p>No significant impact on company, says Wistron on iPhone manufacturing plant violence in Karnataka</p>
            <p>12:19 PM</p>
            <p>Russian Ambassador to India Nikolay R Kudashev on US imposing sanctions on Turkey over Russian S-400 missiles purchase</p>
            <p>We don't welcome unilateral sanctions as tool for international relations. India's position is also crystal clear-no sanctions other than those applied by UNSC.</p>
     
          <InstagramEmbed
            url='https://www.instagram.com/p/B_uf9dmAGPw/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>     

      <div className="app__imageupload">
        {user?.displayName? (
          <ImageUpload username ={user.displayName}/>
        ):
        (
          <h4 className="app__imageuploadH">Sorry you need to login to upload</h4>
        )}  
      </div>
    </div>
  );
}

export default App;
