const root = ''

function searchByIP() {
    $("#loadingmodal").modal("toggle");
    let ip1, ip2, field, url;

    field = document.getElementById('field').value;
    ip1 = document.getElementById('ip1').value;
    ip2 = document.getElementById('ip2').value;
    url = root + 'field/' + field + '/ip/' + ip1 + '/' + ip2;

    GEThttpRequest(url);
}

function searchByMac() {
    $("#loadingmodal").modal("toggle");
    let field, mac;
    
    field = document.getElementById('field').value;
    mac = document.getElementById('mac').value.toLowerCase();
    url = root + 'field/' + field + '/mac/' + mac;
    GEThttpRequest(url);
}
    

function createReservation() {
    var reservation = {
        ip: document.getElementById('inicioIP').textContent + '.' + document.getElementById('ip1').value + '.' + document.getElementById('ip2').value,
        mac: document.getElementById('mac').value.toLowerCase(),
        hostname: document.getElementById('hostname').value,
        description: document.getElementById('description').value
    };
    var field = document.getElementById('field').value;
    createOrDeleteReservation(true, reservation, field);
}

function deleteReservation(id) {
    console.log('Chegou no delete reservation');
    $("#questionmodal").modal("toggle");
    //questionmodal
}

function createOrDeleteReservation(create, reservation, field) {
    if (create) {
        let url = root + 'create/' + field
        POSThttpRequest(url, reservation);
    } else {
        let url = root + 'delete/' + field
        DELETEhttpRequest(url, reservation);
    }
}

function DELETEhttpRequest(url, reservation) {
    var request = new XMLHttpRequest();
    var data = JSON.stringify(reservation);
    request.open('DELETE', url, true);
    request.onload = function() {
        var json = JSON.parse(request.responseText);
        if (request.readyState == 4 && request.status == 200) {
            callModal('Concluído!','Reserva deletada com sucesso.')
        } else {
            callModal('Erro!','Erro ao deletar reserva')
        }
    }
}

function GEThttpRequest(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
        if (request.status == 200) {
            var reservation = JSON.parse(this.response);
            if(Array.isArray(reservation)) {
                for (var i = 0; i < reservation.length; i++) {
                    makeCard(reservation[i]);
                    $("#loadingmodal").modal("hide");
                }
            }else {
                makeCard (reservation);
                $("#loadingmodal").modal("hide");
            }
        } else if (request.status == 204) {
            callModal('Aviso!','Reserva não encontrada!')
        } else {
            callModal('Erro!','Erro ao efetuar consulta')
        }
    }
    request.send();
}


function POSThttpRequest(url, reservation) {
    var request = new XMLHttpRequest();
    var data = JSON.stringify(reservation);
    request.open('POST', url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.onload = function () {
        var json = JSON.parse(request.responseText);
        if (request.readyState == 4 && request.status == 201) {
            callModal('Concluído!','Reserva criada com sucesso.')
            makeCard(reservation);
        } else {
            callModal('Erro!','Erro ao criar reserva')
            console.log(json)
            //necessário tratativa de erro com base na msg recebida pela api
        }
    }
    request.send(data);
}

function callModal(title, msg) {
    $("#loadingmodal").modal("hide");
    document.getElementById('modalmsg').innerHTML = msg;
    document.getElementById('modaltitle').innerHTML = title;
    setTimeout(function() {
        $('#modalalert').modal('toggle')
    }, 1000)
}

function changeIP() {
    field = document.getElementById('field').value;
    if (field == 'FL') {
        document.getElementById('inicioIP').textContent = '172.22';
    } else if (field == 'BL5' || field == 'EDTECH') {
        document.getElementById('inicioIP').textContent = '172.23';
    } else if (field == 'BL8') {
        document.getElementById('inicioIP').textContent = '172.19';
    } else if (field == 'GLETE') {
        document.getElementById('inicioIP').textContent = '172.18';
    } else if (field == 'ANGELICA') {
        document.getElementById('inicioIP').textContent = '172.29';
    } else if (field == 'CURITIBA' || field == 'RJ' || field == 'BH' || field == 'BRASILIA') {
        document.getElementById('inicioIP').textContent = '172.30';
    } else if (field == 'ARARAQUARA' || field == 'PG' || field == 'TAMBORE' || field == 'MARINGA' || field == 'POA' || field == 'UBERLANDIA') {
        document.getElementById('inicioIP').textContent = '172.21';
    }
}

function clearAll() {
    document.getElementById('description').value = '';
    document.getElementById('hostname').value = '';
    document.getElementById('ip1').value = '';
    document.getElementById('ip2').value = '';
    document.getElementById('mac').value = '';
    document.getElementById('field').value = 'FL';
    changeIP();
    document.getElementById('dados').innerHTML = '';
    i = 0
    j = 1
    k = 50
}
//Criação de cards
var i = 0
var j = 1
var k = 50

function makeCard (reservation) {
    let row = document.createElement('div');
        row.className = 'row';
    let col = document.createElement('div');
        col.className = 'col-lg-4';
        row.id = i;
        row.appendChild(col);
    let card = document.createElement('div');
        card.className = 'card';
        col.appendChild(card);
    let cardbody = document.createElement('div');
        cardbody.className = 'card-body';
        cardbody.id = k;
        card.appendChild(cardbody)
    //Encapsular o h5 e p em uma div para ficar fácil o retorno dos dados pelo ID
        let h5 = document.createElement('h5');
        h5.className = 'card-title';
        h5.innerHTML = 'IP: '+reservation.ip
    let p = document.createElement('p')
        p.className = 'card-text'
        p.innerHTML = 'MAC: '+reservation.mac+'<br>'+'Description: '+reservation.description+'<br>'+'Hostname: '+reservation.hostname;  
    //Criar uma div onde irá conter o botão para fechar a reserva
    let deletebtn = document.createElement('button');
        deletebtn.innerHTML = 'Deletar'
        deletebtn.className = 'btn btn-outline-danger btn-sm ml-auto'
        deletebtn.setAttribute('onclick','deleteReservation('+k+')');
    cardbody.appendChild(h5);
    cardbody.appendChild(p);
    cardbody.appendChild(deletebtn);
    if (i % 3 === 0 || i === 0) {
        document.getElementById('dados').appendChild(row);
        j = i;
    } else {
        document.getElementById(j).appendChild(col);
    }
    i++
    k++
}
//Fim da criação de cards