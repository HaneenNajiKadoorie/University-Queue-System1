document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var role = document.getElementById('role').value;
  if (role === 'student') {
    window.location.href = 'student.html';
  } else if (role === 'staff') {
    window.location.href = 'staff.html';
  } else if (role === 'supervisor') {
    window.location.href = 'supervisor.html';
  }
});

