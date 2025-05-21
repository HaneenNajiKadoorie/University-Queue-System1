if (!localStorage.getItem('queues')) {
  const initialQueues = {
    "الخدمة الأكاديمية": [],
    "الخدمة المالية": [],
    "الدعم التقني": []
  };
  localStorage.setItem('queues', JSON.stringify(initialQueues));
}

if (!localStorage.getItem('logs')) {
  localStorage.setItem('logs', JSON.stringify([]));
}

if (!localStorage.getItem('servedStudents')) {
  localStorage.setItem('servedStudents', JSON.stringify([]));
}

let queues = JSON.parse(localStorage.getItem('queues'));
let currentStudent = null;
let isConfirmed = false;

function updateQueueList() {
  queues = JSON.parse(localStorage.getItem('queues'));
  const list = document.getElementById('queueList');
  list.innerHTML = '';
  const selectedService = document.getElementById('serviceSelectStaff').value;
  if (!selectedService) {
    list.innerHTML = '<li class="list-group-item text-center text-muted">يرجى اختيار خدمة لعرض قائمة الانتظار</li>';
    return;
  }
  const queueForService = queues[selectedService] || [];
  if (queueForService.length === 0) {
    list.innerHTML = '<li class="list-group-item text-center text-muted">لا يوجد طلاب في قائمة الانتظار لهذه الخدمة</li>';
    return;
  }
  queueForService.forEach(student => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${student.service} - ${student.name} (${student.id})`;
    list.appendChild(li);
  });
}

function updateCurrentInfo() {
  const info = document.getElementById('currentInfo');
  if (currentStudent) {
    info.textContent = `${currentStudent.service} - ${currentStudent.name} (${currentStudent.id})`;
  } else {
    info.textContent = 'لا يوجد طالب حاليًا';
  }
  document.getElementById('confirmBtn').disabled = !currentStudent || isConfirmed;
  document.getElementById('absentBtn').disabled = !currentStudent || isConfirmed;
  document.getElementById('endBtn').disabled = !isConfirmed;
}

document.getElementById('serviceSelectStaff').addEventListener('change', () => {
  updateQueueList();
  currentStudent = null;
  isConfirmed = false;
  updateCurrentInfo();
});

document.getElementById('callNextBtn').addEventListener('click', () => {
  const service = document.getElementById('serviceSelectStaff').value;
  if (!service) {
    Swal.fire('خطأ', 'يرجى اختيار الخدمة أولاً', 'error');
    return;
  }

  queues = JSON.parse(localStorage.getItem('queues'));
  if (queues[service] && queues[service].length > 0) {
    currentStudent = queues[service].shift();
    localStorage.setItem('queues', JSON.stringify(queues));
    updateQueueList();
    updateCurrentInfo();

    let logs = JSON.parse(localStorage.getItem('logs'));
    logs.push(`تم استدعاء الطالب ${currentStudent.name} برقم ${currentStudent.id} - ${currentStudent.service}`);
    localStorage.setItem('logs', JSON.stringify(logs));

    localStorage.setItem('calledId', currentStudent.id);
    localStorage.setItem('calledService', currentStudent.service);

    Swal.fire('تم الاستدعاء', `الطالب: ${currentStudent.name}`, 'success');
    isConfirmed = false;
    updateCurrentInfo();
  } else {
    Swal.fire('لا يوجد', 'لا يوجد طلاب في قائمة الانتظار لهذه الخدمة', 'info');
  }
});

document.getElementById('confirmBtn').addEventListener('click', () => {
  if (!currentStudent) return;
  isConfirmed = true;
  let logs = JSON.parse(localStorage.getItem('logs'));
  logs.push(`تم تأكيد حضور الطالب ${currentStudent.name} برقم ${currentStudent.id}`);
  localStorage.setItem('logs', JSON.stringify(logs));
  Swal.fire('تأكيد الحضور', 'تم تأكيد حضور الطالب', 'success');
  updateCurrentInfo();
});

document.getElementById('absentBtn').addEventListener('click', () => {
  if (!currentStudent) return;
  let logs = JSON.parse(localStorage.getItem('logs'));
  logs.push(`تم تسجيل غياب الطالب ${currentStudent.name} برقم ${currentStudent.id}`);
  localStorage.setItem('logs', JSON.stringify(logs));
  Swal.fire('تسجيل غياب', 'تم تسجيل غياب الطالب', 'warning');
  currentStudent = null;
  isConfirmed = false;
  updateCurrentInfo();
});


document.getElementById('endBtn').addEventListener('click', () => {
  if (!currentStudent || !isConfirmed) return;
  let logs = JSON.parse(localStorage.getItem('logs'));
  logs.push(`تم إنهاء الخدمة للطالب ${currentStudent.name} برقم ${currentStudent.id}`);
  localStorage.setItem('logs', JSON.stringify(logs));

  // إضافة الطالب لقائمة المنتهين من الخدمة
  let servedStudents = JSON.parse(localStorage.getItem('servedStudents')) || [];
  servedStudents.push(currentStudent);
  localStorage.setItem('servedStudents', JSON.stringify(servedStudents));

  Swal.fire('إنهاء الخدمة', 'تم إنهاء الخدمة للطالب', 'success');
  currentStudent = null;
  isConfirmed = false;
  updateCurrentInfo();
});


// التحديث الأولي عند تحميل الصفحة
updateQueueList();
updateCurrentInfo();
