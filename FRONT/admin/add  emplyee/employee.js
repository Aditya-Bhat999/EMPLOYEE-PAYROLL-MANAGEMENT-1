// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvxOii6dwThVHUZeu8fnDUtFcJg-WlKkY",
    authDomain: "employee-management-2d6f0.firebaseapp.com",
    databaseURL: "https://employee-management-2d6f0-default-rtdb.firebaseio.com/",
    projectId: "employee-management-2d6f0",
    storageBucket: "employee-management-2d6f0.firebasestorage.app",
    messagingSenderId: "770890214866",
    appId: "1:770890214866:web:b00a8fdbe5a7818fb52c0b"
};

// Initialize
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Get ID from URL
const urlParams = new URLSearchParams(window.location.search);
const employeeId = urlParams.get('id');

function loadEmployeeDetails() {
    const employeeRef = ref(database, 'employees/' + employeeId);
    
    get(employeeRef).then((snapshot) => {
        if (snapshot.exists()) {
            const employee = snapshot.val();
            
            // MATH FIX: Calculate 12% bonus/tax after 'employee' is defined
            const salaryValue = parseFloat(employee.salary) || 0;
            const adjustment = salaryValue * 0.12; 
            const finalSalary = salaryValue - adjustment;

            document.getElementById('employee-details').innerHTML = `
                <div class="detail-card">
                    <div class="info-group">
                        
                        <p> ID : ${employee.id}</p>
                    </div>
                    <div class="info-group">
                       
                        <p> NAME : ${employee.name.toUpperCase()}</p>
                    </div>
                    <div class="info-group">
                        
                        <p> ROLE : ${employee.role}</p>
                    </div>
                    <div class="info-group">
                       
                        <p class="salary"> TOTAL SALARY : ₹${finalSalary.toLocaleString()}</p>
                    </div>
                </div>
            `;
        } else {
            document.getElementById('employee-details').innerHTML = '<p>Employee not found.</p>';
        }
    }).catch((error) => {
        console.error('Error:', error);
    });
}

if (employeeId) {
    loadEmployeeDetails();
} else {
    document.getElementById('employee-details').innerHTML = '<p>No ID selected.</p>';
}