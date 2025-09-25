//Pega a informação do html e cria uma variavel para ser usada no js

const poke_name = document.querySelector('.poke_name');    
const poke_indice = document.querySelector('.poke_indice');
const poke_image = document.querySelector('.poke_image');
const poke_altura = document.querySelector('.poke_altura');
const poke_peso = document.querySelector('.poke_peso');
const poke_tipo = document.querySelector('.poke_tipo');
const poke_status = document.querySelector('.poke_status');
const poke_abilidades_lista = document.querySelector('.poke_abilidades');
const poke_moves_lista = document.querySelector('.poke_moves');

const form = document.querySelector('.form');
const input = document.querySelector('.input_search');


//Função para pegar as informações da API do pokemon
const fech_poke = async (poke) => {
    const api_Response = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke}`);

    if (api_Response.status === 200) {
        const data = await api_Response.json();
        return data;    
    }
}    

//Função para utilizar as informações da API do pokemon

const render_poke = async (poke) => {
    
    poke_name.innerHTML = 'Carregando...'
    poke_indice.innerHTML = '';
    poke_altura.innerHTML = '';
    poke_peso.innerHTML = '';
    poke_tipo.innerHTML = '';
    poke_status.innerHTML = '';
    poke_abilidades_lista.innerHTML = '';
    poke_moves_lista.innerHTML = '';
    poke_image.style.display = 'none';

    const data = await fech_poke(poke);

    if (data) {
        poke_name.innerHTML = data.name;
        poke_indice.innerHTML = `#${data.id}`;
        poke_altura.innerHTML = `${data.height /10} m`;
        poke_peso.innerHTML = `${data.weight /10} Kg`;
        poke_tipo.innerHTML = data.types.map(type => type.type.name).join(', ');
        poke_status.innerHTML = `HP: ${data.stats[0].base_stat}, Atk: ${data.stats[1].base_stat}, Def: ${data.stats[2].base_stat}, 
        SAtk: ${data.stats[3].base_stat}, SDef: ${data.stats[4].base_stat}, Spd: ${data.stats[5].base_stat}`;

        poke_image.src = data.sprites.front_default;
        poke_image.style.display = 'block';
        
        
        data.abilities.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.ability.name;
            poke_abilidades_lista.appendChild(li);
        });

        data.moves.slice(0,10).forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.move.name;
            const move_name = item.move.name;

            const move_details = item.version_group_details.find(detail => detail.level_learned_at > -1);
            const level = move_details ? move_details.level_learned_at : 'Não disponível';
            const metodo_aprendizado = move_details ? move_details.move_learn_method.name : 'Método não dispinível';
            li.innerHTML = `${move_name} - Nível: ${level} | Método: ${metodo_aprendizado}`;
            poke_moves_lista.appendChild(li);
        })
    
        input.value = ''; //Limpa o campo de busca   
    } else {
        poke_image.style.display = 'none';
        poke_name.innerHTML = 'Pokemon não encontrado';
        poke_indice.innerHTML = '';
    }
}

//Função para coletar a informação do que o usuário digitou
//toLowerCase transforma o dado a ser passado para a API em letras minúsculas
//Evitando erros na busca
form.addEventListener('submit', (event) => {
    event.preventDefault();
    render_poke(input.value.toLowerCase());
});

render_poke('bulbasaur');
