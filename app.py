from flask import Flask, jsonify, render_template, request, redirect, url_for, session,flash
import sqlite3
import time
import os
import bcrypt 

def password_hashing(plain_password): #function to hash passwords
    salt = bcrypt.gensalt(rounds = 10)
    hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'),salt).decode('utf-8')
    return hashed_password

def verify_password(stored_hash, entered_password): #function to verify the password (unhash)
    return bcrypt.checkpw(entered_password.encode('utf-8'), stored_hash)


app = Flask(__name__)

# Load secret key from a file
SECRET_KEY_PATH = "sessionkey.txt"
if not os.path.exists(SECRET_KEY_PATH):
    raise FileNotFoundError(f"Secret key file '{SECRET_KEY_PATH}' not found.")

with open(SECRET_KEY_PATH, "r") as file:
    SESSIONKEY = file.read().strip()

if not SESSIONKEY:
    raise ValueError("Session key cannot be empty.")

app.secret_key = SESSIONKEY

DATABASE = 'pizza_order.db'
connection = sqlite3.connect(DATABASE, check_same_thread=False)
cursor = connection.cursor()

# Table creation
cursor.execute("""
CREATE TABLE IF NOT EXISTS pizzaOrders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER,
    tablenr INTEGER,
    pizza_type TEXT,
    quantity INTEGER,
    time TIME,
    order_status TEXT DEFAULT 'pending'
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username INTEGER,
    password_hashed TEXT,
    email TEXT
)
""")

pizzaPrice = {
    'Margherita': 11.8,
    'Tonno': 14.0,
    'Diavola': 13.8,
    'Pepperoni': 13.8,
    'Garlic Bread': 5.0,
    'Bruschetta': 6.0,
    'Coke': 3.0,
    'Sprite': 3.0,
    'Ice Cream': 4.0,
    'Tiramisu': 5.0
}

# Map product IDs to product names
def get_product_name_by_id(product_id):
    product_mapping = {
        '1': 'Margherita',
        '2': 'Tonno',
        '3': 'Diavola',
        '4': 'Pepperoni',
        '5': 'Garlic Bread',
        '6': 'Bruschetta',
        '7': 'Coke',
        '8': 'Sprite',
        '9': 'Ice Cream',
        '10': 'Tiramisu'
    }
    product_name = product_mapping.get(str(product_id), 'Unknown Product')
    print(f"Mapping product_id {product_id} to product_name '{product_name}'")
    return product_name

# Variable to track beep signal
beep_signal = False

@app.route('/')
def index():
    return redirect(url_for('table_number'))

@app.route('/table_number', methods=['GET', 'POST'])
def table_number():
    if request.method == 'POST':
        table_nr = request.form.get('table_nr')
        print(f"Table number received: {table_nr}")
        return redirect(url_for('menu', id=table_nr))
    return render_template('table_number.html')

@app.route("/order")
def menu():
    table_nr = request.args.get('id')
    session['tableNr'] = table_nr
    session['order'] = {}
    print(f"Menu accessed for table number: {table_nr}")
    return render_template('index.html')

@app.route("/submit_cart", methods=['POST'])
def submit_cart():
    cart_data = request.get_json()
    print(f"Received cart data: {cart_data}")
    carts = cart_data.get('carts', [])
    if not carts:
        print("No items in the cart.")
    if 'order' not in session:
        session['order'] = {}
    
    order = session['order']
    for item in carts:
        product_id = item.get('product_id')
        quantity = item.get('quantity', 0)
        if not product_id or quantity <= 0:
            print(f"Invalid item in cart: {item}")
            continue
        product_name = get_product_name_by_id(product_id)
        order[product_name] = order.get(product_name, 0) + quantity
        print(f"Added {quantity} x {product_name} to order.")
    
    session['order'] = order
    print(f"Updated session order: {session['order']}")
    return jsonify({'message': 'Cart has been submitted'})

@app.route("/confirm")
def confirm():
    order = session.get('order', {})
    print(f"Session order on confirm: {order}")
    # Calculate total amount
    total_amount = sum(quantity * pizzaPrice.get(pizza, 0) for pizza, quantity in order.items())
    print(f"Total amount: {total_amount} EUR")
    return render_template("confirm.html", order=order, table=session.get('tableNr'), total=total_amount, pizzaPrice=pizzaPrice)

@app.route('/thankyou')
def thankyou():
    order = session.get('order', {})
    tableNr = session.get('tableNr')
    time_cur = time.strftime('%H:%M:%S')
    print(f"Placing order for table {tableNr} at {time_cur}: {order}")
    
    if not order or not tableNr:
        print("Order or table number missing.")
        return redirect(url_for('index'))
    
    # Generate a new orderId
    cursor.execute("SELECT MAX(orderId) FROM pizzaOrders")
    last_order_id = cursor.fetchone()[0]
    new_order_id = (last_order_id + 1) if last_order_id else 1
    print(f"New order ID: {new_order_id}")
    
    for pizzaType, amount in order.items():
        cursor.execute(
            "INSERT INTO pizzaOrders (orderId, tablenr, pizza_type, quantity, time) VALUES (?, ?, ?, ?, ?)",
            (new_order_id, tableNr, pizzaType, amount, time_cur)
        )
        print(f"Inserted into DB: OrderID={new_order_id}, Table={tableNr}, Pizza={pizzaType}, Quantity={amount}, Time={time_cur}")
    
    session.pop('order', None)
    connection.commit()
    print("Order saved to database and session cleared.")
    return render_template('thankyou.html')

@app.route('/dashboard')
def dashboard():
    cursor.execute("""
        SELECT orderId, tablenr, time, pizza_type, quantity
        FROM pizzaOrders
        WHERE order_status = 'pending'
        ORDER BY orderId
    """)
    orders_raw = cursor.fetchall()
    orders = {}
    for order_id, table_nr, order_time, pizza_type, quantity in orders_raw:
        if order_id not in orders:
            orders[order_id] = {
                'orderId': order_id,
                'tablenr': table_nr,
                'time': order_time,
                'order_items': []
            }
        orders[order_id]['order_items'].append((pizza_type, quantity))
    print(f"Dashboard orders: {orders}")
    return render_template('dashboard.html', orders=orders.values())

@app.route('/validate_order', methods=['POST'])
def validate_order():
    global beep_signal
    order_id = request.form.get('orderId')
    print(f"Validating order with ID {order_id}")
    cursor.execute("DELETE FROM pizzaOrders WHERE orderId = ?", (order_id,))
    connection.commit()

    # This sets the beep signal for arduino_client.py
    beep_signal = True
    print("Order validated and beep signal set.")
    return redirect(url_for('dashboard'))

@app.route('/get_beep_signal')
def get_beep_signal():
    global beep_signal
    # Respond with the beep signal status and reset it
    if beep_signal:
        beep_signal = False
        print("Beep signal sent.")
        return jsonify({"beep": True})
    return jsonify({"beep": False})

@app.route('/login',methods =["POST","GET"])
def login():# login code  
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if not username or not password: 
            flash("Username and password required" , "error")
            return redirect(url_for('login'))
        try:
            cursor.execute("SELECT password_hashed FROM accounts WHERE username = ?",(username,)) 
            result = cursor.fetchone()

            if result is None:
                print("No account found")
                return "No account found"
            
            stored_hashed = result[0]
            if verify_password(stored_hashed.encode('utf-8'),password):
                   session['logged_in'] =True  # include redirect url for what is should be
                   session['client_name'] = username
                   return redirect(url_for('menu',id=session['tableNr']))
            else :
                print("Incorrect password")
                flash("Username or password is incorrect","error")
                return redirect(url_for('login'))
        except sqlite3.Error as e:
            print("sql error", e)
        
    return render_template('login.html')


@app.route('/signup' , methods = ['POST','GET'])
def signup():
    if request.method == 'POST':
        username = request.form['username'] 
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        email = request.form['email']

        if password != confirm_password : 
            flash("Passwords does not match" , "error")
            return redirect(url_for('signup'))
        try : 
            cursor.execute("SELECT * FROM accounts WHERE username =?",(username,))
            existing_user = cursor.fetchone()
            if existing_user:
                flash("Username is already taken.Please choose a different one !", "error")
                return redirect(url_for('signup'))
            
            password_hashed = password_hashing(password)
            cursor.execute("INSERT INTO accounts (username,password_hashed,email) VALUES (?,?,?)",(username,password_hashed,email))
            connection.commit()
            flash("account created succesfully !")
            return redirect(url_for('login'))
        except sqlite3.Error as e:
            print("SQL error" ,e)
            flash("Something went wrong")

    return render_template("signup.html")

@app.route('/logout')
def logout():
    session.pop('logged_in', None)  # Remove logged_in from session
    return redirect(url_for('menu',id=session['tableNr']))

@app.route('/offers')
def vouchers():
        return render_template("offers.html")
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)