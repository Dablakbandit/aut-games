import { useEffect, useState } from 'react'
import { CardType, SuitType, Card} from './Card'

const COLUMN_AMOUNT = 7;

const Board = () =>{
    const [columns, setColumns] = useState([]);
    const [stored, setStored] = useState([]);
    const [deck, setDeck] = useState([]);

    const setupBoard = () => {
        let tempDeck = [];
        Object.keys(CardType).map(cardType => {
            Object.keys(SuitType).map(suitType => {
                tempDeck = [...tempDeck, Card(cardType, suitType)]
            })
        })
        shuffleArray(tempDeck);

        let tempColumns = [];
        for(let column = 0; column < COLUMN_AMOUNT; column++){
            let columnCards = [];
            for(let row = 0; row <= column; row++){
                columnCards = [...columnCards, tempDeck.pop()];
            }
            tempColumns = [...tempColumns, columnCards];
        }



        setDeck(tempDeck);
        setColumns(tempColumns);
        console.log(tempDeck);
        console.log(tempColumns);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    useEffect(() => {
        setupBoard();
    }, []);

    const renderBoard = () =>{

    }

    return (
        <>
        {renderBoard()}
        </>
    );
};

export default Board;