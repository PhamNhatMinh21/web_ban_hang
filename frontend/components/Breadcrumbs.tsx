import React from 'react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const ChevronRightIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-gym-gray">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.onClick && index < items.length - 1 ? (
              <button onClick={item.onClick} className="hover:text-gym-yellow transition-colors">
                {item.label}
              </button>
            ) : (
              <span className={`${index === items.length - 1 ? 'text-white font-medium' : ''}`}>
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <ChevronRightIcon className="h-3 w-3 mx-2 flex-shrink-0" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;