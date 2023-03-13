let id_RJ45;

//Si l'équipement vient de la salle ou de la baie
if (sessionStorage.getItem('id_equip_venant_baie') === null) {

    id_RJ45 = sessionStorage.getItem('nom_equip_venant_salle');
    id_RJ45.split('-');
    id_RJ45 = id_RJ45[0];

} else {

    id_RJ45 = sessionStorage.getItem('id_equip_venant_baie');

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

    fetch(`http://${iPort}/items/PRISE_RJ45?filter[ID_PRISE][_eq]=${id_RJ45}`, requestOptions)
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data[0]

            construction_detail(resp)
        })
        .catch(error => console.log('error', error));

}

function construction_detail(resp) {

    let tableau = Object.values(resp)//tableau des éléments à mettre dans le html

    delete tableau[8]//enlève l'id de la prise
    delete tableau[9]//enlève l'id de la salle
    delete tableau[10]//enlève l'id de la baie

    let nom=document.getElementById("intitule-prise")

    nom.textContent=tableau[0]//rajoute le nom au html

    delete tableau[0]//enlève le nom,maintenant inutile    


    let compteur = 0

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
