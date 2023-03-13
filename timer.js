const iPort = "192.168.43.95:8055"

function refresh() {//va reinitialiser le token

    let refresh_token = localStorage.getItem("refresh_token")

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "refresh_token": refresh_token,
        "mode": "json"
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://" + iPort + "/auth/refresh", requestOptions)
        .then(response => response.text())
        .then(result => {

            //console.log(result)

            let resp = JSON.parse(result);
            let tok = resp.data["access_token"];
            let refresh_tok = resp.data["refresh_token"];

            localStorage.setItem("token", tok)
            localStorage.setItem("refresh_token", refresh_tok)

        })
        .catch(error => console.log('error', error));
}

//permet de faire fonctionner le bouton de déconnexion
function deconnexion() {

    fetch(`http://${iPort}/auth/logout`, {
        method: 'POST',
        headers: {

            "Content-Type": 'application/json'

        },
        body: JSON.stringify({
            'refresh_token': `${localStorage.getItem("refresh_token")}`
        }
        )
    })
        .then((response) => response.json())
        .then(

            window.location.href = "../authentification/auth.html",
            sessionStorage.clear(),
			localStorage.clear()
        )
        .catch((err) => {
            console.log("Erreur ->", err);
        })
}

/*------------Exécution lors du chargement du js-------------*/

refresh()

setInterval(refresh, 10 * 60 * 1000)//minutes*secondes*millisecondes

