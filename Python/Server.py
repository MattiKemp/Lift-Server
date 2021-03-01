import asyncio
import websockets
from MySQL import DB
import json
import datetime

db = DB()
#this is all terrible old code and needs to be severly rewritten for a larger scale project :/

def encodeJSONTotal(data):
    JSONData = {}
    for i in range(len(data)):
        if JSONData.get(data[i][0]) != None:
            JSONData[data[i][0]]['minutes'] += 1
        else:
            JSONData[data[i][0]] = {'minutes':1}
    return json.dumps(JSONData)

def encodeJSON(data):
    return json.dumps(data)

def daily(name):
    info = db.get_user_daily(name)
    day = {}
    for k in info:
        if day.get(k[1].hour):
            day[k[1].hour]+=1
        else:
            day[k[1].hour] = 1
    return day

def weekly(name):
    info = db.get_user_weekly(name)
    week = {}
    for k in info:
        if week.get(k[1].day):
            week[k[1].day]+=1
        else:
            week[k[1].day] = 1
    return week

def monthly(name):
    info = db.get_user_monthly(name)
    month = {}
    for k in info:
        if month.get(k[1].day):
            month[k[1].day]+=1
        else:
            month[k[1].day] = 1
    return month

#there is a bug where the db is not being updated for some reason so we have to
#create a new connection everytime a request is made from a client which is not optimal.
async def echo(websocket, path):
    async for message in websocket:
        global db 
        db = DB()
        if(message=="recent"):
            await websocket.send(encodeJSONTotal(db.get_all_weekly()))
        elif("daily" in message):
            await websocket.send(encodeJSON(daily(message[6:])))
        elif("weekly" in message):
            await websocket.send(encodeJSON(weekly(message[7:])))
        elif("monthly" in message):
            await websocket.send(encodeJSON(monthly(message[8:])))
        db.close()


def main():
    #----start server----
    start_server = websockets.serve(echo, "192.168.1.102", 8765)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
    
    #print(encodeJSONWeekly(weekly('neck')))
    

if __name__ == '__main__':
    main()
