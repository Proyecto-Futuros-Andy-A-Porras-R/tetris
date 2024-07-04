import './style.css'

// 1. inicializar el canvas
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const block_size = 30
const board_width = 10
const board_height = 20

canvas.width = block_size * board_width
canvas.height = block_size * board_height

context.scale(block_size, block_size)
// 3. board
const board = []

//funcion para crear el tablero
function createBoard() {
    for (let y = 0; y < board_height; y++) {
        board[y] = []
        for (let x = 0; x < board_width; x++) {
            board[y][x] = 0
        }
    }
}

// 4. pieces
const piece = {
    position: { x: 4, y: 0 },
    shape: [
    ]
    
}

// random piece
const pieces = [
    [[1, 1], 
     [1, 1]], // square
    [
     [0, 1, 0], 
     [1, 1, 1]], // T
     [
     [1, 1, 0], 
     [0, 1, 1]], // S
    [
     [0, 1, 1], 
     [1, 1, 0]], // Z
    [
     [1, 1, 1, 1]], // I
    [
     [1, 1, 1], 
     [0, 0, 1]], // L
    [
     [1, 1, 1], 
     [1, 0, 0]], // J
]
// 2. game loop 

function update() {
    //se selecciona una pieza aleatoria
    if (!piece.shape.length) {
        piece.shape = pieces[Math.floor(Math.random() * pieces.length)]
        //se reinicia la posicion de la pieza
        piece.position.y = 0
        piece.position.x = 3.5
    }
    draw()
    window.requestAnimationFrame(update)
}

function draw() {
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)

    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = 'blue'
                context.fillRect(x, y, 1, 1)
            }
        })
    })
    drawPiece()

    // Se debe mover la pieza hacia abajo cada segundo
    movePiece()

}

//funcion para mover la pieza hacia abajo cada 2 segundos
let lastTime = 0
function movePiece() {
    const currentTime = Date.now()
    if (currentTime - lastTime > 1000) {
        piece.position.y ++
        if (collide()) {
            piece.position.y --
            merge()
            deleteRow()
            // se selecciona una pieza aleatoria
            piece.shape = pieces[Math.floor(Math.random() * pieces.length)]
        }
        lastTime = currentTime
    }
}


function drawPiece() {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = 'red'
                context.fillRect(piece.position.x + x, piece.position.y + y, 1, 1)
            }
        })
    })
}

document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft"){
        piece.position.x --
        if (collide()) {
            piece.position.x ++
        }
    }
    if (event.key === "ArrowRight"){
        piece.position.x ++
        if (collide()) {
            piece.position.x --
        }
    }
    if (event.key === "ArrowDown"){
        piece.position.y ++
        if (collide()) {
            piece.position.y --
        }
    }
    if (event.key === "ArrowUp"){
        piece.shape = piece.shape[0].map((_, index) => piece.shape.map(row => row[index])).reverse()
        if (collide()) {
            piece.shape = piece.shape[0].map((_, index) => piece.shape.map(row => row[index])).reverse()
        }
    }
})

function collide() {
    const m = piece.shape
    const o = piece.position
    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            if (m[y][x] && (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) {
                //si la colision es al principio del tablero, se debe reiniciar el juego y se debe mostrar un mensaje de game over
                if (o.y <= 0) {
                    alert("Game Over")
                    board.forEach((row, y) => {
                        row.forEach((value, x) => {
                            board[y][x] = 0
                        })
                    })
                    piece.shape = []
                    piece.position.y = 0
                    piece.position.x = 5
                } 
                return true
            }
        }
    }
    return false
}

// si se llega al final del tablero, se debe unir la pieza al tablero
function merge() {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[y + piece.position.y][x + piece.position.x] = value
            }
        })
    })
    piece.position.y = 0
    piece.position.x = 4
}

// si la fila esta llena, se debe eliminar la fila
function deleteRow() {
    let rows = 0
    for (let y = 0; y < board.length; y++) {
        if (board[y].every(value => value !== 0)) {
            board.splice(y, 1)
            board.unshift(Array(board_width).fill(0))
            rows++
        }
    }
    return rows
}

createBoard()
update()
