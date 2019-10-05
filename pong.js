/* jshint esversion: 9 */

const speed = 7;
let canvas;
let ctx;
let paddles = [2];
let score = [0, 0];
let ball = {
    x: 0,
    y: 0,
    v_x: 0,
    v_y: 0,
    rad: 5,
    spawn() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.v_x = Math.min(Math.random(), 0.6);
        this.v_y = 1 - this.v_x;
    },
    update()    {
        this.x += speed * 2 * this.v_x;
        this.y += speed * this.v_y;
    },
    draw()  {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
        ctx.fill();
    }
};

let keys = {};
window.onkeyup = function(e) { keys[e.keyCode] = false; }
window.onkeydown = function(e) { keys[e.keyCode] = true; }

class paddle {
    constructor(_x)   {
        this.x = _x;
        this.y = 250;
        this.w = 10;
        this.h = 50;
        this.v = 0;
    }
    move() {
        this.y = Math.min(Math.max(this.y + this.v, 0), 600 - this.h);
        this.v *= 0.9;
    }
    draw()  {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    collides(b)  {
        if(b.x - this.x  < b.rad)   {
            if(b.y - this.y - this.h)   {
                return true;
            }
        }
        return false;
    }
}

const init = function () {
    canvas = document.getElementById("main");
    ctx = canvas.getContext("2d");

    paddles[0] = new paddle(20);
    paddles[1] = new paddle(canvas.width - 30);

    const drawScore = function () {
        ctx.font = "50px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(score[0], 120, 80);
        ctx.fillText(score[1], canvas.width - 180, 80);
    };

    const drawPaddles = function() {
        paddles.forEach((p) => {
            p.move();
            p.draw();
        });
    };

    const updatePaddle = function() {
        if(ball.v_x < 0)
            paddles[0].v = ( Math.min(Math.max(ball.y - (paddles[0].y+paddles[0].h/2), -5), 5) );
    };

    const checkBoundingBox = function() {
        if(ball.x > canvas.width)   {
            score[0]++;
            ball.spawn();
        }   else if(ball.x < 0)   {
            score[1]++;
            ball.spawn();
        }

        if((ball.y > canvas.height - ball.rad) || (ball.y < ball.rad) )   {
            ball.v_y *= -1;
        }
    };

    const checkPaddles = function() {
        if(ball.x - paddles[0].x  < ball.rad)   {
            if( ball.y >= paddles[0].y && ball.y <= paddles[0].y + paddles[0].h)   {
                ball.v_x *= -1;
                ball.x = paddles[0].x + ball.rad;
            }
        }

        if(ball.x + ball.rad > paddles[1].x )   {
            if( ball.y >= paddles[1].y && ball.y <= paddles[1].y + paddles[1].h)   {
                ball.v_x *= -1;
                ball.x = paddles[1].x - ball.rad;
            }
        }
    };

    const update = function() {
        ctx.fillStyle = "rgba(0,0,0, 0.4)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawPaddles();
        ball.draw();
        drawScore();

        checkKeys(keys);

        checkBoundingBox();
        checkPaddles();
        ball.update();
        updatePaddle();

        setTimeout(() => {
            window.requestAnimationFrame(update);
        }, 10);
    };

    const checkKeys = function(_k) {
        console.log(_k);

        if(_k[38]) paddles[1].v = -10;
        if(_k[40]) paddles[1].v = 10;

    };

    ball.spawn();
    window.requestAnimationFrame(update);

};
