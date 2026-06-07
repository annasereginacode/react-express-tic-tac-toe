import { useState, useEffect } from 'react'
import Game from './Game'


function App() {
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  function handleCreateAccount(e) {
    e.preventDefault();
    
    console.log("Posting...");
    fetch("/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    .then(res => res.text())
    .then(data => {
      setMessage(data);

      if ( data === "Registered and logged in") {
        setIsLoggedIn(true); //after registration the user is logged in
      }

      if (data === "You already have an account. Try the Login button.") {
        setRegisterMode(false); //User registered. Please log in.
      }
      
    });
  }

  function handleLogin(e) {
    e.preventDefault();

    console.log("Logging in...");
    fetch("/login", {
      method: "POST",
      credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
    })
    .then(res => res.text())
    .then(data => {
      setMessage(data);
      if (data === 'Logged in') {
        setIsLoggedIn(true);
      }
      if (data === 'User not found') {
        setRegisterMode(true); //User not found. Please create an account.
      }
    });
  }

  function handleLogout() {
    fetch("/logout", {
      method: "POST",
      credentials: "include"
    })
    .then(res => res.text())
    .then(data => {
      setIsLoggedIn(false);
      setRegisterMode(false); //User registered (logged out user has an account)
      setEmail("");
      setPassword("");
      setMessage("You have been logged out.");
    });
  }

  useEffect(() => {
    fetch("/auth-status", {
      credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
      if (data.loggedIn) {
        console.log("Stay logged in");
        setEmail(data.email);
        setIsLoggedIn(true); // stay logged in after refreshing the game page
      } else {
        setIsLoggedIn(false);
      }
    })
    .catch(() => {
      setIsLoggedIn(false);
    });
  }, []);

  if (isLoggedIn) {
    console.log("You logged in: you can play!");
        return (
          <div className="page">
            <Game />
            <div className="logged-in-user">
              Logged in as: {email}<br />
              <button className="logout-button" onClick={handleLogout}>Log Out</button>
            </div>
          </div>
        );
  }

  if (registerMode) {
    return (
      <>
        <form className="account-form" onSubmit={handleCreateAccount}>
          <h1>Please create an account</h1>
          <div className='account-form-info'>
            {message}
          </div>
          <div>
          <label>
          Login: <input 
                    type="email" 
                    name="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />
          </label>
          </div>
          <div>
          <label>
          Password: <input 
                      type="password" 
                      name="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
          </label>
          </div>
          <button type="submit">
            Create Account
          </button>      
          <button className="switch-button" type="button" onClick={() => setRegisterMode(false)}>Have an account? Login here...</button>
        </form>
      </>
    )
  }

  return (
    <>
      <form className="account-form" onSubmit={handleLogin}>
        <h1>Please log in first</h1>
        <div className='account-form-info'>
          {message}
        </div>
        <div>
          <label>
          Login: <input 
                    type="email" 
                    name="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />
          </label>
          </div>
          <div>
          <label>
          Password: <input 
                      type="password" 
                      name="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
          </label>
          </div>       
        <button type="submit">
          Login
        </button>
        <button className="switch-button" type="button" onClick={() => setRegisterMode(true)}>Don't have an account? Create it here...</button>
      </form>
    </>
  )
}

export default App
