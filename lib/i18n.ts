export type Language = 'ar' | 'en';

export interface Translations {
  // Common
  loading: string;
  error: string;
  success: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  search: string;
  confirm: string;
  back: string;
  next: string;
  previous: string;
  close: string;
  submit: string;
  required: string;
  invalid: string;
  notFound: string;
  serverError: string;
  networkError: string;

  // Auth
  login: string;
  register: string;
  logout: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: string;
  patient: string;
  doctor: string;
  finance: string;
  loginSuccess: string;
  registerSuccess: string;
  invalidCredentials: string;
  userExists: string;
  weakPassword: string;

  // Dashboard
  dashboard: string;
  doctorDashboard: string;
  patientDashboard: string;
  financeDashboard: string;
  welcome: string;
  totalVisits: string;
  totalPatients: string;
  totalRevenue: string;
  recentVisits: string;
  upcomingVisits: string;

  // Visits
  visits: string;
  visit: string;
  visitDate: string;
  visitTime: string;
  visitStatus: string;
  visitNotes: string;
  bookVisit: string;
  updateVisit: string;
  cancelVisit: string;
  confirmVisit: string;
  completeVisit: string;
  pending: string;
  confirmed: string;
  completed: string;
  cancelled: string;
  totalAmount: string;
  currency: string;

  // Treatments
  treatments: string;
  treatment: string;
  treatmentName: string;
  treatmentDescription: string;
  treatmentPrice: string;
  treatmentQuantity: string;
  treatmentTotal: string;
  addTreatment: string;
  updateTreatment: string;
  deleteTreatment: string;
  treatmentAdded: string;
  treatmentUpdated: string;
  treatmentDeleted: string;
  treatmentNotFound: string;

  // Patients
  patients: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientHistory: string;
  addPatient: string;
  updatePatient: string;
  deletePatient: string;

  // Doctors
  doctors: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorPhone: string;
  doctorEmail: string;
  addDoctor: string;
  updateDoctor: string;
  deleteDoctor: string;

  // Validation
  fieldRequired: string;
  invalidEmail: string;
  invalidPhone: string;
  invalidPrice: string;
  invalidQuantity: string;
  priceMustBePositive: string;
  quantityMustBePositive: string;
  nameRequired: string;
  priceRequired: string;
  quantityRequired: string;
  visitRequired: string;

  // Messages
  confirmDelete: string;
  confirmCancel: string;
  operationSuccess: string;
  operationFailed: string;
  dataSaved: string;
  dataNotSaved: string;
  connectionError: string;
  pleaseSelectVisit: string;
}

const translations: Record<Language, Translations> = {
  ar: {
    // Common
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    search: 'بحث',
    confirm: 'تأكيد',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    close: 'إغلاق',
    submit: 'إرسال',
    required: 'مطلوب',
    invalid: 'غير صحيح',
    notFound: 'غير موجود',
    serverError: 'خطأ في الخادم',
    networkError: 'خطأ في الاتصال',

    // Auth
    login: 'تسجيل الدخول',
    register: 'تسجيل',
    logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    name: 'الاسم',
    phone: 'رقم الهاتف',
    role: 'الدور',
    patient: 'مريض',
    doctor: 'طبيب',
    finance: 'مالي',
    loginSuccess: 'تم تسجيل الدخول بنجاح',
    registerSuccess: 'تم التسجيل بنجاح',
    invalidCredentials: 'بيانات غير صحيحة',
    userExists: 'المستخدم موجود بالفعل',
    weakPassword: 'كلمة المرور ضعيفة',

    // Dashboard
    dashboard: 'لوحة التحكم',
    doctorDashboard: 'لوحة تحكم الطبيب',
    patientDashboard: 'لوحة تحكم المريض',
    financeDashboard: 'لوحة تحكم المالي',
    welcome: 'مرحباً',
    totalVisits: 'إجمالي الزيارات',
    totalPatients: 'إجمالي المرضى',
    totalRevenue: 'إجمالي الإيرادات',
    recentVisits: 'الزيارات الحديثة',
    upcomingVisits: 'الزيارات القادمة',

    // Visits
    visits: 'الزيارات',
    visit: 'زيارة',
    visitDate: 'تاريخ الزيارة',
    visitTime: 'وقت الزيارة',
    visitStatus: 'حالة الزيارة',
    visitNotes: 'ملاحظات الزيارة',
    bookVisit: 'حجز زيارة',
    updateVisit: 'تحديث الزيارة',
    cancelVisit: 'إلغاء الزيارة',
    confirmVisit: 'تأكيد الزيارة',
    completeVisit: 'إكمال الزيارة',
    pending: 'في الانتظار',
    confirmed: 'مؤكدة',
    completed: 'مكتملة',
    cancelled: 'ملغية',
    totalAmount: 'المبلغ الإجمالي',
    currency: 'ريال',

    // Treatments
    treatments: 'العلاجات',
    treatment: 'علاج',
    treatmentName: 'اسم العلاج',
    treatmentDescription: 'وصف العلاج',
    treatmentPrice: 'سعر العلاج',
    treatmentQuantity: 'كمية العلاج',
    treatmentTotal: 'إجمالي العلاج',
    addTreatment: 'إضافة علاج',
    updateTreatment: 'تحديث العلاج',
    deleteTreatment: 'حذف العلاج',
    treatmentAdded: 'تم إضافة العلاج بنجاح',
    treatmentUpdated: 'تم تحديث العلاج بنجاح',
    treatmentDeleted: 'تم حذف العلاج بنجاح',
    treatmentNotFound: 'العلاج غير موجود',

    // Patients
    patients: 'المرضى',
    patientName: 'اسم المريض',
    patientPhone: 'هاتف المريض',
    patientEmail: 'بريد المريض',
    patientHistory: 'تاريخ المريض',
    addPatient: 'إضافة مريض',
    updatePatient: 'تحديث المريض',
    deletePatient: 'حذف المريض',

    // Doctors
    doctors: 'الأطباء',
    doctorName: 'اسم الطبيب',
    doctorSpecialty: 'تخصص الطبيب',
    doctorPhone: 'هاتف الطبيب',
    doctorEmail: 'بريد الطبيب',
    addDoctor: 'إضافة طبيب',
    updateDoctor: 'تحديث الطبيب',
    deleteDoctor: 'حذف الطبيب',

    // Validation
    fieldRequired: 'هذا الحقل مطلوب',
    invalidEmail: 'بريد إلكتروني غير صحيح',
    invalidPhone: 'رقم هاتف غير صحيح',
    invalidPrice: 'سعر غير صحيح',
    invalidQuantity: 'كمية غير صحيحة',
    priceMustBePositive: 'السعر يجب أن يكون موجب',
    quantityMustBePositive: 'الكمية يجب أن تكون موجب',
    nameRequired: 'اسم العلاج مطلوب',
    priceRequired: 'السعر مطلوب',
    quantityRequired: 'الكمية مطلوبة',
    visitRequired: 'يرجى اختيار زيارة أولاً',

    // Messages
    confirmDelete: 'هل أنت متأكد من الحذف؟',
    confirmCancel: 'هل أنت متأكد من الإلغاء؟',
    operationSuccess: 'تمت العملية بنجاح',
    operationFailed: 'فشلت العملية',
    dataSaved: 'تم حفظ البيانات',
    dataNotSaved: 'لم يتم حفظ البيانات',
    connectionError: 'خطأ في الاتصال',
    pleaseSelectVisit: 'يرجى اختيار زيارة أولاً'
  },
  en: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    submit: 'Submit',
    required: 'Required',
    invalid: 'Invalid',
    notFound: 'Not Found',
    serverError: 'Server Error',
    networkError: 'Network Error',

    // Auth
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    phone: 'Phone',
    role: 'Role',
    patient: 'Patient',
    doctor: 'Doctor',
    finance: 'Finance',
    loginSuccess: 'Login successful',
    registerSuccess: 'Registration successful',
    invalidCredentials: 'Invalid credentials',
    userExists: 'User already exists',
    weakPassword: 'Password is too weak',

    // Dashboard
    dashboard: 'Dashboard',
    doctorDashboard: 'Doctor Dashboard',
    patientDashboard: 'Patient Dashboard',
    financeDashboard: 'Finance Dashboard',
    welcome: 'Welcome',
    totalVisits: 'Total Visits',
    totalPatients: 'Total Patients',
    totalRevenue: 'Total Revenue',
    recentVisits: 'Recent Visits',
    upcomingVisits: 'Upcoming Visits',

    // Visits
    visits: 'Visits',
    visit: 'Visit',
    visitDate: 'Visit Date',
    visitTime: 'Visit Time',
    visitStatus: 'Visit Status',
    visitNotes: 'Visit Notes',
    bookVisit: 'Book Visit',
    updateVisit: 'Update Visit',
    cancelVisit: 'Cancel Visit',
    confirmVisit: 'Confirm Visit',
    completeVisit: 'Complete Visit',
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    totalAmount: 'Total Amount',
    currency: 'SAR',

    // Treatments
    treatments: 'Treatments',
    treatment: 'Treatment',
    treatmentName: 'Treatment Name',
    treatmentDescription: 'Treatment Description',
    treatmentPrice: 'Treatment Price',
    treatmentQuantity: 'Treatment Quantity',
    treatmentTotal: 'Treatment Total',
    addTreatment: 'Add Treatment',
    updateTreatment: 'Update Treatment',
    deleteTreatment: 'Delete Treatment',
    treatmentAdded: 'Treatment added successfully',
    treatmentUpdated: 'Treatment updated successfully',
    treatmentDeleted: 'Treatment deleted successfully',
    treatmentNotFound: 'Treatment not found',

    // Patients
    patients: 'Patients',
    patientName: 'Patient Name',
    patientPhone: 'Patient Phone',
    patientEmail: 'Patient Email',
    patientHistory: 'Patient History',
    addPatient: 'Add Patient',
    updatePatient: 'Update Patient',
    deletePatient: 'Delete Patient',

    // Doctors
    doctors: 'Doctors',
    doctorName: 'Doctor Name',
    doctorSpecialty: 'Doctor Specialty',
    doctorPhone: 'Doctor Phone',
    doctorEmail: 'Doctor Email',
    addDoctor: 'Add Doctor',
    updateDoctor: 'Update Doctor',
    deleteDoctor: 'Delete Doctor',

    // Validation
    fieldRequired: 'This field is required',
    invalidEmail: 'Invalid email address',
    invalidPhone: 'Invalid phone number',
    invalidPrice: 'Invalid price',
    invalidQuantity: 'Invalid quantity',
    priceMustBePositive: 'Price must be positive',
    quantityMustBePositive: 'Quantity must be positive',
    nameRequired: 'Treatment name is required',
    priceRequired: 'Price is required',
    quantityRequired: 'Quantity is required',
    visitRequired: 'Please select a visit first',

    // Messages
    confirmDelete: 'Are you sure you want to delete?',
    confirmCancel: 'Are you sure you want to cancel?',
    operationSuccess: 'Operation completed successfully',
    operationFailed: 'Operation failed',
    dataSaved: 'Data saved successfully',
    dataNotSaved: 'Data not saved',
    connectionError: 'Connection error',
    pleaseSelectVisit: 'Please select a visit first'
  }
};

export function getTranslation(lang: Language, key: keyof Translations): string {
  return translations[lang][key] || key;
}

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

export function detectLanguage(): Language {
  if (typeof window !== 'undefined') {
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'ar' ? 'ar' : 'en';
  }
  return 'en';
} 