import firebase_admin
from firebase_admin import credentials, auth
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

# Habilitar CORS para todas las rutas
CORS(app)

# Configuración de conexión a MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:root@localhost/Proyecto1'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Inicializar Firebase Admin con la clave privada
cred = credentials.Certificate("config/key.json")
firebase_admin.initialize_app(cred)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firebase_uid = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)

# Inicializar la base de datos
with app.app_context():
    db.create_all()

@app.route('/verify_token', methods=['POST'])
def verify_token():
    try:
        # Obtener el token del cuerpo de la solicitud (también podrías usar request.args si viene en la URL)
        data = request.get_json()
        token = data.get('token', None)
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        # Verificar el token con Firebase
        decoded_token = auth.verify_id_token(token)
        
        # Si el token es válido, devolver un status 201
        return jsonify({'message': 'SECRET TEXTTT!!! :)'}), 201
    except firebase_admin.exceptions.FirebaseError:
        return jsonify({'message': 'Token is invalid!'}), 401

@app.route('/users', methods=['POST'])
def add_user():
    token = request.headers.get('Authorization').split(' ')[1]  # El token JWT viene en el header 'Authorization'
    
    try:
        # Verificar el token en Firebase
        decoded_token = auth.verify_id_token(token)
        firebase_uid = decoded_token['uid']
        email = decoded_token['email']
        name = decoded_token.get('name', 'No Name Provided')

        # Verificar si el usuario ya está en la base de datos local
        user = User.query.filter_by(firebase_uid=firebase_uid).first()
        
        if user:
            return jsonify({"message": "User already exists"}), 200

        # Si el usuario no existe en la base de datos, lo creamos
        new_user = User(firebase_uid=firebase_uid, email=email, name=name)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created"}), 201

    except firebase_admin.exceptions.FirebaseError as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)