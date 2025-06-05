"use client";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">        <div>
          <h1 className="text-3xl font-bold text-foreground font-montserrat">{title}</h1>
          {description && <p className="mt-2 text-foreground font-inter">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
