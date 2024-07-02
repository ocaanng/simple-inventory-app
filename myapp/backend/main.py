from fastapi import FastAPI, HTTPException, Request, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from mysql.connector import Error
from app import database
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

app = FastAPI()

class User(BaseModel):
    full_name: str
    username: str
    password: str
    role: str = 'user'  # Default role

class LoginRequest(BaseModel):
    username: str
    password: str

class Product(BaseModel):
    name: str
    id: str
    category: str
    price: float
    stock: int
    image_url: str

class Transaction(BaseModel):
    transaction_id: int
    date: str
    product_id: int
    total: float
    quantity: int

# CORS configuration
origins = [
    "http://localhost:3000",  # Adjust this if your frontend runs on a different port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
    allow_origin_regex='http://localhost:.*',
)


@app.on_event("startup")
def startup():
    try:
        app.state.db_connection = database.create_connection()
    except Error as e:
        raise HTTPException(status_code=500, detail="Database connection failed")

@app.on_event("shutdown")
def shutdown():
    try:
        database.close_connection(app.state.db_connection)
    except Error as e:
        raise HTTPException(status_code=500, detail="Failed to close the database connection")

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI MySQL Example"}

@app.post("/register")
async def register(user: User, request: Request):
    try:
        print(f"Received request: {await request.json()}")
        cursor = app.state.db_connection.cursor()
        cursor.execute("""
            INSERT INTO users (full_name, username, password, role) 
            VALUES (%s, %s, %s, %s)
        """, (user.full_name, user.username, user.password, user.role))
        app.state.db_connection.commit()
        cursor.close()
        return {"msg": "Registration successful"}
    except Error as e:
        raise HTTPException(status_code=400, detail=f"Registration failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unexpected error: {str(e)}")

@app.post("/login")
async def login(login_request: LoginRequest):
    try:
        cursor = app.state.db_connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT * FROM users WHERE username = %s AND password = %s
        """, (login_request.username, login_request.password))
        user = cursor.fetchone()
        cursor.close()
        
        if user:
            return {"msg": "Login successful", "user": user}
        else:
            raise HTTPException(status_code=401, detail="Invalid username or password")
    except Error as e:
        raise HTTPException(status_code=400, detail=f"Login failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unexpected error: {str(e)}")

@app.get("/user")
async def get_user_details(username: str):
    try:
        cursor = app.state.db_connection.cursor(dictionary=True)
        cursor.execute("SELECT full_name FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        
        if user:
            return {"full_name": user['full_name']}
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except Error as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch user details: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unexpected error: {str(e)}")
    
@app.get("/products")
def get_products():
    try:
        cursor = app.state.db_connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM products")
        products = cursor.fetchall()
        cursor.close()
        return {"products": products}
    except Error as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch products: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unexpected error: {str(e)}")

@app.post("/products")
async def add_product(product: Product):
    try:
        cursor = app.state.db_connection.cursor()
        cursor.execute("""
            INSERT INTO products (name, id, category, price, stock, image_url) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (product.name, product.id, product.category, product.price, product.stock, product.image_url))
        app.state.db_connection.commit()
        cursor.close()
        return {"msg": "Product added successfully", "product": product}
    except Error as e:
        raise HTTPException(status_code=400, detail=f"Failed to add product: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unexpected error: {str(e)}")
    
@app.get("/transactions")
def get_transactions():
    try:
        cursor = app.state.db_connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM transactions")
        transactions = cursor.fetchall()
        cursor.close()
        return {"transactions": transactions}
    except Error as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch transactions: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unexpected error: {str(e)}")

@app.post("/transactions")
async def add_transaction(transaction: Transaction):
    try:
        cursor = app.state.db_connection.cursor()
        cursor.execute("""
            INSERT INTO transactions (transaction_id, date, product_id, total, quantity) 
            VALUES (%s, %s, %s, %s, %s)
        """, (transaction.transaction_id, transaction.date, transaction.product_id, transaction.total, transaction.quantity))
        app.state.db_connection.commit()
        cursor.close()
        return {"msg": "Transaction added successfully", "transaction": transaction}
    except Error as e:
        raise HTTPException(status_code=400, detail=f"Failed to add transaction: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unexpected error: {str(e)}")
    
@app.get("/users", response_model=List[User])
def get_users():
    try:
        cursor = app.state.db_connection.cursor(dictionary=True)
        cursor.execute("SELECT full_name, username, role FROM users")
        users = cursor.fetchall()
        cursor.close()
        return users
    except Error as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch users: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unexpected error: {str(e)}")


