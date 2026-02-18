import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase, ref, set, onValue, remove } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDvxOii6dwThVHUZeu8fnDUtFcJg-WlKkY",
    authDomain: "employee-management-2d6f0.firebaseapp.com",
    databaseURL: "https://employee-management-2d6f0-default-rtdb.firebaseio.com/",
    projectId: "employee-management-2d6f0",
    storageBucket: "employee-management-2d6f0.firebasestorage.app",
    messagingSenderId: "770890214866",
    appId: "1:770890214866:web:b00a8fdbe5a7818fb52c0b"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const employeeForm = document.getElementById('employee-form');
const listElement = document.getElementById('list');

// 1. ADD / UPDATE DATA
employeeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('employee-id').value;
    const name = document.getElementById('employee-name').value;
    const role = document.getElementById('employee-role').value;
    const salary = document.getElementById('employee-salary').value;

    set(ref(database, 'employees/' + id), { id, name, role, salary })
        .then(() => employeeForm.reset())
        .catch(err => alert("Error: " + err.message));
});

// 2. READ DATA (Live Sync)
onValue(ref(database, 'employees'), (snapshot) => {
    listElement.innerHTML = '';
    snapshot.forEach((child) => {
        const emp = child.val();
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="employee.html?id=${emp.id}" class="employee-link">${emp.id} - ${emp.name} (${emp.role})</a>
            <div>
                <button onclick="editEmployee('${emp.id}')">Edit</button>
                <button onclick="removeEmployee('${emp.id}')">Remove</button>
            </div>
        `;
        listElement.appendChild(li);
    });
});

// 3. HANDLE CLICKS (Event Delegation)
listElement.addEventListener('click', (e) => {
    const id = e.target.getAttribute('data-id');
    if (!id) return;

    if (e.target.classList.contains('remove-btn')) {
        if(confirm("Delete this employee?")) {
            remove(ref(database, 'employees/' + id));
        }
    } 
    
    if (e.target.classList.contains('edit-btn')) {
        onValue(ref(database, 'employees/' + id), (snapshot) => {
            const emp = snapshot.val();
            document.getElementById('employee-id').value = emp.id;
            document.getElementById('employee-name').value = emp.name;
            document.getElementById('employee-role').value = emp.role;
            document.getElementById('employee-salary').value = emp.salary || '';
        }, { onlyOnce: true });
    }
});

// Render employee list
function renderEmployees() {
    listElement.innerHTML = '';
    employees.forEach((employee) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="employee.html?id=${employee.id}" class="employee-link">${employee.id} - ${employee.name} (${employee.role}) - Salary: ${employee.salary}</a><br><br>
            <div>
<br>
                <button onclick="editEmployee('${employee.id}')">Edit</button>
                <button onclick="removeEmployee('${employee.id}')">Remove</button>
            </div>
        `;
        listElement.appendChild(li);
    });
}

