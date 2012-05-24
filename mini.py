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

#    def on_message(self, ):
#        self.write_message("You said: " + message)

    def on_close(self):
        print "Websocket closed"
        GLOBALS['sockets'].remove(self)

class Announcer(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        x = self.get_argument('x')
        y = self.get_argument('y')
        status = self.get_argument('status')
        scale_x = self.get_argument('scaleX')

        player = self.get_argument('player')

        for socket in GLOBALS['sockets']:
            #bear1, bear2, bear3, bear4
            #socket.write_message('{"bear%s":{"x":"%s", "y":"%s", "scaleX":"%s", "status":"%s"}}' %
            #        (str(player), str(x), str(y), str(status), str(scale_x)))
            socket.write_message('{"bear%s":{"x":"%s", "y":"%s"}}' % (str(player), str(x), str(y)))
#            socket.write_message('{"player":"%s"}' % (str(player)))
        self.write('Posted')

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/socket", ClientSocket),
    (r"/push", Announcer),
])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
