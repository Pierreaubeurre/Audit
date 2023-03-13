let id_serveur;

//Si l'équipement vient de la salle ou de la baie
if (sessionStorage.getItem('id_equip_venant_baie') === null) {

    id_serveur = sessionStorage.getItem('nom_equip_venant_salle');
    id_serveur.split('-');
    id_serveur = id_serveur[0];

} else {

    id_serveur = sessionStorage.getItem('id_equip_venant_baie');

}
function detail() {

    let token=localStorage.getItem('token')

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`http://${iPort}/items/SERVEUR?filter[ID_SERVEUR][_eq]=${id_serveur}`, requestOptions)
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

    delete tableau[9]//enlève l'id du serveur
    delete tableau[10]//enlève l'id de la salle
    delete tableau[11]//enlève l'id de la baie


    tableau.forEach(element => {


        switch (compteur) {

            //Cas pour le nom
            case 0:

                let nom = document.getElementById("intitule-serveur")
                nom.textContent = element
                break


            //Cas pour l'image
            case 1:

                let image = document.getElementById("image-serveur")
                image.setAttribute("src", element)
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

    let token=localStorage.getItem('token')

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(`http://${iPort}/items/AD_DNS_DHCP?filter[ID_SERVEUR][_eq]=${id_serveur[0]}&fields=ID_AD_DNS`, requestOptions)//Partie Fibre
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data

            construction_accordeon(resp, "button-ad-dns-dhcp", "detail-ad-dns-dhcp", "ID_AD_DNS")

        })
        .catch(error => console.log('error', error));


    fetch(`http://${iPort}/items/TICKETING?filter[ID_SERVEUR][_eq]=${id_serveur[0]}&fields=ID_TICKETING`, requestOptions)
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data

            construction_accordeon(resp, "button-ticketing", "detail-ticketing", "ID_TICKETING")

        })
        .catch(error => console.log('error', error));


    fetch(`http://${iPort}/items/VM_SECU?filter[ID_SERVEUR][_eq]=${id_serveur[0]}&fields=ID_VM_SECU`, requestOptions)
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data

            construction_accordeon(resp, "button-vm-secu", "detail-vm-secu", "ID_VM_SECU")

        })
        .catch(error => console.log('error', error));


    fetch(`http://${iPort}/items/PXE?filter[ID_SERVEUR][_eq]=${id_serveur[0]}&fields=ID_PXE`, requestOptions)
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data

            construction_accordeon(resp, "button-pxe", "detail-pxe", "ID_PXE")

        })
        .catch(error => console.log('error', error));


    fetch(`http://${iPort}/items/NAS?filter[ID_SERVEUR][_eq]=${id_serveur[0]}&fields=ID_NAS`, requestOptions)
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data

            construction_accordeon(resp, "button-nas", "detail-nas", "ID_NAS")

        })
        .catch(error => console.log('error', error));


    fetch(`http://${iPort}/items/SERVEUR_IMPRESSION?filter[ID_SERVEUR][_eq]=${id_serveur[0]}&fields=ID_IMPRESSION`, requestOptions)
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data

            construction_accordeon(resp, "button-serveur-impression", "detail-serveur-impression", "ID_IMPRESSION")

        })
        .catch(error => console.log('error', error));
    
        fetch(`http://${iPort}/items/DATA?filter[ID_SERVEUR][_eq]=${id_serveur[0]}&fields=ID_DAT`, requestOptions)
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data

            construction_accordeon(resp, "button-dat", "detail-dat", "ID_DAT")

        })
        .catch(error => console.log('error', error));

        fetch(`http://${iPort}/items/HYPER_V?filter[ID_SERVEUR][_eq]=${id_serveur[0]}&fields=ID_HYPER_V`, requestOptions)
        .then(response => response.text())
        .then(result => {

            let resp = JSON.parse(result).data

            construction_accordeon(resp, "button-hyper-v", "detail-hyper-v", "ID_HYPER_V")

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

    sessionStorage.setItem('id_equip_venant_serveur', id_equip);

    switch (class_equip) {
        case 'detail-ad-dns-dhcp':
            document.location.href='../detail_DNS_DHCP/detail_DNS_DHCP.html';
            break;
        case 'detail-ticketing':
            document.location.href='../detail_ticketing/detail_ticketing.html';
            break;
        case 'detail-vm-secu':
            document.location.href='../detail_VM_SECU/detail_VM_SECU.html';
            break;
        case 'detail-pxe':
            document.location.href='../detail_PXE/detail_PXE.html';
            break;
        case 'detail-nas':
            document.location.href='../detail_NAS/detail_NAS.html';
            break;
        case 'detail-dat':
            document.location.href='../detail_DATA/detail_DATA.html';
            break;
        case 'detail-serveur-impression':
            document.location.href='../detail_impression/detail_impression.html';
            break;
        case 'detail-hyper-v':
            document.location.href='../detail_hyper_V/detail_hyper_V.html';
            break;
        default:
            console.log("Erreur, class_equip n'est peut-être pas valide.");
    }

    
}


/*------------Exécution lors du chargement du js-------------*/

accordeon()
detail()
