class Carta { 
    constructor () { 
        this.getCard()
    }
}

class Player {
    constructor(name, score, sumOfCards) { 
        this.name = name;
        this.score = score; 
        this.sumOfCards = sumOfCards;
        this.points = 0;
        this.gamesWon = 0;
    }
}

class Game { 
    constructor() { 
        this.apiUrl = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';

    }

    async starGame() { 
        try { 
            const response = await fetch(this.apiUrl);
            await response.text();
            const resultado = await JSON.parse(response);
            console.log(resultado)
        }
        catch (error) { 
            console.log("Error: "+ error);
        }
    }
}

let game1 = new Game(); 
game1.starGame()