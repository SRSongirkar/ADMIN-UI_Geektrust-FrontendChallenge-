import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    // Fetch data from the API
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => response.json())
      .then(data => {
        setUsers(data.map(user => ({ ...user, selected: false })));
      });
  }, []);

  const renderTable = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const displayedUsers = users.slice(startIndex, endIndex);

    return displayedUsers.map(user => (
      <tr key={user.id} className={user.selected ? 'table-active' : ''}>
        <td><input type="checkbox" onChange={() => toggleSelectRow(user.id)} checked={user.selected} /></td>
        <td>{user.id}</td>
        <td onClick={() => editName(user.id)}>
          {user.editing ? (
            <input
              type="text"
              className="form-control"
              value={user.name}
              onBlur={() => saveEditedName(user.id)}
              onChange={(e) => handleNameChange(user.id, e.target.value)}
            />
          ) : (
            user.name
          )}
        </td>
        <td>{user.email}</td>
        <td>{user.role}</td>
        <td>
          <button className="btn btn-primary btn-sm" style={{marginRight:"5px"}} onClick={() => editRow(user.id)}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => deleteRow(user.id)}>Delete</button>
        </td>
      </tr>
    ));
  };

  const search = () => {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const filteredUsers = users.map(user => ({ ...user, selected: false }))
      .filter(user =>
        user.id.toLowerCase().includes(searchTerm) ||
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
      );
    setUsers(filteredUsers);
    setCurrentPage(1);
  };

  const editRow = (id) => {
    const updatedUsers = users.map(user => ({
      ...user,
      editing: user.id === id
    }));
    setUsers(updatedUsers);
  };

  const editName = (id) => {
   
  };

  const saveEditedName = (id) => {
    const updatedUsers = users.map(user => ({
      ...user,
      editing: false
    }));
    setUsers(updatedUsers);
  };

  const handleNameChange = (id, value) => {
    const updatedUsers = users.map(user => ({
      ...user,
      name: user.id === id ? value : user.name
    }));
    setUsers(updatedUsers);
  };

  const deleteRow = (id) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
  };

  const toggleSelectRow = (id) => {
    const updatedUsers = users.map(user => ({
      ...user,
      selected: user.id === id ? !user.selected : user.selected
    }));
    setUsers(updatedUsers);
  };

  const toggleSelectAll = () => {
    const isSelected = users.every(user => user.selected);
    const updatedUsers = users.map(user => ({
      ...user,
      selected: !isSelected
    }));
    setUsers(updatedUsers);
  };

  const deleteSelected = () => {
    const updatedUsers = users.filter(user => !user.selected);
    setUsers(updatedUsers);
  };

  const updatePagination = () => {
    const totalPages = Math.ceil(users.length / pageSize);
    document.getElementById('currentPage').innerText = `Page ${currentPage} of ${totalPages}`;
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredUsers = users.map(user => ({ ...user, selected: false }))
      .filter(user =>
        user.id.toLowerCase().includes(searchTerm) ||
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
      );
    setUsers(filteredUsers);
    setCurrentPage(1);
  };
  

  return (
    <div className="container mt-5">
    <header className="mb-4 text-center">
        <h1 className="mx-auto">ADMIN UI</h1>
    </header>

      <main>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="searchInput"
            placeholder="Search...Name,Email,Role"
            onChange={handleSearch}
          />
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead >
              <tr>
                <th> 
                  <input type="checkbox" onChange={toggleSelectAll} />
                  Select All
                </th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{renderTable()}</tbody>
          </table>
        </div>
        <div>
              <button className="btn btn-danger mt-3" onClick={deleteSelected}>
                 Delete Selected
              </button>

                <div style={{marginBottom:"5px"}}className="pagination justify-content-center">
                
                  <button className="btn btn-primary" style={{marginRight:"5px"}}onClick={() => goToPage(1)}>First</button>
                  <button className="btn btn-primary" style={{marginRight:"5px"}}onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                  <span id="currentPage" className="mx-3">{`Page ${currentPage}`}</span>
                  <button className="btn btn-primary" style={{marginRight:"5px"}}onClick={() => goToPage(currentPage + 1)} disabled={currentPage === Math.ceil(users.length / pageSize)}>Next</button>
                  <button className="btn btn-primary" style={{marginRight:"5px"}}onClick={() => goToPage(Math.ceil(users.length / pageSize))}>Last</button>
                </div>
          </div>
      </main>
    </div>
  );
}

export default App;
