//initialisation des variables pour récupérer les informations

function option() {

    let token = localStorage.getItem('token')

    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return requestOptions
}




//permet d'afficher les salles
async function affichage_salle() {


    await fetch(`http://${iPort}/items/POSSEDE?filter[ID_AUDIT][_eq]=${sessionStorage.getItem('id_audit')}`, option())
        .then(res_possede => res_possede.text())
        .then(res_possede => {

            res_possede = JSON.parse(res_possede).data;


            res_possede.forEach(element => {


                let id_salle = element.ID_SALLE;


                fetch(`http://${iPort}/items/SALLE?filter[ID_SALLE][_eq]=${id_salle}`, option())
                    .then(res_salle => res_salle.text())
                    .then(res_salle => {

                        res_salle = JSON.parse(res_salle).data;

                        //on ajoute chaque salle à la liste
                        $("#liste-salle").append(`<li class='nom-salle' onclick='info_salle(this.id); affichage_equip(this.id);' id=${res_salle[0].ID_SALLE}> ${res_salle[0].NOM} </li>`)


                    })

                    .catch(error => console.log('erreur dans le fetch salle =>', error));

            });




        })
        .catch(error => console.log('erreur dans le fetch possede =>', error));


}


//permet d'afficher les baies, les switch, les serveurs et les onduleurs
function affichage_equip(id_salle) {


    //on supprime si les infos des équipements de la salle sont déjà rempli par une autre salle
    $(".equipement_baie, .equipement_onduleur, .equipement_switch, .equipement_serveur, .equipement_fibre, .equipement_RJ45, .equipement_rocade").remove();


    fetch(`http://${iPort}/items/BAIE?filter[ID_SALLE][_eq]=${id_salle}`, option())
        .then(res_baie => res_baie.text())
        .then(res_baie => {

            res_baie = JSON.parse(res_baie).data;

            //on vérifie si la salle à des switch
            if (res_baie.length == 0) {

                $("#table-baie").append(`<tr class="equipement_baie"> 
                <th scope="row">
                <p class="absence-equip"> Pas de baie </p>
                </th> <td class="td-baie-valeur-un" id="null-choix-un">
                </td> <td class="td-baie-valeur-deux" id="null-choix-deux"> 
                </td>  </tr>
        
                <tr class="equipement_baie"> 
                <th scope="row">
                <p class="absence-equip"> Pas de baie </p>
                </th> <td class="td-baie-valeur-un" id="null-choix-un">
                </td> <td class="td-baie-valeur-deux" id="null-choix-deux"> 
                </td>  </tr>`
                )

            } else {


                res_baie.forEach(element => {

                    //on ajoute toutes les baies de la salle au tableau
                    $("#table-baie").append(`<tr class="equipement_baie">  <th scope="row"> <p id="${element.ID_BAIE}-baie" class="element_baie" onclick='detail_equip(this.id)'> ${element.NOM} </p> </th> <td class="td-baie-valeur-un" id="${element.ID_BAIE}-baie-choix-un">  </td> <td class="td-baie-valeur-deux" id="${element.ID_BAIE}-baie-choix-deux">  </td>  </tr>`)

                })


                //on ajoute les choix pour le filtre
                for (let element = 0; element <= Object.keys(res_baie[0]).length - 1; element++) {

                    $("#baie-choix-un").append(`<option id=${Object.keys(res_baie[0])[element]}> ${Object.keys(res_baie[0])[element]}  </option>`)
                    $("#baie-choix-deux").append(`<option id=${Object.keys(res_baie[0])[element]}> ${Object.keys(res_baie[0])[element]} </option>`)

                }


                //-------------------- Baie Choix Un --------------------
                let baie_valeur_choix_un = document.getElementById("baie-choix-un");

                baie_valeur_choix_un.addEventListener("change", function () {

                    let champ_baie_choix_un_ciblee = $(this).children(":selected").attr("id");

                    fetch(`http://${iPort}/items/BAIE?fields=${champ_baie_choix_un_ciblee}`, option())
                        .then(res_choix => res_choix.text())
                        .then(res_choix => {

                            res_choix = JSON.parse(res_choix).data;


                            for (let element = 0; element < document.querySelectorAll('.td-baie-valeur-un').length; element++) {

                                let id_choix_cible = document.querySelectorAll('.td-baie-valeur-un')[element].id;
                                let case_a_remplir = Object.values(res_choix[element]);


                                //on supprime si il y a déjà des informations
                                if ($(`#${id_choix_cible}.td-baie-valeur-un`).length != 0) {

                                    $(`#${id_choix_cible}.td-baie-valeur-un p`).remove()

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-baie-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-baie-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                } else {

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-baie-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-baie-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                }


                            }


                        })
                        .catch(error => console.log('erreur dans le fetch baie choix un =>', error));

                })


                //-------------------- Baie Choix Deux --------------------
                let baie_valeur_choix_deux = document.getElementById("baie-choix-deux");

                baie_valeur_choix_deux.addEventListener("change", function () {

                    let champ_baie_choix_deux_ciblee = $(this).children(":selected").attr("id");

                    fetch(`http://${iPort}/items/BAIE?fields=${champ_baie_choix_deux_ciblee}`, option())
                        .then(res_choix => res_choix.text())
                        .then(res_choix => {

                            res_choix = JSON.parse(res_choix).data;


                            for (let element = 0; element < document.querySelectorAll('.td-baie-valeur-deux').length; element++) {

                                let id_choix_cible = document.querySelectorAll('.td-baie-valeur-deux')[element].id;
                                let case_a_remplir = Object.values(res_choix[element]);


                                //on supprime si il y a déjà des informations
                                if ($(`#${id_choix_cible}.td-baie-valeur-deux`).length != 0) {

                                    $(`#${id_choix_cible}.td-baie-valeur-deux p`).remove()

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-baie-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-baie-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                } else {

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-baie-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-baie-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                }

                            }

                        })
                        .catch(error => console.log('erreur dans le fetch baie choix un =>', error));

                })

            }

        })
        .catch(error => console.log('erreur dans le fetch baie =>', error));


    fetch(`http://${iPort}/items/SWITCH?filter[ID_SALLE][_eq]=${id_salle}`, option())
        .then(res_switch => res_switch.text())
        .then(res_switch => {

            res_switch = JSON.parse(res_switch).data;

            //on vérifie si la salle à des switch
            if (res_switch.length == 0) {

                $("#table-switch").append(`<tr class="equipement_switch"> 
                <th scope="row">
                <p class="absence-equip"> Pas de switch </p>
                </th> <td class="td-switch-valeur-un" id="null-choix-un">
                </td> <td class="td-switch-valeur-deux" id="null-choix-deux"> 
                </td>  </tr>

                <tr class="equipement_switch"> 
                <th scope="row">
                <p class="absence-equip"> Pas de switch </p>
                </th> <td class="td-switch-valeur-un" id="null-choix-un">
                </td> <td class="td-switch-valeur-deux" id="null-choix-deux"> 
                </td>  </tr>`
                )

            } else {

                res_switch.forEach(element => {

                    //on ajoute tous les switch de la salle au tableau
                    $("#table-switch").append(`<tr class="equipement_switch">  <th scope="row"> <p id="${element.ID_SWITCH}-switch" class="element_switch" onclick='detail_equip(this.id)'> ${element.NOM_SWITCH} </p> </th> <td class="td-switch-valeur-un" id="${element.ID_SWITCH}-switch-choix-un">  </td> <td class="td-switch-valeur-deux" id="${element.ID_SWITCH}-switch-choix-deux">  </td>  </tr>`)

                })

                //on ajoute les choix pour le filtre
                for (let element = 0; element <= Object.keys(res_switch[0]).length - 1; element++) {

                    $("#switch-choix-un").append(`<option id=${Object.keys(res_switch[0])[element]}> ${Object.keys(res_switch[0])[element]}  </option>`)
                    $("#switch-choix-deux").append(`<option id=${Object.keys(res_switch[0])[element]}> ${Object.keys(res_switch[0])[element]} </option>`)

                }



                //-------------------- Switch Choix Un --------------------
                let switch_valeur_choix_un = document.getElementById("switch-choix-un");

                switch_valeur_choix_un.addEventListener("change", function () {

                    let champ_switch_choix_un_ciblee = $(this).children(":selected").attr("id");

                    fetch(`http://${iPort}/items/SWITCH?fields=${champ_switch_choix_un_ciblee}`, option())
                        .then(res_choix => res_choix.text())
                        .then(res_choix => {

                            res_choix = JSON.parse(res_choix).data;


                            for (let element = 0; element < document.querySelectorAll('.td-switch-valeur-un').length; element++) {

                                let id_choix_cible = document.querySelectorAll('.td-switch-valeur-un')[element].id;
                                let case_a_remplir = Object.values(res_choix[element]);


                                //on supprime si il y a déjà des informations
                                if ($(`#${id_choix_cible}.td-switch-valeur-un`).length != 0) {

                                    $(`#${id_choix_cible}.td-switch-valeur-un p`).remove()

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-switch-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-switch-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                } else {

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-switch-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-switch-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                }

                            }

                        })
                        .catch(error => console.log('erreur dans le fetch switch choix un =>', error));


                })


                //-------------------- Switch Choix Deux --------------------
                let switch_valeur_choix_deux = document.getElementById("switch-choix-deux");

                switch_valeur_choix_deux.addEventListener("change", function () {

                    let champ_switch_choix_deux_ciblee = $(this).children(":selected").attr("id");

                    fetch(`http://${iPort}/items/SWITCH?fields=${champ_switch_choix_deux_ciblee}`, option())
                        .then(res_choix => res_choix.text())
                        .then(res_choix => {

                            res_choix = JSON.parse(res_choix).data;


                            for (let element = 0; element < document.querySelectorAll('.td-switch-valeur-deux').length; element++) {

                                let id_choix_cible = document.querySelectorAll('.td-switch-valeur-deux')[element].id;
                                let case_a_remplir = Object.values(res_choix[element]);


                                //on supprime si il y a déjà des informations
                                if ($(`#${id_choix_cible}.td-switch-valeur-deux`).length != 0) {

                                    $(`#${id_choix_cible}.td-switch-valeur-deux p`).remove()

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-switch-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-switch-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                } else {

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-switch-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-switch-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                }

                            }

                        })
                        .catch(error => console.log('erreur dans le fetch switch choix deux =>', error));


                })

            }

        })
        .catch(error => console.log('erreur dans le fetch switch =>', error));


    fetch(`http://${iPort}/items/SERVEUR?filter[ID_SALLE][_eq]=${id_salle}`, option())
        .then(res_serveur => res_serveur.text())
        .then(res_serveur => {

            res_serveur = JSON.parse(res_serveur).data;

            //on vérifie si la salle à des serveurs
            if (res_serveur.length == 0) {

                $("#table-serveur").append(`<tr class="equipement_serveur"> 
                <th scope="row">
                <p class="absence-equip"> Pas de serveur </p>
                </th> <td class="td-serveur-valeur-un" id="null-choix-un">
                </td> <td class="td-serveur-valeur-deux" id="null-choix-deux"> 
                </td>  </tr>
        
                <tr class="equipement_serveur"> 
                <th scope="row">
                <p class="absence-equip"> Pas de serveur </p>
                </th> <td class="td-serveur-valeur-un" id="null-choix-un">
                </td> <td class="td-serveur-valeur-deux" id="null-choix-deux"> 
                </td>  </tr>`
                )

            } else {


                res_serveur.forEach(element => {


                    //on ajoute tous les serveurs de la salle au tableau
                    $("#table-serveur").append(`<tr class="equipement_serveur">  <th scope="row"> <p id="${element.ID_SERVEUR}-serveur" class="element_serveur" onclick='detail_equip(this.id)'> ${element.NOM} </p> </th> <td class="td-serveur-valeur-un" id="${element.NOM}-choix-un">  </td> <td class="td-serveur-valeur-deux" id="${element.NOM}-choix-deux">  </td>  </tr>`)

                })

                //on ajoute les choix pour le filtre
                for (let element = 0; element <= Object.keys(res_serveur[0]).length - 1; element++) {

                    $("#serveur-choix-un").append(`<option id=${Object.keys(res_serveur[0])[element]}> ${Object.keys(res_serveur[0])[element]} </option>`)
                    $("#serveur-choix-deux").append(`<option id=${Object.keys(res_serveur[0])[element]}> ${Object.keys(res_serveur[0])[element]} </option>`)

                }

                //-------------------- Serveur Choix Un --------------------
                let serveur_valeur_choix_un = document.getElementById("serveur-choix-un");

                serveur_valeur_choix_un.addEventListener("change", function () {

                    let champ_serveur_choix_un_ciblee = $(this).children(":selected").attr("id");

                    fetch(`http://${iPort}/items/SERVEUR?fields=${champ_serveur_choix_un_ciblee}`, option())
                        .then(res_choix => res_choix.text())
                        .then(res_choix => {

                            res_choix = JSON.parse(res_choix).data;


                            for (let element = 0; element < document.querySelectorAll('.td-serveur-valeur-un').length; element++) {

                                let id_choix_cible = document.querySelectorAll('.td-serveur-valeur-un')[element].id;
                                let case_a_remplir = Object.values(res_choix[element]);


                                //on supprime si il y a déjà des informations
                                if ($(`#${id_choix_cible}.td-serveur-valeur-un`).length != 0) {

                                    $(`#${id_choix_cible}.td-serveur-valeur-un p`).remove()

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-serveur-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-serveur-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                } else {

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-serveur-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-serveur-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                }

                            }

                        })
                        .catch(error => console.log('erreur dans le fetch serveur choix un =>', error));

                })


                //-------------------- Serveur Choix Deux --------------------
                let serveur_valeur_choix_deux = document.getElementById("serveur-choix-deux");

                serveur_valeur_choix_deux.addEventListener("change", function () {

                    let champ_serveur_choix_deux_ciblee = $(this).children(":selected").attr("id");

                    fetch(`http://${iPort}/items/SERVEUR?fields=${champ_serveur_choix_deux_ciblee}`, option())
                        .then(res_choix => res_choix.text())
                        .then(res_choix => {

                            res_choix = JSON.parse(res_choix).data;


                            for (let element = 0; element < document.querySelectorAll('.td-serveur-valeur-deux').length; element++) {

                                let id_choix_cible = document.querySelectorAll('.td-serveur-valeur-deux')[element].id;
                                let case_a_remplir = Object.values(res_choix[element]);


                                //on supprime si il y a déjà des informations
                                if ($(`#${id_choix_cible}.td-serveur-valeur-deux`).length != 0) {

                                    $(`#${id_choix_cible}.td-serveur-valeur-deux p`).remove()

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-serveur-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-serveur-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                } else {

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-serveur-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-serveur-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                }

                            }

                        })
                        .catch(error => console.log('erreur dans le fetch serveur choix deux =>', error));


                })

            }


        })
        .catch(error => console.log('erreur dans le fetch serveur =>', error));


    fetch(`http://${iPort}/items/ONDULEUR?filter[ID_SALLE][_eq]=${id_salle}`, option())
        .then(res_onduleur => res_onduleur.text())
        .then(res_onduleur => {

            res_onduleur = JSON.parse(res_onduleur).data;



            //on vérifie si la salle à des serveurs
            if (res_onduleur.length == 0) {

                $("#table-onduleur").append(`<tr class="equipement_onduleur"> 
            <th scope="row">
            <p class="absence-equip"> Pas d'onduleur </p>
            </th> <td class="td-onduleur-valeur-un" id="null-choix-un">
            </td> <td class="td-onduleur-valeur-deux" id="null-choix-deux"> 
            </td>  </tr>
                
            <tr class="equipement_onduleur"> 
            <th scope="row">
            <p class="absence-equip"> Pas d'onduleur </p>
            </th> <td class="td-onduleur-valeur-un" id="null-choix-un">
            </td> <td class="td-onduleur-valeur-deux" id="null-choix-deux"> 
            </td>  </tr>`
                )

            } else {


                res_onduleur.forEach(element => {

                    //on ajoute tous les onduleurs de la salle au tableau
                    $("#table-onduleur").append(`<tr class="equipement_onduleur">  <th scope="row"> <p class="element_onduleur" id="${element.ID_ONDULEUR}-onduleur" onclick='detail_equip(this.id)'> ${element.ID_ONDULEUR} </p> </th> <td class="td-onduleur-valeur-un" id="${element.ID_ONDULEUR}-choix-un">  </td> <td class="td-onduleur-valeur-deux" id="${element.ID_ONDULEUR}-choix-deux">  </td>  </tr>`);

                })

                //on ajoute les choix pour le filtre
                for (let element = 0; element <= Object.keys(res_onduleur[0]).length - 1; element++) {

                    $("#onduleur-choix-un").append(`<option id=${Object.keys(res_onduleur[0])[element]}> ${Object.keys(res_onduleur[0])[element]}  </option>`)
                    $("#onduleur-choix-deux").append(`<option id=${Object.keys(res_onduleur[0])[element]}> ${Object.keys(res_onduleur[0])[element]} </option>`)

                }

                //-------------------- Onduleur Choix Un --------------------
                let onduleur_valeur_choix_un = document.getElementById("onduleur-choix-un");

                onduleur_valeur_choix_un.addEventListener("change", function () {

                    let champ_onduleur_choix_un_ciblee = $(this).children(":selected").attr("id");

                    fetch(`http://${iPort}/items/ONDULEUR?fields=${champ_onduleur_choix_un_ciblee}`, option())
                        .then(res_choix => res_choix.text())
                        .then(res_choix => {

                            res_choix = JSON.parse(res_choix).data;

                            for (let element = 0; element < document.querySelectorAll('.td-onduleur-valeur-un').length; element++) {

                                let id_choix_cible = document.querySelectorAll('.td-onduleur-valeur-un')[element].id;
                                let case_a_remplir = Object.values(res_choix[element]);


                                //on supprime si il y a déjà des informations
                                if ($(`#${id_choix_cible}.td-onduleur-valeur-un`).length != 0) {


                                    $(`#${id_choix_cible}.td-onduleur-valeur-un p`).remove()


                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-onduleur-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-onduleur-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    }


                                } else {


                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-onduleur-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-onduleur-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    }


                                }

                            }


                        })
                        .catch(error => console.log('erreur dans le fetch onduleur choix un =>', error));



                })


                //-------------------- Onduleur Choix Deux --------------------
                let onduleur_valeur_choix_deux = document.getElementById("onduleur-choix-deux");

                onduleur_valeur_choix_deux.addEventListener("change", function () {

                    let champ_onduleur_choix_deux_ciblee = $(this).children(":selected").attr("id");

                    fetch(`http://${iPort}/items/ONDULEUR?fields=${champ_onduleur_choix_deux_ciblee}`, option())
                        .then(res_choix => res_choix.text())
                        .then(res_choix => {

                            res_choix = JSON.parse(res_choix).data;


                            for (let element = 0; element < document.querySelectorAll('.td-onduleur-valeur-deux').length; element++) {

                                let id_choix_cible = document.querySelectorAll('.td-onduleur-valeur-deux')[element].id;
                                let case_a_remplir = Object.values(res_choix[element]);


                                //on supprime si il y a déjà des informations
                                if ($(`#${id_choix_cible}.td-onduleur-valeur-deux`).length != 0) {

                                    $(`#${id_choix_cible}.td-onduleur-valeur-deux p`).remove()

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-onduleur-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-onduleur-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                } else {

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-onduleur-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-onduleur-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                }


                            }


                        })
                        .catch(error => console.log('erreur dans le fetch onduleur choix deux =>', error));



                })

            }

        })
        .catch(error => console.log('erreur dans le fetch onduleur =>', error));


    fetch(`http://${iPort}/items/FIBRE?filter[ID_SALLE][_eq]=${id_salle}`, option())
        .then(res_fibre => res_fibre.text())
        .then(res_fibre => {

            res_fibre = JSON.parse(res_fibre).data;


            //on vérifie si la salle à des serveurs
            if (res_fibre.length == 0) {

                $("#table-fibre").append(`<tr class="equipement_fibre"> 
            <th scope="row">
            <p class="absence-equip"> Pas de fibre </p>
            </th> <td class="td-onduleur-valeur-un" id="null-choix-un">
            </td> <td class="td-onduleur-valeur-deux" id="null-choix-deux"> 
            </td>  </tr>
                        
            <tr class="equipement_fibre"> 
            <th scope="row">
            <p class="absence-equip"> Pas de fibre </p>
            </th> <td class="td-onduleur-valeur-un" id="null-choix-un">
            </td> <td class="td-onduleur-valeur-deux" id="null-choix-deux"> 
            </td>  </tr>`
                )

            } else {


                res_fibre.forEach(element => {


                    //on ajoute toutes les fibres de la salle au tableau
                    $("#table-fibre").append(`<tr class="equipement_fibre">  <th scope="row"> <p id="${element.ID_FIBRE}-fibre" class="element_fibre"  onclick='detail_equip(this.id)'> ${element.ID_FIBRE} </p> </th> <td class="td-fibre-valeur-un" id="${element.ID_FIBRE}-choix-un">  </td> <td class="td-fibre-valeur-deux" id="${element.ID_FIBRE}-choix-deux">  </td>  </tr>`)


                })

                //on ajoute les choix pour le filtre
                for (let element = 0; element <= Object.keys(res_fibre[0]).length - 1; element++) {

                    $("#fibre-choix-un").append(`<option id=${Object.keys(res_fibre[0])[element]}> ${Object.keys(res_fibre[0])[element]}  </option>`)
                    $("#fibre-choix-deux").append(`<option id=${Object.keys(res_fibre[0])[element]}> ${Object.keys(res_fibre[0])[element]} </option>`)

                }


                //-------------------- Fibre Choix Un --------------------
                let fibre_valeur_choix_un = document.getElementById("fibre-choix-un");

                fibre_valeur_choix_un.addEventListener("change", function () {

                    let champ_fibre_choix_un_ciblee = $(this).children(":selected").attr("id");

                    fetch(`http://${iPort}/items/FIBRE?fields=${champ_fibre_choix_un_ciblee}`, option())
                        .then(res_choix => res_choix.text())
                        .then(res_choix => {

                            res_choix = JSON.parse(res_choix).data;


                            for (let element = 0; element < document.querySelectorAll('.td-fibre-valeur-un').length; element++) {

                                let id_choix_cible = document.querySelectorAll('.td-fibre-valeur-un')[element].id;
                                let case_a_remplir = Object.values(res_choix[element]);


                                //on supprime si il y a déjà des informations
                                if ($(`#${id_choix_cible}.td-fibre-valeur-un`).length != 0) {

                                    $(`#${id_choix_cible}.td-fibre-valeur-un p`).remove()

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-fibre-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-fibre-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                } else {

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-fibre-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-fibre-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                }

                            }

                        })
                        .catch(error => console.log('erreur dans le fetch fibre choix un =>', error));


                })

                //-------------------- Fibre Choix Deux --------------------
                let fibre_valeur_choix_deux = document.getElementById("fibre-choix-deux");

                fibre_valeur_choix_deux.addEventListener("change", function () {

                    let champ_fibre_choix_deux_ciblee = $(this).children(":selected").attr("id");

                    fetch(`http://${iPort}/items/FIBRE?fields=${champ_fibre_choix_deux_ciblee}`, option())
                        .then(res_choix => res_choix.text())
                        .then(res_choix => {

                            res_choix = JSON.parse(res_choix).data;


                            for (let element = 0; element < document.querySelectorAll('.td-fibre-valeur-deux').length; element++) {

                                let id_choix_cible = document.querySelectorAll('.td-fibre-valeur-deux')[element].id;
                                let case_a_remplir = Object.values(res_choix[element]);


                                //on supprime si il y a déjà des informations
                                if ($(`#${id_choix_cible}.td-fibre-valeur-deux`).length != 0) {

                                    $(`#${id_choix_cible}.td-fibre-valeur-deux p`).remove()

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-fibre-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-fibre-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    }


                                } else {

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-fibre-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-fibre-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                }

                            }

                        })
                        .catch(error => console.log('erreur dans le fetch fibre choix deux =>', error));


                })
            }

        })
        .catch(error => console.log('erreur dans le fetch fibre =>', error));


    fetch(`http://${iPort}/items/PRISE_RJ45?filter[ID_SALLE][_eq]=${id_salle}`, option())
        .then(res_RJ45 => res_RJ45.text())
        .then(res_RJ45 => {

            res_RJ45 = JSON.parse(res_RJ45).data;

            //on vérifie si la salle à des serveurs
            if (res_RJ45.length == 0) {

                $("#table-RJ45").append(`<tr class="equipement_RJ45"> 
            <th scope="row">
            <p class="absence-equip"> Pas de câble RJ-45 </p>
            </th> <td class="td-RJ45-valeur-un" id="null-choix-un">
            </td> <td class="td-RJ45-valeur-deux" id="null-choix-deux"> 
            </td>  </tr>
                        
            <tr class="equipement_RJ45"> 
            <th scope="row">
            <p class="absence-equip"> Pas de câble RJ-45 </p>
            </th> <td class="td-RJ45-valeur-un" id="null-choix-un">
            </td> <td class="td-RJ45-valeur-deux" id="null-choix-deux"> 
            </td>  </tr>`
                )

            } else {


                res_RJ45.forEach(element => {


                    //on ajoute tous les cables RJ-45 de la salle au tableau
                    $("#table-RJ45").append(`<tr class="equipement_RJ45">  <th scope="row"> <p class="element_RJ45"  id="${element.ID_PRISE}-RJ45" onclick='detail_equip(this.id)'> ${element.NOM_CABLE} </p> </th> <td class="td-RJ45-valeur-un" id="${element.ID_PRISE}-choix-un">  </td> <td class="td-RJ45-valeur-deux" id="${element.ID_PRISE}-choix-deux">  </td>  </tr>`)

                })

                //on ajoute les choix pour le filtre
                for (let element = 0; element <= Object.keys(res_RJ45[0]).length - 1; element++) {

                    $("#RJ45-choix-un").append(`<option id=${Object.keys(res_RJ45[0])[element]}> ${Object.keys(res_RJ45[0])[element]}  </option>`)
                    $("#RJ45-choix-deux").append(`<option id=${Object.keys(res_RJ45[0])[element]}> ${Object.keys(res_RJ45[0])[element]} </option>`)

                }

                //-------------------- RJ45 Choix Un --------------------
                let RJ45_valeur_choix_un = document.getElementById("RJ45-choix-un");

                RJ45_valeur_choix_un.addEventListener("change", function () {


                    let champ_RJ45_choix_un_ciblee = $(this).children(":selected").attr("id");

                    fetch(`http://${iPort}/items/PRISE_RJ45?fields=${champ_RJ45_choix_un_ciblee}`, option())
                        .then(res_choix => res_choix.text())
                        .then(res_choix => {

                            res_choix = JSON.parse(res_choix).data;


                            for (let element = 0; element < document.querySelectorAll('.td-RJ45-valeur-un').length; element++) {

                                let id_choix_cible = document.querySelectorAll('.td-RJ45-valeur-un')[element].id;
                                let case_a_remplir = Object.values(res_choix[element]);


                                //on supprime si il y a déjà des informations
                                if ($(`#${id_choix_cible}.td-RJ45-valeur-un`).length != 0) {

                                    $(`#${id_choix_cible}.td-RJ45-valeur-un p`).remove()

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-RJ45-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-RJ45-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                } else {

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-RJ45-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-RJ45-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                }

                            }

                        })
                        .catch(error => console.log('erreur dans le fetch RJ45 choix un =>', error));


                })

                //-------------------- RJ45 Choix Deux --------------------
                let RJ45_valeur_choix_deux = document.getElementById("RJ45-choix-deux");

                RJ45_valeur_choix_deux.addEventListener("change", function () {

                    let champ_RJ45_choix_deux_ciblee = $(this).children(":selected").attr("id");

                    fetch(`http://${iPort}/items/PRISE_RJ45?fields=${champ_RJ45_choix_deux_ciblee}`, option())
                        .then(res_choix => res_choix.text())
                        .then(res_choix => {

                            res_choix = JSON.parse(res_choix).data;


                            for (let element = 0; element < document.querySelectorAll('.td-RJ45-valeur-deux').length; element++) {

                                let id_choix_cible = document.querySelectorAll('.td-RJ45-valeur-deux')[element].id;
                                let case_a_remplir = Object.values(res_choix[element]);


                                //on supprime si il y a déjà des informations
                                if ($(`#${id_choix_cible}.td-RJ45-valeur-deux`).length != 0) {

                                    $(`#${id_choix_cible}.td-RJ45-valeur-deux p`).remove()

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-RJ45-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-RJ45-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    }


                                } else {

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-RJ45-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-RJ45-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                }

                            }

                        })
                        .catch(error => console.log('erreur dans le fetch RJ45 choix un =>', error));


                })

            }

        })
        .catch(error => console.log('erreur dans le fetch RJ45 =>', error));



    fetch(`http://${iPort}/items/ROCADE_RJ45?filter[ID_SALLE][_eq]=${id_salle}`, option())
        .then(res_rocade => res_rocade.text())
        .then(res_rocade => {

            res_rocade = JSON.parse(res_rocade).data;

            //on vérifie si la salle à des serveurs
            if (res_rocade.length == 0) {

                $("#table-rocade").append(`<tr class="equipement_rocade"> 
            <th scope="row">
            <p class="absence-equip"> Pas de rocade </p>
            </th> <td class="td-rocade-valeur-un" id="null-choix-un">
            </td> <td class="td-rocade-valeur-deux" id="null-choix-deux"> 
            </td>  </tr>
                        
            <tr class="equipement_rocade"> 
            <th scope="row">
            <p class="absence-equip"> Pas de rocade </p>
            </th> <td class="td-rocade-valeur-un" id="null-choix-un">
            </td> <td class="td-rocade-valeur-deux" id="null-choix-deux"> 
            </td>  </tr>`
                )

            } else {


                res_rocade.forEach(element => {

                    //on ajoute toutes les rocades de la salle au tableau
                    $("#table-rocade").append(`<tr class="equipement_rocade">  <th scope="row"> <p class="element_rocade" id="${element.ID_ROCADE}-rocade" onclick='detail_equip(this.id)'> ${element.ROCADE_DEPART_ARRIVE} </p> </th> <td class="td-rocade-valeur-un" id="${element.ID_ROCADE}-choix-un">  </td> <td class="td-rocade-valeur-deux" id="${element.ID_ROCADE}-choix-deux">  </td>  </tr>`)

                })

                //on ajoute les choix pour le filtre
                for (let element = 0; element <= Object.keys(res_rocade[0]).length - 1; element++) {

                    $("#rocade-choix-un").append(`<option id=${Object.keys(res_rocade[0])[element]}> ${Object.keys(res_rocade[0])[element]}  </option>`)
                    $("#rocade-choix-deux").append(`<option id=${Object.keys(res_rocade[0])[element]}> ${Object.keys(res_rocade[0])[element]} </option>`)

                }

                //-------------------- Rocade Choix Un --------------------
                let rocade_valeur_choix_un = document.getElementById("rocade-choix-un");

                rocade_valeur_choix_un.addEventListener("change", function () {

                    let champ_rocade_choix_un_ciblee = $(this).children(":selected").attr("id");

                    fetch(`http://${iPort}/items/ROCADE_RJ45?fields=${champ_rocade_choix_un_ciblee}`, option())
                        .then(res_choix => res_choix.text())
                        .then(res_choix => {

                            res_choix = JSON.parse(res_choix).data;


                            for (let element = 0; element < document.querySelectorAll('.td-rocade-valeur-un').length; element++) {

                                let id_choix_cible = document.querySelectorAll('.td-rocade-valeur-un')[element].id;
                                let case_a_remplir = Object.values(res_choix[element]);


                                //on supprime si il y a déjà des informations
                                if ($(`#${id_choix_cible}.td-rocade-valeur-un`).length != 0) {

                                    $(`#${id_choix_cible}.td-rocade-valeur-un p`).remove()

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-rocade-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-rocade-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                } else {

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-rocade-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-rocade-valeur-un`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                }

                            }

                        })
                        .catch(error => console.log('erreur dans le fetch rocade choix un =>', error));


                })

                //-------------------- Rocade Choix Deux --------------------
                let rocade_valeur_choix_deux = document.getElementById("rocade-choix-deux");

                rocade_valeur_choix_deux.addEventListener("change", function () {

                    let champ_rocade_choix_deux_ciblee = $(this).children(":selected").attr("id");

                    fetch(`http://${iPort}/items/ROCADE_RJ45?fields=${champ_rocade_choix_deux_ciblee}`, option())
                        .then(res_choix => res_choix.text())
                        .then(res_choix => {

                            res_choix = JSON.parse(res_choix).data;


                            for (let element = 0; element < document.querySelectorAll('.td-rocade-valeur-deux').length; element++) {

                                let id_choix_cible = document.querySelectorAll('.td-rocade-valeur-deux')[element].id;
                                let case_a_remplir = Object.values(res_choix[element]);


                                //on supprime si il y a déjà des informations
                                if ($(`#${id_choix_cible}.td-rocade-valeur-deux`).length != 0) {

                                    $(`#${id_choix_cible}.td-rocade-valeur-deux p`).remove()

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-rocade-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-rocade-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                } else {

                                    if (case_a_remplir[0] == null) {

                                        case_a_remplir = "N/A"

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-rocade-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    } else {

                                        //on rempli les cases en fonction de l'information sélectionnées
                                        $(`#${id_choix_cible}.td-rocade-valeur-deux`).append(`<p> ${case_a_remplir} </p>`);

                                    }

                                }

                            }

                        })
                        .catch(error => console.log('erreur dans le fetch rocade choix deux =>', error));


                })

            }

        })
        .catch(error => console.log('erreur dans le fetch rocade =>', error));

}


//affiche les infos de la salle en cliquant dessus
function info_salle(id_salle) {



    fetch(`http://${iPort}/items/SALLE?filter[ID_SALLE][_eq]=${id_salle}`, option())
        .then(res_salle => res_salle.text())
        .then(res_salle => {

            res_salle = JSON.parse(res_salle).data;

            //on supprime si les infos de la salle sont déjà rempli par une autre salle
            $("#batiment, #etage, #acces, #clim, #superficie, #radiateur").remove();



            //on ajoute les informations
            $("#info-lycee").append(`<p id="batiment"> Bâtiment: ${res_salle[0].BATIMENT} </p>`)
            $("#info-lycee").append(`<p id="etage"> Etage: ${res_salle[0].ETAGE} </p>`)
            $("#info-lycee").append(`<p id="acces"> Passe-clé: ${res_salle[0].PASSE_CLE} </p>`)
            $("#info-lycee").append(`<p id="clim"> Clim (VMC): ${res_salle[0].CLIM_VMC} </p>`)
            $("#info-lycee").append(`<p id="superficie"> Superficie: ${res_salle[0].SUPERFICIE} </p>`)
            $("#info-lycee").append(`<p id="radiateur"> Radiateur: ${res_salle[0].RADIATEUR} </p>`)


        })
        .catch(error => console.log('erreur dans le fetch liste_salle =>', error));

}



//permet d'ajouter une salle
function ajout_salle() {


    //permet d'éviter de spammer des champs de texte
    $("#formulaire-ajout-salle").remove();

    //création d'un champ de texte
    $("#div-liste-salle").append(`<div id="formulaire-ajout-salle">
                                  <input type='text' placeholder='nom de la salle' maxlength='15' id='nouvelle-salle' value=''>
                                  <input type='text' placeholder='bâtiment' maxlength='15' id='valeur-batiment' value=''>
                                  <input type='text' placeholder='étage' maxlength='15' id='valeur-etage' value=''>
                                  <input type='text' placeholder='passe-clé' maxlength='15' id='valeur-passe-cle' value=''>
                                  <input type='text' placeholder='clim (VMC)' maxlength='15' id='valeur-clim' value=''>
                                  <input type='number' min='0' step='0.01' placeholder='superficie' id='valeur-superficie' value=''>
                                  <p>Radiateur ?</p>
                                  <label for='valeur-true'> Oui </label>
                                  <input type='radio' name="radiateur-boolean" placeholder='radiateur' id='valeur-true' value='1' checked>
                                  <label for='valeur-false'> Non </label>
                                  <input type='radio' name="radiateur-boolean" placeholder='radiateur' id='valeur-false' value='0'>
                                  <button id='btn-confirmer-ajout-salle' onclick='requete_ajout_salle()'> Confirmer </button>
                                  </div>`
    );

}


async function requete_ajout_salle() {

    let id_salle;

    await fetch(`http://${iPort}/items/SALLE`, {
        method: 'POST',
        headers: {

            "Content-Type": 'application/json',
            "Authorization": `Bearer ${sessionStorage.getItem('token')}`

        },
        body: JSON.stringify({

            'NOM': `${document.getElementById('nouvelle-salle').value}`,
            'BATIMENT': `${document.getElementById('valeur-batiment').value}`,
            'ETAGE': `${document.getElementById('valeur-etage').value}`,
            'PASSE_CLE': `${document.getElementById('valeur-passe-cle').value}`,
            'CLIM_VMC': `${document.getElementById('valeur-clim').value}`,
            'SUPERFICIE': `${document.getElementById('valeur-superficie').value}`,
            'RADIATEUR': `${$('input[name="radiateur-boolean"]:checked').val()}`

        })

    }) //on récupère ensuite l'id de la salle créé qui nous sera utile pour le fetch POSSEDE en dessous
    .then(res => res.text())
    .then(res => {

        id_salle = JSON.parse(res).data['ID_SALLE']

    })



    .catch((err) => {

        console.log("Erreur dans le fetch ajout_salle_salle ->", err);

    });

    await fetch(`http://${iPort}/items/POSSEDE`, {
        method: 'POST',
        headers: {

            "Content-Type": 'application/json',
            "Authorization": `Bearer ${sessionStorage.getItem('token')}`

        },
        body: JSON.stringify({

            'ID_AUDIT': `${sessionStorage.getItem('id_audit')}`,
            'ID_SALLE': `${id_salle}`

        })
    })
        .then(res => {

            if (res.ok) {

                //on ajoute la salle à la liste
                $("#liste-salle").append(`<li class='nom-salle' onclick="info_salle(this.id); affichage_equip(this.id);" id="${id_salle}"> ${document.getElementById('nouvelle-salle').value} </li>`)
                $("#formulaire-ajout-salle").remove();

            }


        })

        .catch((err) => {

            console.log("Erreur dans le fetch ajout_salle_possede ->", err);

        });

}


//permet de rediriger vers la page détail correspondant au type de l'équipement
function detail_equip(nom_equip) {

    sessionStorage.setItem('nom_equip_venant_salle', nom_equip);

    let type_equip = $(`#${nom_equip}`).attr('class');

    switch (type_equip) {
        case 'element_baie':
            document.location.href='../detail_baie/detail_baie.html';
            break;
        case 'element_switch':
            document.location.href='../detail_switch/detail_switch.html';
            break;
        case 'element_serveur':
            document.location.href='../detail_serveur/detail_serveur.html';
            break;
        case 'element_onduleur':
            document.location.href='../detail_onduleur/detail_onduleur.html';
            break;
        case 'element_fibre':
            document.location.href='../detail_fibre/detail_fibre.html';
            break;
        case 'element_RJ45':
            document.location.href='../details_prise_RJ45/detail_prise_RJ45.html';
            break;
        case 'element_rocade':
            document.location.href='../details_rocade_RJ45/detail_rocade_RJ45.html';
            break;
        default:
            console.log("Erreur, type_equip n'est peut-être pas valide.");
    }


}


//on affiche les salles dans la liste
affichage_salle();