'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
}

interface Visit {
  _id: string;
  date: string;
  status: string;
  doctor: Doctor;
  totalAmount: number;
}

export default function PatientDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }

    const userObj = JSON.parse(userData);
    if (userObj.role !== 'patient') {
      router.push('/');
      return;
    }

    setUser(userObj);
    fetchDoctors();
    fetchVisits(userObj._id);
  }, [router]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/users?userType=doctor');
      const data = await response.json();
      if (response.ok) {
        setDoctors(data.users);
      } else {
        console.error('Failed to fetch doctors:', data.error);
        toast.error('Failed to load doctors');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    }
  };

  const fetchVisits = async (patientId: string) => {
    try {
      const response = await fetch(`/api/visits?patientId=${patientId}`);
      const data = await response.json();
      if (response.ok) {
        setVisits(data.visits);
      } else {
        console.error('Failed to fetch visits:', data.error);
        toast.error('Failed to load appointments');
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
      toast.error('Failed to load appointments');
    }
  };

  const handleBookVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate) {
      toast.error('Please select the doctor and date');
      return;
    }

    if (!user?._id) {
      toast.error('User not found');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: user._id,
          doctorId: selectedDoctor,
          date: selectedDate
        })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Appointment booked successfully');
        setSelectedDoctor('');
        setSelectedDate('');
        fetchVisits(user._id);
      } else {
        toast.error(data.error || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('An error occurred while booking the appointment');
    } finally {
      setLoading(false);
    }
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
              <h1 className="text-xl font-semibold text-gray-900">Patient Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Book new appointment */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Book New Appointment</h2>
              <form onSubmit={handleBookVisit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Doctor
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Date
                  </label>
                  <input
                    type="datetime-local"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </button>
              </form>
            </div>

            {/* My appointments */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">My Appointments</h2>
              <div className="space-y-4">
                {visits.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No appointments booked</p>
                ) : (
                  visits.map((visit) => (
                    <div key={visit._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Dr. {visit.doctor.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {visit.doctor.specialization}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(visit.date).toLocaleString('en-US')}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          visit.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          visit.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          visit.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {visit.status === 'scheduled' ? 'Scheduled' :
                           visit.status === 'in-progress' ? 'In Progress' :
                           visit.status === 'completed' ? 'Completed' : 'Cancelled'}
                        </span>
                      </div>
                      {visit.totalAmount > 0 && (
                        <p className="text-sm text-gray-600 mt-2">
                          Total Amount: {visit.totalAmount} SAR
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 