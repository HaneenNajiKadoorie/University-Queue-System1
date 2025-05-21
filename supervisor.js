var queues = JSON.parse(localStorage.getItem('queues')) || {};
var logs = JSON.parse(localStorage.getItem('logs')) || [];
var servedStudents = JSON.parse(localStorage.getItem('servedStudents')) || [];

function updateQueueSummary() {
  var ul = document.getElementById('queueSummary');
  ul.innerHTML = '';
  for (var service in queues) {
    var li = document.createElement('li');
    li.className = 'list-group-item';
    var count = queues[service].length;
    li.textContent = service + ': ' + count + ' طالب';
    if (count > 0) {
      var names = queues[service].map(function(item) {
        return item.name + ' (' + item.id + ')';
      }).join(', ');
      li.textContent += ' (' + names + ')';
    }
    ul.appendChild(li);
  }
}

function showLogs() {
  var div = document.getElementById('logs');
  div.innerHTML = '';
  logs.forEach(function(entry) {
    var p = document.createElement('p');
    p.textContent = entry;
    div.appendChild(p);
  });
}

function generateReport() {
  var called = 0, present = 0, absent = 0;
  logs.forEach(function(entry) {
    if (entry.includes('تم استدعاء')) called++;
    if (entry.includes('تم تأكيد حضور')) present++;
    if (entry.includes('تم تسجيل غياب')) absent++;
  });
  var served = servedStudents.length;

  document.getElementById('countCalled').innerText = called;
  document.getElementById('countPresent').innerText = present;
  document.getElementById('countAbsent').innerText = absent;
  document.getElementById('countServed').innerText = served;

  document.getElementById('report').style.display = 'block';
}

// مسح السجلات
document.getElementById('clearLogs').addEventListener('click', function() {
  localStorage.removeItem('logs');
  logs = [];
  alert('✅ تم مسح سجلات العمليات.');
  showLogs();
  generateReport();
});

// مسح الطوابير
document.getElementById('clearQueues').addEventListener('click', function() {
  localStorage.removeItem('queues');
  queues = {};
  alert('✅ تم مسح جميع الطوابير.');
  updateQueueSummary();
});

// مسح الكل
document.getElementById('clearAll').addEventListener('click', function() {
  if (confirm('هل أنت متأكد من مسح جميع البيانات؟')) {
    localStorage.clear();
    queues = {};
    logs = [];
    servedStudents = [];
    alert('🧹 تم مسح جميع البيانات بنجاح.');
    updateQueueSummary();
    showLogs();
    generateReport();
  }
});

updateQueueSummary();
showLogs();
generateReport();
