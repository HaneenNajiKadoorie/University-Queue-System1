 // تهيئة قائمة الانتظار إذا لم تكن موجودة
    if (!localStorage.getItem('queues')) {
      var initialQueues = {
        "الخدمة الأكاديمية": [],
        "الخدمة المالية": [],
        "الدعم التقني": []
      };
      localStorage.setItem('queues', JSON.stringify(initialQueues));
    }

    document.getElementById('serviceForm').addEventListener('submit', function(e) {
      e.preventDefault();
      var name = document.getElementById('studentName').value.trim();
      var service = document.getElementById('serviceSelect').value;
      if (!name || !service) {
        alert('يرجى ملء جميع الحقول');
        return;
      }
      // إضافة الطالب إلى قائمة الانتظار وتوليد التذكرة
      var queues = JSON.parse(localStorage.getItem('queues'));
      var serviceQueue = queues[service];
      var ticketNum = serviceQueue.length + 1;
      var codeMap = { "الخدمة الأكاديمية": "أك", "الخدمة المالية": "مال", "الدعم التقني": "تقن" };
      var ticketId = codeMap[service] + ticketNum;
      var ticket = { name: name, id: ticketId, service: service };
      serviceQueue.push(ticket);
      queues[service] = serviceQueue;
      localStorage.setItem('queues', JSON.stringify(queues));
      // عرض التذكرة
      document.getElementById('displayName').innerText = name;
      document.getElementById('displayService').innerText = service;
      document.getElementById('displayTicket').innerText = ticketId;
      document.getElementById('ticketInfo').style.display = 'block';
      localStorage.setItem('myTicketId', ticketId);
    });

    document.getElementById('checkCallBtn').addEventListener('click', function() {
      var myId = localStorage.getItem('myTicketId');
      var calledId = localStorage.getItem('calledId');
      var calledService = localStorage.getItem('calledService');
      if (calledId && myId === calledId) {
        Swal.fire('تم استدعاؤك', 'الرجاء التوجه إلى مكتب الخدمة', 'success');
        localStorage.removeItem('calledId');
        localStorage.removeItem('calledService');
      } else {
        Swal.fire('ليس دورك بعد', 'لم يتم استدعاؤك بعد', 'info');
      }
    });