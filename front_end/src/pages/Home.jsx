export default function Home() {
  return (
    <section className="grid gap-6">
      <h1 className="text-2xl font-bold">Welcome to MdediTrack</h1>
      <p className="text-gray-700 max-w-prose">
        Book appointments, view health records, manage prescriptions, and keep up with your
        schedule. Use a <code>student</code> email for the student experience or an email ending
        with <code>@staff.edu</code> to see the staff dashboard after login.
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Appointments" text="Create and view your clinic visits." />
        <Card title="Health Records" text="Securely store and access documents." />
        <Card title="Prescriptions" text="Track active and past prescriptions." />
      </div>
    </section>
  );
}

function Card({ title, text }) {
  return (
    <div className="border rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}