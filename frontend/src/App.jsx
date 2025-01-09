import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [isNewContactOpen, setIsNewContactOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [updateOpen, setUpdateOpen] = useState({ open: false, contact: null });
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = "http://127.0.0.1:5000";

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/contacts`);
      if (!response.ok) throw new Error("Failed to fetch contacts");
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/create-contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email }),
      });
      if (response.status === 201) {
        setMessage("Contact created successfully!");
        setFirstName("");
        setLastName("");
        setEmail("");
        setIsNewContactOpen(false);
        fetchContacts();
      } else {
        throw new Error("Failed to create contact");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const { id, firstName, lastName, email } = updateOpen.contact;
      console.log(updateOpen.contact)
      const response = await fetch(`${API_URL}/update-contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email }),
      });
      if (response.ok) {
        setMessage("Contact updated successfully!");
        setUpdateOpen({ open: false, contact: null });
        fetchContacts();
      } else {
        throw new Error("Failed to update contact");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteContact = async (id) => {
    try {
      const response = await fetch(`${API_URL}/delete-contact/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        setMessage("Contact deleted successfully!");
        fetchContacts();
      } else {
        throw new Error("Failed to delete contact");
      }
    } catch (error) {
      setMessage(error.message);
    }
  }


  return (
    <div className="App">
      {message && <div className="message">{message}</div>}
      {isLoading ? (
        <div>Loading contacts...</div>
      ) : (
        <>
          <h1>
            Contact management app
          </h1>
          <table border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Names</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>{contact.id}</td>
                    <td>{`${contact.firstName} ${contact.lastName}`}</td>
                    <td>{contact.email}</td>
                    <td>
                      <button
                        onClick={() =>
                          setUpdateOpen({ open: true, contact })
                        }
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteContact(contact.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No contacts available</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
      <button onClick={() => setIsNewContactOpen(true)}>New Contact</button>
      {isNewContactOpen && (
        <div className="form-container">
          <h1>New Contact</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Save</button>
            <button
              type="button"
              onClick={() => setIsNewContactOpen(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
      {updateOpen.open && (
        <div className="form-container">
          <h1>Update Contact</h1>
          <form onSubmit={handleUpdateSubmit}>
            <input
              type="text"
              value={updateOpen.contact.firstName}
              onChange={(e) =>
                setUpdateOpen({
                  ...updateOpen,
                  contact: { ...updateOpen.contact, firstName: e.target.value },
                })
              }
              required
            />
            <input
              type="text"
              value={updateOpen.contact.lastName}
              onChange={(e) =>
                setUpdateOpen({
                  ...updateOpen,
                  contact: { ...updateOpen.contact, lastName: e.target.value },
                })
              }
              required
            />
            <input
              type="email"
              value={updateOpen.contact.email}
              onChange={(e) =>
                setUpdateOpen({
                  ...updateOpen,
                  contact: { ...updateOpen.contact, email: e.target.value },
                })
              }
              required
            />
            <button type="submit">Save Changes</button>
            <button
              type="button"
              onClick={() =>
                setUpdateOpen({ open: false, contact: null })
              }
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;