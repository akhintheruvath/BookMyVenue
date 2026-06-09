export function OwnerBenefitCard({ icon: Icon, title, text }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 inline-flex rounded-lg bg-red-50 p-2 text-red-600">
                <Icon size={22} />
            </div>
            <h3 className="mb-1 font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{text}</p>
        </div>
    );
}
