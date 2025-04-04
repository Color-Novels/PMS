'use client';

import { useCallback, useState, useEffect } from 'react';
import { USSReferral } from '@/app/lib/definitions';
import { USSReferralCard } from './USSReferralCard';
import { getUSSReferrals } from '../documents/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, FileX } from "lucide-react";
import { motion } from "framer-motion";

interface USSReferralListProps {
  patientId: number;
  limit?: number;
}

export function USSReferralList({ patientId, limit }: USSReferralListProps) {
  const [referrals, setReferrals] = useState<USSReferral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReferrals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUSSReferrals(patientId);
      setReferrals(limit ? data.slice(0, limit) : data);
    } catch (error) {
      console.error("Failed to fetch referrals:", error);
      setError("Unable to load USS referrals. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [patientId, limit]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  if (loading) {
    return <USSReferralSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-muted/30 rounded-lg border border-muted">
        <div className="text-destructive mb-2">
          <FileX size={32} />
        </div>
        <p className="text-muted-foreground mb-4 text-center">{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fetchReferrals()}
          className="flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Try Again
        </Button>
      </div>
    );
  }

  if (!loading && referrals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-muted/30 rounded-lg border border-dashed border-muted">
        <div className="bg-primary/10 p-3 rounded-full mb-3">
          <FileX className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-1">No referrals found</h3>
        <p className="text-muted-foreground text-center mb-4">
          This patient does not have any USS referrals yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {referrals.map((referral, index) => (
          <motion.div
            key={referral.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <USSReferralCard
              referral={referral}
              action={fetchReferrals}
            />
          </motion.div>
        ))}
      </div>
      
      {limit && referrals.length === limit && (
        <div className="flex justify-center pt-2">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
            View all USS Referrals
          </Button>
        </div>
      )}
    </div>
  );
}

function USSReferralSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="overflow-hidden border border-muted/60">
          <div className="h-1 bg-gradient-to-r from-blue-400/40 to-blue-400/20 w-full"></div>
          <CardHeader className="pb-2 pt-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-7 w-7 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pb-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32" />
            <div className="pt-2">
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}