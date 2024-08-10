function Vehicle(x, y, velocity, image) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.image = image;
    this.width = image.width;
    this.height = image.height;
}

function Rectangle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

function animate() {
    if (Game.active) {
        setTimeout(function() {
            requestId = requestAnimationFrame(animate);
            Game.loop();
        }, 1000 / Board.FPS);
    }
}

var mainCanvas = document.getElementById("tanji");
var mainContext = mainCanvas.getContext("2d");

var Board = {
    canvas: mainCanvas,
    context: mainContext,
    WIDTH: mainCanvas.width,
    HEIGHT: mainCanvas.height,
    CENTER: mainCanvas.width / 2,
    FPS: 30
};

var ImageFactory = {
    names: [],
    images: {},
    
    init: function() {
        this.names.push("ambulance");
        this.names.push("audi");
        this.names.push("car");
        this.names.push("mini_truck");
        this.names.push("mini_van");
        this.names.push("police");
        this.names.push("truck");
        this.names.push("viper");
        
        var taxi = document.getElementById("taxi");
        this.images.taxi = taxi;
        
        var target = document.getElementById("target");
        this.images.target = target;
        
        for (var i = 0; i < this.names.length; i++) {
            var name = this.names[i];
            var upImage = document.getElementById("up_" + name);
            var downImage = document.getElementById("down_" + name);
            this.images["up_" + name] = upImage;
            this.images["down_" + name] = downImage;
        }
    },
    
    taxi: function() {
        return this.images.taxi;
    },
    
    target: function() {
        return this.images.target;
    },
    
    vehicle: function(type) {
        var index = Math.floor(8 * Math.random());
        var name = this.names[index];
        return this.images[type + name];
    }
};

var Game = {
    vehicles: [],
    keys: [],
    active: false,

    init: function() {
        Board.context.clearRect(0, 0, Board.WIDTH, Board.HEIGHT);
        Road.init();
        Road.draw();
        ImageFactory.init();
        this.vehicles = VehicleCreator.create();
        
        for (var i = 0; i < this.vehicles.length; i++) {
            this.vehicles[i].draw();
        }
        
        Player.init();
        Player.draw();
        Target.init();
        Target.locate();
        Target.draw();
        ScoreBoard.init();
        HealthBoard.init();
        
        this.active = true;
    },

    loop: function() {
        Board.context.clearRect(0, 0, Board.WIDTH, Board.HEIGHT);
        ScoreBoard.count();
        HealthBoard.count();
        Road.draw();

        for (var i = 0; i < this.vehicles.length; i++) {
            this.vehicles[i].move();
            this.vehicles[i].draw();
        }
        
        this.pickTarget();
        Road.move();
        Target.move();
        Target.draw();
        Player.move();
        Player.draw();
        ScoreBoard.draw();
        HealthBoard.draw();
        
        if (this.isAccident() || HealthBoard.isDead()) {
            this.active = false;
            this.drawGameOver();
        }
    },

    isAccident: function() {
        for (var i = 0; i < this.vehicles.length; i++) {
            var vehicle = this.vehicles[i];
            var vehicleRect = new Rectangle(vehicle.x, vehicle.y, vehicle.width, vehicle.height);
            var playerRect = new Rectangle(Player.x, Player.y, Player.width, Player.height);
            if (playerRect.intersects(vehicleRect)) {
                return true;
            }
        }
        return false;
    },

    pickTarget: function() {
        var playerRect = new Rectangle(Player.x, Player.y, Player.width, Player.height);
        var targetRect = new Rectangle(Target.x, Target.y, Target.width, Target.height);
        if (playerRect.intersects(targetRect)) {
            Target.locate();
            HealthBoard.pickTarget();
            ScoreBoard.pickTarget();
        }
    },

    drawGameOver: function() {
        Board.context.fillStyle = "black";
        Board.context.fillRect(115, 150, 195, 100);
        Board.context.fillStyle = "white";
        Board.context.fillText("Game Over! Play again (y)", 130, 200);
    }
};

var Road = {
    y: 0,
    lanes: [],
    trees: [],
    velocity: 0,

    init: function() {
        for (var i = -Board.HEIGHT; i < 2 * Board.HEIGHT; i += 100) {
            this.lanes.push(i);
        }
        for (var i = -Board.HEIGHT; i < 2 * Board.HEIGHT; i += 80) {
            this.trees.push(i);
        }
    },

    draw: function() {
        Board.context.fillStyle = "black";
        Board.context.fillRect(0, 0, Board.WIDTH, Board.HEIGHT);
        this.drawBackground();
        this.drawMainLanes();
        this.drawDottedLane();
        this.drawTrees();
    },

    drawBackground: function() {
        Board.context.fillStyle = "#794C13";
        Board.context.fillRect(0, 0, 100, Board.HEIGHT);
        Board.context.fillRect(316, 0, 100, Board.HEIGHT);
    },

    drawMainLanes: function() {
        Board.context.fillStyle = "white";
        Board.context.fillRect(100, 0, 5, Board.HEIGHT);
        Board.context.fillRect(207, 0, 2, Board.HEIGHT);
        Board.context.fillRect(311, 0, 5, Board.HEIGHT);
    },

    drawDottedLane: function() {
        for (var i = 0; i < this.lanes.length; i++) {
            Board.context.fillRect(155, this.lanes[i] + this.y + 10, 2, 80);
            Board.context.fillRect(259, this.lanes[i] + this.y + 10, 2, 80);
        }
    },

    drawTrees: function() {
        for (var i = 0; i < this.trees.length; i++) {
            Board.context.beginPath();
            Board.context.arc(80, this.trees[i] + this.y, 8, 12, 360, false);
            Board.context.fillStyle = "green";
            Board.context.fill();
        }
    },

    move: function() {
        this.y += Player.velocity - this.velocity;
        if (this.y > Board.HEIGHT || this.y < -Board.HEIGHT) {
            this.y = 0;
        }
    }
};

var Player = {
    x: 115,
    y: 200,
    velocity: 1,
    width: 0,
    height: 0,
    image: {},

    init: function() {
        var taxiImage = ImageFactory.taxi();
        this.width = taxiImage.width;
        this.height = taxiImage.height;
        this.image = taxiImage;
        this.x = 115;
        this.y = 200;
    },

    draw: function() {
        Board.context.drawImage(this.image, this.x, this.y);
    },

    reset: function() {
        this.velocity = 1;
    },

    move: function() {
        if (Game.keys[38]) {
            this.forward();
        }
        if (Game.keys[40]) {
            this.reverse();
        }
        if (Game.keys[37]) {
            this.left();
        }
        if (Game.keys[39]) {
            this.right();
        }
        if (!Game.keys[38] && this.velocity > 1) {
            this.reset();
        }
        if (!Game.keys[40] && this.velocity < 1) {
            this.reset();
        }
    },

    forward: function() {
        this.velocity++;
        if (this.velocity > 3) {
            this.velocity = 3;
        }
    },

    reverse: function() {
        this.velocity = -1;
    },

    left: function() {
        this.x--;
    },

    right: function() {
        this.x++;
    }
};

Vehicle.prototype.move = function() {
    this.y += Player.velocity - this.velocity;
    if (this.y < -700) {
        this.y = 1000;
    }
    if (this.y > 1000) {
        this.y = -600;
    }
};

Vehicle.prototype.draw = function() {
    Board.context.drawImage(this.image, this.x, this.y);
};

var VehicleCreator = {
    create: function() {
        var vehicles = [];
        var positions = [
            [-600, -410, -200, 80, 400, 590, 700, 850],
            [-600, -390, -200, 100, 300, 610, 810, 1000],
            [-600, -430, -200, 10, 200, 610, 810, 1000],
            [-600, -400, -200, 50, 300, 610, 810, 1000]
        ];
        
        for (var i = 0; i < positions.length; i++) {
            for (var j = 0; j < positions[i].length; j++) {
                var xOffset = 0;
                var velocity = 0;
                if (i === 0) {
                    xOffset = 115;
                    velocity = 1;
                } else if (i === 1) {
                    xOffset = 167;
                    velocity = 2;
                } else if (i === 2) {
                    xOffset = 219;
                    velocity = -2;
                } else if (i === 3) {
                    xOffset = 271;
                    velocity = -1;
                }
                
                var direction = velocity > 0 ? "up_" : "down_";
                var image = ImageFactory.vehicle(direction);
                var vehicle = new Vehicle(xOffset, positions[i][j], velocity, image);
                vehicles.push(vehicle);
            }
        }
        
        return vehicles;
    }
};

var Target = {
    x: 115,
    y: 10,
    width: 0,
    height: 0,
    velocity: 0,
    image: {},

    init: function() {
        var targetImage = ImageFactory.target();
        this.image = targetImage;
        this.width = targetImage.width;
        this.height = targetImage.height;
    },

    draw: function() {
        Board.context.drawImage(this.image, this.x, this.y);
    },

    move: function() {
        this.y += Player.velocity - this.velocity;
        if (this.y > Board.HEIGHT) {
            this.locate();
        }
    },

    locate: function() {
        this.y = -100;
        var randomIndex = Math.floor(2 * Math.random());
        this.x = (randomIndex === 0) ? 115 : 167;
    }
};

var ScoreBoard = {
    score: 0,

    init: function() {
        this.score = 0;
    },

    draw: function() {
        Board.context.fillStyle = "white";
        Board.context.fillText("Score", 330, 50);
        Board.context.fillStyle = "yellow";
        Board.context.fillText("" + this.score, 330, 70);
    },

    count: function() {
        this.score++;
    },

    pickTarget: function() {
        this.score += 200;
    }
};

var HealthBoard = {
    FULL_HEALTH: 600,
    health: 600,

    init: function() {
        this.health = this.FULL_HEALTH;
    },

    draw: function() {
        Board.context.fillStyle = "white";
        Board.context.fillText("Health", 330, 110);
        var offset = 0;
        if (this.health < 600) {
            offset = 60 - this.health / 10;
        }
        Board.context.fillStyle = "green";
        if (offset > 30) {
            Board.context.fillStyle = "red";
        }
        Board.context.fillRect(330, 120, 60, 15);
        Board.context.fillStyle = "black";
        Board.context.fillRect(390 - offset, 120, offset, 15);
    },

    count: function() {
        this.health--;
    },

    pickTarget: function() {
        this.health += this.FULL_HEALTH / 3;
        if (this.health > this.FULL_HEALTH) {
            this.health = this.FULL_HEALTH;
        }
    },

    isDead: function() {
        return this.health < 1;
    }
};

Rectangle.prototype.intersects = function(rect) {
    return this.x < rect.x + rect.width &&
           this.x + this.width > rect.x &&
           this.y < rect.y + rect.height &&
           this.y + this.height > rect.y;
};

window.onkeydown = function(event) {
    var keyCode = event.keyCode ? event.keyCode : event.which;
    Game.keys[keyCode] = true;
    if (keyCode === 89 && !Game.active) {
        Game.init();
        animate();
    }
    event.preventDefault();
};

window.onkeyup = function(event) {
    var keyCode = event.keyCode ? event.keyCode : event.which;
    Game.keys[keyCode] = false;
};

Game.init();
animate();