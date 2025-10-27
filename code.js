document.addEventListener("DOMContentLoaded", () => {
//Header scroll
    window.addEventListener("scroll", () => {
        const header = document.querySelector(".header");
        if (window.scrollY >50 ) {
            header.classList.add("scrolled");
        }else {
            header.classList.remove("scrolled")
        }
    });

//menu celular
    document.querySelector(".menu-toggle").addEventListener("click", () => {
        document.querySelector(".container-direita").classList.toggle("ativo");
    });

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

    function limparCampos() {
        poke_name.innerHTML = 'Carregando...'
        poke_indice.innerHTML = '';
        poke_altura.innerHTML = '';
        poke_peso.innerHTML = '';
        poke_tipo.innerHTML = '';
        poke_status.innerHTML = '';
        poke_abilidades_lista.innerHTML = '';
    poke_moves_lista.innerHTML = '';
    poke_image.hidden = true;
}
//imagem
poke_image.src = data.sprites.front_default;
poke_image.classList.add("show");

//Função para pegar as informações da API do pokemon
    async function fetch_poke(poke) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke}`);
            if (!response.ok) throw new Error("Pókemon não encontrado!");
            return await response.json();
        } catch (error) {
            poke_name.textContent = "Erro ao buscar pokémon!";
            console.error("Erro:", error);
            return null;
        }
    }

//Função para utilizar as informações da API do pokemon
    async function render_poke(poke) {
        limparCampos();
        const data = await fetch_poke(poke);
        if(!data) return;

        poke_name.textContent = data.name;
        poke_indice.textContent = `#${data.id}`;
        poke_altura.textContent = `${data.height /10} m`;
        poke_peso.textContent = `${data.weight /10} Kg`;
        poke_tipo.textContent = data.types.map(t => t.type.name).join(", ");
        poke_status.textContent = data.stats
            .map(s => `${s.stat.name}: ${s.base_stat}`)
            .join(", ");

        poke_image.src = data.sprites.front_default;
        poke_image.hidden = false;

        data.abilities.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item.ability.name;
            poke_abilidades_lista.appendChild(li);
        });
    
    data.moves.slice(0,10).forEach(item => {
        const li = document.createElement('li');
        const details = item.version_group_details.find(d => d.level_learned_at >=o);
        const nivel = details ? details.level_learned_at : "-";
        const metodo = details ? details.move_learn_method.name : "Desconhecido";
        li.textContent = `{item.move.name} - Nível: ${nivel} | Método: ${metodo}`;
        poke_moves_lista.appendChild(li);
    });

    localStorage.setItem("ultimoPokemon", JSON.stringify({
        name: data.name,
        id: data.id,
        prite: data.sprites.front_default
    }));

        input.value = ''; //Limpa o campo de busca    
    }

//Função para coletar a informação do que o usuário digitou
//toLowerCase transforma o dado a ser passado para a API em letras minúsculas
//Evitando erros na busca

    form.addEventListener("submit", e => {
        e.preventDefault();
        render_poke(input.value.toLowerCase());
    });

    const salvo = json.parse(localStorage.getItem("ultimoPokemon"));
    render_poke(salvo ? salvo.name : "bulbasaur");
});
