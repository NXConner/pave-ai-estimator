import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Enhanced skeleton loader for measurement sidebar
export const MeasurementSidebarSkeleton: React.FC = () => (
  <div className="w-80 border-l border-border p-4 bg-card space-y-4">
    {/* Area Summary Skeleton */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-2">
          <Skeleton className="h-12 w-24 mx-auto" />
          <Skeleton className="h-4 w-20 mx-auto" />
          <Skeleton className="h-6 w-16 mx-auto" />
        </div>
      </CardContent>
    </Card>

    {/* Materials Skeleton */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-20" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Labor & Expenses Skeleton */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Cost Summary Skeleton */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-28" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Export Options Skeleton */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  </div>
);

// Map loading component
export const MapLoadingState: React.FC = () => (
  <div className="h-full w-full flex items-center justify-center bg-muted/20">
    <div className="text-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/30 rounded-full animate-spin border-t-primary mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Loading Map</h3>
        <p className="text-sm text-muted-foreground">Initializing Google Maps...</p>
      </div>
    </div>
  </div>
);

// Export loading overlay
export const ExportLoadingOverlay: React.FC<{ 
  isVisible: boolean; 
  type: 'pdf' | 'excel';
  onCancel?: () => void;
}> = ({ isVisible, type, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-80">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/30 rounded-full animate-spin border-t-primary mx-auto"></div>
            <div>
              <h3 className="text-lg font-semibold">
                Generating {type.toUpperCase()} Export
              </h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we prepare your estimate...
              </p>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Cancel
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Calculation engine loading state
export const CalculationLoadingState: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center space-y-3">
      <div className="w-8 h-8 border-2 border-primary/30 rounded-full animate-spin border-t-primary mx-auto"></div>
      <p className="text-sm text-muted-foreground">Calculating estimate...</p>
    </div>
  </div>
);

// Progress bar component for long operations
export const ProgressBar: React.FC<{ 
  progress: number; 
  label?: string;
  showPercentage?: boolean;
}> = ({ progress, label, showPercentage = true }) => (
  <div className="space-y-2">
    {label && (
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        {showPercentage && <span>{Math.round(progress)}%</span>}
      </div>
    )}
    <div className="w-full bg-muted rounded-full h-2">
      <div 
        className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  </div>
);

// Pulse animation for real-time updates
export const PulseIndicator: React.FC<{ active: boolean; children: React.ReactNode }> = ({ 
  active, 
  children 
}) => (
  <div className={`${active ? 'animate-pulse' : ''} transition-all duration-200`}>
    {children}
  </div>
);

export default MeasurementSidebarSkeleton;