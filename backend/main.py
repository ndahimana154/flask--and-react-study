from flask import request,jsonify
from config import app,db
from models import Contact

@app.route("/contacts", methods=["GET"])
def getContacts():
    contacts = Contact.query.all()
    json_contacts =list(map(lambda x: x.to_json(),contacts))
    return jsonify({"contacts": json_contacts}),200

@app.route("/create-contact", methods=["POST"])
def createContact():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")
    
    if not first_name or not last_name or not email:
        return jsonify({"error": "Missing required fields"}), 400
    newContact = Contact(first_name=first_name, last_name=last_name, email=email)
    
    try:
        db.session.add(newContact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}, 400)
    
    return jsonify({"message": "User created!"}),201

@app.route("/update-contact/<int:user_id>", methods=["PATCH"])
def updateContact(user_id):
    contact = Contact.query.get(user_id)
    
    if not contact: return jsonify({"message": "User not found"})
    
    data = request.json
    contact.first_name = data.get("firstName", contact.first_name)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)
    
    db.session.commit()
    
    return jsonify({"message": "User updated"}), 200

@app.route("/delete-contact/<int:user_id>", methods=["DELETE"])
def deleteContact(user_id):
    contact = Contact.query.get(user_id)
    
    if not contact: return jsonify({"message": "User not found"})
    
    db.session.delete(contact)
    db.session.commit()
    
    return jsonify({"message": "User deleted"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
    app.run(debug=True)