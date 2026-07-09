type DashboardCardProps = {
  title: string;
  value: number;
  color: string;
};

function DashboardCard({
  title,
  value,
  color,
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">

      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <h1 className={`text-4xl font-bold mt-3 ${color}`}>
        {value}
      </h1>

    </div>
  );
}

export default DashboardCard;