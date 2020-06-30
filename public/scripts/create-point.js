

function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() )
    .then( states => { 
            /* ufSelect.innerHTML =  `<option value="1">Valor</option>` */ //Propriedade de elementos de HTML (De um select)
            for( const state of states){
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
            }
        })
    }

populateUFs()

function getCities(event){
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufValue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex;
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTM = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( res => res.json() )
    .then( cities => { 
            /* ufSelect.innerHTML =  `<option value="1">Valor</option>` */ //Propriedade de elementos de HTML (De um select)
            for( const city of cities){
                citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
            }

            citySelect.disabled = false
        })
}

document.querySelector("select[name=uf]").addEventListener("change", getCities)

// Itens de Coleta
// Pegar todos os li's
const itemsToCollection = document.querySelectorAll(".items-grid li");

for (const item of itemsToCollection){
    item.addEventListener("click", handleSelectedItem)
}


const collectedItems = document.querySelector("input[name=items]");

let selectedItems = []; //E uma selecao de dados Array

function handleSelectedItem(event){
    const itemLi = event.target;
    // adicionar ou remover uma classe com Javascript
    itemLi.classList.toggle("selected"); // Adiciona ou remove o toggle o elemento.
    
    const itemId = itemLi.dataset.id;

    console.log('ITEM ID: ', itemId)


    // Verificar se existem items selecionados, se sim
    // Pegar os itens selecionados e colocar no array

    const alreadySelected = selectedItems.findIndex( item =>{
        const itemFound = item == itemId; // Isso será true ou false.
        return itemFound
    })

    // Se já estiver selecionado, tirar da seleção
    if(alreadySelected >= 0){
        //tirar da selecao
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId; // retorna false
            return itemIsDifferent
        })
        
        selectedItems = filteredItems;
    } else {
            // se não estiver selecionado, adicionar a seleção
            // adicionar a selecao
        selectedItems.push(itemId);
    }

    console.log("selectedItems: ", selectedItems)

    // atualizar o campo escondido com os Items selecionados.
    collectedItems.value = selectedItems;
}