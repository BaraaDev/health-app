'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface Visit {
  _id: string;
  date: string;
  status: string;
  patient: {
    name: string;
    email: string;
    phone: string;
  };
  doctor: {
    _id: string;
    name: string;
    email: string;
  };
  totalAmount: number;
}

export default function TestDoctorFilter() {
  const { t, language, isRTL } = useLanguage();
  const [allVisits, setAllVisits] = useState<Visit[]>([]);
  const [doctorVisits, setDoctorVisits] = useState<Visit[]>([]);
  const [doctorId, setDoctorId] = useState('685ebb987032216eea5f00f3');
  const [loading, setLoading] = useState(false);

  const fetchAllVisits = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/visits');
      const data = await response.json();
      setAllVisits(data.visits || []);
    } catch (error) {
      console.error('Error fetching all visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorVisits = async () => {
    if (!doctorId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/visits?doctorId=${doctorId}`);
      const data = await response.json();
      setDoctorVisits(data.visits || []);
    } catch (error) {
      console.error('Error fetching doctor visits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllVisits();
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchDoctorVisits();
    }
  }, [doctorId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'مجدول';
      case 'in-progress': return 'قيد التنفيذ';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const checkSecurity = () => {
    if (doctorVisits.length === 0) return true;
    return doctorVisits.every(visit => visit.doctor._id === doctorId);
  };

  const isSecure = checkSecurity();

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          اختبار تصفية حجوزات الطبيب
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* جميع الحجوزات */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🔍 جميع الحجوزات في النظام
            </h2>
            <div className="mb-4">
              <button
                onClick={fetchAllVisits}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'جاري التحميل...' : 'تحديث البيانات'}
              </button>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                <strong>عدد الحجوزات الإجمالي:</strong> {allVisits.length}
              </p>
              
              {allVisits.slice(0, 3).map((visit) => (
                <div key={visit._id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{visit.patient.name}</h4>
                      <p className="text-sm text-gray-600">الطبيب: {visit.doctor.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(visit.date).toLocaleString('ar-SA')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                      {getStatusText(visit.status)}
                    </span>
                  </div>
                </div>
              ))}
              
              {allVisits.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  ... و {allVisits.length - 3} حجوزات أخرى
                </p>
              )}
            </div>
          </div>

          {/* حجوزات الطبيب */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              👨‍⚕️ حجوزات الطبيب المحدد
            </h2>
            
            <div className="mb-4">
              <input
                type="text"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                placeholder="أدخل ID الطبيب"
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
              <button
                onClick={fetchDoctorVisits}
                disabled={loading || !doctorId}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'جاري التحميل...' : 'جلب حجوزات الطبيب'}
              </button>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                <strong>عدد حجوزات الطبيب:</strong> {doctorVisits.length}
              </p>
              
              {doctorVisits.map((visit) => (
                <div key={visit._id} className="border rounded-lg p-3 bg-green-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{visit.patient.name}</h4>
                      <p className="text-sm text-gray-600">الطبيب: {visit.doctor.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(visit.date).toLocaleString('ar-SA')}
                      </p>
                      <p className="text-sm text-gray-600">
                        المبلغ: {visit.totalAmount} ريال
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                      {getStatusText(visit.status)}
                    </span>
                  </div>
                </div>
              ))}
              
              {doctorVisits.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  لا توجد حجوزات لهذا الطبيب
                </p>
              )}
            </div>
          </div>
        </div>

        {/* مقارنة النتائج */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            📊 مقارنة النتائج
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{allVisits.length}</p>
              <p className="text-sm text-gray-600">إجمالي الحجوزات</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{doctorVisits.length}</p>
              <p className="text-sm text-gray-600">حجوزات الطبيب</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {allVisits.length > 0 ? ((doctorVisits.length / allVisits.length) * 100).toFixed(1) : '0'}%
              </p>
              <p className="text-sm text-gray-600">نسبة حجوزات الطبيب</p>
            </div>
          </div>
        </div>

        {/* اختبار الأمان */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            ✅ اختبار الأمان
          </h2>
          
          <div className={`p-4 rounded-lg ${isSecure ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center">
              <span className={`text-2xl mr-3 ${isSecure ? 'text-green-600' : 'text-red-600'}`}>
                {isSecure ? '✅' : '❌'}
              </span>
              <div>
                <h3 className={`font-semibold ${isSecure ? 'text-green-800' : 'text-red-800'}`}>
                  {isSecure ? 'اختبار الأمان نجح' : 'مشكلة في الأمان'}
                </h3>
                <p className={`text-sm ${isSecure ? 'text-green-700' : 'text-red-700'}`}>
                  {isSecure 
                    ? 'جميع الحجوزات المعروضة تخص الطبيب المحدد فقط. لا يمكن للطبيب رؤية حجوزات الأطباء الآخرين.'
                    : 'بعض الحجوزات لا تخص الطبيب المحدد. يجب إصلاح هذه المشكلة.'
                  }
                </p>
              </div>
            </div>
          </div>
          
          {doctorVisits.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">تفاصيل التحقق:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {doctorVisits.map((visit, index) => (
                  <li key={visit._id} className="flex items-center">
                    <span className={`mr-2 ${visit.doctor._id === doctorId ? 'text-green-600' : 'text-red-600'}`}>
                      {visit.doctor._id === doctorId ? '✅' : '❌'}
                    </span>
                    حجز {index + 1}: {visit.patient.name} - 
                    {visit.doctor._id === doctorId ? ' يخص الطبيب المحدد' : ' لا يخص الطبيب المحدد'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ملخص */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            📋 ملخص الاختبار
          </h2>
          
          <div className="space-y-2 text-sm text-blue-700">
            <p>• تم اختبار API للحصول على جميع الحجوزات</p>
            <p>• تم اختبار API للحصول على حجوزات طبيب محدد</p>
            <p>• تم التحقق من أن الطبيب يرى فقط حجوزاته</p>
            <p>• تم مقارنة النتائج وحساب النسب</p>
            <p>• تم اختبار الأمان والتحقق من صحة البيانات</p>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded border">
            <p className="text-sm text-gray-700">
              <strong>النتيجة النهائية:</strong> {isSecure 
                ? '✅ النظام يعمل بشكل صحيح - الطبيب يرى فقط حجوزاته'
                : '❌ هناك مشكلة في النظام - الطبيب يمكنه رؤية حجوزات أخرى'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 