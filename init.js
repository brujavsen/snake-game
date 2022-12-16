// Tomar todos los elementos a usar
const board = document.querySelector('#board');
const scoreBoard = document.querySelector('#score-board');
const tableScore = document.querySelector('#scores-board');
const nameUserBoard = document.querySelector('#name-user');
const startButton = document.querySelector('#start');
const gameOverSign = document.querySelector('#game-over');

// Configuración juego
const boardSize = 10; //Tamaño del tablero donde se va a mover snake
const gameSpeed = 200; //Velocidad de snake
const squareTypes = { //Objeto para setear valores según avance el juego
    emptySquare:0,
    snakeSquare:1,
    foodSquare:2
};
const directions = { //Mapeo de direcciones según la tecla seleccionada
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
};

//Variables del juego
let snake; //Array con snake y los valores que ocupa
let score; //Puntaje del jugador
let direction; //Setea la direccion que fue seleccionada
let boardSquares; //Array con info del tablero
let emptySquares; //Guarda los lugares vacios para generar la manzana en el tablero
let moveInterval; //Intervalo que ejecuta para cambiar la velocidad del snake

const drawSnake = () => { //Pintamos un cuadrado del snake
    snake.forEach(square => drawSquare(square, 'snakeSquare')); //Seleccionamos los cuadrados, la dimensión del snake y le indicamos que pinte los cuadrados según el tamaño
}
//Rellena cada cuadrado del tablero
//@params
//square: posicion del cuadrado
//type:tipo de cuadrado (emptySquare,snakeSquare,foodSquare)
const drawSquare = (square, type) => { //Hay que pintar un cuadrado segun el tipo de cuadrado que queremos, en este caso pintamos un cuadrado vacio
    const [row,column] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square); //Lo llevamos al tablero
    squareElement.setAttribute('class', `square ${type}`); //Se va setear con las clases de estilo definidas según el tipo de cuadrado que buscamos

    if(type === 'emptySquare') { 
        emptySquares.push(square); //Creamos un cuadrado vacio un lugar anterior según donde se mueva la snake
    }else {
        if(emptySquares.indexOf(square) !== -1) {//Nos preguntamos si existe ese elemento, si existe entonces lo borramos
            emptySquares.splice(emptySquares.indexOf(square), 1);// El elemento 1, significa que sacamos el elemento 
        }
    }
};

const createBoard = () => { //Crear el tablero
    boardSquares.forEach((row, rowIndex) => { //Itera por cada fila
        row.forEach((column,columnIndex)=>{ //Una vez itera la fila, luego ingresa a la columna para iterarla de arriba para abajo
            const squareValue = `${rowIndex}${columnIndex}`; //Conocemos los valores según los indices de la dimensión
            const squareElement = document.createElement('div'); //Creamos un div para ingresar el tablero
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement); //Cada vez que se cree uno de los elementos, agregarlos al tablero
            emptySquares.push(squareValue); //por último agregamos los cuadrados vacios
        });
    });
}

const moveSnake = () => { //movimientos snake
    const newSquare = String ( //Saber cual va a ser el nuevo cuadrado para ir sumando el valor según la dirección tomando el último cuadrado al que se movió el snake
        Number(snake[snake.length - 1]) + directions[direction])
        .padStart(2, '0'); //Le agrega un 0 adelante si solo tiene un número
    const [row, column] = newSquare.split(''); //Vamos a tomar del nuevo cuadrado para seleccionar lo que queramos

    if( newSquare < 0 || //Si es menor a 0 se choco arriba, ya que no hay menor a 0
        newSquare > boardSize * boardSize || //Si es mayor a 99, se choco abajo
        (direction === 'ArrowRight' && column == 0) || //Se fue más lejos hacia los costados, sea derecha o izquierda
        direction === 'ArrowLeft' && column == 9 ||
        boardSquares[row][column] === squareTypes.snakeSquare) { //También la posibilidad de que se choque a si misma
        gameOver(); //Se llama a la función para finalizar el juego
        scoreBoardUserName();
    }else {
        snake.push(newSquare); //Pintar cuadrado a la direccion donde se movio
        if(boardSquares[row][column] === squareTypes.foodSquare){
            addFood();
        }else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare'); //Cuando la snake se mueva, vamos a tener que pintar de nuevo los cuadrados vacios donde no está posicionada
        }
        drawSnake(); //Volvemos a pintar el snake cada vez que se mueva
    }
    
}

const addFood = () => { //Agregamos un nuevo cuadrado y aumentamos el score, para luego agregar otra comida de manera aleatoria en el tablero
    score++;
    updateScore();
    createRandomFood();
}


const gameOver = () => { //Señal de perdiste
    gameOverSign.style.display = 'block'; //Se muestra el mensaje de game over
    clearInterval(moveInterval) //Se borra las posiciones y se reinicia snake
    startButton.disabled = false; //El botón de start se vuelve habilitar para un nuevo juego
    showSignGameOver();
}

function showSignGameOver() { //Mostrar imagen que perdiste
    const gameOverImage = document.createElement('picture');
    gameOverImage.innerHTML = `
        <img loading="lazy" width="500" height="300" src="gameover.png" alt="imagen game over">
    `
    //Crea el overlay con la imagen
    const overlay = document.createElement('DIV');
    overlay.appendChild(gameOverImage);
    overlay.classList.add('overlay');
    
    //Pueda cerrarse al dar click en cualquier parte
    overlay.onclick = function() {
        const body = document.querySelector('body');
        body.classList.remove('fijar-body');
        overlay.remove();
    }

    //Boton para cerrar el Modal
    const cerrarModal = document.createElement('P');
    cerrarModal.textContent = 'X';
    cerrarModal.classList.add('btn-cerrar');
    cerrarModal.onclick = function() {
        const body = document.querySelector('body');
        body.classList.remove('fijar-body');
        overlay.remove();
    }
    overlay.appendChild(cerrarModal);

    //Añadirlo al HTML
    const body = document.querySelector('body');
    body.appendChild(overlay);
    body.classList.add('fijar-body');
}

function scoreBoardUserName () { //Registra nombres de los jugadores
    let userName = prompt("Ingrese su nombre: "); //Solicita el nombre
    // console.log(userName)
    if (userName === null || userName.length > 10) { //Verifica si la respuesta esta vacia o es mayor a 10
        alert("Nombre muy largo o vacío");
        return false;
    } else {
        let userList = document.createElement('LI'); //Crea una lista para agregar elementos
        userList.textContent += `Nombre: ${userName} — Puntaje: ${score} `; //Actualiza el nombre de usuario y el score que hizo
        nameUserBoard.appendChild(userList); //Agrega los nombres a la tabla
    }
}

const setDirection = newDirection => { //Recibe una nueva direccion y setea la variable direccion para que el snake haga una nueva dirección
    direction = newDirection;
}

const directionEvent = key => { //Declaramos la función que recibe la key que se apreta, tecla del teclado presionada
    switch (key.code) {
        case 'ArrowUp': //Setear que si va para una dirección, no puede ir a la dirección contrario, debera girar. Si va para arriba, no puede ir para abajo y así sucesivamente
            direction != 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;
    }
}

const createRandomFood = () => { 
    const randomEmptySquare = emptySquares[Math.floor(Math.random()*emptySquares.length)]; //Crea un lugar vacio al azar para colocar la comida para pintar el cuadrado de comida
    drawSquare(randomEmptySquare, 'foodSquare'); //Pinta la comida random en la dimension del tablero
}

const updateScore = () => {
    scoreBoard.innerHTML = score; //Actualiza el score cuando se pierde en el juego
}



const setGame = () => { //Seteamos valores iniciales de la snake
    snake = ['00', '01', '02', '03']; //Crea snake con largo de 4 bloques
    score = snake.length; //Largo del snake, se suma cada vez que se agregue otro valor en el array
    direction = 'ArrowRight';//La snake comienza con direction rigth
    boardSquares = Array.from(Array(boardSize), ()=> new Array(boardSize).fill(squareTypes.emptySquare)); //Guarda info del tablero, array de 2 dimensiones filas y columnas. Toma 2 parametros, crea 2 arrays de 10 elementos = 20, siendo filas y columnas y por último se va a rellenar con (.fill) cuadros vacios o sea con lugares vacios. Se llena con 0 los arrays, equivale a un cuadrado vacio
    console.log(boardSquares); //-- Ver en consola la dimension de 10filas x 10columnas 
    board.innerHTML = ''; //Resetea el tablero cuando el jugador pierda
    emptySquares = []; //Setea los cuadros del tablero a 0 nuevamente
    createBoard();
};

// function speedIncrement(speed) {
//     moveInterval =  setInterval(() =>
//         moveSnake(), gameSpeed+10
//     );
// };

const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none'; //ocultamos mensaje de perdiste
    startButton.disabled = true; //bloqueamos el button de start cuando se inicia el juego
    drawSnake(); //Funcion para pintar snake
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval(() =>//Ejecuta de manera constante según el tiempo definido que asignamos en gamespeed
        moveSnake(), 
    gameSpeed); 
};

startButton.addEventListener('click', startGame);