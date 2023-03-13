let id_onduleur;

//Si l'équipement vient de la salle ou de la baie
if (sessionStorage.getItem('id_equip_venant_baie') === null) {

    id_onduleur = sessionStorage.getItem('nom_equip_venant_salle');
    id_onduleur.split('-');
    id_onduleur = id_onduleur[0];

} else {

    id_onduleur = sessionStorage.getItem('id_equip_venant_baie');

}
function detail() {

    let token = localStorage.getItem('token')

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`http://${iPort}/items/ONDULEUR?filter[ID_ONDULEUR][_eq]=${id_onduleur}`, requestOptions)
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data[0]

            construction_detail(resp)
        })
        .catch(error => console.log('error', error));

}

function construction_detail(resp) {

    let compteur = 0

    let tableau = Object.values(resp)//tableau des éléments à mettre dans le html

    delete tableau[7]//enlève l'id de l'ondulateur
    delete tableau[8]//enlève l'id de la salle
    delete tableau[9]//enlève l'id de la baie


    tableau.forEach(element => {

        let detail = document.getElementById(compteur)

        switch (element) {

            case null:
                detail.textContent = "Non renseigné"
                break

            case true:
                detail.textContent = "OUI"
                break

            case false:
                detail.textContent = "NON"
                break

            default:
                detail.textContent = element
                break


        }
        compteur = compteur + 1
    }
    )
}


/*------------Exécution lors du chargement du js-------------*/

detail()
