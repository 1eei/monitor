#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author: Colin Yao
# 客户端
import socket
import uuid
import time
import json
import Adafruit_DHT

sensor = Adafruit_DHT.DHT11
gpio = 18

client = socket.socket()  # 定义协议类型,相当于生命socket类型,同时生成socket连接对象
client.connect(('192.168.122.113', 7777))

while True:
    humidity, temperature = Adafruit_DHT.read_retry(sensor, gpio)
    mac = uuid.UUID(int=uuid.getnode()).hex[-12:]
    number = mac + 'mac'
    times = int(time.time())
    data = {"temperature": temperature, "humidity": humidity, "number": number, "times": times}
    data = json.dumps(data)
    print('数据发送成功')
    client.send(data.encode())

client.close()
