'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/LanguageContext';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface Visit {
  _id: string;
  date: string;
  time?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  patient: Patient;
  doctor: {
    name: string;
  };
  totalAmount: number;
  treatments: Treatment[];
}

interface Treatment {
  _id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export default function DoctorDashboard() {
  const router = useRouter();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [selectedVisit, setSelectedVisit] = useState<string>('');
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [showTreatmentForm, setShowTreatmentForm] = useState(false);
  const [treatmentForm, setTreatmentForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '1'
  });
  const [visitForm, setVisitForm] = useState({
    symptoms: '',
    diagnosis: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }

    const userObj = JSON.parse(userData);
    if (userObj.role !== 'doctor') {
      router.push('/');
      return;
    }

    setUser(userObj);
    fetchVisits(userObj._id);
  }, [router]);

  useEffect(() => {
    if (selectedVisit) {
      fetchTreatments(selectedVisit);
    }
  }, [selectedVisit]);

  const fetchVisits = async (doctorId: string) => {
    try {
      const response = await fetch(`/api/visits?doctorId=${doctorId}`);
      if (response.ok) {
        const data = await response.json();
        setVisits(data.visits);
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('serverError'));
        toast.error(errorData.error || 'Failed to load visits');
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
      setError(t('networkError'));
      toast.error('Failed to load visits');
    } finally {
      setLoading(false);
    }
  };

  const fetchTreatments = async (visitId: string) => {
    try {
      const response = await fetch(`/api/treatments?visitId=${visitId}`);
      if (response.ok) {
        const data = await response.json();
        setTreatments(data.treatments);
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('serverError'));
        toast.error(errorData.error || 'Failed to load treatments');
      }
    } catch (error) {
      console.error('Error fetching treatments:', error);
      setError(t('networkError'));
      toast.error('Failed to load treatments');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTreatmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVisit) {
      setError(t('pleaseSelectVisit'));
      toast.error('Please select a visit first');
      return;
    }

    // Validate inputs
    if (!treatmentForm.name.trim()) {
      setError(t('nameRequired'));
      toast.error('Treatment name is required');
      return;
    }

    const price = parseFloat(treatmentForm.price);
    if (isNaN(price) || price < 0) {
      setError(t('priceMustBePositive'));
      toast.error('Price must be a positive number');
      return;
    }

    const quantity = parseInt(treatmentForm.quantity);
    if (isNaN(quantity) || quantity < 1) {
      setError(t('quantityMustBePositive'));
      toast.error('Quantity must be at least 1');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/treatments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitId: selectedVisit,
          name: treatmentForm.name.trim(),
          description: treatmentForm.description.trim(),
          price: price,
          quantity: quantity
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(t('treatmentAdded'));
        toast.success('Treatment added successfully');
        setTreatmentForm({
          name: '',
          description: '',
          price: '',
          quantity: '1'
        });
        setShowTreatmentForm(false);
        fetchTreatments(selectedVisit);
        fetchVisits(user!._id); // Update total amount
      } else {
        setError(data.error || t('operationFailed'));
        toast.error(data.error || 'Failed to add treatment');
      }
    } catch (error) {
      console.error('Error adding treatment:', error);
      setError(t('connectionError'));
      toast.error('Failed to add treatment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTreatment = async (treatmentId: string) => {
    if (!confirm(t('confirmDelete'))) {
      return;
    }

    try {
      const response = await fetch(`/api/treatments/${treatmentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Treatment deleted successfully');
        fetchTreatments(selectedVisit);
        fetchVisits(user!._id); // Update total amount
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete treatment');
      }
    } catch (error) {
      console.error('Error deleting treatment:', error);
      toast.error('Failed to delete treatment');
    }
  };

  const handleUpdateVisitStatus = async (visitId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/visits/${visitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Visit status updated successfully');
        fetchVisits(user!._id);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update visit status');
      }
    } catch (error) {
      console.error('Error updating visit status:', error);
      toast.error('Failed to update visit status');
    }
  };

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
      case 'scheduled': return 'Scheduled';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
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
              <h1 className="text-xl font-semibold text-gray-900">Doctor Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, Dr. {user.name}</span>
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
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visits List */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">My Patient Visits</h2>
              {loading ? (
                <p className="text-gray-500 text-center py-4">Loading visits...</p>
              ) : visits.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No visits found</p>
              ) : (
                <div className="space-y-4">
                  {visits.map((visit) => (
                    <div 
                      key={visit._id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedVisit === visit._id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedVisit(visit._id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {visit.patient.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {visit.patient.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            {visit.patient.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(visit.date).toLocaleString('en-US')}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                            {getStatusText(visit.status)}
                          </span>
                          <div className="flex space-x-2">
                            {visit.status === 'scheduled' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateVisitStatus(visit._id, 'in-progress');
                                }}
                                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                              >
                                Start
                              </button>
                            )}
                            {visit.status === 'in-progress' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateVisitStatus(visit._id, 'completed');
                                }}
                                className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      {visit.totalAmount > 0 && (
                        <p className="text-sm text-gray-600 mt-2">
                          Total Amount: {visit.totalAmount} SAR
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Treatment Management */}
            <div className="card">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Treatment Management</h2>
              
              {selectedVisit ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">Treatments</h3>
                    <button
                      onClick={() => setShowTreatmentForm(!showTreatmentForm)}
                      className="btn-primary text-sm"
                    >
                      {showTreatmentForm ? 'Cancel' : 'Add Treatment'}
                    </button>
                  </div>

                  {showTreatmentForm && (
                    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Treatment Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={treatmentForm.name}
                          onChange={handleInputChange}
                          className="form-input"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={treatmentForm.description}
                          onChange={handleInputChange}
                          className="form-input"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (SAR) *
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={treatmentForm.price}
                            onChange={handleInputChange}
                            className="form-input"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity *
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            value={treatmentForm.quantity}
                            onChange={handleInputChange}
                            className="form-input"
                            min="1"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full disabled:opacity-50"
                      >
                        {submitting ? 'Adding...' : 'Add Treatment'}
                      </button>
                    </form>
                  )}

                  <div className="space-y-2">
                    {treatments.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No treatments added</p>
                    ) : (
                      treatments.map((treatment) => (
                        <div key={treatment._id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{treatment.name}</h4>
                              {treatment.description && (
                                <p className="text-sm text-gray-600">{treatment.description}</p>
                              )}
                              <p className="text-sm text-gray-600">
                                {treatment.quantity} x {treatment.price} SAR = {treatment.totalPrice} SAR
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteTreatment(treatment._id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Select a visit to manage treatments</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 