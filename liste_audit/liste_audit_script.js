let tr
const table = document.getElementById("liste-audit")
const detail = document.getElementById("info-lycee")

function oeil(id){
    sessionStorage.setItem("id_audit",id)
    window.location.href="../detail_audit/detail_audit.html"
}




function creation_liste_audit(date, id) {//fait la création des cases

    if (tr == null) {

        tr = document.createElement("tr")
        table.appendChild(tr)


        let td = document.createElement("td")//
        tr.appendChild(td)


        let p = document.createElement("p")
        p.textContent = "Audit du " + date
        p.setAttribute("class", "contenu-td-audit")
        td.appendChild(p)

        
        let bloc = document.createElement("img")
        bloc.setAttribute("class", "contenu-td-image")
        bloc.setAttribute("alt", "oeil")
        bloc.setAttribute("src", "../image/icon-pen-paper.png")
        td.appendChild(bloc)
        

        let oeil = document.createElement("img")
        oeil.setAttribute("class", "contenu-td-image")
        oeil.setAttribute("alt", "oeil")
        oeil.setAttribute("src", "../image/icon-eye.png")
        td.appendChild(oeil)


        oeil.setAttribute("onclick", "oeil('"+id+"')")
        bloc.setAttribute("onclick", "bloc(" + id + ")")

    }
    else {

        let td = document.createElement("td")
        tr.appendChild(td)


        let p = document.createElement("p")
        p.textContent = "Audit du " + date
        p.setAttribute("class", "contenu-td-audit")
        td.appendChild(p)

        
        let bloc = document.createElement("img")
        bloc.setAttribute("class", "contenu-td-image")
        bloc.setAttribute("alt", "oeil")
        bloc.setAttribute("src", "../image/icon-pen-paper.png")
        td.appendChild(bloc)
        


        let oeil = document.createElement("img")
        oeil.setAttribute("class", "contenu-td-image")
        oeil.setAttribute("alt", "oeil")
        oeil.setAttribute("src", "../image/icon-eye.png")
        td.appendChild(oeil)

        oeil.setAttribute("onclick", "oeil('"+id+"')")
        bloc.setAttribute("onclick", "bloc(" + 'test' + ")")


        tr = null
    }

}



function lecture_audit(resp) {//lit la requete sous la forme d'un tableau

    resp.forEach(element => {

        let date = element.DATE;
        let id = element.ID_AUDIT;

        creation_liste_audit(date,id)
    });

}

function creation_detail_lycee(element){//met les détails dans la barre du haut

    let p=document.createElement("p")
    p.textContent=element

    detail.appendChild(p)

}

function lecture_detail_lycee(resp){


    let rne = resp.RNE
    let rue = resp.RUE
    let code = resp.CODE_POSTAL
    let ville = resp.VILLE
    let tel = resp.TEL
    let mail = resp.MAIL


    let test = [rne,rue,code,ville,tel,mail]

    test.forEach(element => {

        creation_detail_lycee(element)

    });

}


function audit(rne) {//fait les requètes

    let token = localStorage.getItem('token')

    let nom=sessionStorage.getItem("nom")
    let h3=document.getElementById("titre-liste-audit")

    h3.textContent="Liste des audits du lycée "+nom//modifie le nom du lycée dans le titre


    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };


    fetch(`http://192.168.43.95:8055/items/LYCEE?fields=RNE,RUE,CODE_POSTAL,VILLE,TEL,MAIL&filter[RNE][_eq]=${rne}`, requestOptions)//requete pour les détails du lycee
        .then(response => response.text())
        .then(result =>{

            resp = JSON.parse(result).data[0]

            lecture_detail_lycee(resp)

        })
        .catch(error => console.log('error', error));




    fetch("http://" + iPort + "/items/AUDIT?fields=DATE,ID_AUDIT&filter[RNE][_eq]=" + rne, requestOptions)//requete pour le tableau
        .then(response => response.text())
        .then(result => {

            resp = JSON.parse(result).data;

            lecture_audit(resp);


        })
        .catch(error => console.log('error', error));

}



//permet d'ajouter un audit
function ajout_audit() {


    //permet d'éviter de spammer des champs de texte
    $("#formulaire-ajout-audit").remove();

    //création d'un champ de texte
    $("body").append(`<div id="formulaire-ajout-audit">
                      <input type='text' placeholder="intitule de l'audit" maxlength='20' id='valeur-intitule' value=''>
                      <input type='date' id="valeur-date" pattern="\d{1,2}/\d{1,2}/\d{4}">
                      <button id='btn-confirmer-ajout-audit' onclick='requete_ajout_audit()'> Confirmer </button>
                      </div>`
                    );

}


function requete_ajout_audit() {
            
    /*Ce code sert à changer le format de la date sans utilisé de bibliothèque*/

    let date_en = document.getElementById('valeur-date').value.split('-');
    console.log(date_en);
    let jour = date_en[2];
    let mois = date_en[1];
    let annee = date_en[0];
    let date_fr = `${jour}/${mois}/${annee}`;
    console.log(date_fr);

    fetch(`http://${iPort}/items/AUDIT`, {
        method: 'POST',
        headers: {

            "Content-Type": 'application/json',
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        
        },
        body: JSON.stringify( {

            'RNE': `${sessionStorage.getItem('rne')}`,
            'INTITULE': `${document.getElementById('valeur-intitule').value}`,
            'DATE': `${date_fr}`

        })
    })
    .then(res => res.text()).then(res => {



        /* on vérifie le nombre de td: est-ce que le nombre est impair ou
        non pour savoir s'il faut créer un td en plus ou l'ajouter à un tr existant*/
        if ( $("#liste-audit tr td").length%2 == 0 ) {

            
            $("#liste-audit").append(`<tr>
                                      <td>
                                      <p class="contenu-td-audit"> Audit du ${date_fr} </p>
                                      <img class="contenu-td-image" alt="oeil" src="../image/icon-pen-paper.png" onclick="oeil(${JSON.parse(res).data['ID_AUDIT']})">
                                      <img class="contenu-td-image" alt="oeil" src="../image/icon-eye.png" onclick="oeil(${JSON.parse(res).data['ID_AUDIT']})">
                                      <td>
                                      </tr>`);
            $("#formulaire-ajout-audit").remove();

        } else {

            $("#liste-audit tr:last").append(`<td>
                                      <p class="contenu-td-audit"> Audit du ${date_fr} </p>
                                      <img class="contenu-td-image" alt="oeil" src="../image/icon-pen-paper.png" onclick="oeil(${JSON.parse(res).data['ID_AUDIT']})">
                                      <img class="contenu-td-image" alt="oeil" src="../image/icon-eye.png" onclick="oeil(${JSON.parse(res).data['ID_AUDIT']})">
                                      </td>`);
            $("#formulaire-ajout-audit").remove();


        }


    })
        

    .catch((err) => {

        console.log("Erreur dans le fetch ajout_audit ->", err);

    });

}

/*------------Exécution lors du chargement du js-------------*/


audit(sessionStorage.getItem("rne"))