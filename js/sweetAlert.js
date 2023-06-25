
class DeckOfCard { 
    constructor(domNamedeck) { 
        this.domNamedeck = domNamedeck;
        this.deckplayer1 = [];
        this.deckplayer2 = [];
        this.namedeck = '';
        this.numCard = 0;
        this.apiUrl = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
    }

    async getNameDeck(){
        try { 
            const response = await fetch(this.apiUrl);
            const result = await response.json();
            this.namedeck = await result.deck_id; 
        }
        catch (error) { 
            console.log("Error: "+ error);
        }
    }

    showNameDeck(){
        this.domNamedeck.forEach((text)=>{
            text.innerHTML += this.deck;
        })
    }

    async getCards(cardIndex=0, getanotherCard=false) { 
        try { 
            const response = await fetch('https://deckofcardsapi.com/api/deck/' + this.namedeck + '/draw/?count=1');
            const result = await response.json();
            this.numCard++;
            let value = result.cards[0].value;
            let sign = result.cards[0].suit;
            let img = result.cards[0].image;
            const card = {
                valuecard: `${value}`,
                signcard: `${sign}`,
                imgcard:  `${img}`,
            }
            let carstring = JSON.stringify(card)
            if ((cardIndex == 0) && (!getanotherCard)) {
                if (this.numCard % 2 != 0 && this.numCard>0){
                    this.deckplayer1.push(carstring);
                } else { 
                    this.deckplayer2.push(carstring);
                }
            } else { 
                this.deckplayer2[cardIndex-1].valuecard = value;
                this.deckplayer2[cardIndex-1].signcard = sign;
                this.deckplayer2[cardIndex-1].imgcard = img;
            }
        } catch(error) { 
            console.log('Error '+ error);
        }
    }

    async getCardsMachine(){
        const response = await fetch('https://deckofcardsapi.com/api/deck/' + this.namedeck + '/draw/?count=1');
        const result = await response.json();
        this.numCard++;
        let value = result.cards[0].value;
        let sign = result.cards[0].suit;
        let img = result.cards[0].image;
        const card = {
            valuecard: `${value}`,
            signcard: `${sign}`,
            imgcard:  `${img}`,
        }
        this.deckplayer2.push(card)
    }

    removeRedundantCards() { 
        this.deckplayer1.forEach((card1)=>{
            this.deckplayer2.forEach((card2)=>{
                if ((card1.valuecard == card2.valuecard) && (card1.signcard == card2.signcard)) { 
                    this.getCards(card2.id, true);
                };
            });
        });
    }
}

class Player {
    constructor(DomName, domRoundPoints, domDivCards, domSumCards){
        this.DomName = DomName;
        this.domRoundPoints = domRoundPoints;
        this.domDivCards = domDivCards;
        this.domSumCards = domSumCards;
        this.sumCardsValue = 0;
        this.pointsOfRounds = 0;
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
            color: '#fff',
        })
        .then((resultado)=>{ 
            this.DomName.innerHTML = resultado.value;
        });
    }

    sumPointsCard(value) {
        if (value == "KING" || value == "QUEEN" || value == "JACK") { 
            this.sumCardsValue += 10;
        } else if (value == "ACE") { 
            this.sumCardsValue += 1;
        } else { 
            this.sumCardsValue += Number(value);
        }
        return this.sumCardsValue;
    }

    messageforRoundWinner(mensaje, estadisticas) { 
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
    }

    pointForRoundVictory(){
        this.pointsOfRounds ++;
    }
}



class MachinePlayer extends Player { 
    messageforPassRound(){
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

class Game { 
    constructor(userPlayer, machinePlayer, deckCard, playButtonDom, passButtonDom, restartButtonDom , exitButtonDom){
        this.userPlayer = userPlayer;
        this.machinePlayer = machinePlayer;
        this.deckCard = deckCard;
        this.playButtonDom = playButtonDom;
        this.passButtonDom = passButtonDom;
        this.restartButtonDom = restartButtonDom;
        this.exitButtonDom = exitButtonDom;
        this.UserCardused = 0;
        this.MachineCardused = 0;
    }

    async InitGame() {
    await this.userPlayer.getName();
    await this.deckCard.getNameDeck();
    await this.deckCard.showNameDeck();
    await this.InitCardsOfPlayers(4);
    this.showCardsPlayersInDom(2, "user");
    this.showCardsPlayersInDom(2, "machine");
    this.InitPlay();
    this.passButton();
    this.restartButton();
    this.exitButton();
    }

    async InitCardsOfPlayers(num){
        for(let i= 0; i<num; i++){
            await this.deckCard.getCards();
            await this.deckCard.removeRedundantCards();
        }
    }

    showCardsPlayersInDom(num, player){
        console.log(this.deckCard.deckplayer1[0]);
        for(let i=0; i<num; i++){
            let div = document.createElement('div'); 
            div.setAttribute('id', 'carta-jugador'); 
            div.setAttribute('class', 'carta');
            if (player == 'user') { 
                div.innerHTML += `<img class="carta-img flip-in-ver-right" src="${this.deckCard.deckplayer1[this.UserCardused].imgcard}" alt="${this.deckCard.deckplayer1[this.UserCardused].valuecard} ${this.deckCard.deckplayer1[this.UserCardused].signcard}">`;
                this.userPlayer.domDivCards.appendChild(div);
                this.UserCardused++;
                this.userPlayer.domSumCards = this.userPlayer.sumPointsCard(this.deckCard.deckplayer1[this.UserCardused].valuecard);
            } else if (player == "machine") { 
                div.innerHTML += `<img class="carta-img flip-in-ver-right" src="${this.deckCard.deckplayer2[this.MachineCardused].imgcard}" alt="${this.deckCard.deckplayer2[this.MachineCardused].valuecard} ${this.deckCard.deckplayer2[this.MachineCardused].signcard}">`;
                this.machinePlayer.domDivCards.appendChild(div);
                this.MachineCardused++;
                this.machinePlayer.domSumCards = this.machinePlayer.sumPointsCard(this.deckCard.deckplayer2[this.MachineCardused].valuecard);
            }    
        }
    }

    InitPlay() { 
        this.playButtonDom.addEventListener('click', ()=>{
            this.this.InitCardsOfPlayers(2);
            this.showCardsPlayersInDom(1,"user");
            this.showCardsPlayersInDom(1,"machine");
            this.checkWinnerRound();
        });
    }

    passButton(){
        this.passButtonDom.addEventListener('click', ()=>{
            this.deckCard.getCardsMachine();
            this.deckCard.removeRedundantCards();
            this.showCardsPlayersInDom(1, 'machine');
            this.checkWinnerRound();
        })
    }
    
    checkWinnerRound(){
        if(this.userPlayer.sumCardsValue > 21) {
            this.machinePlayer.messageforRoundWinner(`El usuario ${this.userPlayer.DomName.innerHTML} esta descalificado por pasarse de 21`, `Puntaje de ${this.userPlayer.DomName.innerHTML}: ${this.userPlayer.sumCardsValue} vs Puntaje de AIplayer: ${this.machinePlayer.sumCardsValue}`);
            this.bloquearControles()
        } else if(this.machinePlayer.sumCardsValue > 21) {
            this.machinePlayer.messageforRoundWinner(`El usuario AIplayer esta descalificado por pasarse de 21`, `Puntaje de ${this.userPlayer.DomName.innerHTML}: ${this.userPlayer.sumCardsValue} vs Puntaje de AIplayer: ${this.machinePlayer.sumCardsValue}`);
            this.bloquearControles()
        } else if (this.userPlayer.sumCardsValue == 21) {
            this.machinePlayer.messageforRoundWinner(`El usuario ${this.userPlayer.DomName.innerHTML} gano 🤗🤗`, `Puntaje de ${this.userPlayer.DomName.innerHTML}: ${this.userPlayer.sumCardsValue} vs Puntaje de AIplayer: ${this.machinePlayer.sumCardsValue}`);
            this.bloquearControles();
        } else if (this.machinePlayer.sumCardsValue == 21){
            this.machinePlayer.messageforRoundWinner(`El usuario AIplayer gano 🤗🤗🤗`, `Puntaje de ${this.userPlayer.DomName.innerHTML}: ${this.userPlayer.sumCardsValue} vs Puntaje de AIplayer: ${this.machinePlayer.sumCardsValue}`);
            this.bloquearControles();
        } else  {
            this.machinePlayer.messageforRoundWinner(`Empate 😱😱😱`, `Puntaje de ${this.userPlayer.DomName.innerHTML}: ${this.userPlayer.sumCardsValue} vs Puntaje de AIplayer: ${this.machinePlayer.sumCardsValue}`);
            this.bloquearControles();
        }
    }

    restartButton(){
        this.restartButtonDom.addEventListener('click', ()=>{
            this.userPlayer.sumCardsValue = 0;
            this.machinePlayer.sumCardsValue = 0;
            this.userPlayer.domSumCards.innerHTML = 0;
            this.machinePlayer.domSumCards.innerHTML = 0;
            document.querySelectorAll("#carta-jugador").forEach((card)=>{
                card.remove();
            });
            this.InitCardsOfPlayers(4);
            this.showCardsPlayersInDom(2, "user");
            this.showCardsPlayersInDom(2, "machine");
            this.InitPlay();
        });
    }
    
    bloquearControles(){
        document.querySelector(".control-jugador").addEventListener('click', ()=>{
            alert('El Round termino presione Reiniciar');
        })
    }

    exitButton(){
        this.exitButtonDom.addEventListener('click', ()=>{
            location.reload();
        })
    }


}

const deck = new DeckOfCard(document.querySelectorAll("#text-mazo"));
const user = new Player(document.querySelector("#jugador1"), document.querySelector("#jugador1puntos"), document.querySelector("#cartas-jugador"), document.querySelector("#puntajejugador"));
const machine = new MachinePlayer(document.querySelector("#jugador2"), document.querySelector("#jugador2puntos"), document.querySelector("#cartas-maquina"), document.querySelector("#puntajemaquina"));
const game = new Game(user, machine, deck, document.querySelector("#solicitar-carta"), document.querySelector("#plantarse"), document.querySelector("#reiniciar"), document.querySelector("#finalizar"));
game.InitGame();