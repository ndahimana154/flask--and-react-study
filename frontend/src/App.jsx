import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);

  const fetchContacts = async () => {
    const response = await fetch("http://127.0.0.1:5000/contacts");
    const data = await response.json();
    setContacts(data.contacts);
  }
  useEffect(() => {
    fetchContacts();
  }, []);

  const [isNewContactOpen, setIsNewContactOpen] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch("http://127.0.0.1:5000/create-contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email }),
    })
    console.log(response)
    if (response.status === 201) {
      setMessage("Contact created successfully");
      setIsNewContactOpen(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      fetchContacts();
    }

  }
  return (
    <>
      {isNewContactOpen ? (
        <div>
          {message && message}
          <table border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Names</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length > 0 ? contacts.map(contact => (
                <tr key={contact.id}>
                  <td>{contact.id}</td>
                  <td>{contact.firstName}{" "}{contact.lastName}</td>
                  <td>{contact.email}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={"10"}>No contacts available</td>
                </tr>
              )}
            </tbody>
          </table>
          <button onClick={() => setIsNewContactOpen(false)}>
            New contact
          </button>
        </div >
      ) : (
        <div>
          <form action="" method="post" onSubmit={handleSubmit}>
            <h1>New contact</h1>
            <p>
              <label htmlFor="">Firstname</label>
              <input type="text" name="firstName"
                placeholder="First Name" required
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
              />
            </p>
            <p>
              <label htmlFor="">Lastname</label>
              <input type="text" name="lastName" placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                required />
            </p>
            <p>
              <label htmlFor="">Email</label>
              <input type="email" name="email" placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required />
            </p>
            <button type="submit">Save</button>
          </form>
        </div>
      )
      }

    </>
  );
}

export default App;
