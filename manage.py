from flask import Flask, render_template, session, request, jsonify
from flask_socketio import SocketIO, emit, send
import socket, time, socketserver, threading, traceback
import json
from threading import Lock
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String

async_mode = None
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:qq111111@127.0.0.1:3306/device"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

socketio = SocketIO(app, async_mode=async_mode)


class Device(db.Model):
    __tablename__ = 'device'

    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.String(15))
    attr = db.Column(db.String(16))
    par = db.Column(db.String(16))
    times = db.Column(db.String(16), index=True)


thread_lock = Lock()
client_addr = []
client_socket = []
global msgdata
msgdata = ""


class ThreadedTCPRequestHandler(socketserver.BaseRequestHandler):
    ip = ""
    port = 0
    timeOut = 3600

    def setup(self):
        self.ip = self.client_address[0].strip()
        self.port = self.client_address[1]
        self.request.settimeout(self.timeOut)
        print(self.ip + ":" + str(self.port) + "连接到服务器！")
        client_addr.append(self.client_address)
        client_socket.append(self.request)

    def handle(self):
        while True:
            try:
                time.sleep(3)
                try:
                    data = self.request.recv(1024).decode()
                except socket.timeout:
                    print(self.ip + ":" + str(self.port) + "接收超时！即将断开连接！")
                    break
                if data:
                    cur_thread = threading.current_thread()
                    data = json.loads(data)
                    times = time.strftime('%H:%M:%S', time.localtime())

                    temperature = data['temperature']
                    humidity = data['humidity']
                    timestamp = data['times']
                    number = data['number']

                    socketio.emit('server_response', {'data': [times, humidity, temperature]})

                    humidity_data = Device(number=number,
                                           attr='humidity',
                                           par=humidity,
                                           times=timestamp
                                           )

                    temperature_data = Device(number=number,
                                              attr='temperature',
                                              par=temperature,
                                              times=timestamp
                                              )

                    db.session.add(humidity_data)
                    db.session.add(temperature_data)
                    db.session.commit()

                    self.request.sendall(('%s %s %s ' % (time.ctime(), cur_thread.name, data)).encode())
            except:
                traceback.print_exc()
                break

    def finish(self):
        print(self.ip + ":" + str(self.port) + "断开连接！")
        client_addr.remove(self.client_address)
        client_socket.remove(self.request)


class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    ServerStart = False
    pass


HOST, PORT = "0.0.0.0", 7777
server = ThreadedTCPServer((HOST, PORT), ThreadedTCPRequestHandler)
ip, port = server.server_address
server.ServerStart = False
server_thread = threading.Thread(target=server.serve_forever)
server_thread.daemon = True


@app.route('/')
def index():
    if len(client_socket) == 0:

        if server.ServerStart:
            pass
        else:
            server_thread.start()
            server.ServerStart = True
    return render_template('demo.html', async_mode=socketio.async_mode)


if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=8888)
