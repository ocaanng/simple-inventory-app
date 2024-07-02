import mysql.connector
from mysql.connector import Error

def create_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",  # Isi password MySQL Anda jika ada
            database="fastapi_db"
        )
        if connection.is_connected():
            print("Connection to MySQL database successful")
            return connection
    except Error as e:
        print(f"The error '{e}' occurred")
        return None

def close_connection(connection):
    if connection.is_connected():
        connection.close()
        print("The connection is closed")
