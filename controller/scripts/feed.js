// import { json } from "express/lib/response";

function showModal() {
    document.getElementById("overlay").style.display = "block";
}

function closeModal() {
    document.getElementById("overlay").style.display = "none";
}

//get URL query parameters
function getParameter(parameterName) {
    let parameters = new URLSearchParams(window.location.search);
    return parameters.get(parameterName);
}

//Get all files
const displayAllFiles = async () => {
    let userRole = getParameter('userRole');
    console.log(userRole);
    console.log("Hello");

    if (userRole === 'admin') {
        document.getElementById('show_modal_btn').style.display="block";
    } else {
        document.getElementById('show_modal_btn').style.display="none";
    };

        try {
        const url = new URL('https://file-servar.herokuapp.com/allFiles');
        const display = await fetch(url)
        if (display.ok) {
            const files = await display.json();
            console.log(files);
            let grid = document.getElementById('grid');
            let gridContent = document.createElement('gridContent');
            gridContent.className = 'gridCon';
            gridContent.innerHTML = "";
            document.body.appendChild(gridContent);
            // let gridContent = "";
            files.forEach(file => {
                console.log(file.filename)
                gridContent = `
                <div id="row" class="row">
                    <div id="action_field" class="action_field">
                    <b id="${file.fileid}" class="download_btn" onclick="download(this.id)">Download</b>
                    <b id="${file.fileid}" class="send_email" onclick="fileToEmail(this.id)">Email</b>
                    </div>
                    <div id="title_field" class="title_field">${file.title}</div>
                    <div id="file_name_${file.fileid}" onclick="DownloadEmailCount(this.id)" class="file_name_field">${file.filename}</div>
                    <div id="description_field" class="description_field">${file.description}</div>
                </div>
                `;
                // grid.appendChild(gridContent);
                // console.log(gridContent.innerHTML)
                // grid.append(gridContent.innerHTML);
                // grid.innerHTML= groappendChild(gridContent);
                grid.innerHTML = gridContent;
            });

        } else {
            alert("No such FIle");
        } 
     } catch (error) {
            console.log(error.message);            
        }
        
        }

// if(document.readyState === 'loading'){
//     document.addEventListener("DOMContentLoaded", displayAllFiles);
// } else {
//     displayAllFiles();
// }



//GET LOOKUP FILES
const searchBtn = document.getElementById("search_btn");

const displaySearch = async function(e) {
    e.preventDefault();

    const searched = document.getElementById("search_input").value;
    document.getElementById("grid").innerHTML("");
    
    try {
        const url = new URL('https://file-servar.herokuapp.com/fileSearch');
        const response = await fetch(url, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({search: searched})
        }) 
        if (response.ok) {
            const files = await response.json();
            if(files.length !==0) {
                console.log(files);
                let grid = document.getElementById("grid");
                let gridContent = "";
                files.forEach(file => {
                    gridContent = `
                    <div id="row" class="row">
                        <div id="action_field" class="action_field"><p id="download_btn${file.fileid}" class="download_btn">Download</p>
                        <p id="${file.fileid}" class="send_email" onclick="fileToEmail(this.id)">Email</p></div>
                        <div id="title_field" class="title_field">${file.title}</div>
                        <div id="file_name_field" class="file_name_field" onclick="fileDownloadEmailCount(this.id)">${file.filename}</div>
                        <div id="description_field" class="description_field">${file.description}</div>
                    </div>
                    `;
                    grid.append(gridContent);
                })
            } else {
                alert("No such File");
            }
        } throw new Error('Request failed!');
        
    } catch (error) {
        console.log(error.message);
        
    }
};

searchBtn.addEventListener("click", displaySearch);

const downloadEmailCount = async (click_id) => {
    let fileId = click_id.split("_")[2];
    let countInput = {
        fileId: fileId
    }

    try {
        const url = new URL('https://file-servar.herokuapp.com/fileEmailCount');
        const response = await fetch(url, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(countInput)
        })
        if (response.ok) {
            const result = await response.json();
            console.log(result[0].emailCount);
            let emailCount = result[0].emailCount;
            let downloadCount = result[1].downloadCount;

            alert(`Email Count: ${emailCount} \nDownload Count: ${downloadCount}`);
        } throw new Error('Request Failed');
    } catch (error) {
        console.log(error.message);
    }
}

const fileToEmail = async (click_id) => {
    let fileId = click_id;
    let recepientEmail = prompt("Receipient email");

    let emailInfo = {
        fileId: fileId,
        recepientEmail: recepientEmail
    };

try {
    const url = new URL('https://file-servar.herokuapp.com/fileEmail');
    const response = await fetch (url, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(emailInfo)
    })

    if(response.ok) {
        const result = await response.json();
        if (result) alert("File sent to " + recepientEmail);
    } throw new Error("Request failed!");

} catch (error) {
    console.log(error.message);
}
}

//download a file

const download = async (click_id) => {
    console.log("Here we are")
    let fileid = click_id;
    console.log(fileid);
    let filename = document.getElementById(`file_name_${fileid}`).innerHTML.toString();
    console.log(filename)
    try {
        window.location.href = `/fileDownload?filename=${filename}&fileid=${fileid}` 
    } catch (error) {
        console.log(error.message);
    }
    
}

//Upload a file
const uploadForm = document.getElementById("upload_form");
const uploadings = async (e) => {
    e.preventDefault();
    const form_data = new FormData(uploadForm);
    // const payload = new URLSearchParams(form_data);
    // const form_data = new FormData(upload_form);
    // const titleval = document.getElementById('title').value;
    // const descriptionval = document.getElementById('description').value;
try {
    const url = new URL('https://file-servar.herokuapp.com/fileUpload');
    const response = await fetch(url, {
    method: 'POST',
        enctype: {'content-type': 'multipart/form-data'},
        body: (form_data)

    })
    if(response.ok){
        const file = await response.json();
        console.log("File uploaded");
        alert("File Uploaded");
    } throw new Error('File couldnt upload')

} catch (error) {
    console.log(error.message);
}
};

uploadForm.addEventListener('submit', uploadings)