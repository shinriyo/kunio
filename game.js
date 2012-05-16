enchant();

window.onload = function() {
    var game = new Game(320, 320);
    game.fps = 24;
    game.preload('chara1.png');
    game.preload('stage.gif');
    var score = 0;
    var timeLeft = 60 * game.fps; // 60minuits

    game.onload = function() {
        game.keybind(90, 'a'); //z
        game.keybind(88, 'b'); //x
        //game.keybind(67, 'c'); //c
        var stage = new Sprite(730, 460);
        stage.frame = 0;
        stage.image = game.assets['stage.gif'];
        stage.x = -200;
        stage.y = -90;
        stage.scaleX = 0.5;
        stage.scaleY = 0.5;

        var bear = new Sprite(32, 32);
        bear.current_y = 0;
        bear.frame = 0;
        bear.image = game.assets['chara1.png'];
        //Math.floor(Math.random() * 300) + 10;
        bear.status = 'walk';
        bear.x = 80;
        bear.y = 130;
        bear.vy = 0;
        bear.hp = 100;
        bear.jumping = false;
        bear.speed = 5;

        var bear2 = new Sprite(32, 32);
        bear2.current_y = 0;
        bear2.frame = 5;
        bear2.x = 60;
        bear2.y = 130;
        bear2.hp = 100;
        bear2.image = game.assets['chara1.png'];

        var bear3 = new Sprite(32, 32);
        bear3.current_y = 0;
        bear3.frame = 10;
        bear3.x = 160;
        bear3.y = 130;
        bear3.hp = 100;
        bear3.image = game.assets['chara1.png'];

        var chara_speed = {'bear':5};
        var time_label = new Label('Time 0');
        time_label.x = 5;
        time_label.y = 5;

        var label = new Label('message');
        label.x = 55;
        label.y = 5;
        label.color = 'red';
        label.font = "bold 24px 'Impact'";

        var life1_label = new Label('HP: 0');
        life1_label.x = 5;
        life1_label.y = 215;
        life1_label.color = 'blue';
        life1_label.font = "bold 14px 'Impact'";

        var life2_label = new Label('HP: 0');
        life2_label.x = 80;
        life2_label.y = 215;
        life2_label.color = 'blue';
        life2_label.font = "bold 14px 'Impact'";

        var life3_label = new Label('HP: 0');
        life3_label.x = 155;
        life3_label.y = 215;
        life3_label.color = 'blue';
        life3_label.font = "bold 14px 'Impact'";

        var life4_label = new Label('HP: 0');
        life4_label.x = 230;
        life4_label.y = 215;
        life4_label.color = 'blue';
        life4_label.font = "bold 14px 'Impact'";

        var score_label = new Label('Score: 0');
        score_label.x = 200;
        score_label.y = 5;
        var player1_label = new Label("player1: hoge");
        player1_label.x = 5;
        player1_label.y = 200;
        var player2_label = new Label("player2: bar");
        player2_label.x = 80;
        player2_label.y = 200;
        var player3_label = new Label("player3: huga");
        player3_label.x = 155;
        player3_label.y = 200;
        var player4_label = new Label("player4: boo");
        player4_label.x = 230;
        player4_label.y = 200;

        bear.addEventListener('enterframe', function() {
            if (this.status === 'walk') {
               //this.frame++;
            } else if (this.status === 'idle') {

            }

            // and ground line also
            if (this.within(bear2, 5)) {
                label.text = 'hit';
            }

            if (game.input.left) {
               this.x -= this.speed;
               this.scaleX = -1;
            }
            if (game.input.right) {
               this.x += this.speed;
               this.scaleX = 1;
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
            //score_label.text = 'Score: ' + score;
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
            time_label.text = 'Time: ' + timeLeft;
        });
        var gameover_scene = new Scene();
        gameover_scene.backgroundColor = 'black';
       // game.pushScene(gameover_scene);
        

        game.rootScene.addChild(stage);
        game.rootScene.addChild(bear);
        game.rootScene.addChild(bear2);
        game.rootScene.addChild(bear3);
        game.rootScene.addChild(score_label);
        game.rootScene.addChild(time_label);
        game.rootScene.addChild(label);
        game.rootScene.addChild(life1_label);
        game.rootScene.addChild(life2_label);
        game.rootScene.addChild(life3_label);
        game.rootScene.addChild(life4_label);
        game.rootScene.addChild(player1_label);
        game.rootScene.addChild(player2_label);
        game.rootScene.addChild(player3_label);
        game.rootScene.addChild(player4_label);
    };

    game.start();
}
