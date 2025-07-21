/// <reference lib="dom" />
import { UIResourceRenderer as McpUIResourceRenderer } from '@mcp-ui/client';
import { Content, getResourceText } from '../types/message';
import React from 'react';

// Resource interface compatible with @mcp-ui/client
export interface Resource {
  uri: string;
  mimeType: string;
  text?: string;
  blob?: string;
  name?: string;
  title?: string;
  description?: string;
  _meta?: { [x: string]: unknown };
  [x: string]: unknown; // Index signature for compatibility
}

interface UIResourceRendererProps {
  resource: Resource;
  onUIAction?: (action: any) => Promise<any>;
  className?: string;
  htmlProps?: {
    style?: React.CSSProperties;
    [key: string]: unknown;
  };
  remoteDomProps?: {
    [key: string]: unknown;
  };
}

export function UIResourceRenderer({
  resource,
  onUIAction,
  className = '',
  htmlProps,
  remoteDomProps,
}: UIResourceRendererProps) {
  console.log('=== UIResourceRenderer called ===');
  console.log('Raw resource object:', resource);
  console.log('Resource type:', typeof resource);
  console.log('Resource keys:', Object.keys(resource || {}));
  console.log('Resource.uri:', resource?.uri);
  console.log('Resource.mimeType:', resource?.mimeType);

  // Validate resource according to mcp-ui spec
  const mimeType = resource.mimeType;
  const mimeTypeString = String(mimeType || 'unknown');

  if (!resource.uri || !mimeType) {
    console.error('❌ Invalid UI resource: missing uri or mimeType', {
      hasUri: !!resource.uri,
      uri: resource.uri,
      hasMimeType: !!mimeType,
      mimeType: mimeType,
      resourceKeys: Object.keys(resource || {}),
    });
    return <div className="text-red-500">Invalid UI resource: missing uri or mimeType</div>;
  }

  console.log('✅ Valid UI resource detected:', {
    uri: resource.uri,
    mimeType: mimeTypeString,
    hasText: !!resource.text,
    hasBlob: !!resource.blob,
  });

  // Handle UI actions from the rendered component
  const handleUIAction = async (action: any): Promise<any> => {
    console.log('🎯 UI Action received:', action);
    
    try {
      if (onUIAction) {
        const result = await onUIAction(action);
        console.log('✅ UI Action handled:', result);
        return result;
      }
      
      console.log('⚠️ No onUIAction handler provided');
      return { status: 'handled' };
    } catch (error) {
      console.error('❌ Error handling UI action:', error);
      return { status: 'error', error: String(error) };
    }
  };

  return (
    <div className={`mcp-ui-resource-renderer ${className}`}>
      <McpUIResourceRenderer
        resource={resource}
        onUIAction={handleUIAction}
        htmlProps={{
          style: {
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            minHeight: '200px',
            backgroundColor: '#ffffff',
            ...htmlProps?.style,
          },
          ...htmlProps,
        }}
        remoteDomProps={remoteDomProps}
      />
    </div>
  );
}

export function isUIResource(content: Content): boolean {
  console.log('🔍 Checking if content is UI resource:', content.type);

  // Check if it's a resource content type first
  if (content.type === 'resource') {
    const resource = content.resource;
    console.log('Found resource content, checking URI and mimeType:', {
      uri: resource.uri,
      mimeType: 'mime_type' in resource ? resource.mime_type : 'unknown',
    });

    // Check if it's a valid UI resource according to mcp-ui spec
    if (
      resource.uri &&
      resource.uri.startsWith('ui://') &&
      ('mime_type' in resource && (
        resource.mime_type === 'text/html' ||
        resource.mime_type === 'text/uri-list' ||
        resource.mime_type?.startsWith('application/vnd.mcp-ui.')
      ))
    ) {
      console.log('✅ Valid UI resource found');
      return true;
    }
  }

  // Handle text type content that might contain embedded UI resource (legacy fallback)
  if (content.type === 'text' && content.text) {
    console.log('Checking text content for embedded UI resource');
    try {
      // Try to parse the text as JSON to see if it's a resource object
      const parsed = JSON.parse(content.text);
      
      // Check for Goose internal format in JSON
      if (
        parsed &&
        typeof parsed === 'object' &&
        parsed.uri?.startsWith('ui://') &&
        parsed.mimeType &&
        (parsed.mimeType === 'text/html' ||
          parsed.mimeType === 'text/uri-list' ||
          parsed.mimeType.startsWith('application/vnd.mcp-ui.'))
      ) {
        console.log('Found valid UI resource in JSON text');
        return true;
      }
    } catch {
      // Not valid JSON, check for text patterns
      const hasUIPattern =
        content.text.includes('ui://') &&
        (content.text.includes('text/html') ||
          content.text.includes('text/uri-list') ||
          content.text.includes('application/vnd.mcp-ui.'));
      if (hasUIPattern) {
        console.log('Found UI resource pattern in text');
        return true;
      }
    }
  }

  console.log('❌ Not a UI resource');
  return false;
}

export function extractUIResource(content: Content): Resource | null {
  console.log('🔍 Attempting to extract UI resource from content:', content.type);

  // Check if it's a resource content type first
  if (content.type === 'resource') {
    const resource = content.resource;
    console.log('Found resource content:', {
      uri: resource.uri,
      hasText: 'text' in resource,
      hasBlob: 'blob' in resource,
      mimeType: 'mime_type' in resource ? resource.mime_type : 'unknown',
    });

    // Check if it's a valid UI resource according to mcp-ui spec (Goose internal format)
    if (isUIResource(content)) {
      // Safely extract text content from resource using type-safe helper
      const textContent = getResourceText(resource);
      const blobContent = 'blob' in resource ? resource.blob : undefined;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mimeType = (resource as any).mimeType || resource.mime_type;

      if (!resource.uri || !mimeType) {
        console.error('Resource missing required fields:', { uri: resource.uri, mimeType });
        return null;
      }

      const extractedResource: Resource = {
        uri: resource.uri,
        mimeType: mimeType,
        ...(textContent && { text: textContent }),
        ...(blobContent && { blob: blobContent }),
      };

      console.log('Successfully extracted resource:', extractedResource);
      return extractedResource;
    }
  }

  // Handle text type content that might contain embedded UI resource (legacy fallback)
  if (content.type === 'text' && content.text) {
    console.log('Checking text content for embedded UI resource');
    try {
      // Try to parse the text as JSON to see if it's a resource object
      const parsed = JSON.parse(content.text);
      
      // Check for Goose internal format in JSON
      if (
        parsed &&
        typeof parsed === 'object' &&
        parsed.uri?.startsWith('ui://') &&
        parsed.mimeType &&
        (parsed.mimeType === 'text/html' ||
          parsed.mimeType === 'text/uri-list' ||
          parsed.mimeType.startsWith('application/vnd.mcp-ui.'))
      ) {
        console.log('Successfully extracted resource from JSON text:', parsed);
        const extractedResource: Resource = {
          uri: parsed.uri,
          mimeType: parsed.mimeType,
          ...(parsed.text && { text: parsed.text }),
          ...(parsed.blob && { blob: parsed.blob }),
        };
        return extractedResource;
      }
    } catch {
      // Not valid JSON, skip
      console.log('Text content is not valid JSON, cannot extract resource');
    }
  }

  console.log('❌ No valid UI resource found');
  return null;
} 