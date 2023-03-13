var iPort = "192.168.43.95:8055"

function session(token,refresh_token){

    localStorage.setItem("token",token)
    localStorage.setItem("refresh_token",refresh_token)
}


function token(){

    let email=document.getElementById("email").value
    let mdp=document.getElementById("mdp").value


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "email": email,
        "password": mdp
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://"+iPort+"/auth/login", requestOptions)
        .then(response => response.text())
        .then(result =>{

            let resp=JSON.parse(result)

            if (typeof resp.data !== 'undefined'){//Identifie si l'identification a fonctionné

            let token=resp.data["access_token"]


            let refresh_token=resp.data["refresh_token"]

            session(token,refresh_token)

            alert("Vous êtes connecté")

            window.location.href="../liste_lycee/liste_lycee.html"

            }
            else  if (resp.errors[0].message=="Invalid user credentials.")// Identifie si l'indentification a échoué à cause de l'email ou du mdp
            {

                alert ("Votre email et/ou mot de passe n'existe pas")

            }
            }

        )
        .catch(error => console.log('error', error))
}


