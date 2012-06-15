enchant();

window.onload = function() {
    var game = new Game(320, 320);
    game.fps = 24;
    game.preload('chara1.png');
    game.preload('stage.gif');

    var score = 0;
    var timeLeft = 60 * game.fps; // 60minuits

    var player_select_scene = new Scene();
    player_select_scene.backgroundColor = 'black';

    // websocket
    var ws = new WebSocket("ws://localhost:8888/socket");

    var label = new Label('message');
    label.x = 105;
    label.y = 0;
    label.color = 'red';
    label.font = "bold 24px 'Impact'";
    label.addEventListener('enterframe', function() {
        ws.onmessage = function(event) {
            var data = $.parseJSON(event.data);
            label.text = data['login'];
        }
    });

    var createLife = function (life) {
        var bars = "";
        for (var i=0;i<life/10;i+=1) {
            bars += "|";
        }
        return bars;
    }

    // logged in
    jQuery.ajax({
        url: 'http://localhost:8888/login', type: 'GET',
        data: {
            //login: '1', // 1 ~ 4
            login: 'OK',
        },
        dataType: 'json',
        beforeSend: function(xhr, settings) {
        },
        success: function(data, status, xhr) {
        }
    });
 
    game.onload = function() {
        game.keybind(90, 'a'); //z
        game.keybind(88, 'b'); //x
        //game.keybind(67, 'c'); //c
        var stage = new Sprite(730, 460);
        stage.frame = 0;
        stage.image = game.assets['stage.gif'];
        stage.x = -215;
        stage.y = -90;
        stage.scaleX = 0.42;
        stage.scaleY = 0.42;
        stage.WALL_LX = 10;
        stage.WALL_RX = 260;
        stage.WALL_UY = 70;
        stage.WALL_DY = 125;

        var bear = new Sprite(32, 32);
        bear.name = 'hoge';
        bear.n = 0; // frame
        bear.current_y = 0;
        bear.frame = 0;
        bear.status = 'idle';
        bear.scaleX = 1;
        bear.x = 80;
        bear.y = 130;
        bear.vy = 0;
        bear.hp = 100;
        bear.jumping = false;
        bear.speed = 5;
        bear.image = game.assets['chara1.png'];
        //Math.floor(Math.random() * 300) + 10;

        var bear2 = new Sprite(32, 32);
        bear2.name = 'bar';
        bear2.n = 0;
        bear2.current_y = 0;
        bear2.frame = 5;
        bear2.status = 'idle';
        bear2.scaleX = 1;
        bear2.x = 60;
        bear2.y = 100;
        bear2.vy = 100;
        bear2.hp = 100;
        bear2.jumping = false;
        bear2.speed = 5;
        bear2.image = game.assets['chara1.png'];

        var bear3 = new Sprite(32, 32);
        bear3.name = 'fuga';
        bear3.n = 0;
        bear3.current_y = 0;
        bear3.frame = 10;
        bear3.status = 'idle';
        bear3.scaleX = -1;
        bear3.x = 230;
        bear3.y = 100;
        bear3.vy = 100;
        bear3.hp = 100;
        bear3.jumping = false;
        bear3.speed = 5;
        bear3.image = game.assets['chara1.png'];

        var bear4 = new Sprite(32, 32);
        bear4.name = 'hoo';
        bear4.n = 0;
        bear4.current_y = 0;
        bear4.frame = 15;
        bear4.scaleX = -1;
        bear4.status = 'idle';
        bear4.x = 200;
        bear4.y = 130;
        bear4.hp = 100;
        bear4.image = game.assets['chara1.png'];

        var time_label = new Label('Time 0');
        time_label.x = 5;
        time_label.y = 3;
        time_label.color = 'white';
        time_label.font = "bold 20px 'Impact'";

        var life1_label = new Label(createLife(bear.hp));
        life1_label.x = 20;
        life1_label.y = 219;
        life1_label.color = 'white';

        var life2_label = new Label(createLife(bear2.hp))
        life2_label.x = 100;
        life2_label.y = 219;
        life2_label.color = 'white';

        var life3_label = new Label(createLife(bear3.hp))
        life3_label.x = 179;
        life3_label.y = 219;
        life3_label.color = 'white';

        var life4_label = new Label(createLife(bear4.hp))
        life4_label.x = 255;
        life4_label.y = 219;
        life4_label.color = 'white';

        var score_label = new Label('Score: 0');
        score_label.x = 200;
        score_label.y = 5;

        var player1_label = new Label(bear.name);
        player1_label.x = 19;
        player1_label.y = 207;
        player1_label.color = 'white';

        var player2_label = new Label(bear2.name);
        player2_label.x = 100;
        player2_label.y = 207;
        player2_label.color = 'white';
        
        var player3_label = new Label(bear3.name);
        player3_label.x = 183;
        player3_label.y = 207;
        player3_label.color = 'white';

        var player4_label = new Label(bear4.name);
        player4_label.x = 260;
        player4_label.y = 207;
        player4_label.color = 'white';

        // player logged in
        ws.onmessage = function(event) {
            label.text = $.parseJSON(event.data)['login'];
        }

        // CPU ----
        // from "game.py"
        var cpu_player2 = bear2;
        cpu_player2.addEventListener('enterframe', function() {
            ws.onmessage = function(event) {
                var data = $.parseJSON(event.data)['bear2'];
                cpu_player2.x = data['x'];
                cpu_player2.y = data['y'];
                cpu_player2.scaleX = data['scaleX'];
                cpu_player2.status = data['status'];
                cpu_player2.frame = data['frame'];
            }
        });

        var cpu_player3 = bear3;
        cpu_player3.addEventListener('enterframe', function() {
            ws.onmessage = function(event) {
//                cpu_player3.scaleX = $.parseJSON(event.data)['bear3']['scaleX'];
//                cpu_player3.status = $.parseJSON(event.data)['bear3']['status'];
//                cpu_player3.x = $.parseJSON(event.data)['bear3']['x'];
//                cpu_player3.y = $.parseJSON(event.data)['bear3']['y'];
            }
        });

        var cpu_player4 = bear4;
        cpu_player4.addEventListener('enterframe', function() {
            ws.onmessage = function(event) {
//                cpu_player4.scaleX = $.parseJSON(event.data)['bear4']['scaleX'];
//                cpu_player4.status = $.parseJSON(event.data)['bear4']['status'];
//                cpu_player4.x = $.parseJSON(event.data)['bear4']['x'];
//                cpu_player4.y = $.parseJSON(event.data)['bear4']['y'];
            }
        });

        // PLAYER
        var my_player = bear;
        my_player.addEventListener('enterframe', function() {

            // and ground line also
            if (this.within(bear2, 5)) {
                bear.hp -= 10;
//                label.text = 'HIT';
            }

            if (!game.input.left && !game.input.right) {
               this.status = 'idle';
            }

            if (game.input.left && this.x >= stage.WALL_LX) {
               this.x -= this.speed;
               this.scaleX = -1;
            }
            if (game.input.right && this.x <= stage.WALL_RX) {
               this.x += this.speed;
               this.scaleX = 1;
            }
            if (game.input.right || game.input.left) {
               this.status = 'walk';
            }
            if (!this.jumping) {
                if (game.input.up || game.input.down) {
                   this.status = 'walk';
                }

                if (game.input.up && this.y >= stage.WALL_UY) {
                   this.y -= this.speed;
                }
                if (game.input.down && this.y <= stage.WALL_DY) {
                   this.y += this.speed;
                }
                // jump button
                if (game.input.a) {
                    this.current_y = this.y;
                    this.vy = -9;
                    this.jumping = true;
                }

                // punch
                if (game.input.b) {
                    this.status = 'attack';

                }
            } else { // jump

                // punch
                if (game.input.b) {
                    this.status = 'jump_attack';
                }
            }

            this.vy += 0.9;
            if (this.jumping) this.y += this.vy;
            //score_label.text = 'Score: ' + score;
            if (this.jumping && this.y >= this.current_y) {
                this.y = this.current_y;
                this.jumping = false;
            }

            this.n++;
            if (this.status === 'walk') {
                this.frame = ((this.n%=4) < 2) ? this.n : (this.n!=2)*2;
            } else if (this.status === 'jump') {
                this.frame = 0;
            } else if (this.status === 'idle') {
                this.frame = 0;
            }

            jQuery.ajax({
                url: 'http://localhost:8888/push', type: 'GET',
                data: {
                    player: '2', // 1 ~ 4
                    x: this.x,
                    y: this.y,
                    hp: this.hp,
                    status: this.status,
                    scaleX: this.scaleX,
                    jumping: this.jumping,
                    frame: this.frame, // n is not needed
                },
                dataType: 'json',
                beforeSend: function(xhr, settings) {
                },
                success: function(data, status, xhr) {
                }
            });
        });

        var readdChild = function (object) {
            game.rootScene.removeChild(object);
            game.rootScene.addChild(object);
        }

        game.addEventListener('enterframe', function() {

            life1_label.text = createLife(bear.hp);
            life2_label.text = createLife(bear2.hp);
            life3_label.text = createLife(bear3.hp);
            life4_label.text = createLife(bear4.hp);
            /*
            console.log("bear.y:" + bear.y);
            console.log("bear2.y:" + bear2.y);
            console.log("bear3.y:" + bear3.y);
            console.log("bear4.y:" + bear4.y);
            game.rootScene.removeChild(bear);
            game.rootScene.removeChild(bear2);
            game.rootScene.removeChild(bear3);
            game.rootScene.removeChild(bear4);
            */

            //var order_ary = [bear, bear2, bear3, bear4];
//            var order_ary = [bear.y, bear2.y, bear3.y, bear4.y];
//            console.log(order_ary.sort());
            /*
            if (bear.y > bear2.y) {
                readdChild(bear);
            } else {
                readdChild(bear2);
             }

            if (bear.y > bear3.y) {
                readdChild(bear);
            } else {
                readdChild(bear3);
            }

            if (bear.y > bear4.y) {
                readdChild(bear);
            } else {
                readdChild(bear4);
            }
            */

            timeLeft--;
            if (timeLeft <= 0) {
                this.stop();
            }
            time_label.text = 'Time: ' + timeLeft;
        });

    player_select_scene.addChild(bear);
//    game.pushScene(player_select_scene);
/*        var gameover_scene = new Scene();
*/

        game.rootScene.addChild(stage);
        game.rootScene.addChild(bear);
        game.rootScene.addChild(bear2);
        game.rootScene.addChild(bear3);
        game.rootScene.addChild(bear4);
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
