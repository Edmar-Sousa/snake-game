const canvas = document.getElementById('canvas') as HTMLCanvasElement
const context = canvas.getContext('2d')

type Tile = { x : number, y : number }

const tile_size = 10

const KEYBOARD_LEFT_CODE  = 37,
      KEYBOARD_UP_CODE    = 38,
      KEYBOARD_RIGHT_CODE = 39,
      KEYBOARD_DOWN_CODE  = 40


class Apple {
    public px : number
    public py : number
    public color : string

    public constructor(color : string) {
        this.color = color
        this.random_pos()
    }

    public random_pos() {
        this.px = Math.round(Math.random() * (canvas.width - tile_size) / 10) * 10
        this.py = Math.round(Math.random() * (canvas.height- tile_size) / 10) * 10
    }

    public draw() {
        context.fillStyle = this.color
        context.fillRect(this.px, this.py, tile_size - 1, tile_size - 1)
    }

    public return_tile() : Tile {
        return { x : this.px, y : this.py }
    }
}

class Player {
    private body : Tile[]

    public dirx : number
    public diry : number

    private colors : string[]

    public constructor() {
        this.dirx = 1
        this.diry = 0

        this.colors = ['#1b439c', '#1b8a9c', '#1d9c1b']

        this.body = [{ x: 60, y: 20 }]
    }

    public draw() {
        let size = Math.floor(this.body.length / 3)
        let c = 0
        
        for (let i = 0; i < this.body.length; i++ ) {
            context.fillStyle = this.colors[c]
            context.fillRect(this.body[i].x, this.body[i].y, tile_size - 1, tile_size - 1)

            if (i == size) {
                c++
                size += size
            }

        }
    }

    public update_position() {
        let last_tile_body = this.body[this.body.length - 1]

        if ( is_collide(last_tile_body, apple.return_tile()) ) {
            apple.random_pos()
            this.body.push({ x : last_tile_body.x, y : last_tile_body.y })
        }

        let x = last_tile_body.x + this.dirx * tile_size
        let y = last_tile_body.y + this.diry * tile_size

        let tile : Tile = { x, y }

        if (tile.x > canvas.width - tile_size)
            tile.x = 0

        else if (tile.x < 0)
            tile.x = canvas.width - tile_size

        if (tile.y > canvas.height - tile_size)
            tile.y = 0

        else if (tile.y < 0)
            tile.y = canvas.height - tile_size

        for (let pc of this.body) {
            if ( is_collide(tile, pc) ) {
                reset_game()
            }
        }

        this.body.push(tile)
        this.body.shift()
    }
}


let player = new Player()
let apple  = new Apple('#f00')

function reset_game() {
    player = new Player()
    apple = new Apple('#f00')
}

function is_collide(obj1 : Tile, obj2 : Tile) {
    if ( (obj1.x >= obj2.x && obj1.x <= obj2.x + tile_size - 1) && (obj1.y >= obj2.y && obj1.y <= obj2.y + tile_size - 1) ) {
        return true
    }

    return false
}

function update_player_dir(dirx : number, diry : number) {
    if (player.dirx != -dirx)
        player.dirx = dirx

    if (player.diry != -diry)
        player.diry = diry
}



document.addEventListener('keydown', event => {
    switch (event.keyCode) {
        case KEYBOARD_LEFT_CODE:  update_player_dir(-1, 0); break
        case KEYBOARD_RIGHT_CODE: update_player_dir( 1, 0); break

        case KEYBOARD_UP_CODE:    update_player_dir(0, -1); break
        case KEYBOARD_DOWN_CODE:  update_player_dir(0,  1); break
    }

})


var fps, fpsInterval, startTime, now, then, elapsed

function startAnimating() {
    fpsInterval = 1000 / 10;
    then = Date.now();
    startTime = then;
    mainLoop()
}


function mainLoop() {
    requestAnimationFrame(mainLoop)


    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        context.clearRect(0, 0, canvas.width, canvas.height)
        player.update_position()
        
        apple.draw()
        player.draw()
    }
}

startAnimating()