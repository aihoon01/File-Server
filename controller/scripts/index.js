const form = document.getElementById("login_form");

const getData = async (e) => {
    e.preventDefault();

    // const prepayload = new FormData(form);
    // const payload = new URLSearchParams(prepayload);
    // console.log([...payload]);
    const emailvalue = document.getElementById("email").value;
    const passwordvalue = document.getElementById("password").value;

    const url = new URL('http://localhost:5000/login');
    console.log(url);

    try {
        const response = await fetch(url, 
        {
        method: 'POST',
        headers: {'content-Type': 'application/json'},
        body: //prepayload
        JSON.stringify({
            email: emailvalue,
            password: passwordvalue})
    }) 
    if (response.ok) {
            const users = await response.json();
            console.log(users);
            if(users.length !==0) {
                users.forEach(user => {
                    console.log(user.userRole);
                    window.location.href = `./templates/feed.html?userRole=${user.userrole}`;
                    // window.location.replace("./templates/feed.html")
                });
            } else {
                alert("invalid User");
            }
        } throw new Error('Request Failed!');
    } catch (error) {
        console.log(error.message);
    }
};

form.addEventListener('submit', getData)