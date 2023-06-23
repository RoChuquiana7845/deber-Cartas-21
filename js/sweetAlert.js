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
        Swal.fire({
            html: `
            <div style:'border-radius:5%; font-family: 'Times New Roman';'>
                <div>
                    <h1 style='color:#fff; background: #000';>Bienvenido al mejor juego del 21 🤗</h1>
                    <h2 style='color:#fff; background: green; border-radius:3%'>Por favor presione comenzar para empezar a jugar 😊</h2>
                    <video src="../video/hey ya! pero en 8bit.mp4" width="300" height="350" controls autoplay loop></video>
            </div>
            `,
            title: 'Ingrese el nombre del jugador',
            input: 'text',
            confirmButtonText: 'Comenzar',
            width: '90%',
            height: '80%',
            background: '#000',
            color: '#fff'
        })
        .then((resultado)=>{ 
            this.name.innerHTML = resultado.value;
        })
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

    pointForRoundVictory(mensaje, estadisticas) { 
        this.gamesWon += 1;
        Swal.fire({ 
            html: `
            <div style:'border-radius:5%; font-family: 'Times New Roman';'>
                <h2>${mensaje}</h2>
                <iframe width="350" height="500" src="https://www.youtube.com/embed/OyHImE9hQmQ" title="John Cena  Dancing Tiktok Mem original" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                <p>Estadisticas:</p><br>
                <p><span>${estadisticas}</span></p>
            </div>
            `,
            width: '500px',
            height: '500px',
            background: '#000',
            color: '#fff'    
        })
        alert(mensaje);
        this.score.innerHTML = this.gamesWon;
    }

    async playUser() { 
        try { 
            const response = await fetch('https://deckofcardsapi.com/api/deck/' + this.deck + '/draw/?count=1');
            const result = await response.json();
            let div = document.createElement('div'); 
            div.setAttribute('id', 'carta-jugador'); 
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

class UserPLayer extends Player { 
    checkRoundLooser() { 
        if (this.points> 21) { 
            Swal.fire({
                html: `
                <div style:'border-radius:5%; font-family: 'Times New Roman';'>
                    <h2>Perdiste 😭😭</h2>
                    <iframe width="500" height="315" src="https://www.youtube.com/embed/xaZfsypesSs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
                `,
                width: '500px',
                height: '500px',
                background: '#000',
                color: '#fff'
            })
            let points =document.querySelector('#jugador2puntos').innerHTML;
            points++;
            document.getElementById('jugador2puntos').innerText=points;
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

    checkRoundLooser() { 
        if (this.points> 21) { 
            Swal.fire({
                html: `
                <div style:'border-radius:5%; font-family: 'Times New Roman';'>
                    <h2>Perdio la AI 😭🤖😭</h2>
                    <iframe width="500" height="315" src="https://www.youtube.com/embed/xaZfsypesSs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
                `,
                width: '500px',
                height: '500px',
                background: '#000',
                color: '#fff'
            });
            let points =document.querySelector('#jugador1puntos').innerHTML;
            points++;
            document.getElementById('jugador1puntos').innerText=points;
        }
    }

    mechanismPlayer(level) { 
        if(this.points <= level) { 
            this.playUser();
        } else { 
            Swal.fire({
                html: `
                <h2>Paso🥸</h2>
                <div style='position:relative; padding-bottom:calc(57.50% + 44px)'><iframe src='https://gfycat.com/ifr/LawfulInformalAntelopegroundsquirrel' frameborder='0' scrolling='no' width='100%' height='100%' style='position:absolute;top:0;left:0;' allowfullscreen></iframe></div>`,
                confirmButtonText: `Aceptar que la AI es mas inteligente :v`,
                width: '500px',
                height: '500px',
                background: '#000',
                color: '#fff'

            })
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
                this.player1.pointForRoundVictory(`Ganaste 🤗`, `PuntajeUsuario: ${this.player1.points} vs PuntajeMaquina: ${this.player2.points}`);
            } else if(this.player2.points == 21 || this.player2.points <= this.player1.points) { 
                this.player2.pointForRoundVictory(`Ganó la IA 🤖`, `PuntajeUsuario: ${this.player1.points}vs PuntajeMaquina: ${this.player2.points}`)
            } else { 
                Swal.fire({
                    html: `
                    <div style:'border-radius:5%; font-family: 'Times New Roman';'>
                        <h2>Empate 🤓🤓🤓</h2>
                        <iframe width="500" height="285" src="https://www.youtube.com/embed/I4xwCT1F5RA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                    `,
                    width: '500px',
                    height: '500px',
                    background: '#000',
                    color: '#fff'
                })
            }
        }
    }

    restart() { 
        this.restartbutton.addEventListener('click', ()=> { 
            this.player1.points = 0;
            this.player2.points = 0;
            this.player1.sumOfCards.textContent = 0;
            this.player2.sumOfCards.textContent = 0;
            document.querySelectorAll("#carta-jugador").forEach((card)=>{
                card.remove();
            });
            this.startCardsOfPlayers();
        })
    }

    exit() {
        this.exitbutton.addEventListener("click", ()=> {
            alert(`Gracias por jugar. Estadisticas: Jugador ${this.player1.name.textContent}: ${this.player1.gamesWon} vs AI Opponent🤖: ${this.player2.gamesWon}`)
            location.reload();
        })
    }
     
}

const playeruser = new UserPLayer(document.querySelector("#jugador1"), document.querySelector("#jugador1puntos"), document.querySelector("#cartas-jugador"), document.querySelector("#puntajejugador"), document.querySelectorAll("#text-mazo"));
const playermachine = new MachinePlayer(document.querySelector("#jugador2"), document.querySelector("#jugador2puntos"), document.querySelector("#cartas-maquina"), document.querySelector("#puntajemaquina") , document.querySelectorAll("#text-mazo"));
const game1 = new Game(playeruser, playermachine, document.querySelector("#solicitar-carta"), document.querySelector("#plantarse"), document.querySelector("#finalizar"), document.querySelector("#reiniciar")); 
game1.starGame();