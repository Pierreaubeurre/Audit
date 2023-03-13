let id_switch;

//Si l'équipement vient de la salle ou de la baie
if (sessionStorage.getItem('id_equip_venant_baie') === null) {

    id_switch = sessionStorage.getItem('nom_equip_venant_salle');
    id_switch.split('-');
    id_switch = id_switch[0];

} else {

    id_switch = sessionStorage.getItem('id_equip_venant_baie');

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

    fetch(`http://${iPort}/items/SWITCH?filter[ID_SWITCH][_eq]=${id_switch}`, requestOptions)
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data[0]

            construction_detail(resp)
        })
        .catch(error => console.log('error', error));

}

function construction_detail(resp) {

    let compteur = 0

    let tableau_complet = Object.values(resp)//tableau des éléments à mettre dans le html

    delete tableau_complet[60]//enlève l'id du switch
    delete tableau_complet[61]//enlève l'id de la salle
    delete tableau_complet[62]//enlève l'id de la baie

    let tableau_basique = tableau_complet.slice(0, 28)//tableau correspondant à la partie switch basique
    let tableau_avance = tableau_complet.slice(28, 64)//tableau correspondant à la partie switch avancé


    //----Partie basique----

    tableau_basique.forEach(element => {

        let detail = document.getElementById(compteur)

        switch (compteur) {

            case 0:
                let nom = document.getElementById("titre-detail-switch")
                nom.textContent = element
                break

            //Concerne les ip
            case 1:
                defaul(element, detail)
                break

            case 2://"ou", l'ommission du break est volontaire
            case 3://"ou"
            case 4://"ou"
            case 5://"ou"
            case 6://"ou"
            case 7://"ou"
            case 8://"ou"
            case 9://"ou"
            case 10:
                if (element != null) {
                    detail.parentElement.removeAttribute("hidden")
                    detail.textContent = element
                }
                break

            case 18:
                detail.setAttribute("href", element)
                break

            default:
                defaul(element, detail)
                break

        }

        compteur = compteur + 1
    }
    )

    //----Partie avancé----

    if (tableau_basique[27] == "avancé") {//deux choix possible : "basique" ou "avancé"

        tableau_avance.forEach(element => {

            let detail = document.getElementById(compteur)

            switch (compteur) {

                case 29://"ou", l'ommission du break est volontaire
                case 30://"ou"
                case 31://"ou"
                case 32://"ou"
                case 33://"ou"
                case 34:
                    detail.setAttribute("href", element)
                    break

                default:
                    defaul(element, detail)
                    break

            }

            detail.parentElement.removeAttribute("hidden")
            compteur = compteur + 1
        })
    }
}


function defaul(element, detail) {

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

}


/*------------Exécution lors du chargement du js-------------*/

detail()
