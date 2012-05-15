enchant();

window.onload = function() {
    var game = new Game(320, 320);
    game.fps = 24;
    game.preload('chara1.png');
    var score = 0;
    var timeLeft = 10 * game.fps;

    game.onload = function() {
        game.keybind(90, 'a'); //z
        game.keybind(88, 'b'); //x
        //game.keybind(67, 'c'); //c
        var bear = new Sprite(32, 32);
        bear.frame = 1;
        bear.image = game.assets['chara1.png'];
        //Math.floor(Math.random() * 300) + 10;
        bear.x = 10;
        bear.y = 10;
        bear.vy = 0;
        bear.jumping = false;

        var bear2 = new Sprite(32, 32);
        bear2.frame = 2;
        bear.image = game.assets['chara1.png'];
        var chara_speed = {'bear':5};
        var timeLabel = new Label('Time 0');
        timeLabel.x = 5;
        timeLabel.y = 5;

        var scoreLabel = new Label('Score: 0');
        scoreLabel.x = 200;
        scoreLabel.y = 5;
        var bear_current_y = 0;
        bear.addEventListener('enterframe', function() {
            if (game.input.left) {
               this.x -= chara_speed['bear'];
            }
            if (game.input.right) {
               this.x += chara_speed['bear'];
            }
            if (!bear.jumping) {
                if (game.input.up) {
                   this.y -= chara_speed['bear'];
                }
                if (game.input.down) {
                   this.y += chara_speed['bear'];
                }
                // jump button
                if (game.input.a) {
                    bear_current_y = bear.y;
                    bear.vy = -9;
                    //bear.y = -1;
                    bear.jumping = true;
                }
            }
            bear.vy += 0.9;
            if (bear.jumping) bear.y += bear.vy;
            //scoreLabel.text = 'Score: ' + score;
            if (bear.jumping && bear.y >= bear_current_y) {
                bear.y = bear_current_y;
                bear.jumping = false;
            }
        });

        game.addEventListener('enterframe', function() {
            if (timeLeft <= 0) {
                this.stop();
            }
            timeLeft--;
            timeLabel.text = 'Time: ' + timeLeft;
        });

        game.rootScene.addChild(bear);
        game.rootScene.addChild(bear2);
        game.rootScene.addChild(scoreLabel);
        game.rootScene.addChild(timeLabel);
    };

    game.start();
}
