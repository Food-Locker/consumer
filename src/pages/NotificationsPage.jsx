const NotificationsPage = () => {
  const notifications = [
    { id: 1, title: 'Vox Travel', message: 'lorem ipsum dolor sit amet lorem ipsum dol... lorem ipsum dolor sit sit amet', time: '5m', date: 'Today' },
    { id: 2, title: 'Vox Travel', message: 'lorem ipsum dolor sit amet lorem ipsum dol... lorem ipsum dolor sit sit amet', time: '10m', date: 'Today' },
    { id: 3, title: 'Vox Travel', message: 'lorem ipsum dolor sit amet lorem ipsum dol... lorem ipsum dolor sit sit amet', time: '1h', date: 'Thursday' },
  ];

  const groupedNotifications = notifications.reduce((acc, notif) => {
    if (!acc[notif.date]) {
      acc[notif.date] = [];
    }
    acc[notif.date].push(notif);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-4 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">알림</h1>
      </div>

      <div className="px-4 py-6">
        {Object.entries(groupedNotifications).map(([date, notifs]) => (
          <div key={date} className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-3">{date}</h2>
            <div className="space-y-3">
              {notifs.map((notif) => (
                <div key={notif.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    <span className="text-xs text-gray-500">{notif.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{notif.message}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-24 left-0 right-0 px-4 mobile-container">
        <div className="bg-primary/10 border border-primary rounded-lg p-3 text-center">
          <p className="text-sm text-primary">음식을 락커에 넣으면 알림.</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

