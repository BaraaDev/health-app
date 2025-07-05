# تطبيق إدارة الرعاية الصحية

تطبيق شامل لإدارة الرعاية الصحية مبني باستخدام Next.js و Node.js و MongoDB مع دعم اللغتين العربية والإنجليزية.

## الميزات الرئيسية

### 🔐 نظام المصادقة
- تسجيل الدخول والتسجيل للمستخدمين
- ثلاثة أنواع من المستخدمين: المرضى، الأطباء، والمالية
- إدارة الجلسات باستخدام JWT

### 👥 إدارة المستخدمين
- **المرضى**: حجز المواعيد وعرض التاريخ الطبي
- **الأطباء**: إدارة المواعيد والعلاجات
- **الموظفين الماليين**: إدارة الفواتير والمدفوعات

### 📅 نظام المواعيد
- حجز المواعيد مع الأطباء
- إدارة حالة المواعيد (مجدول، قيد التنفيذ، مكتمل، ملغي)
- عرض تفاصيل المواعيد والتكاليف

### 💊 إدارة العلاجات
- إضافة العلاجات للمواعيد
- حساب التكاليف الإجمالية
- إدارة الكميات والأسعار

### 🌐 دعم اللغات
- العربية والإنجليزية
- تبديل تلقائي للاتجاه (RTL/LTR)
- ترجمة شاملة للواجهة

## التقنيات المستخدمة

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **UI Components**: React Hot Toast, Custom Components
- **Styling**: Tailwind CSS with RTL Support

## التثبيت والتشغيل

### المتطلبات الأساسية
- Node.js 18+ 
- MongoDB
- npm أو yarn

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone <repository-url>
cd health-app
```

2. **تثبيت التبعيات**
```bash
npm install
```

3. **إعداد متغيرات البيئة**
```bash
cp env.example .env.local
```

تعديل ملف `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/health-app
JWT_SECRET=your-secret-key-here
```

4. **تشغيل التطبيق**
```bash
npm run dev
```

التطبيق سيعمل على `http://localhost:3000`

## كيفية الاستخدام

### 1. التسجيل والدخول
- انتقل إلى الصفحة الرئيسية
- اختر "Register" للتسجيل أو "Login" للدخول
- اختر نوع المستخدم (مريض، طبيب، أو مالي)

### 2. لوحة تحكم المريض
- **حجز موعد جديد**: اختر الطبيب والتاريخ
- **عرض المواعيد**: راجع جميع المواعيد وحالتها
- **التكاليف**: عرض إجمالي التكاليف لكل موعد

### 3. لوحة تحكم الطبيب
- **عرض المواعيد**: راجع جميع مواعيد المرضى
- **إدارة الحالة**: تحديث حالة المواعيد (بدء، إكمال)
- **إضافة العلاجات**: إضافة العلاجات وحساب التكاليف
- **حذف العلاجات**: إزالة العلاجات غير المطلوبة

### 4. تبديل اللغة
- استخدم زر تبديل اللغة في أعلى الصفحة
- التطبيق يدعم العربية والإنجليزية
- الاتجاه يتغير تلقائياً حسب اللغة

## هيكل المشروع

```
health-app/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Authentication APIs
│   │   ├── users/         # User management
│   │   ├── visits/        # Appointment management
│   │   └── treatments/    # Treatment management
│   ├── doctor/            # Doctor dashboard
│   ├── patient/           # Patient dashboard
│   └── finance/           # Finance dashboard
├── components/            # Reusable components
├── lib/                   # Utilities and models
│   ├── models/           # Mongoose models
│   ├── db.ts             # Database connection
│   ├── i18n.ts           # Internationalization
│   └── LanguageContext.tsx # Language context
└── docs/                 # Documentation
```

## API Endpoints

### المصادقة
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول

### المستخدمين
- `GET /api/users?userType=doctor` - جلب الأطباء

### المواعيد
- `GET /api/visits` - جلب جميع المواعيد
- `GET /api/visits?patientId=id` - جلب مواعيد مريض
- `POST /api/visits` - إنشاء موعد جديد
- `PATCH /api/visits/[id]` - تحديث حالة الموعد

### العلاجات
- `GET /api/treatments?visitId=id` - جلب علاجات موعد
- `POST /api/treatments` - إضافة علاج جديد
- `DELETE /api/treatments/[id]` - حذف علاج

## النماذج (Models)

### User Model
```typescript
{
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'patient' | 'doctor' | 'finance';
  specialization?: string;
}
```

### Visit Model
```typescript
{
  patient: ObjectId;
  doctor: ObjectId;
  date: Date;
  time?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  totalAmount: number;
}
```

### Treatment Model
```typescript
{
  visit: ObjectId;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  totalPrice: number;
}
```

## الأمان

- تشفير كلمات المرور باستخدام bcrypt
- JWT للمصادقة
- التحقق من صحة المدخلات
- حماية من CSRF

## الاختبار

```bash
# تشغيل الاختبارات
npm test

# تشغيل الاختبارات مع التغطية
npm run test:coverage
```

## النشر

### Vercel
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t health-app .
docker run -p 3000:3000 health-app
```

## المساهمة

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى Branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم

إذا واجهت أي مشاكل أو لديك أسئلة، يرجى فتح issue في GitHub أو التواصل مع فريق التطوير.

## التحديثات المستقبلية

- [ ] نظام الفواتير المتقدم
- [ ] إشعارات البريد الإلكتروني
- [ ] تطبيق الهاتف المحمول
- [ ] نظام التقارير والإحصائيات
- [ ] دعم المدفوعات الإلكترونية
- [ ] نظام الجدولة المتقدم
- [ ] إدارة المخزون الصيدلاني # health-app
