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
    projectId = data.get('projectId')  # Adjusted to 'projectId' for consistency

     # Check if user already exists
    if projects.find_one({"projectId": id}):
        return jsonify({"error": "Project already exists", "code": 409}), 409
    
    try:
        new_project = {"projectName": projectName, "description": description, "projectId": projectId}
        projects.insert_one(new_project)
        return jsonify({"message": "Project created successfully", "projectId": projectId, "code": 200}), 201
    except Exception as e:
        # Handle any database errors
        return jsonify({"error": str(e), "code": 500}), 500
    
<<<<<<< HEAD


@app.route('/join_project', methods=['POST'])
def join_project():
    data = request.get_json()
    print("Received data:", data)  # Log the received data

    join_project_id = data.get('joinProjectId')
    user_id = data.get('id')
    

    # Check if project ID is provided
    if not join_project_id:
        return jsonify({'error': 'Missing project ID'}), 400

    try:
        # Check if the user exists
        user = users.find_one({"id": user_id})
        if not user:
            return jsonify({'error': 'User not found'}), 405

        # Update the user's document
        result = users.update_one({"id": user_id}, {"$push": {"projects": join_project_id}})
        if result.modified_count > 0:
            return jsonify({'message': 'Project joined successfully!'}), 200
        else:
            return jsonify({'error': 'Failed to join project'}), 500
    except Exception as e:
        # Log the error (consider using logging library)
        print(f"Database error: {e}")
        return jsonify({'error': 'Database error'}), 500
=======
@app.route('/join_project', methods=['POST'])
def join_project():
    data = request.json
    projectId = data.get('projectId')
    print
    if projects.find_one({"projectId": projectId}):
        return jsonify({"message": "Project created successfully", "projectId": projectId, "code": 200}), 200
   
    return jsonify({"error": "Project not found", "code": 404}), 404
>>>>>>> ae98276421e7c07b40ffdf2d93b9137f5f4dae50



@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=os.environ.get('DEBUG', 'False') == 'True')

# # Resource Management Logic
# #
# #


#  # Reference to the HardwareSet collection
# hardware_set = ProjectDB.HardwareSet

# # List available resources
# @app.route('/resources', methods=['GET'])
# def list_resources():
#     resources = list(hardware_set.find({}, {'_id': 0}))
#     return jsonify(resources), 200

# # Check out resource
# @app.route('/checkout', methods=['POST'])
# def checkout_resource():
#     data = request.json
#     resource_id = data['resource_id']
#     units_to_checkout = data['units']
#     result = hardware_set.update_one({'_id': resource_id, 'available_units': {'$gte': units_to_checkout}},
#                                      {'$inc': {'available_units': -units_to_checkout}})
#     if result.modified_count:
#         return jsonify({'message': 'Resource checked out successfully'}), 200
#     else:
#         return jsonify({'error': 'Resource could not be checked out or insufficient units'}), 400

# # Check in resource
# @app.route('/checkin', methods=['POST'])
# def checkin_resource():
#     data = request.json
#     resource_id = data['resource_id']
#     units_to_checkin = data['units']
#     result = hardware_set.update_one({'_id': resource_id},
#                                      {'$inc': {'available_units': units_to_checkin}})
#     if result.modified_count:
#         return jsonify({'message': 'Resource checked in successfully'}), 200
#     else:
#         return jsonify({'error': 'Resource could not be checked in'}), 400

# # Add new resource
# @app.route('/add_resource', methods=['POST'])
# def add_resource():
#     data = request.json
#     # Include validation and sanitization as necessary
#     result = hardware_set.insert_one(data)
#     return jsonify({'message': 'New resource added', 'resource_id': str(result.inserted_id)}), 201

# # Update resource details
# @app.route('/update_resource/<resource_id>', methods=['PATCH'])
# def update_resource(resource_id):
#     data = request.json
#     result = hardware_set.update_one({'_id': resource_id}, {'$set': data})
#     if result.modified_count:
#         return jsonify({'message': 'Resource updated successfully'}), 200
#     else:
#         return jsonify({'error': 'Resource could not be updated'}), 400
    

    # Hardware Resource Management

ResourcesDB = client.Resources
resources = ResourcesDB.resources1

@app.route('/get_hardware_state', methods=['POST'])
@cross_origin()
def get_hardware_state():
    data = request.json
    hardwareSetId = data.get('hardwareSetId')

    resource = resources.find_one({"hardwareSetId": hardwareSetId}, {"_id": 0})  # Exclude MongoDB's default _id field from the response

    if resource:
        return jsonify(resource), 200
    else:
        return jsonify({"error": "Hardware set not found", "code": 404}), 404


@app.route('/checkout_hardware', methods=['POST'])
@cross_origin()
def checkout_hardware():
    data = request.json
    hardwareSetId = data['hardwareSetId']
    quantity = int(data['quantity'])
    
    resource = resources.find_one({"hardwareSetId": hardwareSetId})
    if resource and resource['availability'] >= quantity:
        new_availability = resource['availability'] - quantity
        resources.update_one({"hardwareSetId": hardwareSetId}, {"$set": {"availability": new_availability}})
        return jsonify({"message": "Hardware checked out successfully", "code": 200}), 200
    else:
        return jsonify({"error": "Not enough hardware available", "code": 400}), 400

@app.route('/checkin_hardware', methods=['POST'])
@cross_origin()
def checkin_hardware():
    data = request.json
    hardwareSetId = data['hardwareSetId']
    quantity = int(data['quantity'])
    
    resource = resources.find_one({"hardwareSetId": hardwareSetId})
    if resource:
        new_availability = min(resource['capacity'], resource['availability'] + quantity)
        resources.update_one({"hardwareSetId": hardwareSetId}, {"$set": {"availability": new_availability}})
        return jsonify({"message": "Hardware checked in successfully", "code": 200}), 200
    else:
        return jsonify({"error": "Hardware set not found", "code": 404}), 404