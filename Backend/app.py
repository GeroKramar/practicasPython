from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Importar CORS

app = Flask(__name__)

# Habilitar CORS para todas las rutas
CORS(app)

# Configuración de conexión a MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@localhost/Proyecto1'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firebase_uid = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)

# Inicializar la base de datos
with app.app_context():
    db.create_all()

@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    new_user = User(firebase_uid=data['firebase_uid'], email=data['email'], name=data['name'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created"}), 201

if __name__ == '__main__':
    app.run(debug=True)