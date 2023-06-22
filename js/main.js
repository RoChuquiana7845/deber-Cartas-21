class Player { 
    constructor(name, score, divCards, sumOfCards, namedeck) { 
        this.name = name;
        this.score = score; 
        this.divCards = divCards;
        this.sumOfCards = sumOfCards;
        this.namedeck = namedeck;
        this.apiUrl = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'; 
        this.points = 0;
        this.gamesWon = 0;
        this.deck = "";

    }

    getName() { 
        this.name.innerHTML = prompt("Ingrese el nombre del jugador 1");
    }

    showDeck () { 
        this.namedeck.forEach((text)=>{
            text.innerHTML += this.deck;
        })
    }

    showSumofCards(value) {
        if (value == "KING" || value == "QUEEN" || value == "JACK") { 
            this.points += 10;
        } else if (value == "ACE") { 
            this.points += 1;
        } else { 
            this.points += Number(value);
        }
        this.sumOfCards.textContent = this.points;
    }

    pointForRoundVictory(mensaje) { 
        this.gamesWon += 1;
        alert(mensaje);
        this.score.innerHTML = this.gamesWon;
    }

    async playUser() { 
        try { 
            const response = await fetch('https://deckofcardsapi.com/api/deck/' + this.deck + '/draw/?count=1');
            const result = await response.json();
            let div = document.createElement('div'); 
            div.setAttribute('id', 'cartas-jugador'); 
            div.setAttribute('class', 'carta');
            div.innerHTML += `<img class="carta-img flip-in-ver-right" src="${result.cards[0].image}" alt="Carta: ${result.cards[0].value} ${result.cards[0].suit}">`;
            this.divCards.appendChild(div);
            this.showSumofCards(result.cards[0].value);
        } catch(error) { 
            console.log("Error: "+ error);
        }
    }


    async stardeckOfCard() { 
        try { 
            const response = await fetch(this.apiUrl);
            const result = await response.json();
            this.deck = await result.deck_id; 
            this.showDeck();
        }
        catch (error) { 
            console.log("Error: "+ error);
        }
    }

}

class UserPlayer extends Player { 
    constructor(name, score, divCards, sumOfCards, namedeck, request) { 
        super(name, score, divCards, sumOfCards, namedeck);
        this.request = request;
    }

    getReady() { 
        this.request.addEventListener("click", ()=> { 
            this.playUser();
        })
    } 
}

class MachinePlayer extends Player { 
    play(URLdeck) {
        let probabilidad = Math.floor(Math.random()*4);
        switch(probabilidad) { 
            case 1: 
                this.mechanismPlayer( 11, URLdeck);break;
            case 2: 
                this.mechanismPlayer(17, URLdeck);break;
            case 3: 
                this.mechanismPlayer(20, URLdeck);break;
        }
        
    }

    mechanismPlayer(level, URLdeck) { 
        if(this.points <= level) { 
            this.playUser(URLdeck);
        } else { 
            alert("Paso🥸");
        }
    }
}

class Game { 
    constructor(player1, player2, gameProcess) { 
        this.player1 = player1;
        this.player2 = player2;
        this.gameProcess = gameProcess;
    }

    async starGame() { 
        await this.player1.getName();
        await this.player2.getName();
        await this.player1.stardeckOfCard();
        await this.player1.getReady();
        this.player2.deck = this.player1.deck;
        this.process();
        this.startCardsOfPlayers();
    }

    startCardsOfPlayers() { 
        for (let i = 0; i<2; i++) { 
            this.player1.playUser(this.player1.deck);
            this.player2.mechanismPlayer(11);
        };
    }

    process() { 
        this.gameProcess.addEventListener("click" ,()=> {
            setTimeout(this.checkRoundWinner(), 3000)
        })   
    }

    checkRoundWinner() { 
        console.log(this.player1.points);
        if (this.player1.points >= 21 || this.player2.points >=21) {
            if (this.player1.points == 21 || this.player1.points <= this.player2.points) { 
                this.player1.pointForRoundVictory(`Ganaste 🤗: PuntajeUsuario: ${this.player1.points}, PuntajeMaquina: ${this.player2.points}`);
            } else if(this.player2.points == 21 || this.player2.points <= this.player1.points) { 
                this.player2.pointForRoundVictory(`Ganó la IA 🤖: PuntajeUsuario: ${this.player1.points}, PuntajeMaquina: ${this.player2.points}`)
            }
        }
    }
     
}

const playeruser = new UserPlayer(document.querySelector("#jugador1"), document.querySelector("#jugador1puntos"), document.querySelector("#cartas-jugador"), document.querySelector("#puntajejugador"), document.querySelectorAll("#text-mazo"), document.querySelector("#solicitar-carta"));
const playermachine = new MachinePlayer(document.querySelector("#jugador2"), document.querySelector("#jugador2puntos"), document.querySelector("#cartas-maquina"), document.querySelector("#puntajemaquina") , document.querySelectorAll("#text-mazo"));
const game1 = new Game(playeruser, playermachine, document.querySelector(".control-jugador")); 
game1.starGame();