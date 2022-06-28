function getParameter(parameterName) {
    let parameters = new URLSearchParams(window.location.search);
    return parameters.get(parameterName);
}

if(document.readyState === 'loading') {
    let email = getParameter('email');
}

const reset_password = document.getElementById("reset_password_btn");
const resetPassword = async (e) => {
    e.preventDefault();
    let email = getParameter('email');
    console.log(email);
    let newPassword = document.getElementById("new_password").value;
    let confimPassword = document.getElementById("confirm_password").value;

    if(newPassword === confimPassword) {
        console.log(newPassword);
        try {
            const url = new URL('http://localhost:5000/allFiles');
        const response = await fetch(url, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: {
                email: email,
                newPassword: newPassword,
                confimPassword: confimPassword
            }
        })
        if(response.ok) {
            const users = await response.json();
            window.location.href = '../index.html';
            alert("Password reset succcessful. Log in with your new password!");
        }
        throw new Error("Password reset failed!");
        } catch (error) {
            console.log(errror.message);
        }
        
    } 
}

reset_password.addEventListener('click', resetPassword);