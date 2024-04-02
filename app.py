import os

from flask import Flask, jsonify
from flask_cors import cross_origin, CORS
from flask import request

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import bcrypt

from dotenv import load_dotenv
load_dotenv()  # This loads the environment variables from .env file.

app = Flask(__name__, static_folder='./build', static_url_path='/')
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

uri = os.environ.get("MONGODB_URI")
print("MongoDB URI: ", uri)
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))


UserDB = client.Users  
ProjectDB = client.Projects
projects = ProjectDB.project1
users = UserDB.users1
HardwareDB = client.HardwareSet
hardware_sets = HardwareDB.HWSet1


# Function to initialize hardware sets in the database
def initialize_hardware_sets():
    default_sets = [
        {"name": "HWSet1", "capacity": 100, "availability": 100},
        {"name": "HWSet2", "capacity": 100, "availability": 100}
    ]
    for hw_set in default_sets:
        if not hardware_sets.find_one({"name": hw_set["name"]}):
            hardware_sets.insert_one(hw_set)

# Initialize hardware sets at the start of the application
initialize_hardware_sets()


#Login and Signup logic
#
#
@app.route('/process_login', methods=['POST'])
@cross_origin()
def process_login():

    data = request.json
    username = data.get('username')
    password = data.get('password')
    id = data.get('id')

    user = users.find_one({"username": username})
    if user:
        if bcrypt.checkpw(password.encode('utf-8'), user["password"]):
            return jsonify({"username": username, "code": 200}), 200
        else:
            return jsonify({"error": "Invalid login credentials", "code": 401}), 401
    else:
        return jsonify({"error": "User not found", "code": 404}), 404


@app.route('/process_signup', methods=['POST'])
def process_signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    id = data.get('id')
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Check if user already exists
    if users.find_one({"id": id}):
        return jsonify({"error": "User already exists", "code": 409}), 409

    # Add user to database
    new_user = {"username": username, "password": hashed_password, "id": id, "projects": []}
    users.insert_one(new_user)
    return jsonify({"username": username, "code": 200}), 200

#Project Management Logic
#
#
@app.route('/create_project', methods=['POST'])
def create_project():
    data = request.json
    projectName = data.get('projectName')
    description = data.get('description')
    projectId = data.get('projectId')
    userId = data.get('userId')

     # Check if user already exists
    if projects.find_one({"projectId": projectId}):
        return jsonify({"error": "Project already exists", "code": 409}), 409
    
    try:
        new_project = {"projectName": projectName, "description": description, "projectId": projectId}
        projects.insert_one(new_project)
        # Associate project with the user
        users.update_one({"id": userId}, {"$push": {"projects": projectId}})
        return jsonify({"message": "Project created successfully", "projectId": projectId, "code": 200}), 201
    except Exception as e:
        # Handle any database errors
        return jsonify({"error": str(e), "code": 500}), 500
    
app.route('/join_project', methods=['POST'])
def join_project():
    data = request.json
    projectId = data.get('projectId')
    userId = data.get('userId')

    # Check if project ID is provided
    if not projectId:
        return jsonify({'error': 'Missing project ID'}), 400

    # Check if the project exists
    project = projects.find_one({"projectId": projectId})
    if not project:
        return jsonify({"error": "Project not found", "code": 404}), 404

    # Check if the user has already joined the project
    user = users.find_one({"id": userId, "projects": {"$in": [projectId]}})
    if user:
        return jsonify({"error": "User has already joined this project", "code": 400}), 400

    # If the project exists and the user hasn't joined yet, add the project to the user's list
    try:
        users.update_one({"id": userId}, {"$push": {"projects": projectId}})
        return jsonify({"message": "Successfully joined project", "projectId": projectId, "code": 200}), 200
    except Exception as e:
        return jsonify({"error": str(e), "code": 500}), 500


@app.route('/get_user_projects', methods=['POST'])
def get_user_projects():
    data = request.json
    userId = data.get('userId')
    user = users.find_one({"id": userId})
    if user:
        projects_list = projects.find({"projectId": {"$in": user.get("projects", [])}})
        projects_data = [{"projectName": proj["projectName"], "projectId": proj["projectId"]} for proj in projects_list]
        return jsonify(projects_data), 200
    else:
        return jsonify({"error": "User not found", "code": 404}), 404

# Resource Management Logic
#
#

@app.route('/checkout', methods=['POST'])
@cross_origin()
def checkin():
    data = request.json
    hw_set_name = data.get('hwSetName')
    quantity = int(data.get('quantity'))

    hw_set = hardware_sets.find_one({"name": hw_set_name})
    if hw_set:
        new_availability = min(hw_set['capacity'], hw_set['availability'] + quantity)
        hardware_sets.update_one({"name": hw_set_name}, {"$set": {"availability": new_availability}})
        return jsonify({"message": f"Successfully checked in {quantity} units to {hw_set_name}.", "code": 200}), 200
    else:
        return jsonify({"error": "Hardware set not found", "code": 404}), 404

@app.route('/checkin', methods=['POST'])
@cross_origin()
def checkout():
    data = request.json
    hw_set_name = data.get('hwSetName')
    quantity = int(data.get('quantity'))

    hw_set = hardware_sets.find_one({"name": hw_set_name})
    if hw_set:
        if hw_set['availability'] >= quantity:
            new_availability = hw_set['availability'] - quantity
            hardware_sets.update_one({"name": hw_set_name}, {"$set": {"availability": new_availability}})
            return jsonify({"message": f"Successfully checked out {quantity} units from {hw_set_name}.", "code": 200}), 200
        else:
            return jsonify({"error": "Not enough available units to check out", "code": 400}), 400
    else:
        return jsonify({"error": "Hardware set not found", "code": 404}), 404


@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=os.environ.get('DEBUG', 'False') == 'True')
