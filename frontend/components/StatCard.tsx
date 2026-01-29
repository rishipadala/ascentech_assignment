interface StatCardProps {
    label: string;
    value: number;
}

export default function StatCard({ label, value }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">{label}</p>
            <p className="text-4xl font-extrabold mt-2 text-black">{value}</p>
        </div>
    );
}