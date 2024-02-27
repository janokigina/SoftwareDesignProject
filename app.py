import os

from flask import Flask, jsonify
from flask_cors import cross_origin, CORS
app = Flask(__name__, static_folder='./build', static_url_path='/')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/process_login/<username>/<id>/<password>')
@cross_origin()
def process_login(username, id, password):
    #need to fix logic here to check if user exists in db
    if username == "abc" and id == "123" and password == "456":
        successM = {"username": username, "code": 200}
        return jsonify(successM), 200
    else:
        errorM = {"error": "User Not Found", "code": 404}
        return jsonify(errorM), 404

@app.route('/process_signup/<username>/<id>/<password>/<confirmPassword>')
@cross_origin()
def process_signup(username, id, password, confirmPassword):
    #this is some placeholder logic
    if password == confirmPassword:
        successM = {"username": username, "code": 200}
        return jsonify(successM), 200
    else:
        errorM = {"error": "Passwords do not match", "code": 404}
        return jsonify(errorM), 404

@app.route('/')
@cross_origin()
def index():
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False, port=5000)
