import tornado.ioloop
import tornado.web
from tornado import websocket

GLOBALS = {
    'sockets' : []
}

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

class ClientSocket(websocket.WebSocketHandler):
    def open(self):
        GLOBALS['sockets'].append(self)
        print "Websocket opened"

    def on_close(self):
        print "Websocket closed"
        GLOBALS['sockets'].remove(self)

class Announcer(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        player = self.get_argument('player')
        x = self.get_argument('x')
        y = self.get_argument('y')
        status = self.get_argument('status')
        scaleX = self.get_argument('scaleX')
        frame = self.get_argument('frame')

        for socket in GLOBALS['sockets']:
            #bear1, bear2, bear3, bear4
            socket.write_message(
                '{"bear%s":{"x":"%s", "y":"%s", "status":"%s", "scaleX":"%s", "frame":"%s"}}'
                % (str(player), str(x), str(y), str(status), str(scaleX), str(frame)))
        self.write('Posted')

class Login(tornado.web.RequestHandler):
    num = 0
    def get(self, *args, **kwargs):
        login = self.get_argument('login')
        if login == 'OK':
            self.num += 1
        for socket in GLOBALS['sockets']:
            #socket.write_message('{"login":"%s"}' % (str(login)))
            socket.write_message('{"login":"%s"}' % (str(self.num)))
        self.write('Login')

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/socket", ClientSocket),
    (r"/push", Announcer),
    (r"/login", Login),
])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
