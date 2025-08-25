import PhoneCard from "./PhoneCard";

export default function UserLikeYou({ phones }) {
  if (!phones || phones.length === 0) return null;
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {phones.map((phone, idx) => (
          <PhoneCard key={phone.Model || idx} phone={phone} />
        ))}
      </div>
    </div>
  );
} 