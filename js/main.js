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
        Saludar()
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
        this.checkRoundLooser();
        this.sumOfCards.textContent = this.points;
    }

    checkRoundLooser() { 
        if (this.points>= 21) { 
            alert('Perdiste');
        }
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
class MachinePlayer extends Player { 
    play() {
        let probabilidad = Math.floor(Math.random()*4);
        switch(probabilidad) { 
            case 1: 
                this.mechanismPlayer( 11);break;
            case 2: 
                this.mechanismPlayer(17);break;
            case 3: 
                this.mechanismPlayer(20);break;
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
    constructor(player1, player2, request, pass, exitbutton, restartbutton) { 
        this.player1 = player1;
        this.player2 = player2;
        this.request = request;
        this.pass = pass;
        this.exitbutton = exitbutton;
        this.restartbutton = restartbutton;
    }

    async starGame() { 
        await this.player1.getName();
        await this.player1.stardeckOfCard();
        this.player2.deck = this.player1.deck;
        this.startCardsOfPlayers();
        this.getReady();
        this.passTurn();
        this.exit();
        this.restart();
    }

    getReady() { 
        this.request.addEventListener("click", ()=> { 
            this.player1.playUser();
            this.player2.play();
            setInterval(this.checkRoundWinner(), 5000)
            
        })
    } 

    passTurn() { 
        this.pass.addEventListener('click', ()=> { 
            this.player2.play();
            this.checkRoundWinner();
        })
    }

    startCardsOfPlayers() { 
        for (let i = 0; i<2; i++) { 
            this.player1.playUser();
            this.player2.mechanismPlayer(11);
        };
    }

   

    checkRoundWinner() { 
        console.log(this.player1.points);
        if (this.player1.points > 21 && this.player2.points >21) { 
            alert("Empate");
        } else if (this.player1.points >= 21 || this.player2.points >=21) {
            if (this.player1.points == 21 || this.player1.points <= this.player2.points) { 
                this.player1.pointForRoundVictory(`Ganaste 🤗: PuntajeUsuario: ${this.player1.points}, PuntajeMaquina: ${this.player2.points}`);
            } else if(this.player2.points == 21 || this.player2.points <= this.player1.points) { 
                this.player2.pointForRoundVictory(`Ganó la IA 🤖: PuntajeUsuario: ${this.player1.points}, PuntajeMaquina: ${this.player2.points}`)
            } else { 
                alert('Empate');
            }
        }
    }

    restart() { 
        this.restartbutton.addEventListener('click', ()=> { 
            this.player1.points = 0;
            this.player2.points = 0;
            this.player1.sumOfCards.textContent = 0;
            this.player2.sumOfCards.textContent = 0;
            document.querySelectorAll("#cartas-jugador").forEach((card)=>{
                card.remove();
            })
        })
    }

    exit() {
        this.exitbutton.addEventListener("click", ()=> {
            alert(`Gracias por jugar. Estadisticas: Jugador ${this.player1.name.textContent}: ${this.player1.gamesWon} vs AI Opponent🤖: ${this.player2.gamesWon}`)
            location.reload();
        })
    }
     
}

const playeruser = new Player(document.querySelector("#jugador1"), document.querySelector("#jugador1puntos"), document.querySelector("#cartas-jugador"), document.querySelector("#puntajejugador"), document.querySelectorAll("#text-mazo"));
const playermachine = new MachinePlayer(document.querySelector("#jugador2"), document.querySelector("#jugador2puntos"), document.querySelector("#cartas-maquina"), document.querySelector("#puntajemaquina") , document.querySelectorAll("#text-mazo"));
const game1 = new Game(playeruser, playermachine, document.querySelector("#solicitar-carta"), document.querySelector("#plantarse"), document.querySelector("#finalizar"), document.querySelector("#reiniciar")); 
game1.starGame();