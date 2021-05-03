export const CardType ={
    ACE:'A',
    TWO:'2',
    THREE:'3',
    FOUR:'4',
    FIVE:'5',
    SIX:'6',
    SEVEN:'7',
    EIGHT:'8',
    NINE:'9',
    TEN:'X',
    JACK:'J',
    QUEEN:'Q',
    KING:'K'
}

export const SuitType = {
    HEARTS:'♥',
    DIAMONDS:'♦',
    SPADES:'♠',
    CLUBS:'♣'
}

export const Card = (cardtype, suittype) => {
    const cardType = cardtype;
    const suitType = suittype;
    let visible  = false;
    return {
        cardType,
        suitType,
        visible: false
    }
}

Card.propTypes ={
    cardType: CardType,
    suitType: SuitType
}
