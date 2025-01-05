import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
    );
};

const Home = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        getContacts();
    }, []);

    const getContacts = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/contacts", {
                method: "GET", // Fixed the undefined GET variable
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(response)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setContacts(data.contacts); // Assuming the API returns { contacts: [...] }
            console.log(data.contacts);
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };

    return (
        <>
            <h1>Contacts List</h1>
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.length > 0 ? (
                        contacts.map((contact, index) => (
                            <tr key={index}>
                                <td>{`${contact.firstName} ${contact.lastName}`}</td>
                                <td>{contact.email}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">No contacts available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
};

export default AppRoutes;
