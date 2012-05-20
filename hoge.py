import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.websocket
import simplejson as json
from tornado import options
from hashlib import sha1
import datetime
import random

class Model(dict):
    def __getattr__(self, key):
        return dict.__getitem__(self, key)
    def __setattr__(self, key, value):
        return dict.__setitem__(self, key, value)

socketConnections = {}
class TTLSSocketHandler(tornado.websocket.WebSocketHandler):
    sessionId = ''
    def open(self, *args, **kwargs):
        print("open: " + self.sessionId)
        if len(socketConnections) > 3:
            self.close()
            return
        session_id = TTLSSocketHandler._create_session()
        self.sessionId = session_id
        socketConnections[session_id] = self
        for key in socketConnections.keys():
            if key != session_id:
                try:
                    socketConnections[key].write_message(json.dumps({"session_id":
                    session_id}))
                except
                    IOError:
                    socketConnections.pop(key)
                    self.write_message(json.dumps({'my_session_id': session_id}))

    def on_message(self, message):
        print('on_message: ' + self.sessionId)
        msg = Model(json.loads(message));
        while 'func' in msg and msg.func == 'attack' and len(socketConnections) > 1:
            i = random.randint(0, len(socketConnections) - 1)
            sendCon = socketConnections[socketConnections.keys()[i]]
            if sendCon.sessionId != self.sessionId:
                try:
                    sendCon.write_message(message)
                except IOError:
                    socketConnections.pop(sendCon.sessionId)
                return;

        for con in socketConnections.values():
            if con != self:
                try:
                    con.write_message(message)
                except IOError:
                    socketConnections.pop(con.sessionId)

    @staticmethod
    def _create_session():
        session_id = sha1(str(datetime.datetime.now()) +
        str(random.randint(1, 10000))).hexdigest()
        while session_id in socketConnections:
            session_id = sha1(str(datetime.datetime.now()) + str(random(1, 10000)))
        return session_id

    def on_close(self):
        print('on_close: ' + self.sessionId)
        for con in socketConnections.values():
        if con != self:
        try:
            con.write_message(json.dumps({
        'func':
        'remove',
        'session_id':
        self.sessionId
        }))
        except
            IOError:
        socketConnections.pop(con.sessionId)
        if self in socketConnections:
            socketConnections.pop(self.sessionId)

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        print('MainHandler.get(self)')
        self.render("index.html")

application = tornado.web.Application([
        (r"/ttls", TTLSSocketHandler),
            (r"/index.html", MainHandler)
        ], debug=True)

if __name__ == "__main__":
    options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(10002)
    tornado.ioloop.IOLoop.instance().start()
