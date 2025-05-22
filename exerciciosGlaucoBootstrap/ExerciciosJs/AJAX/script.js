$(document).ready(function() {
        const totalPokemons = 168;
        const pokemonsPerPage = 10;
        const totalPages = Math.ceil(totalPokemons / pokemonsPerPage);
        let allPokemons = [];
        let currentPage = 1;

        // Carrega todos os Pokémon
        function loadAllPokemons() {
            for (let id = 1; id <= totalPokemons; id++) {
                $.getJSON(`https://pokeapi.co/api/v2/pokemon/${id}`, function(pokemon) {
                    allPokemons.push({
                        id: pokemon.id,
                        name: pokemon.name,
                        sprite: pokemon.sprites.front_default,
                        height: (pokemon.height / 10).toFixed(1),
                        weight: (pokemon.weight / 10).toFixed(1),
                        species: pokemon.species.name
                    });

                    // Quando todos os Pokémon forem carregados
                    if (allPokemons.length === totalPokemons) {
                        createPagination();
                        showPage(1);
                    }
                }).fail(function() {
                    console.log(`Erro ao carregar Pokémon ${id}`);
                });
            }
        }

        // Mostra uma página específica
        function showPage(page) {
            currentPage = page;
            const startIndex = (page - 1) * pokemonsPerPage;
            const endIndex = Math.min(startIndex + pokemonsPerPage, allPokemons.length);
            
            $('#pokemonTable').empty();
            
            for (let i = startIndex; i < endIndex; i++) {
                const pokemon = allPokemons[i];
                const row = `
                    <tr>
                        <td>${pokemon.id}</td>
                        <td>${pokemon.name}</td>
                        <td><img src="${pokemon.sprite}" alt="${pokemon.name}" class="pokemon-sprite"></td>
                        <td>${pokemon.height}</td>
                        <td>${pokemon.weight}</td>
                        <td>${pokemon.species}</td>
                    </tr>
                `;
                $('#pokemonTable').append(row);
            }
            
            updatePaginationButtons();
        }

        // Cria os botões de paginação
        function createPagination() {
            const pagination = $('#pagination');
            pagination.empty();
            
            // Botão Anterior
            pagination.append(`
                <li class="page-item" id="prevButton">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
            `);
            
            // Botões de página
            for (let i = 1; i <= totalPages; i++) {
                pagination.append(`
                    <li class="page-item page-number ${i === 1 ? 'active' : ''}">
                        <a class="page-link" href="#">${i}</a>
                    </li>
                `);
            }
            
            // Botão Próximo
            pagination.append(`
                <li class="page-item" id="nextButton">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            `);
            
            // Event listeners
            $('.page-number').click(function() {
                const page = parseInt($(this).text());
                showPage(page);
            });
            
            $('#prevButton').click(function() {
                if (currentPage > 1) {
                    showPage(currentPage - 1);
                }
            });
            
            $('#nextButton').click(function() {
                if (currentPage < totalPages) {
                    showPage(currentPage + 1);
                }
            });
        }
        
        // Atualiza o estado dos botões de paginação
        function updatePaginationButtons() {
            $('.page-number').removeClass('active');
            $(`.page-number:contains('${currentPage}')`).addClass('active');
            
            $('#prevButton').toggleClass('disabled', currentPage === 1);
            $('#nextButton').toggleClass('disabled', currentPage === totalPages);
        }

        // Inicia o carregamento
        loadAllPokemons();
    });