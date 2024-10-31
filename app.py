from flask import Flask, jsonify, render_template, request, redirect, url_for, session
import sqlite3
import time

app = Flask(__name__)

# Load secret key from a file
with open("sessionkey.txt", "r") as file:
    SESSIONKEY = file.read()
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

pizzaPrice = {
    'Margherita': 10,
    'Pepperoni': 13,
    'Vegetarian': 12,
    'BBQ-Chicken': 14,
    'Hawaiian': 16
}

# Variable to track beep signal
beep_signal = False

@app.route('/')
def index():
    return redirect(url_for('table_number'))

@app.route('/table_number', methods=['GET', 'POST'])
def table_number():
    if request.method == 'POST':
        table_nr = request.form.get('table_nr')
        return redirect(url_for('menu', id=table_nr))
    return render_template('table_number.html')

@app.route("/order")
def menu():
    table_nr = request.args.get('id')
    session['tableNr'] = table_nr
    session['order'] = {}
    # return render_template('index.html', table=session['tableNr'])
    return render_template('index.html')

@app.route("/submit_order", methods=['POST'])
def submit():
    pizza_type = request.form.get('pizza')
    if 'order' not in session:
        session['order'] = {}

    order = session['order']
    order[pizza_type] = order.get(pizza_type, 0) + 1
    session['order'] = order
    return jsonify({'message': f'{pizza_type} has been added to your cart!'})

@app.route("/confirm")
def confirm():
    order = session.get('order', {})
    total_amount = sum(quantity * pizzaPrice[pizza] for pizza, quantity in order.items())
    return render_template("confirm.html", order=order, table=session['tableNr'], total=total_amount)

@app.route('/thankyou')
def thankyou():
    order = session.get('order', {})
    tableNr = session['tableNr']
    time_cur = time.strftime('%H:%M:%S')

    # Generate a new orderId
    cursor.execute("SELECT MAX(orderId) FROM pizzaOrders")
    last_order_id = cursor.fetchone()[0]
    new_order_id = (last_order_id + 1) if last_order_id else 1

    for pizzaType, amount in order.items():
        cursor.execute(
            "INSERT INTO pizzaOrders (orderId, tablenr, pizza_type, quantity, time) VALUES (?, ?, ?, ?, ?)",
            (new_order_id, tableNr, pizzaType, amount, time_cur)
        )

    session.pop('order', None)
    connection.commit()
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
    return render_template('dashboard.html', orders=orders.values())

@app.route('/validate_order', methods=['POST'])
def validate_order():
    global beep_signal
    order_id = request.form.get('orderId')
    print(f"Validating order with ID {order_id}")
    cursor.execute("DELETE FROM pizzaOrders WHERE orderId = ?", (order_id,))
    connection.commit()

    # this sets the beep signal for arduino_client.py
    beep_signal = True
    return redirect(url_for('dashboard'))

@app.route('/get_beep_signal')
def get_beep_signal():
    global beep_signal
    # Respond with the beep signal status and reset it
    if beep_signal:
        beep_signal = False
        return jsonify({"beep": True})
    return jsonify({"beep": False})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)