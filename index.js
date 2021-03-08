document.addEventListener('DOMContentLoaded', () => {
    aListaCadastrada = Array();
    getLocaisCadastrados();
})


window.addEventListener('keydown', (e) => {
    if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
        if (e.target.nodeName == 'INPUT' && e.target.type == 'text') {
            e.preventDefault();
            return false;
        }
    }
}, true);


function getLocaisCadastrados() {

    if (!aListaCadastrada.length && window.sessionStorage.getItem('arrLocaisTrabalho')) {
        aListaCadastrada = JSON.parse(window.sessionStorage.getItem('arrLocaisTrabalho'));
    }

    let conteudo = document.getElementsByTagName('tbody')[0];

    let aTable = document.getElementById('table__locais');

    /**
     * Pega a partir da primeira tr__conteudo e limpa as informações já renderizadas, evitando a duplicidade.
     */
    for (let count = 7; count < aTable.childNodes[1].childNodes.length; count++) {
        aTable.childNodes[1].childNodes[count].innerHTML = '';
    }

    if (!aListaCadastrada.length) {
        let oNodeVazio = document.createElement('tr');
        oNodeVazio.classList.add('tr__conteudo');
        oNodeVazio.innerHTML = "<td colspan='3'>Nenhum registro informado!</td>"
        conteudo.appendChild(oNodeVazio);
    }

    for (let count = 0; count < aListaCadastrada.length; count++) {

        let oNode = document.createElement('tr');
        oNode.classList.add('tr__conteudo');

        let oNodeChildFirst = document.createElement('td');
        oNodeChildFirst.id = `td__predio${count}`;
        oNodeChildFirst.innerHTML = `
            <select id="select__predio${count}">
                <option value="selecione">Selecione</option>
                <option value="predio1">Prédio 1</option>
                <option value="predio2">Prédio 2</option>
                <option value="predio3">Prédio 3</option>
            </select>
        `;

        let oNodeChildSecond = document.createElement('td');
        oNodeChildSecond.id = `td__localtrabalho${count}`;
        oNodeChildSecond.innerHTML = `<input id="input__local-trabalho${count}" value="${aListaCadastrada[count].localTrabalho}"/>`;

        let divEdition = `
                <div>
                    <a id="td__editaLocal${count}" class="td__editaLocal" alt="Editar Local" onclick="editaLocal(${count})">
                    </a>
                    <a id="td__excluiLocal${count}" class="td__excluiLocal" alt="Excluir Local" onclick="excluiLocal(${count})">
                    </a>
                </div>`;

        let oNodeChildThird = document.createElement('td');
        oNodeChildThird.innerHTML = divEdition;

        oNode.appendChild(oNodeChildFirst);
        oNode.appendChild(oNodeChildSecond);
        oNode.appendChild(oNodeChildThird);
        conteudo.appendChild(oNode);

        document.getElementById(`select__predio${count}`).selectedIndex = aListaCadastrada[count].predio;
        document.getElementById(`select__predio${count}`).disabled = true;

        document.getElementById(`td__localtrabalho${count}`).childNodes[0].disabled = true;
        document.getElementById(`td__localtrabalho${count}`).childNodes[0].style.background = '#fff';

    }
}


function addLocal(event) {

    event.preventDefault();

    if (validaCampos()) {
        let oPredio = document.getElementById('select__predio');
        let oLocalTrabalho = document.getElementById('input__local-trabalho');

        aListaCadastrada.push({
            'predio': oPredio.selectedIndex,
            'localTrabalho': oLocalTrabalho.value
        });
        updateStorage();

        oPredio.selectedIndex = 0;
        oLocalTrabalho.value = '';
    }

}

function updateStorage() {

    if (!aListaCadastrada.length) {
        window.sessionStorage.removeItem('arrLocaisTrabalho');
    } else {
        window.sessionStorage.setItem('arrLocaisTrabalho', JSON.stringify(aListaCadastrada));
    }

    getLocaisCadastrados();

}

function editaLocal(index) {

    if (document.getElementById(`td__editaLocal${index}`).classList.contains('td__editaLocal')) {
        liberaCampos(index);
    } else {

        if (validaCampos(index)) {

            bloqueiaCampos(index);

            let objeto = new Object;
            objeto.predio = document.getElementById(`select__predio${index}`).selectedIndex;
            objeto.localTrabalho = document.getElementById(`input__local-trabalho${index}`).value;
            aListaCadastrada[index] = objeto;

            updateStorage();

        } else {

            liberaCampos(index);

        }

    }

}

function excluiLocal(index) {

    let elementoSelecionado = document.getElementById(`td__excluiLocal${index}`);

    if (elementoSelecionado.classList.contains('td__cancelEdit')) {
        bloqueiaCampos(index);
        getLocaisCadastrados();
        return;
    };

    aListaCadastrada.splice(index, 1);

    updateStorage();

}

function bloqueiaCampos(index) {

    document.getElementById(`td__editaLocal${index}`).classList.remove('td__editConfirm');
    document.getElementById(`td__editaLocal${index}`).classList.add('td__editaLocal');

    document.getElementById(`td__excluiLocal${index}`).classList.remove('td__cancelEdit');
    document.getElementById(`td__excluiLocal${index}`).classList.add('td__excluiLocal');

    document.getElementById(`select__predio${index}`).disabled = true;
    document.getElementById(`td__localtrabalho${index}`).childNodes[0].disabled = true;
    document.getElementById(`td__localtrabalho${index}`).childNodes[0].style.border = 'none';

}

function liberaCampos(index) {

    document.getElementById(`td__editaLocal${index}`).classList.remove('td__editaLocal');
    document.getElementById(`td__editaLocal${index}`).classList.add('td__editConfirm');

    document.getElementById(`td__excluiLocal${index}`).classList.remove('td__excluiLocal');
    document.getElementById(`td__excluiLocal${index}`).classList.add('td__cancelEdit');

    document.getElementById(`select__predio${index}`).disabled = '';
    document.getElementById(`td__localtrabalho${index}`).childNodes[0].disabled = '';
    document.getElementById(`td__localtrabalho${index}`).childNodes[0].style.border = '1px solid #000';

}

function validaCampos(index) {

    let idPredio = (index != null || index !== undefined) ? `select__predio${index}` : 'select__predio';
    let idLocalTrabalho = (index != null || index !== undefined) ? `input__local-trabalho${index}` : 'input__local-trabalho';

    let predioSelecionado = document.getElementById(idPredio);

    if (!predioSelecionado.selectedIndex) {
        alert('Prédio selecionado inválido. Verifique!');
        predioSelecionado.focus();
        return false;
    }

    let localTrabalho = document.getElementById(idLocalTrabalho);

    if (!localTrabalho.value.trim()) {
        alert('Campo Local de Trabalho é obrigatório. Verifique!');
        localTrabalho.focus();
        return false;
    }

    return true;

}