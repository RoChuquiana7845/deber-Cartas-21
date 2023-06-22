class Card { 
    constructor(value,type, cardImage) {
        this.value = value;
        this.type = type; 
        this.cardImage  = cardImage
    }

    
}

class DeckOfCard { 
    constructor(type) { 
        this.apiUrl = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'; 
        this.type = type;
        this.deck = "";
        this.cards = []
    }

    showDeck () { 
        this.type.forEach((text)=>{
            text.innerHTML += this.deck;
        })
    }

    getCard() { 
        fetch('https://deckofcardsapi.com/api/deck/' + this.deck + '/draw/?count=1')
        .then((result)=> {
            result.json();
        })
        .then((result)=> {
            const value = result.cards[0].value;
            const type = result.cards[0].suit;
            const img = result.cards[0].image;
            const card = [];
            card.push(value);
            card.push(type);
            card.push(img);
            this.cards.push(card);
        })
    }

    async starCard() { 
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


class Player {
    constructor(name, score, divCards, sumOfCards, deckOfCard) { 
        this.name = name;
        this.score = score; 
        this.divCards = divCards;
        this.sumOfCards = sumOfCards;
        this.deckOfCard = deckOfCard;
        this.points = 0;
        this.gamesWon = 0;
        this.cardused = -1;
        this.mycards = [];
    }

    getName() { 
        this.name.innerHTML = prompt("Ingrese el nombre del jugador 1");
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
}

class UserPlayer extends Player { 
    constructor(name, score, divCards, sumOfCards, deckOfCard, request) { 
        super(name, score, divCards, sumOfCards, deckOfCard);
        this.request = request;
    }

    getReady() { 
        this.request.addEventListener("click", ()=> { 
            this.playUser();
        })
    } 
}

class MachinePlayer extends Player { 
    play() {
        let probabilidad = Math.floor(Math.random()*4);
        switch(probabilidad) { 
            case 1: 
                this.mechanismPlayer( 11);break;
            case 2: 
                this.mechanismPlayer(14);break;
            case 3: 
                this.mechanismPlayer(17);break;
                

        }
        
    }

    mechanismPlayer(level) { 
        if(this.points <= level) { 
            this.playUser();
        } else { 
            alert("Paso🥸");
        }
    }
}

class Game { 
    constructor(deckOfCard, player1, player2, gameProcess) { 
        this.deckOfCard = deckOfCard;
        this.player1= player1;
        this.player2 = player2; 
        this.gameProcess = gameProcess;

    }

    process() { 
        this.gameProcess.addEventListener("click" ,()=> {
            this.cardused += 1
            this.player2.play();
            this.checkRoundWinner();
        })   
    }

    checkRoundWinner() { 
        if (this.player1.points >= 21 || this.player2.points >=21) {
            if (this.player1.points == 21 || this.player1.points <= this.player2.points) { 
                this.player1.pointForRoundVictory(`Ganaste 🤗: PuntajeUsuario: ${this.player1.points}, PuntajeMaquina: ${this.player2.points}`);
            } else if(this.player2.points == 21 || this.player2.points <= this.player1.points) { 
                this.player2.pointForRoundVictory(`Ganó la IA 🤖: PuntajeUsuario: ${this.player1.points}, PuntajeMaquina: ${this.player2.points}`)
            }
        }
    }

    restart() {
        console.log("Hola");
    }

    async starGame() { 
        try { 
            this.deckOfCard.starCard();
            await this.player1.getName();
            await this.player2.getName();
            this.baraja = await this.deckOfCard.deck;
            await this.player1.getReady();
            this.startCardsOfPlayers();
            this.process();
        }  catch (error) { 
            console.log("Error: "+ error);
        }
    }

    startCardsOfPlayers() { 
        for (let i = 0; i<2; i++) { 
            this.player1.playUser();
            this.player2.mechanismPlayer(11);
        };
    }

}

const deckOfCard = new DeckOfCard(document.querySelectorAll("#text-mazo"));
const playeruser = new UserPlayer(document.querySelector("#jugador1"), document.querySelector("#jugador1puntos"), document.querySelector("#cartas-jugador"), document.querySelector("#puntajejugador"), deckOfCard, document.querySelector("#solicitar-carta"));
const playermachine = new MachinePlayer(document.querySelector("#jugador2"), document.querySelector("#jugador2puntos"), document.querySelector("#cartas-maquina"), document.querySelector("#puntajemaquina") ,deckOfCard);
const game1 = new Game(deckOfCard, playeruser, playermachine, document.querySelector(".control-jugador")); 
game1.starGame();