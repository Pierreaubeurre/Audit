let tr
const table = document.getElementById("liste-lycee")

function detail(nom,rne){

    sessionStorage.setItem("nom",nom)
    sessionStorage.setItem("rne",rne)
    window.location.href="../liste_audit/liste_audit.html"
}



function creation(nom, rne) {//fait la création des éléments

    if (tr == null) {

        tr = document.createElement("tr")
        table.appendChild(tr)


        let td = document.createElement("td")
        tr.appendChild(td)


        let p = document.createElement("p")
        p.textContent = nom
        p.setAttribute("class", "contenu-td-lycee")
        td.appendChild(p)


        var img = document.createElement("img")
        img.setAttribute("class", "contenu-td-oeil")
        img.setAttribute("alt", "oeil")
        img.setAttribute("src", "../image/icon-eye.png")
        td.appendChild(img)

    }
    else {

        let td = document.createElement("td")
        tr.appendChild(td)


        let p = document.createElement("p")
        p.textContent = nom
        p.setAttribute("class", "contenu-td-lycee")
        td.appendChild(p)


        var img = document.createElement("img")
        img.setAttribute("class", "contenu-td-oeil")
        img.setAttribute("alt", "oeil")
        img.setAttribute("src", "../image/icon-eye.png")

        td.appendChild(img)

        tr = null
    }

    img.setAttribute("onclick", "detail('"+nom+"','"+rne+"')")
}


function lecture(resp) {//lit la requete sous la forme d'un tableau

    resp.forEach(element => {

        let nom = element.NOM;
        let rne = element.RNE;

        creation(nom, rne)
    });

}


function lycee() {//fait la requete

    let token=localStorage.getItem("token")

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer "+token);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

    fetch("http://" + iPort + "/items/LYCEE?fields=NOM,RNE", requestOptions)
        .then(response => response.text())
        .then(result => {

            resp = JSON.parse(result).data;

            lecture(resp)


        })
        .catch(error => console.log('error', error));

}


/*------------Exécution lors du chargement du js-------------*/


lycee()