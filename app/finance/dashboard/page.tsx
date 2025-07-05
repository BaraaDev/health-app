'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function FinanceDashboard() {
  const [user, setUser] = useState(null);
  const [visits, setVisits] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    doctorName: '',
    patientName: '',
    visitId: '',
    status: ''
  });
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }

    const userObj = JSON.parse(userData);
    if (userObj.userType !== 'finance') {
      router.push('/');
      return;
    }

    setUser(userObj);
    fetchVisits();
  }, [router]);

  const fetchVisits = async () => {
    try {
      const params = new URLSearchParams();
      if (searchFilters.doctorName) params.append('doctorName', searchFilters.doctorName);
      if (searchFilters.patientName) params.append('patientName', searchFilters.patientName);
      if (searchFilters.visitId) params.append('visitId', searchFilters.visitId);
      if (searchFilters.status) params.append('status', searchFilters.status);

      const response = await fetch(`/api/visits?${params.toString()}`);
      const data = await response.json();
      if (response.ok) {
        setVisits(data.visits);
      }
    } catch (error) {
      console.error('خطأ في جلب الزيارات:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVisits();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">لوحة تحكم المالي</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">مرحباً، {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">البحث في الزيارات</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم الطبيب
                  </label>
                  <input
                    type="text"
                    value={searchFilters.doctorName}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, doctorName: e.target.value }))}
                    className="input-field"
                    placeholder="ابحث باسم الطبيب"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم المريض
                  </label>
                  <input
                    type="text"
                    value={searchFilters.patientName}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, patientName: e.target.value }))}
                    className="input-field"
                    placeholder="ابحث باسم المريض"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    معرف الزيارة
                  </label>
                  <input
                    type="text"
                    value={searchFilters.visitId}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, visitId: e.target.value }))}
                    className="input-field"
                    placeholder="ابحث برقم الزيارة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    حالة الزيارة
                  </label>
                  <select
                    value={searchFilters.status}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">جميع الحالات</option>
                    <option value="scheduled">محجوز</option>
                    <option value="in-progress">قيد التنفيذ</option>
                    <option value="completed">مكتمل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">
                بحث
              </button>
            </form>
          </div>

          <div className="card mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">قائمة الزيارات</h2>
            <div className="space-y-4">
              {visits.length === 0 ? (
                <p className="text-gray-500 text-center py-4">لا توجد زيارات</p>
              ) : (
                visits.map((visit) => (
                  <div key={visit._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {visit.patient.name} - د. {visit.doctor.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(visit.date).toLocaleString('ar-SA')}
                        </p>
                        <p className="text-sm text-gray-600">
                          المبلغ: {visit.totalAmount} ريال
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        visit.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        visit.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        visit.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {visit.status === 'scheduled' ? 'محجوز' :
                         visit.status === 'in-progress' ? 'قيد التنفيذ' :
                         visit.status === 'completed' ? 'مكتمل' : 'ملغي'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
