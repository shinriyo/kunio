enchant();

window.onload = function() {
    var game = new Game(320, 320);
    game.fps = 24;
    game.preload('chara1.png');
    var score = 0;
    var timeLeft = 60 * game.fps; // 60minuits

    game.onload = function() {
        game.keybind(90, 'a'); //z
        game.keybind(88, 'b'); //x
        //game.keybind(67, 'c'); //c
        var bear = new Sprite(32, 32);
        bear.current_y = 0;
        bear.frame = 1;
        bear.image = game.assets['chara1.png'];
        //Math.floor(Math.random() * 300) + 10;
        bear.x = 10;
        bear.y = 30;
        bear.vy = 0;
        bear.jumping = false;
        bear.speed = 5;

        var bear2 = new Sprite(32, 32);
        bear2.current_y = 0;
        bear2.frame = 2;
        bear2.x = 60;
        bear2.y = 30;
        bear2.image = game.assets['chara1.png'];
        var chara_speed = {'bear':5};
        var timeLabel = new Label('Time 0');
        timeLabel.x = 5;
        timeLabel.y = 5;

        var label = new Label('message');
        label.x = 55;
        label.y = 5;
        label.color = 'red';
        label.font = "bold 24px 'Impact'";

        var scoreLabel = new Label('Score: 0');
        scoreLabel.x = 200;
        scoreLabel.y = 5;
        var player1Label = new Label("player1: hoge");
        player1Label.x = 5;
        player1Label.y = 200;
        var player2Label = new Label("player2: bar");
        player2Label.x = 80;
        player2Label.y = 200;
        var player3Label = new Label("player3: huga");
        player3Label.x = 155;
        player3Label.y = 200;
        var player4Label = new Label("player4: boo");
        player4Label.x = 230;
        player4Label.y = 200;

        bear.addEventListener('enterframe', function() {
            if (this.within(bear2, 5)) {
                label.text = 'hit';
            }

            if (game.input.left) {
               this.x -= this.speed;
            }
            if (game.input.right) {
               this.x += this.speed;
            }
            if (!this.jumping) {
                if (game.input.up) {
                   this.y -= this.speed;
                }
                if (game.input.down) {
                   this.y += this.speed;
                }
                // jump button
                if (game.input.a) {
                    this.current_y = this.y;
                    this.vy = -9;
                    this.jumping = true;
                }
            }
            this.vy += 0.9;
            if (this.jumping) this.y += this.vy;
            //scoreLabel.text = 'Score: ' + score;
            if (this.jumping && bear.y >= this.current_y) {
                this.y = this.current_y;
                this.jumping = false;
            }
        });

        game.addEventListener('enterframe', function() {
            timeLeft--;
            if (timeLeft <= 0) {
                this.stop();
            }
            timeLabel.text = 'Time: ' + timeLeft;
        });

        game.rootScene.addChild(bear);
        game.rootScene.addChild(bear2);
        game.rootScene.addChild(scoreLabel);
        game.rootScene.addChild(timeLabel);
        game.rootScene.addChild(label);
        game.rootScene.addChild(player1Label);
        game.rootScene.addChild(player2Label);
        game.rootScene.addChild(player3Label);
        game.rootScene.addChild(player4Label);
    };

    game.start();
}
