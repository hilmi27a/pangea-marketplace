function Timer(_delay) {
    return new Promise( res => setTimeout(res, _delay) );  }

export default Timer;