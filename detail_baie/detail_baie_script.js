let id_baie = sessionStorage.getItem('nom_equip_venant_salle');
id_baie.split('-');

function detail() {

    let token = localStorage.getItem('token')

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`http://${iPort}/items/BAIE?filter[ID_BAIE][_eq]=${id_baie[0]}`, requestOptions)
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

    delete tableau[13]//enlève l'id de la baie
    delete tableau[14]//enlève l'id de la salle


    tableau.forEach(element => {

        switch (compteur) {

            //Cas pour le nom
            case 0:

                let nom = document.getElementById("intitule-baie")
                nom.textContent = element
                break


            //Cas pour l'image
            case 1:

                let image = document.getElementById("image-baie")
                image.setAttribute("src", element)
                break



            //Cas pour la réponse avant la précision
            case 9:

                let double_alim = document.getElementById(compteur)
                double_alim.textContent = element


                if (element == "partiellement")//Affiche ou pas la précision
                {
                    let precision = document.getElementById("precision")


                    precision.removeAttribute("hidden")
                }
                break

            //Cas par défault, pour les booléens ou chaine de texte
            default:

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
                break
        }

        compteur = compteur + 1

    })
}

function accordeon() {

    let token = localStorage.getItem('token')

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`http://${iPort}/items/FIBRE?filter[ID_BAIE][_eq]=${id_baie[0]}&fields=ID_FIBRE`, requestOptions)//Partie Fibre
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data

            construction_accordeon(resp, "button-fibre", "detail-fibre", "ID_FIBRE")

        })
        .catch(error => console.log('error', error));


    fetch(`http://${iPort}/items/ROCADE_RJ45?filter[ID_BAIE][_eq]=${id_baie[0]}&fields=ID_ROCADE`, requestOptions)
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data

            construction_accordeon(resp, "button-rocade", "detail-rocade", "ID_ROCADE")

        })
        .catch(error => console.log('error', error));


    fetch(`http://${iPort}/items/PRISE_RJ45?filter[ID_BAIE][_eq]=${id_baie[0]}&fields=ID_PRISE`, requestOptions)
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data

            construction_accordeon(resp, "button-prise", "detail-prise", "ID_PRISE")

        })
        .catch(error => console.log('error', error));


    fetch(`http://${iPort}/items/ONDULEUR?filter[ID_BAIE][_eq]=${id_baie[0]}&fields=ID_ONDULEUR`, requestOptions)
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data

            construction_accordeon(resp, "button-onduleur", "detail-onduleur", "ID_ONDULEUR")

        })
        .catch(error => console.log('error', error));


    fetch(`http://${iPort}/items/SWITCH?filter[ID_BAIE][_eq]=${id_baie[0]}&fields=ID_SWITCH`, requestOptions)
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data

            construction_accordeon(resp, "button-switch", "detail-switch", "ID_SWITCH")

        })
        .catch(error => console.log('error', error));


    fetch(`http://${iPort}/items/SERVEUR?filter[ID_BAIE][_eq]=${id_baie[0]}&fields=ID_SERVEUR`, requestOptions)
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data

            construction_accordeon(resp, "button-serveur", "detail-serveur", "ID_SERVEUR")

        })
        .catch(error => console.log('error', error));

}


function construction_accordeon(resp, id_boutton, id_detail, recup) {

    let premier = resp[0]

    if (premier != null) {

        let boutton = document.getElementById(id_boutton)
        let detail_boutton = document.getElementById(id_detail)

        boutton.removeAttribute("hidden")
        detail_boutton.removeAttribute("hidden")

        resp.forEach(element => {

            let p = document.createElement("p")
            p.textContent = element[recup]
            p.setAttribute("onclick", `detail_equip("${element[recup]}", "${id_detail}")`)

            detail_boutton.append(p)

        });

    }

}


//permet de rediriger vers la page détail correspondant au type de l'équipement
function detail_equip(id_equip, class_equip) {

    sessionStorage.setItem('id_equip_venant_baie', id_equip);

    switch (class_equip) {
        case 'detail-fibre':
            document.location.href='../detail_fibre/detail_fibre.html';
            break;
        case 'detail-rocade':
            document.location.href='../details_rocade_RJ45/detail_rocade_RJ45.html';
            break;
        case 'detail-serveur':
            document.location.href='../detail_serveur/detail_serveur.html';
            break;
        case 'detail-onduleur':
            document.location.href='../detail_onduleur/detail_onduleur.html';
            break;
        case 'detail-switch':
            document.location.href='../detail_switch/detail_switch.html';
            break;
        case 'detail-prise':
            document.location.href='../details_prise_RJ45/detail_prise_RJ45.html';
            break;
        default:
            console.log("Erreur, class_equip n'est peut-être pas valide.");
    }

    
}



/*------------Exécution lors du chargement du js-------------*/

accordeon()
detail()
