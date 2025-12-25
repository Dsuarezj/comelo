import { Plus } from 'lucide-react';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

export default function ActionCard({ icon, title, description, onClick }: ActionCardProps) {
  return (
    <div className="bg-surface rounded-2xl p-4 shadow-md border border-neutral-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-primary-600">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-neutral-900 mb-1">{title}</h3>
          <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
        </div>
        <button
          onClick={onClick}
          className="flex-shrink-0 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors shadow-lg"
        >
          <Plus size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}
