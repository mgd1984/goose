/// <reference lib="dom" />
import React from 'react';
import { UIResourceRenderer as MCPUIResourceRenderer } from '@mcp-ui/client';
import type { Resource } from '@modelcontextprotocol/sdk/types.js';
import type { UIActionResult } from '@mcp-ui/client';
import { Content, ResourceContents } from '../types/message';
import { gooseComponentLibrary, gooseRemoteElements } from './GooseComponentLibrary';

interface UIResourceRendererProps {
  resource: UIResource;
  className?: string;
  onUIAction?: (action: any) => Promise<any>;
}

interface UIResource {
  uri: string;
  mimeType: string;
  text: string;
  name: string;
  title: string;
  description: string;
}

// Error boundary for catching MCP-UI rendering errors
class MCPUIErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🚨 MCP-UI Error Boundary caught error:', error);
    console.error('🚨 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 MCP-UI Error Boundary details:', error, errorInfo);
    console.error('🚨 Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      console.log('🔄 MCP-UI Error Boundary rendering fallback');
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Real MCP-UI renderer using the actual @mcp-ui/client library
export const UIResourceRenderer: React.FC<UIResourceRendererProps> = ({ 
  resource, 
  className = '',
  onUIAction 
}) => {
  console.log('🎯 UIResourceRenderer rendering with:', resource);

  if (!resource) {
    console.log('❌ No resource provided to UIResourceRenderer');
    return <div className={`p-4 text-gray-500 ${className}`}>No UI resource available</div>;
  }

  // Handle UI actions - use the correct UIActionResult type
  const handleUIAction = React.useCallback(async (result: UIActionResult): Promise<unknown> => {
    console.log('🎯 UI Action received from MCP-UI client:', result);
    if (onUIAction) {
      return await onUIAction(result);
    }
    return undefined;
  }, [onUIAction]);

  // SIMPLIFIED: Convert to the exact format expected by MCP-UI client (following original author's pattern)
  const mcpResource = React.useMemo(() => {
    const result = {
      uri: resource.uri,
      mimeType: resource.mimeType,
      text: resource.text,
    };
    console.log('🔄 Final MCP resource for @mcp-ui/client:', result);
    return result;
  }, [resource]);

  // Create the fallback component
  const fallbackRenderer = (
    <div className={`${className} border rounded-lg p-4`}>
      <div className="text-sm text-gray-600 mb-2">
        UI Resource (MCP-UI failed - using fallback)
      </div>
      <div className="border rounded bg-gray-50 p-2" style={{ minHeight: '300px' }}>
        {resource.mimeType === 'text/html' ? (
          <iframe
            srcDoc={resource.text}
            className="w-full border-0"
            title={resource.name || 'UI Resource'}
            sandbox="allow-scripts allow-same-origin allow-forms"
            style={{ height: '400px', width: '100%' }}
          />
        ) : (
          <pre className="text-xs whitespace-pre-wrap">
            {resource.text.substring(0, 1000)}
            {resource.text.length > 1000 && '...'}
          </pre>
        )}
      </div>
    </div>
  );

  // CRITICAL: Use the exact same pattern as the original author
  return (
    <MCPUIErrorBoundary fallback={fallbackRenderer}>
      <div className={className}>
        <MCPUIResourceRenderer
          resource={mcpResource}
          onUIAction={handleUIAction}
          remoteDomProps={{
            library: gooseComponentLibrary as any,
            remoteElements: gooseRemoteElements,
          }}
        />
      </div>
    </MCPUIErrorBoundary>
  );
};

// Wrapper function to check if Content contains a UI resource
export function isContentUIResource(content: Content): boolean {
  console.log('🔍 isContentUIResource checking:', content);
  
  if (content.type === 'resource' && content.resource) {
    return isUIResource(content.resource);
  }
  
  // For backwards compatibility, also check text content for HTML
  if (content.type === 'text' && content.text) {
    const text = content.text.toLowerCase().trim();
    const hasHTMLContent = text.includes('<html') || 
                          text.includes('<!doctype') ||
                          (text.includes('<div') && text.includes('</div>')) ||
                          (text.includes('<h1') || text.includes('<h2') || text.includes('<h3')) ||
                          text.includes('<script') ||
                          text.includes('<style');
    return hasHTMLContent;
  }
  
  return false;
}

export function isUIResource(resource: ResourceContents): boolean {
  console.log('🔍 isUIResource checking:', resource);
  
  // Add this right before the MIME type extraction
  console.log('🔍 DEBUG: Raw resource structure:', {
    resource,
    hasMimeType: !!(resource as any).mimeType,
    hasMime_type: !!resource.mime_type,
    allKeys: Object.keys(resource),
    nestedResource: (resource as any).resource,
    nestedKeys: (resource as any).resource ? Object.keys((resource as any).resource) : []
  });

  // Check MIME type (both formats)
  const mimeType = resource.mime_type || (resource as any).mimeType;
  console.log('🎯 MIME type found:', mimeType);
  
  const hasValidMimeType = Boolean(
    mimeType &&
    typeof mimeType === 'string' &&
    (mimeType.includes('text/html') ||
     mimeType === 'text/html' ||
     mimeType.startsWith('application/vnd.mcp-ui') ||
     mimeType === 'text/uri-list')
  );
  
  // Check URI patterns for UI resources
  const hasUIUri = Boolean(
    resource.uri &&
    (resource.uri.startsWith('ui://') ||
     resource.uri.includes('/ui/') ||
     resource.uri.includes('html') ||
     resource.uri.includes('interactive') ||
     resource.uri.includes('phantasm')) // Specific for your MCP server
  );
  
  // Check content for HTML-like patterns (for text resources only)
  let hasHTMLContent = false;
  if ('text' in resource && typeof resource.text === 'string') {
    const text = resource.text.toLowerCase().trim();
    hasHTMLContent = text.includes('<html') || 
                    text.includes('<!doctype') ||
                    (text.includes('<div') && text.includes('</div>')) ||
                    (text.includes('<h1') || text.includes('<h2') || text.includes('<h3')) ||
                    text.includes('<script') ||
                    text.includes('<style');
  }
  
  console.log('🔍 UI Resource Detection:', {
    mimeType,
    hasValidMimeType,
    hasUIUri,
    hasHTMLContent,
    uri: resource.uri
  });
  
  // Return true if ANY of these conditions are met
  const isUI = hasValidMimeType || hasUIUri || hasHTMLContent;
  console.log('✅ Final UI detection result:', isUI);
  
  return isUI;
}

export function extractUIResource(content: Content): UIResource | null {
  console.log('🔍 extractUIResource called with:', content);
  
  // Handle resource content
  if (content.type === 'resource' && content.resource) {
    const resource = content.resource;
    console.log('🔍 Found resource:', resource);
    
    const textContent = getResourceText(resource);
    const originalMimeType = resource.mime_type || (resource as any).mimeType;

    if (textContent) {
      console.log('🔍 Extracting text content:', textContent.substring(0, 100) + '...');
      
      // Convert to UI Resource format
      const extractedResource: UIResource = {
        uri: resource.uri,
        mimeType: originalMimeType || 'text/html',
        text: textContent,
        name: 'UI Resource',
        title: 'UI Resource',
        description: 'Interactive UI component',
      };
      
      console.log('✅ Successfully extracted UI resource:', extractedResource);
      return extractedResource;
    }
  }
  
  // Handle text content with HTML (backwards compatibility)
  if (content.type === 'text' && content.text) {
    const text = content.text.toLowerCase().trim();
    const hasHTMLContent = text.includes('<html') || 
                          text.includes('<!doctype') ||
                          (text.includes('<div') && text.includes('</div>')) ||
                          (text.includes('<h1') || text.includes('<h2') || text.includes('<h3')) ||
                          text.includes('<script') ||
                          text.includes('<style');
    
    if (hasHTMLContent) {
      console.log('🔍 Extracting HTML from text content');
      
      const extractedResource: UIResource = {
        uri: 'ui://goose/inline-html',
        mimeType: 'text/html',
        text: content.text,
        name: 'Inline HTML',
        title: 'Inline HTML',
        description: 'HTML content detected in text response',
      };
      
      console.log('✅ Successfully extracted HTML from text:', extractedResource);
      return extractedResource;
    }
  }

  console.log('❌ No UI resource found in content');
  return null;
}

// Safe helper to extract text from ResourceContents
function getResourceText(resource: ResourceContents): string | null {
  if ('text' in resource && typeof resource.text === 'string') {
    return resource.text;
  }
  return null;
} 