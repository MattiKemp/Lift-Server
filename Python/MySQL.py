import mysql.connector as mariadb
import datetime

class DB:
    def __init__(self):
        print('connecting to database')
        try:
            self.db = mariadb.connect(user='python', password='Hinoob22',host='127.0.0.1',database='workout')
            print('connected')
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
                print("Something is wrong with your user name or password")
            elif err.errno == errorcode.ER_BAD_DB_ERROR:
                print("Database does not exist")
            else:
                print(err)
        #else:
            #print('closing')
            #self.db.close()
    
    def close(self):
        self.db.close()

    def insert(self, data):
        cur = self.db.cursor()
        cur.execute('INSERT INTO sensor_info(y,m,d,hour,min,sec,cel,fer,hum) VALUES({},{},{},{},{},{},{},{},{})'.format(int(data.year),int(data.month),int(data.day),int(data.hour),int(data.minute),int(data.second),data.celcius,data.fer,data.humidity))
        self.db.commit()

    def getLatest(self):
        cur = self.db.cursor()
        cur.execute('SELECT * FROM sensor_info ORDER BY id DESC LIMIT 1;')
        data = cur.fetchall()
        cur.close()
        return data

    def get300(self):
        cur = self.db.cursor()
        cur.execute('SELECT * FROM sensor_info ORDER BY id DESC LIMIT 300;')
        data = cur.fetchall()
        cur.close()
        return data

    def get_all_weekly(self):
        cur = self.db.cursor()
        # link: https://stackoverflow.com/questions/20573459/getting-the-date-of-7-days-ago-from-current-date-in-python
        date = datetime.date.today()
        date = date - datetime.timedelta(days=7)
        cur.execute('SELECT * FROM info_time WHERE time > date_sub(now(), interval 1 week);')
        data = cur.fetchall()
        cur.close()
        return data


    def get_user_daily(self, name):            
        cur = self.db.cursor()
        # link: https://stackoverflow.com/questions/20573459/getting-the-date-of-7-days-ago-from-current-date-in-python
        date = datetime.date.today()
        date = date - datetime.timedelta(days=1)
        cur.execute("SELECT * FROM info_time WHERE time > date_sub(now(), interval 1 day) AND name='" + name + "';")
        data = cur.fetchall()
        cur.close()
        return data

    #doesn't work propely, gets date beyond a week.
    def get_user_weekly(self, name):            
        cur = self.db.cursor()
        # link: https://stackoverflow.com/questions/20573459/getting-the-date-of-7-days-ago-from-current-date-in-python
        date = datetime.date.today()
        date = date - datetime.timedelta(days=7)
        cur.execute("SELECT * FROM info_time WHERE time > date_sub(now(), interval 1 week) AND name='" +name+ "';" )
        data = cur.fetchall()
        cur.close()
        return data

    def get_user_monthly(self, name):            
        cur = self.db.cursor()
        # link: https://stackoverflow.com/questions/20573459/getting-the-date-of-7-days-ago-from-current-date-in-python
        date = datetime.date.today()
        date = date - datetime.timedelta(days=7)
        cur.execute("SELECT * FROM info_time WHERE time > date_sub(now(), interval 1 month) AND name='" +name+ "';" )
        data = cur.fetchall()
        cur.close()
        return data

def main():
    db = DB()
    #db.getLatest()
    #dates = db.get_all_weekly()
    #print(dates)
    #dates = db.get_user_weekly('neck')
    #print(dates)
    #print(db.get_user_daily('neck'));
    print(db.get_user_monthly('neck'));

if __name__ == "__main__":
    main()
