const signup = async (e) =>{
    e.preventDefault();
try {
    
    const usernameVal= document.getElementById('username').value;
    const emailVal= document.getElementById('email').value;
    const passwordVal= document.getElementById('password').value;

    const url = new URL('https://file-servar.herokuapp.com/signup');
    const response = await fetch(url, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            username: usernameVal,
            email: emailVal,
            password: passwordVal
        })
    })
    if(response.ok){
        const users = await response.json();
        window.location.href = '../index.html';
        alert("Account Created. Login now!");
        console.log(users);
    } throw new Error("Failed to Create account!");
    
} catch (error) {
    console.log(error.message);
}

}

const signUp = document.getElementById("sign_up");
signUp.addEventListener('click', signup);