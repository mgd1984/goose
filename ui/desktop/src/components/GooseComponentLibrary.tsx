import React from 'react';

// Goose-specific React components for Remote DOM rendering
// These components correspond to the semantic elements sent by your server

interface ProductCardProps {
  name?: string;
  sku?: string;
  price?: string;
  currency?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  interactive?: string;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  sku,
  price,
  currency = 'USD',
  category,
  description,
  imageUrl,
  interactive,
  onPress,
}) => {
  const handleClick = () => {
    if (interactive === 'true' && onPress) {
      onPress();
    }
  };

  return (
    <div 
      className={`border rounded-lg p-4 bg-white shadow-sm ${
        interactive === 'true' ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
      onClick={handleClick}
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={name || 'Product'} 
          className="w-full h-32 object-cover rounded mb-3"
        />
      )}
      <div className="space-y-2">
        {name && <h3 className="font-semibold text-lg text-gray-900">{name}</h3>}
        {sku && <p className="text-sm text-gray-500">SKU: {sku}</p>}
        {price && (
          <p className="text-lg font-bold text-green-600">
            {currency} {price}
          </p>
        )}
        {category && (
          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
            {category}
          </span>
        )}
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
    </div>
  );
};

interface ProductCatalogProps {
  title?: string;
  subtitle?: string;
  interactive?: string;
  children?: React.ReactNode;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({
  title,
  subtitle,
  interactive,
  children,
}) => {
  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <div className="mb-6">
        {title && <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>}
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
        {interactive === 'true' && (
          <p className="text-sm text-blue-600 mt-2">Interactive catalog - click items to interact</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
};

interface PricingCalculatorProps {
  title?: string;
  total?: string;
  currency?: string;
  children?: React.ReactNode;
}

const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  title,
  total,
  currency = 'USD',
  children,
}) => {
  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      {title && <h2 className="text-lg font-semibold mb-4 text-gray-900">{title}</h2>}
      <div className="space-y-2">
        {children}
      </div>
      {total && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total:</span>
            <span className="text-green-600">{currency} {total}</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface CostItemProps {
  label?: string;
  amount?: string;
  currency?: string;
}

const CostItem: React.FC<CostItemProps> = ({
  label,
  amount,
  currency = 'USD',
}) => {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-700">{label}</span>
      <span className="font-medium">{currency} {amount}</span>
    </div>
  );
};

interface CostSummaryProps {
  subtotal?: string;
  shipping?: string;
  tax?: string;
  total?: string;
  currency?: string;
}

const CostSummary: React.FC<CostSummaryProps> = ({
  subtotal,
  shipping,
  tax,
  total,
  currency = 'USD',
}) => {
  return (
    <div className="space-y-1">
      {subtotal && (
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{currency} {subtotal}</span>
        </div>
      )}
      {shipping && (
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>{currency} {shipping}</span>
        </div>
      )}
      {tax && (
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>{currency} {tax}</span>
        </div>
      )}
      {total && (
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total:</span>
          <span className="text-green-600">{currency} {total}</span>
        </div>
      )}
    </div>
  );
};

interface DesignPreviewProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const DesignPreview: React.FC<DesignPreviewProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="p-4 bg-white border rounded-lg">
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        {children || <span className="text-gray-500">Design preview placeholder</span>}
      </div>
    </div>
  );
};

interface PreviewPlaceholderProps {
  text?: string;
}

const PreviewPlaceholder: React.FC<PreviewPlaceholderProps> = ({
  text,
}) => {
  return (
    <div className="text-gray-500 italic">
      {text || 'Preview will be generated...'}
    </div>
  );
};

interface OrderFlowProps {
  title?: string;
  step?: string;
  children?: React.ReactNode;
}

const OrderFlow: React.FC<OrderFlowProps> = ({
  title,
  step,
  children,
}) => {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      {title && <h2 className="text-lg font-semibold mb-2 text-blue-900">{title}</h2>}
      {step && <p className="text-sm text-blue-700 mb-4">Current step: {step}</p>}
      <div>{children}</div>
    </div>
  );
};

interface FlowPlaceholderProps {
  message?: string;
}

const FlowPlaceholder: React.FC<FlowPlaceholderProps> = ({
  message,
}) => {
  return (
    <div className="text-blue-600 italic">
      {message || 'Order flow will be displayed here...'}
    </div>
  );
};

// Create the component library mapping for MCP-UI
export const gooseComponentLibrary = new Map<string, React.ComponentType<any>>([
  ['product-catalog', ProductCatalog],
  ['product-card', ProductCard],
  ['pricing-calculator', PricingCalculator],
  ['cost-item', CostItem],
  ['cost-summary', CostSummary],
  ['design-preview', DesignPreview],
  ['preview-placeholder', PreviewPlaceholder],
  ['order-flow', OrderFlow],
  ['flow-placeholder', FlowPlaceholder],
]);

// Export individual components for testing/standalone use
export {
  ProductCard,
  ProductCatalog,
  PricingCalculator,
  CostItem,
  CostSummary,
  DesignPreview,
  PreviewPlaceholder,
  OrderFlow,
  FlowPlaceholder,
}; 