import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

// Goose-specific React components for Remote DOM rendering using shadcn/ui
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
    <Card 
      className={`transition-all duration-200 ${
        interactive === 'true' ? 'cursor-pointer hover:shadow-default' : ''
      }`}
      onClick={handleClick}
    >
      {imageUrl && (
        <div className="p-4 pb-0">
          <img 
            src={imageUrl} 
            alt={name || 'Product'} 
            className="w-full h-32 object-cover rounded"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{name || 'Product'}</span>
          {price && (
            <span className="text-lg font-bold text-green-600">
              {currency} {price}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {sku && <p className="text-sm text-text-muted">SKU: {sku}</p>}
          {category && (
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          )}
          {description && <p className="text-sm text-text-muted">{description}</p>}
          {interactive === 'true' && (
            <Button size="sm" variant="outline" className="mt-2">
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
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
    <Card>
      <CardHeader>
        {title && <CardTitle className="text-2xl">{title}</CardTitle>}
        {subtitle && <p className="text-text-muted">{subtitle}</p>}
        {interactive === 'true' && (
          <p className="text-sm text-text-accent mt-2">Interactive catalog - click items to interact</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {children}
        </div>
      </CardContent>
    </Card>
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
    <Card>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-2">
          {children}
        </div>
        {total && (
          <div className="mt-4 pt-4 border-t border-borderSubtle">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total:</span>
              <span className="text-green-600">{currency} {total}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
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
      <span className="text-text-default">{label}</span>
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
        <div className="flex justify-between font-bold text-lg pt-2 border-t border-borderSubtle">
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
    <Card>
      <CardHeader>
        {title && <CardTitle className="text-lg">{title}</CardTitle>}
        {description && <p className="text-text-muted">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-borderSubtle rounded-lg p-8 text-center">
          {children || <span className="text-text-muted">Design preview placeholder</span>}
        </div>
      </CardContent>
    </Card>
  );
};

interface PreviewPlaceholderProps {
  text?: string;
}

const PreviewPlaceholder: React.FC<PreviewPlaceholderProps> = ({
  text,
}) => {
  return (
    <div className="text-text-muted italic">
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
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        {title && <CardTitle className="text-lg text-blue-900">{title}</CardTitle>}
        {step && <p className="text-sm text-blue-700">Current step: {step}</p>}
      </CardHeader>
      <CardContent>
        <div>{children}</div>
      </CardContent>
    </Card>
  );
};

interface FlowPlaceholderProps {
  message?: string;
}

const FlowPlaceholder: React.FC<FlowPlaceholderProps> = ({
  message,
}) => {
  return (
    <div className="text-text-accent italic">
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